/** @type {import('next').NextConfig} */

const missingOnVercel = [];

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  missingOnVercel.push("NEXT_PUBLIC_FIREBASE_API_KEY");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
  missingOnVercel.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  missingOnVercel.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
  missingOnVercel.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) {
  missingOnVercel.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) {
  missingOnVercel.push("NEXT_PUBLIC_FIREBASE_APP_ID");
}

if (process.env.VERCEL && missingOnVercel.length > 0) {
  throw new Error(
    `Vercel build: dodaj zmienne środowiskowe Firebase w ustawieniach projektu: ${missingOnVercel.join(", ")}. ` +
      "Wzór wartości: lab5/todos/.env.local.example",
  );
}

const nextConfig = {};

export default nextConfig;
