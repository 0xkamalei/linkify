import { adminDb } from "../lib/firebaseAdmin";
import type { Folder } from "../types/v2";
import { FieldValue } from "firebase-admin/firestore";

const COLLECTION = "folders";

export const folderService = {
  /**
   * Create a new folder
   */
  async createFolder(
    userId: string,
    spaceId: string,
    folderData: Omit<Folder, "id" | "userId" | "spaceId" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = FieldValue.serverTimestamp();

    const docRef = await adminDb.collection(COLLECTION).add({
      ...folderData,
      userId,
      spaceId,
      createdAt: now,
      updatedAt: now,
    });

    return docRef.id;
  },

  /**
   * Get all folders in a space (flat list)
   */
  async listFolders(spaceId: string): Promise<Folder[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("spaceId", "==", spaceId)
      .orderBy("order", "asc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Folder));
  },

  /**
   * Get folder tree structure (hierarchical)
   */
  async getFolderTree(spaceId: string): Promise<any[]> {
    const folders = await this.listFolders(spaceId);

    // Build a map for quick lookup
    const folderMap = new Map<string, any>();
    folders.forEach(folder => {
      folderMap.set(folder.id!, {
        ...folder,
        children: []
      });
    });

    // Build tree structure
    const roots: any[] = [];

    folders.forEach(folder => {
      const node = folderMap.get(folder.id!);
      if (!folder.parentId) {
        // Root level folder
        roots.push(node);
      } else {
        // Child folder
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // Parent not found, treat as root
          roots.push(node);
        }
      }
    });

    return roots;
  },

  /**
   * Get a single folder by ID
   */
  async getFolder(folderId: string): Promise<Folder | null> {
    const doc = await adminDb.collection(COLLECTION).doc(folderId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as Folder;
  },

  /**
   * Update a folder
   */
  async updateFolder(
    folderId: string,
    updates: Partial<Omit<Folder, "id" | "userId" | "spaceId" | "createdAt">>
  ): Promise<void> {
    await adminDb.collection(COLLECTION).doc(folderId).update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    });
  },

  /**
   * Delete a folder and optionally cascade delete children
   */
  async deleteFolder(folderId: string, cascadeChildren: boolean = true): Promise<void> {
    const batch = adminDb.batch();

    // Delete the folder itself
    const folderRef = adminDb.collection(COLLECTION).doc(folderId);
    batch.delete(folderRef);

    if (cascadeChildren) {
      // Delete all child folders recursively
      const childFolders = await adminDb
        .collection(COLLECTION)
        .where("parentId", "==", folderId)
        .get();

      for (const doc of childFolders.docs) {
        // Recursively delete child folders
        await this.deleteFolder(doc.id, true);
      }
    } else {
      // Move child folders to parent's parent (or root)
      const folder = await this.getFolder(folderId);
      if (folder) {
        const childFolders = await adminDb
          .collection(COLLECTION)
          .where("parentId", "==", folderId)
          .get();

        childFolders.docs.forEach(doc => {
          batch.update(doc.ref, {
            parentId: folder.parentId || null,
            updatedAt: FieldValue.serverTimestamp(),
          });
        });
      }
    }

    // Move links to root (no folder) or delete them
    const links = await adminDb
      .collection("links_v2")
      .where("folderId", "==", folderId)
      .get();

    links.docs.forEach(doc => {
      batch.update(doc.ref, {
        folderId: null, // Remove folder association
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
  },

  /**
   * Move a folder to a new parent
   */
  async moveFolder(folderId: string, newParentId: string | null): Promise<void> {
    // Validate: Cannot move folder into itself or its descendants
    if (newParentId) {
      const isDescendant = await this.isDescendantOf(newParentId, folderId);
      if (isDescendant || newParentId === folderId) {
        throw new Error("Cannot move folder into itself or its descendants");
      }
    }

    await adminDb.collection(COLLECTION).doc(folderId).update({
      parentId: newParentId || null,
      updatedAt: FieldValue.serverTimestamp(),
    });
  },

  /**
   * Check if a folder is a descendant of another folder
   */
  async isDescendantOf(folderId: string, ancestorId: string): Promise<boolean> {
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = await this.getFolder(currentId);
      if (!folder) break;

      if (folder.parentId === ancestorId) {
        return true;
      }

      currentId = folder.parentId || null;
    }

    return false;
  },

  /**
   * Get folder path (breadcrumb)
   */
  async getFolderPath(folderId: string): Promise<Folder[]> {
    const path: Folder[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = await this.getFolder(currentId);
      if (!folder) break;

      path.unshift(folder); // Add to beginning
      currentId = folder.parentId || null;
    }

    return path;
  },

  /**
   * Get all child folder IDs (recursive)
   */
  async getAllChildFolderIds(folderId: string): Promise<string[]> {
    const childIds: string[] = [];

    const directChildren = await adminDb
      .collection(COLLECTION)
      .where("parentId", "==", folderId)
      .get();

    for (const doc of directChildren.docs) {
      childIds.push(doc.id);
      // Recursively get descendants
      const descendants = await this.getAllChildFolderIds(doc.id);
      childIds.push(...descendants);
    }

    return childIds;
  },

  /**
   * Reorder folders within the same parent
   */
  async reorderFolders(folderIds: string[], parentId: string | null): Promise<void> {
    const batch = adminDb.batch();

    // Verify all folders have the same parent
    for (const id of folderIds) {
      const folder = await this.getFolder(id);
      if (!folder || folder.parentId !== parentId) {
        throw new Error("All folders must have the same parent");
      }
    }

    folderIds.forEach((folderId, index) => {
      const ref = adminDb.collection(COLLECTION).doc(folderId);
      batch.update(ref, {
        order: index,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
  },

  /**
   * Get folder with stats (link count, child folder count)
   */
  async getFolderWithStats(folderId: string): Promise<any> {
    const folder = await this.getFolder(folderId);
    if (!folder) {
      return null;
    }

    // Count direct child folders
    const childFoldersSnapshot = await adminDb
      .collection(COLLECTION)
      .where("parentId", "==", folderId)
      .count()
      .get();

    // Count links in this folder
    const linksSnapshot = await adminDb
      .collection("links_v2")
      .where("folderId", "==", folderId)
      .count()
      .get();

    return {
      ...folder,
      childFolderCount: childFoldersSnapshot.data().count,
      linkCount: linksSnapshot.data().count,
    };
  },

  /**
   * Toggle public/private status
   */
  async togglePublic(folderId: string): Promise<boolean> {
    const folder = await this.getFolder(folderId);
    if (!folder) {
      throw new Error("Folder not found");
    }

    const newStatus = !folder.isPublic;
    await this.updateFolder(folderId, { isPublic: newStatus });

    // Optionally cascade to child folders and links
    // (Commented out for now - can be enabled if needed)
    // const childIds = await this.getAllChildFolderIds(folderId);
    // for (const childId of childIds) {
    //   await this.updateFolder(childId, { isPublic: newStatus });
    // }

    return newStatus;
  }
};
