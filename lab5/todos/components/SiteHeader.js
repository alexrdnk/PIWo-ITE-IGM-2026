"use client";

import Link from "next/link";
import NavAuth from "@/components/NavAuth";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";

export default function SiteHeader() {
  const { user } = useAuth();
  const { count } = useFavorites();

  return (
    <header className="site-header">
      <div className="header-row">
        <nav className="site-nav site-nav--side" aria-label="Dodatkowa nawigacja">
          {user ? (
            <Link href="/favorites">
              Ulubione
              {count > 0 ? <span className="nav-badge">{count}</span> : null}
            </Link>
          ) : null}
        </nav>
        <Link className="site-brand" href="/">
          the fiszka
        </Link>
        <NavAuth />
      </div>
    </header>
  );
}
