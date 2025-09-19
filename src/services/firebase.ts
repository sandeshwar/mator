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
let initializationFailed = false;

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

function ensureApp(): FirebaseApp | null {
  if (initializationFailed) {
    return null;
  }

  if (app) {
    return app;
  }

  try {
    if (getApps().length) {
      app = getApps()[0]!;
    } else {
      app = initializeApp(readFirebaseConfig());
    }
  } catch (error) {
    initializationFailed = true;
    console.error('Failed to initialize Firebase app', error);
    return null;
  }

  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (authInstance) {
    return authInstance;
  }

  const ensured = ensureApp();
  if (!ensured) {
    return null;
  }

  try {
    authInstance = getAuth(ensured);
  } catch (error) {
    initializationFailed = true;
    console.error('Failed to initialize Firebase auth', error);
    return null;
  }

  return authInstance;
}

export function getFirestoreDb(): Firestore | null {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const ensured = ensureApp();
  if (!ensured) {
    return null;
  }

  try {
    firestoreInstance = getFirestore(ensured);
  } catch (error) {
    initializationFailed = true;
    console.error('Failed to initialize Firestore', error);
    return null;
  }

  return firestoreInstance;
}

export async function ensureAnonymousUser(): Promise<string> {
  const auth = getFirebaseAuth();

  if (auth?.currentUser) {
    return auth.currentUser.uid;
  }

  if (!auth) {
    const storageKey = 'mathquest-offline-uid';
    if (typeof window !== 'undefined') {
      try {
        const existing = window.localStorage.getItem(storageKey);
        if (existing) {
          return existing;
        }

        const generated =
          typeof window.crypto !== 'undefined' && typeof window.crypto.randomUUID === 'function'
            ? window.crypto.randomUUID()
            : `offline-${Math.random().toString(36).slice(2)}`;
        window.localStorage.setItem(storageKey, generated);
        return generated;
      } catch (error) {
        console.warn('Unable to persist offline user identifier', error);
      }
    }

    return `offline-${Date.now()}`;
  }

  const result = await signInAnonymously(auth);
  return result.user.uid;
}

export function subscribeToAuthState(callback: (uid: string | null) => void) {
  const auth = getFirebaseAuth();

  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => callback(user ? user.uid : null));
}
