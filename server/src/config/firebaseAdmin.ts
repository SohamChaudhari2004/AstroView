import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const getFirebaseConfig = () => {
  // Check if Firebase is already initialized
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
    console.warn('Firebase Admin SDK credentials not fully configured. Some features may be unavailable.');
    return null;
  }

  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log('Firebase Admin SDK initialized successfully');
    return app;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    return null;
  }
};

const firebaseApp = getFirebaseConfig();

export const auth = firebaseApp ? admin.auth() : null;
export const firestore = firebaseApp ? admin.firestore() : null;
export default firebaseApp;
