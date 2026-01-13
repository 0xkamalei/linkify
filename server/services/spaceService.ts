import { adminDb } from "../lib/firebaseAdmin";
import type { Space } from "../types/v2";
import { FieldValue } from "firebase-admin/firestore";

const COLLECTION = "spaces";

export const spaceService = {
  /**
   * Create a new space for a user
   */
  async createSpace(userId: string, spaceData: Omit<Space, "id" | "userId" | "createdAt" | "updatedAt">): Promise<string> {
    const now = FieldValue.serverTimestamp();

    const docRef = await adminDb.collection(COLLECTION).add({
      ...spaceData,
      userId,
      createdAt: now,
      updatedAt: now,
    });

    return docRef.id;
  },

  /**
   * Get all spaces for a user
   */
  async listSpaces(userId: string): Promise<Space[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("userId", "==", userId)
      .orderBy("order", "asc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Space));
  },

  /**
   * Get a single space by ID
   */
  async getSpace(spaceId: string): Promise<Space | null> {
    const doc = await adminDb.collection(COLLECTION).doc(spaceId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as Space;
  },

  /**
   * Update a space
   */
  async updateSpace(spaceId: string, updates: Partial<Omit<Space, "id" | "userId" | "createdAt">>): Promise<void> {
    await adminDb.collection(COLLECTION).doc(spaceId).update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    });
  },

  /**
   * Delete a space and cascade delete all folders and links within it
   */
  async deleteSpace(spaceId: string): Promise<void> {
    const batch = adminDb.batch();

    // Delete the space itself
    const spaceRef = adminDb.collection(COLLECTION).doc(spaceId);
    batch.delete(spaceRef);

    // Delete all folders in this space
    const foldersSnapshot = await adminDb
      .collection("folders")
      .where("spaceId", "==", spaceId)
      .get();

    foldersSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete all links in this space
    const linksSnapshot = await adminDb
      .collection("links_v2")
      .where("spaceId", "==", spaceId)
      .get();

    linksSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete all smart collections in this space
    const collectionsSnapshot = await adminDb
      .collection("smartCollections")
      .where("userId", "==", spaceId) // Note: collections are per-user, not per-space
      .get();

    // Only delete non-system collections
    collectionsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (!data.isSystem) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();
  },

  /**
   * Reorder spaces
   */
  async reorderSpaces(spaceIds: string[], userId: string): Promise<void> {
    const batch = adminDb.batch();

    spaceIds.forEach((spaceId, index) => {
      const ref = adminDb.collection(COLLECTION).doc(spaceId);
      batch.update(ref, {
        order: index,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
  },

  /**
   * Create default space for new user
   */
  async createDefaultSpace(userId: string): Promise<string> {
    return this.createSpace(userId, {
      name: "Personal",
      icon: "🏠",
      isPublic: false,
      order: 0,
    });
  },

  /**
   * Toggle public/private status
   */
  async togglePublic(spaceId: string): Promise<boolean> {
    const space = await this.getSpace(spaceId);
    if (!space) {
      throw new Error("Space not found");
    }

    const newStatus = !space.isPublic;
    await this.updateSpace(spaceId, { isPublic: newStatus });

    return newStatus;
  },

  /**
   * Get space with stats (link count, folder count)
   */
  async getSpaceWithStats(spaceId: string): Promise<any> {
    const space = await this.getSpace(spaceId);
    if (!space) {
      return null;
    }

    // Count folders
    const foldersSnapshot = await adminDb
      .collection("folders")
      .where("spaceId", "==", spaceId)
      .count()
      .get();

    // Count links
    const linksSnapshot = await adminDb
      .collection("links_v2")
      .where("spaceId", "==", spaceId)
      .count()
      .get();

    return {
      ...space,
      folderCount: foldersSnapshot.data().count,
      linkCount: linksSnapshot.data().count,
    };
  }
};
