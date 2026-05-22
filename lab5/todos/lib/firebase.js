import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseEnvKeys = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

export function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

export function getMissingFirebaseEnvKeys() {
  return firebaseEnvKeys.filter((key) => !process.env[key]);
}

function createFirebaseApp() {
  const missing = getMissingFirebaseEnvKeys();

  if (missing.length > 0) {
    throw new Error(
      `Brak zmiennych Firebase: ${missing.join(", ")}. ` +
        "Ustaw je w .env.local (lokalnie) lub w Vercel → Settings → Environment Variables. " +
        "Wzór: .env.local.example",
    );
  }

  return getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
}

const app = createFirebaseApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
