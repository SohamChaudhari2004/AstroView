"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = exports.auth = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getFirebaseConfig = () => {
    // Check if Firebase is already initialized
    if (firebase_admin_1.default.apps.length > 0) {
        return firebase_admin_1.default.app();
    }
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
        console.warn('Firebase Admin SDK credentials not fully configured. Some features may be unavailable.');
        return null;
    }
    try {
        const app = firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: privateKey,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });
        console.log('Firebase Admin SDK initialized successfully');
        return app;
    }
    catch (error) {
        console.error('Error initializing Firebase Admin SDK:', error);
        return null;
    }
};
const firebaseApp = getFirebaseConfig();
exports.auth = firebaseApp ? firebase_admin_1.default.auth() : null;
exports.firestore = firebaseApp ? firebase_admin_1.default.firestore() : null;
exports.default = firebaseApp;
