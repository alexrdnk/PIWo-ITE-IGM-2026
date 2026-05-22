"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

export default function NavAuth() {
  const { user, ready } = useAuth();

  if (!ready) {
    return null;
  }

  if (user) {
    return (
      <div className="nav-auth nav-auth--logged">
        <span className="nav-auth-email" title={user.email}>
          {user.email}
        </span>
        <button className="secondary-button" type="button" onClick={() => signOut(auth)}>
          Wyloguj
        </button>
      </div>
    );
  }

  return (
    <div className="nav-auth">
      <Link className="buy-button" href="/logowanie">
        Zaloguj
      </Link>
      <Link className="secondary-button" href="/rejestracja">
        Zarejestruj
      </Link>
    </div>
  );
}
