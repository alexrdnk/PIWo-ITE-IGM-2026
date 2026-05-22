"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import {
  getFirebaseAuthErrorMessage,
  validateAuthForm,
} from "@/lib/authValidation";

export default function LoginPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) {
      router.replace("/");
    }
  }, [ready, user, router]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    const validationError = validateAuthForm(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/");
    } catch (authError) {
      setError(getFirebaseAuthErrorMessage(authError));
    } finally {
      setBusy(false);
    }
  }

  async function loginWithGoogle() {
    setError("");
    setBusy(true);

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.replace("/");
    } catch (authError) {
      setError(getFirebaseAuthErrorMessage(authError));
    } finally {
      setBusy(false);
    }
  }

  if (!ready || user) {
    return <main className="page">Ładowanie...</main>;
  }

  return (
    <main className="page">
      <section className="hero">
        <h1>Logowanie</h1>
      </section>

      <section className="panel auth-page">
        <form className="auth-form" onSubmit={handleLogin}>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              disabled={busy}
              required
            />
          </label>

          <label>
            Hasło
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              disabled={busy}
              required
            />
          </label>

          <p className="auth-hint">Hasło: minimum 6 znaków (wymaganie Firebase).</p>

          <button className="buy-button" type="submit" disabled={busy}>
            Zaloguj
          </button>
        </form>

        <button
          className="secondary-button auth-google"
          type="button"
          disabled={busy}
          onClick={loginWithGoogle}
        >
          Zaloguj się z Google
        </button>

        {error ? <p className="auth-error">{error}</p> : null}

        <p className="auth-footer">
          Nie masz konta? <Link href="/rejestracja">Zarejestruj się</Link>
        </p>
      </section>
    </main>
  );
}
