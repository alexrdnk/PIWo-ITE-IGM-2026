"use client";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function AuthBox({ user }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function loginWithEmail(event) {
    event.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function registerWithEmail() {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  if (user) {
    return (
      <section className="auth-box">
        <p>
          Zalogowano jako <strong>{user.email}</strong>
        </p>
        <button type="button" onClick={() => signOut(auth)}>
          Wyloguj
        </button>
      </section>
    );
  }

  return (
    <section className="auth-box">
      <button type="button" onClick={loginWithGoogle}>
        Zaloguj przez Google
      </button>

      <form onSubmit={loginWithEmail}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="hasło"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit">Zaloguj Email/Hasło</button>
        <button type="button" onClick={registerWithEmail}>
          Zarejestruj
        </button>
      </form>
    </section>
  );
}
