import { adminDb } from "../lib/firebaseAdmin";
import type { SmartCollection, CollectionRule, Link } from "../types/v2";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { linkServiceV2 } from "./linkServiceV2";

const COLLECTION = "smartCollections";

export const smartCollectionService = {
  /**
   * Create system collections for a new user
   */
  async createSystemCollections(userId: string): Promise<void> {
    const systemCollections = [
      {
        name: "Unread",
        icon: "📥",
        isSystem: true,
        rules: [
          { field: "readStatus" as const, operator: "equals" as const, value: "unread" }
        ],
        order: 0,
      },
      {
        name: "Read Later",
        icon: "⭐",
        isSystem: true,
        rules: [
          { field: "readStatus" as const, operator: "equals" as const, value: "read_later" }
        ],
        order: 1,
      },
      {
        name: "Read",
        icon: "✅",
        isSystem: true,
        rules: [
          { field: "readStatus" as const, operator: "equals" as const, value: "read" }
        ],
        order: 2,
      },
      {
        name: "Recent (7 days)",
        icon: "🕐",
        isSystem: true,
        rules: [
          { field: "createdAt" as const, operator: "gte" as const, value: "now-7d" }
        ],
        order: 3,
      },
      {
        name: "This Week",
        icon: "📅",
        isSystem: true,
        rules: [
          { field: "createdAt" as const, operator: "gte" as const, value: "week-start" }
        ],
        order: 4,
      },
      {
        name: "This Month",
        icon: "📆",
        isSystem: true,
        rules: [
          { field: "createdAt" as const, operator: "gte" as const, value: "month-start" }
        ],
        order: 5,
      },
    ];

    const batch = adminDb.batch();
    const now = FieldValue.serverTimestamp();

    systemCollections.forEach(collection => {
      const ref = adminDb.collection(COLLECTION).doc();
      batch.set(ref, {
        ...collection,
        userId,
        createdAt: now,
        updatedAt: now,
      });
    });

    await batch.commit();
  },

  /**
   * Create a custom collection
   */
  async createCollection(
    userId: string,
    collectionData: Omit<SmartCollection, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = FieldValue.serverTimestamp();

    const docRef = await adminDb.collection(COLLECTION).add({
      ...collectionData,
      userId,
      createdAt: now,
      updatedAt: now,
    });

    return docRef.id;
  },

  /**
   * Get all collections for a user
   */
  async listCollections(userId: string): Promise<SmartCollection[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("userId", "==", userId)
      .orderBy("order", "asc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SmartCollection));
  },

  /**
   * Get a single collection
   */
  async getCollection(collectionId: string): Promise<SmartCollection | null> {
    const doc = await adminDb.collection(COLLECTION).doc(collectionId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as SmartCollection;
  },

  /**
   * Update a collection (system collections cannot be updated)
   */
  async updateCollection(
    collectionId: string,
    updates: Partial<Omit<SmartCollection, "id" | "userId" | "createdAt" | "isSystem">>
  ): Promise<void> {
    const collection = await this.getCollection(collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }

    if (collection.isSystem) {
      throw new Error("Cannot update system collections");
    }

    await adminDb.collection(COLLECTION).doc(collectionId).update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    });
  },

  /**
   * Delete a collection (system collections cannot be deleted)
   */
  async deleteCollection(collectionId: string): Promise<void> {
    const collection = await this.getCollection(collectionId);
    if (!collection) {
      return;
    }

    if (collection.isSystem) {
      throw new Error("Cannot delete system collections");
    }

    await adminDb.collection(COLLECTION).doc(collectionId).delete();
  },

  /**
   * Evaluate a single rule against a link
   */
  evaluateRule(link: Link, rule: CollectionRule): boolean {
    const { field, operator, value } = rule;

    switch (field) {
      case "folderId":
        if (operator === "equals") {
          return link.folderId === value;
        }
        if (operator === "in") {
          return Array.isArray(value) && value.includes(link.folderId);
        }
        break;

      case "tagId":
        if (operator === "equals") {
          return link.tags.includes(value);
        }
        if (operator === "in") {
          return Array.isArray(value) && value.some((tagId: string) => link.tags.includes(tagId));
        }
        break;

      case "readStatus":
        if (operator === "equals") {
          return link.readStatus === value;
        }
        if (operator === "in") {
          return Array.isArray(value) && value.includes(link.readStatus);
        }
        break;

      case "domain":
        if (operator === "equals") {
          return link.domain === value;
        }
        if (operator === "contains") {
          return link.domain.includes(value);
        }
        if (operator === "in") {
          return Array.isArray(value) && value.includes(link.domain);
        }
        break;

      case "createdAt":
        const createdAt = this.timestampToDate(link.createdAt);
        const compareDate = this.parseTimeValue(value);

        if (operator === "gte") {
          return createdAt >= compareDate;
        }
        if (operator === "lte") {
          return createdAt <= compareDate;
        }
        if (operator === "between") {
          const [start, end] = value;
          return createdAt >= this.parseTimeValue(start) && createdAt <= this.parseTimeValue(end);
        }
        break;
    }

    return false;
  },

  /**
   * Parse special time values like "now-7d", "week-start", "month-start"
   */
  parseTimeValue(value: string | Date | Timestamp): Date {
    if (value instanceof Date) {
      return value;
    }

    if (value instanceof Timestamp) {
      return value.toDate();
    }

    const now = new Date();

    if (value === "now") {
      return now;
    }

    // "now-7d" pattern
    if (value.startsWith("now-")) {
      const match = value.match(/now-(\d+)([dhm])/);
      if (match) {
        const amount = parseInt(match[1]);
        const unit = match[2];

        const date = new Date(now);
        if (unit === "d") {
          date.setDate(date.getDate() - amount);
        } else if (unit === "h") {
          date.setHours(date.getHours() - amount);
        } else if (unit === "m") {
          date.setMinutes(date.getMinutes() - amount);
        }
        return date;
      }
    }

    // Week start (Monday)
    if (value === "week-start") {
      const date = new Date(now);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      date.setDate(diff);
      date.setHours(0, 0, 0, 0);
      return date;
    }

    // Month start
    if (value === "month-start") {
      const date = new Date(now);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      return date;
    }

    // Year start
    if (value === "year-start") {
      const date = new Date(now);
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }

    return now;
  },

  /**
   * Convert Firestore Timestamp to Date
   */
  timestampToDate(timestamp: any): Date {
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    return new Date(timestamp);
  },

  /**
   * Evaluate all rules in a collection against a link
   */
  evaluateCollection(link: Link, rules: CollectionRule[]): boolean {
    if (rules.length === 0) {
      return true;
    }

    let result = this.evaluateRule(link, rules[0]);

    for (let i = 1; i < rules.length; i++) {
      const rule = rules[i];
      const ruleResult = this.evaluateRule(link, rule);

      // Use the logic from the PREVIOUS rule to combine with current result
      const logic = rules[i - 1].logic || "AND";

      if (logic === "AND") {
        result = result && ruleResult;
      } else {
        result = result || ruleResult;
      }
    }

    return result;
  },

  /**
   * Get links that match a collection's rules
   */
  async getCollectionLinks(
    collectionId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Link[]> {
    const collection = await this.getCollection(collectionId);
    if (!collection) {
      return [];
    }

    // For simple single-rule collections, we can optimize with Firestore queries
    if (collection.rules.length === 1) {
      const rule = collection.rules[0];

      // Optimize for common cases
      if (rule.field === "readStatus" && rule.operator === "equals") {
        return linkServiceV2.getLinks({
          readStatus: rule.value,
          limit,
          offset,
        });
      }

      if (rule.field === "createdAt" && rule.operator === "gte") {
        const date = this.parseTimeValue(rule.value);
        return linkServiceV2.getLinks({
          startDate: date,
          limit,
          offset,
        });
      }
    }

    // For complex multi-rule collections, fetch all links and filter in memory
    // In production, this should be optimized based on the most selective rule
    const allLinks = await linkServiceV2.getLinks({
      limit: 1000, // Fetch a large batch
    });

    const matchingLinks = allLinks.filter(link =>
      this.evaluateCollection(link, collection.rules)
    );

    // Apply pagination
    return matchingLinks.slice(offset, offset + limit);
  },

  /**
   * Count links matching a collection
   */
  async countCollectionLinks(collectionId: string, userId: string): Promise<number> {
    const collection = await this.getCollection(collectionId);
    if (!collection) {
      return 0;
    }

    // Simple optimization for single-rule status collections
    if (collection.rules.length === 1) {
      const rule = collection.rules[0];

      if (rule.field === "readStatus" && rule.operator === "equals") {
        return linkServiceV2.countLinks({
          readStatus: rule.value,
        });
      }
    }

    // For complex rules, get all matching links and count
    const links = await this.getCollectionLinks(collectionId, userId, 10000);
    return links.length;
  },

  /**
   * Get collection with link count
   */
  async getCollectionWithStats(collectionId: string, userId: string): Promise<any> {
    const collection = await this.getCollection(collectionId);
    if (!collection) {
      return null;
    }

    const linkCount = await this.countCollectionLinks(collectionId, userId);

    return {
      ...collection,
      linkCount,
    };
  },

  /**
   * Reorder collections
   */
  async reorderCollections(collectionIds: string[], userId: string): Promise<void> {
    const batch = adminDb.batch();

    collectionIds.forEach((collectionId, index) => {
      const ref = adminDb.collection(COLLECTION).doc(collectionId);
      batch.update(ref, {
        order: index,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
  }
};
