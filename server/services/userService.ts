import { adminDb } from "../lib/firebaseAdmin";
import type { User, UserSettings } from "../types/v2";
import { FieldValue } from "firebase-admin/firestore";
import { spaceService } from "./spaceService";

const COLLECTION = "users";

export const userService = {
  /**
   * Create a new user profile (called after Firebase Auth registration)
   */
  async createUser(
    userId: string,
    userData: Omit<User, "id" | "createdAt" | "updatedAt" | "settings">
  ): Promise<void> {
    const now = FieldValue.serverTimestamp();

    // Create default space first
    const defaultSpaceId = await spaceService.createDefaultSpace(userId);

    // Default settings
    const defaultSettings: UserSettings = {
      defaultSpace: defaultSpaceId,
      defaultReadStatus: "unread",
      theme: "auto",
      compactView: true,
    };

    await adminDb.collection(COLLECTION).doc(userId).set({
      ...userData,
      settings: defaultSettings,
      createdAt: now,
      updatedAt: now,
    });
  },

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<User | null> {
    const doc = await adminDb.collection(COLLECTION).doc(userId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as User;
  },

  /**
   * Get user by username (for public profiles)
   */
  async getUserByUsername(username: string): Promise<User | null> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("username", "==", username)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as User;
  },

  /**
   * Check if username is available
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    return user === null;
  },

  /**
   * Update user profile
   */
  async updateUser(
    userId: string,
    updates: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> {
    // If username is being updated, check availability
    if (updates.username) {
      const currentUser = await this.getUser(userId);
      if (currentUser && currentUser.username !== updates.username) {
        const available = await this.isUsernameAvailable(updates.username);
        if (!available) {
          throw new Error("Username already taken");
        }
      }
    }

    await adminDb.collection(COLLECTION).doc(userId).update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    });
  },

  /**
   * Update user settings only
   */
  async updateSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newSettings = {
      ...user.settings,
      ...settings,
    };

    await adminDb.collection(COLLECTION).doc(userId).update({
      settings: newSettings,
      updatedAt: FieldValue.serverTimestamp(),
    });
  },

  /**
   * Delete user and all associated data
   */
  async deleteUser(userId: string): Promise<void> {
    // Delete all user's spaces (which cascades to folders and links)
    const spaces = await spaceService.listSpaces(userId);
    for (const space of spaces) {
      await spaceService.deleteSpace(space.id!);
    }

    // Delete all user's tags
    const tagsSnapshot = await adminDb
      .collection("tags")
      .where("userId", "==", userId)
      .get();

    const batch = adminDb.batch();
    tagsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete user profile
    const userRef = adminDb.collection(COLLECTION).doc(userId);
    batch.delete(userRef);

    await batch.commit();
  },

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<any> {
    const [spacesCount, linksCount, foldersCount, tagsCount] = await Promise.all([
      adminDb.collection("spaces").where("userId", "==", userId).count().get(),
      adminDb.collection("links_v2").where("userId", "==", userId).count().get(),
      adminDb.collection("folders").where("userId", "==", userId).count().get(),
      adminDb.collection("tags").where("userId", "==", userId).count().get(),
    ]);

    // Count by read status
    const [unreadCount, readLaterCount, readCount] = await Promise.all([
      adminDb.collection("links_v2").where("userId", "==", userId).where("readStatus", "==", "unread").count().get(),
      adminDb.collection("links_v2").where("userId", "==", userId).where("readStatus", "==", "read_later").count().get(),
      adminDb.collection("links_v2").where("userId", "==", userId).where("readStatus", "==", "read").count().get(),
    ]);

    return {
      spacesCount: spacesCount.data().count,
      linksCount: linksCount.data().count,
      foldersCount: foldersCount.data().count,
      tagsCount: tagsCount.data().count,
      readStatus: {
        unread: unreadCount.data().count,
        readLater: readLaterCount.data().count,
        read: readCount.data().count,
      },
    };
  }
};
