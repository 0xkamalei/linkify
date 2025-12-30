import { adminDb } from "../lib/firebaseAdmin";
import type { Link } from "../../src/types";
import { sensitiveService } from "./sensitiveService";

const COLLECTION = "links";

export const linkService = {
    async saveLink(link: Link) {
        // Sanitize content
        const titleSafe = await sensitiveService.safeUserText(link.title);
        const descSafe = link.description ? await sensitiveService.safeUserText(link.description) : "";

        const docRef = await adminDb.collection(COLLECTION).add({
            ...link,
            title: titleSafe,
            description: descSafe,
            createTime: new Date(),
            updateTime: new Date(),
        });
        return docRef.id;
    },

    async listLinks(topicId?: string, limit: number = 20, userId?: string) {
        try {
            let query = adminDb.collection(COLLECTION).orderBy("createTime", "desc").limit(limit);
            if (topicId) {
                query = query.where("topicId", "==", topicId);
            }
            if (userId) {
                query = query.where("userId", "==", userId);
            }
            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Link));
        } catch (error) {
            console.error("Error in listLinks:", error);
            throw error;
        }
    },

    async getLink(id: string) {
        const doc = await adminDb.collection(COLLECTION).doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as Link;
    }
};
