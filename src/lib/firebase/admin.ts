import * as admin from "firebase-admin";

// Ensure only one firebase admin instance is created
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
    }),
    databaseURL: "https://aip-assessment-2.firebaseio.com",
  });
}

export { admin };
