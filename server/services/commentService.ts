import { adminDb } from "../lib/firebaseAdmin";
import type { Comment } from "../../src/types";
import { sensitiveService } from "./sensitiveService";
import { FieldValue } from "firebase-admin/firestore";

const COLLECTION = "comments";

export const commentService = {
    async saveComment(comment: Comment) {
        // Sanitize content
        const safeContent = await sensitiveService.safeUserText(comment.content);

        const docRef = await adminDb.collection(COLLECTION).add({
            ...comment,
            content: safeContent,
            createTime: FieldValue.serverTimestamp(),
        });

        // Increment comment count on the link
        await adminDb.collection("links").doc(comment.linkId).update({
            commentCnt: FieldValue.increment(1)
        });

        return docRef.id;
    },

    async listComments(linkId: string, limit: number = 50) {
        try {
            const snapshot = await adminDb.collection(COLLECTION)
                .where("linkId", "==", linkId)
                .orderBy("createTime", "asc")
                .limit(limit)
                .get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
        } catch (error) {
            console.error("Error in listComments:", error);
            throw error;
        }
    }
};
