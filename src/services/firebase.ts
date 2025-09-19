import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

interface FirebaseEnvConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

function readFirebaseConfig(): FirebaseEnvConfig {
  const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;
  const config: FirebaseEnvConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: env.VITE_FIREBASE_APP_ID ?? '',
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(`Missing Firebase configuration values: ${missing.join(', ')}`);
  }

  return config;
}

function ensureApp(): FirebaseApp {
  if (app) {
    return app;
  }

  if (getApps().length) {
    app = getApps()[0]!;
  } else {
    app = initializeApp(readFirebaseConfig());
  }

  return app;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(ensureApp());
  }
  return authInstance;
}

export function getFirestoreDb(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(ensureApp());
  }
  return firestoreInstance;
}

export async function ensureAnonymousUser(): Promise<string> {
  const auth = getFirebaseAuth();

  if (auth.currentUser) {
    return auth.currentUser.uid;
  }

  const result = await signInAnonymously(auth);
  return result.user.uid;
}

export function subscribeToAuthState(callback: (uid: string | null) => void) {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, (user) => callback(user ? user.uid : null));
}
