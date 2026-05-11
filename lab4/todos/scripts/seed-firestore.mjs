import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const API_URL = "https://szandala.github.io/piwo-api/board-games.json";

function loadEnv() {
  const envFile = readFileSync(".env.local", "utf8");

  for (const line of envFile.split("\n")) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const [key, ...valueParts] = trimmedLine.split("=");
    process.env[key] = valueParts.join("=");
  }
}

loadEnv();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const response = await fetch(API_URL);
const data = await response.json();

for (const game of data.board_games) {
  await setDoc(doc(db, "games", String(game.id)), {
    ...game,
    available: true,
    buyerEmail: null,
    buyerUid: null,
    soldAt: null,
  });
}

console.log(`Dodano do Firestore: ${data.board_games.length} gier.`);
