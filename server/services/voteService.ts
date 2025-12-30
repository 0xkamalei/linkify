import { adminDb } from "../lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

type VoteType = "link" | "comment";

export const voteService = {
    async vote(userId: string, targetId: string, type: VoteType, isLike: number) {
        const voteRef = adminDb.collection("votes").doc(`${userId}_${targetId}`);
        const targetRef = adminDb.collection(type === "link" ? "links" : "comments").doc(targetId);

        return adminDb.runTransaction(async (transaction) => {
            const voteDoc = await transaction.get(voteRef);
            const targetDoc = await transaction.get(targetRef);

            if (!targetDoc.exists) throw new Error("Target not found");

            const before = voteDoc.exists ? voteDoc.data()?.isLike : -1;
            if (before === isLike) return true;

            const { scoreDelta, agreeDelta, disagreeDelta } = this.calculateDeltas(before, isLike);

            transaction.set(voteRef, {
                userId,
                targetId,
                type,
                isLike,
                updateTime: FieldValue.serverTimestamp()
            });

            transaction.update(targetRef, {
                score: FieldValue.increment(scoreDelta),
                agree: FieldValue.increment(agreeDelta),
                disagree: FieldValue.increment(disagreeDelta),
            });

            return true;
        });
    },

    calculateDeltas(before: number, now: number) {
        let scoreDelta = 0;
        let agreeDelta = 0;
        let disagreeDelta = 0;

        if (before !== -1) {
            // Logic from legacy Go dualScore function
            if (before === 1) { // Liked
                if (now === 0) { // Cancel
                    scoreDelta = -1; agreeDelta = -1;
                } else if (now === 2) { // To Dislike
                    scoreDelta = -2; agreeDelta = -1; disagreeDelta = 1;
                }
            } else if (before === 2) { // Disliked
                if (now === 0) {
                    scoreDelta = 1; disagreeDelta = -1;
                } else if (now === 1) {
                    scoreDelta = 2; agreeDelta = 1; disagreeDelta = -1;
                }
            } else if (before === 0) { // Cancelled
                if (now === 1) {
                    scoreDelta = 1; agreeDelta = 1;
                } else if (now === 2) {
                    scoreDelta = -1; disagreeDelta = 1;
                }
            }
        } else {
            // First time voting
            if (now === 1) {
                scoreDelta = 1; agreeDelta = 1;
            } else if (now === 2) {
                scoreDelta = -1; disagreeDelta = 1;
            }
        }

        return { scoreDelta, agreeDelta, disagreeDelta };
    }
};
