import { adminDb } from "../lib/firebaseAdmin";
import type { Link, LinkFilters, BatchLinkUpdate } from "../types/v2";
import { FieldValue } from "firebase-admin/firestore";
import { tagService } from "./tagService";

const COLLECTION = "links_v2";

export const linkServiceV2 = {
  /**
   * Extract domain from URL
   */
  extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, "");
    } catch (e) {
      return "";
    }
  },

  /**
   * Create a new link
   */
  async createLink(
    userId: string,
    linkData: Omit<Link, "id" | "userId" | "domain" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = FieldValue.serverTimestamp();

    // Extract domain from URL
    const domain = this.extractDomain(linkData.url);

    // Increment usage count for all tags
    if (linkData.tags && linkData.tags.length > 0) {
      for (const tagId of linkData.tags) {
        await tagService.incrementUsage(tagId);
      }
    }

    const docRef = await adminDb.collection(COLLECTION).add({
      ...linkData,
      userId,
      domain,
      createdAt: now,
      updatedAt: now,
    });

    return docRef.id;
  },

  /**
   * Get a single link by ID
   */
  async getLink(linkId: string): Promise<Link | null> {
    const doc = await adminDb.collection(COLLECTION).doc(linkId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as Link;
  },

  /**
   * Update a link
   */
  async updateLink(
    linkId: string,
    updates: Partial<Omit<Link, "id" | "userId" | "createdAt">>
  ): Promise<void> {
    const updateData: any = {
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Update domain if URL changed
    if (updates.url) {
      updateData.domain = this.extractDomain(updates.url);
    }

    // Handle tag changes
    if (updates.tags) {
      const currentLink = await this.getLink(linkId);
      if (currentLink) {
        const oldTags = currentLink.tags || [];
        const newTags = updates.tags;

        // Decrement count for removed tags
        const removedTags = oldTags.filter(id => !newTags.includes(id));
        for (const tagId of removedTags) {
          await tagService.decrementUsage(tagId);
        }

        // Increment count for added tags
        const addedTags = newTags.filter(id => !oldTags.includes(id));
        for (const tagId of addedTags) {
          await tagService.incrementUsage(tagId);
        }
      }
    }

    await adminDb.collection(COLLECTION).doc(linkId).update(updateData);
  },

  /**
   * Update read status only (optimized for quick toggle)
   */
  async updateReadStatus(
    linkId: string,
    readStatus: "unread" | "read_later" | "read"
  ): Promise<void> {
    const updateData: any = {
      readStatus,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (readStatus === "read") {
      updateData.lastReadAt = FieldValue.serverTimestamp();
    }

    await adminDb.collection(COLLECTION).doc(linkId).update(updateData);
  },

  /**
   * Delete a link
   */
  async deleteLink(linkId: string): Promise<void> {
    const link = await this.getLink(linkId);
    if (!link) {
      return;
    }

    // Decrement usage count for all tags
    if (link.tags && link.tags.length > 0) {
      for (const tagId of link.tags) {
        await tagService.decrementUsage(tagId);
      }
    }

    // Delete the link
    await adminDb.collection(COLLECTION).doc(linkId).delete();

    // Delete associated notes
    const notesSnapshot = await adminDb
      .collection("notes")
      .where("linkId", "==", linkId)
      .get();

    const batch = adminDb.batch();
    notesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  },

  /**
   * Get links with complex filtering
   */
  async getLinks(filters: LinkFilters): Promise<Link[]> {
    let query: any = adminDb.collection(COLLECTION);

    // Base filters
    if (filters.spaceId) {
      query = query.where("spaceId", "==", filters.spaceId);
    }

    if (filters.folderId) {
      query = query.where("folderId", "==", filters.folderId);
    }

    // Read status filter
    if (filters.readStatus) {
      if (Array.isArray(filters.readStatus)) {
        query = query.where("readStatus", "in", filters.readStatus);
      } else {
        query = query.where("readStatus", "==", filters.readStatus);
      }
    }

    // Domain filter
    if (filters.domain) {
      query = query.where("domain", "==", filters.domain);
    }

    // Tag filter (complex - requires client-side filtering)
    // Firestore doesn't support multiple array-contains, so we do it in memory
    if (filters.tags && filters.tags.length > 0) {
      // Can only use array-contains for one tag
      query = query.where("tags", "array-contains", filters.tags[0]);
    }

    // Date range filters
    if (filters.startDate) {
      query = query.where("createdAt", ">=", filters.startDate);
    }

    if (filters.endDate) {
      query = query.where("createdAt", "<=", filters.endDate);
    }

    // Sorting
    const sortBy = filters.sortBy || "createdAt";
    const sortOrder = filters.sortOrder || "desc";
    query = query.orderBy(sortBy, sortOrder);

    // Pagination
    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    const limit = filters.limit || 50;
    query = query.limit(limit);

    // Execute query
    const snapshot = await query.get();
    let links = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Link));

    // Client-side filtering for multiple tags
    if (filters.tags && filters.tags.length > 1) {
      const tagLogic = filters.tagLogic || "AND";

      if (tagLogic === "AND") {
        // Link must have ALL tags
        links = links.filter(link =>
          filters.tags!.every(tagId => link.tags.includes(tagId))
        );
      } else {
        // Link must have ANY tag (already filtered by array-contains)
        // No additional filtering needed
      }
    }

    // Search filter (client-side)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      links = links.filter(link =>
        link.title.toLowerCase().includes(searchLower) ||
        link.url.toLowerCase().includes(searchLower) ||
        (link.description && link.description.toLowerCase().includes(searchLower))
      );
    }

    return links;
  },

  /**
   * Batch update multiple links
   */
  async batchUpdateLinks(batchUpdate: BatchLinkUpdate): Promise<void> {
    const { linkIds, updates } = batchUpdate;

    // Handle tag operations
    let tagUpdates: any = null;

    if (updates.tags) {
      const operation = updates.tagOperation || "replace";

      if (operation === "replace") {
        tagUpdates = updates.tags;
      } else if (operation === "append") {
        tagUpdates = null; // Will be handled per-link
      } else if (operation === "remove") {
        tagUpdates = null; // Will be handled per-link
      }
    }

    // Batch update all links
    const batch = adminDb.batch();

    for (const linkId of linkIds) {
      const ref = adminDb.collection(COLLECTION).doc(linkId);

      const updateData: any = {
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (updates.folderId !== undefined) {
        updateData.folderId = updates.folderId;
      }

      if (updates.readStatus) {
        updateData.readStatus = updates.readStatus;
        if (updates.readStatus === "read") {
          updateData.lastReadAt = FieldValue.serverTimestamp();
        }
      }

      if (updates.isPublic !== undefined) {
        updateData.isPublic = updates.isPublic;
      }

      // Handle tags per operation
      if (updates.tags && updates.tagOperation) {
        const currentLink = await this.getLink(linkId);
        if (currentLink) {
          if (updates.tagOperation === "replace") {
            updateData.tags = updates.tags;
          } else if (updates.tagOperation === "append") {
            const currentTags = currentLink.tags || [];
            const newTags = [...new Set([...currentTags, ...updates.tags])];
            updateData.tags = newTags;
          } else if (updates.tagOperation === "remove") {
            const currentTags = currentLink.tags || [];
            updateData.tags = currentTags.filter(id => !updates.tags!.includes(id));
          }
        }
      }

      batch.update(ref, updateData);
    }

    await batch.commit();
  },

  /**
   * Count links with filters
   */
  async countLinks(filters: Partial<LinkFilters>): Promise<number> {
    let query: any = adminDb.collection(COLLECTION);

    if (filters.spaceId) {
      query = query.where("spaceId", "==", filters.spaceId);
    }

    if (filters.folderId) {
      query = query.where("folderId", "==", filters.folderId);
    }

    if (filters.readStatus) {
      query = query.where("readStatus", "==", filters.readStatus);
    }

    const snapshot = await query.count().get();
    return snapshot.data().count;
  },

  /**
   * Get links by domain (for domain grouping)
   */
  async getLinksByDomain(userId: string, domain: string): Promise<Link[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("userId", "==", userId)
      .where("domain", "==", domain)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Link));
  },

  /**
   * Get unique domains for a user (for filter options)
   */
  async getUniqueDomains(userId: string, spaceId?: string): Promise<string[]> {
    let query: any = adminDb.collection(COLLECTION).where("userId", "==", userId);

    if (spaceId) {
      query = query.where("spaceId", "==", spaceId);
    }

    const snapshot = await query.select("domain").get();

    const domains = new Set<string>();
    snapshot.docs.forEach(doc => {
      const domain = doc.data().domain;
      if (domain) {
        domains.add(domain);
      }
    });

    return Array.from(domains).sort();
  },

  /**
   * Check if URL already exists for user (duplicate detection)
   */
  async findDuplicateUrl(userId: string, url: string): Promise<Link | null> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("userId", "==", userId)
      .where("url", "==", url)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Link;
  }
};
