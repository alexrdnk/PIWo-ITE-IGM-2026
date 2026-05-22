/** @type {import('next').NextConfig} */

const firebaseEnvKeys = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const missingOnVercel = firebaseEnvKeys.filter((key) => !process.env[key]);

if (process.env.VERCEL && missingOnVercel.length > 0) {
  throw new Error(
    `Vercel build: dodaj zmienne środowiskowe Firebase w ustawieniach projektu: ${missingOnVercel.join(", ")}. ` +
      "Wzór wartości: lab5/todos/.env.local.example",
  );
}

const nextConfig = {};

export default nextConfig;
