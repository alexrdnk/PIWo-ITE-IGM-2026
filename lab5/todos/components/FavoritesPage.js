"use client";

import Link from "next/link";
import LoginPrompt from "@/components/LoginPrompt";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";

export default function FavoritesPage() {
  const { user, ready } = useAuth();
  const { items, clearFavorites, removeFavorite } = useFavorites();

  if (!ready) {
    return <main className="page">Ładowanie...</main>;
  }

  if (!user) {
    return (
      <main className="page">
        <section className="hero">
          <h1>Ulubione</h1>
        </section>
        <LoginPrompt message="Lista ulubionych jest dostępna tylko po zalogowaniu." />
      </main>
    );
  }

  return (
    <main className="page">
      <section className="hero">
        <h1>Ulubione</h1>
      </section>

      {items.length === 0 ? (
        <section className="panel">
          <p>Brak ulubionych gier. Dodaj je ze sklepu po zalogowaniu.</p>
          <Link className="details-link" href="/">
            Przejdź do sklepu
          </Link>
        </section>
      ) : (
        <>
          <div className="favorites-toolbar">
            <p className="result-count">Liczba pozycji: {items.length}</p>
            <button className="secondary-button" type="button" onClick={clearFavorites}>
              Wyczyść ulubione
            </button>
          </div>

          <section className="favorites-list">
            {items.map((game) => (
              <article className="favorites-item" key={game.id}>
                <div>
                  <p className="tag">{game.type}</p>
                  <h2>{game.title}</h2>
                  <p className="price">{game.price_pln.toFixed(2)} zł</p>
                </div>

                <div className="favorites-actions">
                  <Link className="details-link" href={`/games/${game.id}`}>
                    Szczegóły
                  </Link>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => removeFavorite(game.id)}
                  >
                    Usuń
                  </button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
