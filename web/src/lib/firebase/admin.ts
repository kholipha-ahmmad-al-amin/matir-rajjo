import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    initializeApp({
      credential: applicationDefault(),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const adminDb = getFirestore();
const adminAuth = getAuth();

export { adminDb, adminAuth };
