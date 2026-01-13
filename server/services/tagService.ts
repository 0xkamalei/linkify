import { adminDb } from "../lib/firebaseAdmin";
import type { Tag } from "../types/v2";
import { FieldValue } from "firebase-admin/firestore";

const COLLECTION = "tags";

export const tagService = {
  /**
   * Create a new tag
   */
  async createTag(
    userId: string,
    tagData: Omit<Tag, "id" | "userId" | "usageCount" | "createdAt">
  ): Promise<string> {
    // Check if tag with same name already exists for this user
    const existing = await this.findTagByName(userId, tagData.name);
    if (existing) {
      return existing.id!;
    }

    const docRef = await adminDb.collection(COLLECTION).add({
      ...tagData,
      userId,
      usageCount: 0,
      createdAt: FieldValue.serverTimestamp(),
    });

    return docRef.id;
  },

  /**
   * Get all tags for a user
   */
  async listTags(userId: string): Promise<Tag[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("userId", "==", userId)
      .orderBy("name", "asc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tag));
  },

  /**
   * Get a single tag by ID
   */
  async getTag(tagId: string): Promise<Tag | null> {
    const doc = await adminDb.collection(COLLECTION).doc(tagId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as Tag;
  },

  /**
   * Find tag by name (case-insensitive)
   */
  async findTagByName(userId: string, name: string): Promise<Tag | null> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("userId", "==", userId)
      .where("name", "==", name.trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Tag;
  },

  /**
   * Update a tag
   */
  async updateTag(
    tagId: string,
    updates: Partial<Omit<Tag, "id" | "userId" | "usageCount" | "createdAt">>
  ): Promise<void> {
    await adminDb.collection(COLLECTION).doc(tagId).update(updates);
  },

  /**
   * Delete a tag and remove it from all links
   */
  async deleteTag(tagId: string): Promise<void> {
    const batch = adminDb.batch();

    // Delete the tag
    const tagRef = adminDb.collection(COLLECTION).doc(tagId);
    batch.delete(tagRef);

    // Remove tag from all links that use it
    const linksWithTag = await adminDb
      .collection("links_v2")
      .where("tags", "array-contains", tagId)
      .get();

    linksWithTag.docs.forEach(doc => {
      const currentTags = doc.data().tags || [];
      const newTags = currentTags.filter((id: string) => id !== tagId);

      batch.update(doc.ref, {
        tags: newTags,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
  },

  /**
   * Merge two tags (sourceTag into targetTag)
   */
  async mergeTags(sourceTagId: string, targetTagId: string): Promise<void> {
    const batch = adminDb.batch();

    // Get all links with sourceTag
    const linksWithSourceTag = await adminDb
      .collection("links_v2")
      .where("tags", "array-contains", sourceTagId)
      .get();

    // Replace sourceTag with targetTag in all links
    linksWithSourceTag.docs.forEach(doc => {
      const currentTags = doc.data().tags || [];

      // Remove source tag and add target tag (if not already present)
      const newTags = currentTags
        .filter((id: string) => id !== sourceTagId)
        .concat(currentTags.includes(targetTagId) ? [] : [targetTagId]);

      batch.update(doc.ref, {
        tags: newTags,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    // Delete source tag
    const sourceTagRef = adminDb.collection(COLLECTION).doc(sourceTagId);
    batch.delete(sourceTagRef);

    // Update target tag usage count
    await batch.commit();
    await this.recalculateUsageCount(targetTagId);
  },

  /**
   * Increment tag usage count
   */
  async incrementUsage(tagId: string, amount: number = 1): Promise<void> {
    await adminDb.collection(COLLECTION).doc(tagId).update({
      usageCount: FieldValue.increment(amount),
    });
  },

  /**
   * Decrement tag usage count
   */
  async decrementUsage(tagId: string, amount: number = 1): Promise<void> {
    await adminDb.collection(COLLECTION).doc(tagId).update({
      usageCount: FieldValue.increment(-amount),
    });
  },

  /**
   * Recalculate usage count for a tag (for data integrity)
   */
  async recalculateUsageCount(tagId: string): Promise<void> {
    const linksSnapshot = await adminDb
      .collection("links_v2")
      .where("tags", "array-contains", tagId)
      .count()
      .get();

    await adminDb.collection(COLLECTION).doc(tagId).update({
      usageCount: linksSnapshot.data().count,
    });
  },

  /**
   * Get tags by IDs (batch fetch)
   */
  async getTagsByIds(tagIds: string[]): Promise<Tag[]> {
    if (tagIds.length === 0) {
      return [];
    }

    // Firestore 'in' query limit is 10
    const chunks = [];
    for (let i = 0; i < tagIds.length; i += 10) {
      chunks.push(tagIds.slice(i, i + 10));
    }

    const allTags: Tag[] = [];

    for (const chunk of chunks) {
      const snapshot = await adminDb
        .collection(COLLECTION)
        .where(FieldValue.documentId(), "in", chunk)
        .get();

      const tags = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Tag));

      allTags.push(...tags);
    }

    return allTags;
  },

  /**
   * Get popular tags (highest usage count)
   */
  async getPopularTags(userId: string, limit: number = 10): Promise<Tag[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("userId", "==", userId)
      .orderBy("usageCount", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Tag));
  },

  /**
   * Search tags by name (autocomplete)
   */
  async searchTags(userId: string, query: string, limit: number = 10): Promise<Tag[]> {
    const lowerQuery = query.toLowerCase().trim();

    // Get all user tags (cached in real implementation)
    const allTags = await this.listTags(userId);

    // Filter by name match
    const matches = allTags
      .filter(tag => tag.name.toLowerCase().includes(lowerQuery))
      .slice(0, limit);

    return matches;
  },

  /**
   * Get or create tag by name
   */
  async getOrCreateTag(userId: string, name: string, color?: string): Promise<string> {
    const existing = await this.findTagByName(userId, name);
    if (existing) {
      return existing.id!;
    }

    return this.createTag(userId, { name: name.trim(), color });
  },

  /**
   * Batch get or create tags
   */
  async getOrCreateTags(userId: string, tagNames: string[]): Promise<string[]> {
    const tagIds: string[] = [];

    for (const name of tagNames) {
      const id = await this.getOrCreateTag(userId, name);
      tagIds.push(id);
    }

    return tagIds;
  }
};
