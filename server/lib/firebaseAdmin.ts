import admin from "firebase-admin";

if (!admin.apps.length) {
    try {
        const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "")
            .replace(/^"(.*)"$/, '$1') // Remove surrounding quotes if present
            .replace(/\\n/g, "\n");

        console.log("Initializing Firebase Admin with Project ID:", process.env.FIREBASE_PROJECT_ID);
        console.log("Client Email exists:", !!process.env.FIREBASE_CLIENT_EMAIL);
        console.log("Private Key length:", privateKey.length);
        console.log("Private Key Header:", privateKey.substring(0, 50));

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
        });
    } catch (error) {
        console.error("Firebase admin initialization error", error);
    }
}

// In test environment or if init failed, we might want to export proxies or mocks
// But for now, we assume if it fails, the app crashes.
// To support unit tests importing this file without crashing:
let db: FirebaseFirestore.Firestore;
let auth: admin.auth.Auth;

try {
    if (admin.apps.length) {
        db = admin.firestore();
        auth = admin.auth();
    } else {
        // Allow compilation/import in tests even if init failed
        // usage will throw
        db = {} as any;
        auth = {} as any;
    }
} catch (e) {
    db = {} as any;
    auth = {} as any;
}

export const adminDb = db;
export const adminAuth = auth;
