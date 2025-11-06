
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useUser } from './auth/use-user';

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

function initializeFirebase() {
  // Check if the necessary environment variables are set.
  const isConfigValid = firebaseConfig.apiKey && firebaseConfig.projectId;

  if (isConfigValid) {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  } else {
    // Handle the case where Firebase config is missing.
    // This can happen if the .env.local file is not set up.
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Firebase config is missing. Please create a .env.local file with your Firebase credentials.'
      );
    }
  }

  return { firebaseApp, auth, firestore };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useUser,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
};
