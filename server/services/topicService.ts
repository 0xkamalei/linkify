import { adminDb } from "../lib/firebaseAdmin";
import type { Topic } from "../../src/types";

const COLLECTION = "topics";

export const topicService = {
    async saveTopic(topic: Topic) {
        const docRef = await adminDb.collection(COLLECTION).add({
            ...topic,
            createTime: new Date(),
        });
        return docRef.id;
    },

    async listTopics(limit: number = 50) {
        try {
            const snapshot = await adminDb.collection(COLLECTION).limit(limit).get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Topic));
        } catch (error) {
            console.error("Error in listTopics:", error);
            throw error;
        }
    },

    async getTopicByShortCode(shortCode: string) {
        try {
            const snapshot = await adminDb.collection(COLLECTION).where("shortCode", "==", shortCode).limit(1).get();
            if (snapshot.empty) return null;
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Topic;
        } catch (error) {
            console.error("Error in getTopicByShortCode:", error);
            throw error;
        }
    }
};
