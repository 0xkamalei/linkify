import { adminDb } from "../lib/firebaseAdmin";
import type { Note } from "../types/v2";
import { FieldValue } from "firebase-admin/firestore";
import { sensitiveService } from "./sensitiveService";

const COLLECTION = "notes";

/**
 * Comment Service V2 - Adapted for private notes (no voting)
 * Notes are private annotations that users add to their own links
 */
export const commentServiceV2 = {
  /**
   * Create a new note
   */
  async createNote(
    userId: string,
    linkId: string,
    content: string
  ): Promise<string> {
    // Sanitize content
    const safeContent = await sensitiveService.safeUserText(content);

    const now = FieldValue.serverTimestamp();

    const docRef = await adminDb.collection(COLLECTION).add({
      userId,
      linkId,
      content: safeContent,
      createdAt: now,
    });

    return docRef.id;
  },

  /**
   * Get all notes for a link
   */
  async listNotes(linkId: string): Promise<Note[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("linkId", "==", linkId)
      .orderBy("createdAt", "asc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Note));
  },

  /**
   * Get a single note
   */
  async getNote(noteId: string): Promise<Note | null> {
    const doc = await adminDb.collection(COLLECTION).doc(noteId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as Note;
  },

  /**
   * Update a note
   */
  async updateNote(noteId: string, content: string): Promise<void> {
    const safeContent = await sensitiveService.safeUserText(content);

    await adminDb.collection(COLLECTION).doc(noteId).update({
      content: safeContent,
      updatedAt: FieldValue.serverTimestamp(),
    });
  },

  /**
   * Delete a note
   */
  async deleteNote(noteId: string): Promise<void> {
    await adminDb.collection(COLLECTION).doc(noteId).delete();
  },

  /**
   * Count notes for a link
   */
  async countNotes(linkId: string): Promise<number> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("linkId", "==", linkId)
      .count()
      .get();

    return snapshot.data().count;
  },

  /**
   * Delete all notes for a link (when link is deleted)
   */
  async deleteNotesByLink(linkId: string): Promise<void> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where("linkId", "==", linkId)
      .get();

    const batch = adminDb.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
};
