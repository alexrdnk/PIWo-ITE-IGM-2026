"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import FavoriteButton from "@/components/FavoriteButton";
import { useAuth } from "@/context/AuthContext";
import { usePurchases } from "@/context/PurchasesContext";
import { db } from "@/lib/firebase";

export default function GamesPage() {
  const { user, ready } = useAuth();
  const { buyGame: markAsPurchased, isPurchased } = usePurchases();
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [expansion, setExpansion] = useState("all");

  useEffect(() => {
    const stopGames = onSnapshot(collection(db, "games"), (snapshot) => {
      const firestoreGames = snapshot.docs.map((gameDoc) => gameDoc.data());
      firestoreGames.sort((a, b) => a.id - b.id);
      setGames(firestoreGames);
    });

    return () => stopGames();
  }, []);

  function buyGame(game) {
    markAsPurchased(game.id);
  }

  const gameTypes = [...new Set(games.map((game) => game.type))];
  const filteredGames = games.filter((game) => {
    const text = search.toLowerCase();
    const matchesSearch =
      game.title.toLowerCase().includes(text) ||
      game.publisher.toLowerCase().includes(text);
    const matchesType = type === "all" || game.type === type;
    const matchesExpansion =
      expansion === "all" ||
      (expansion === "yes" && game.is_expansion) ||
      (expansion === "no" && !game.is_expansion);

    return matchesSearch && matchesType && matchesExpansion;
  });

  return (
    <main className="page">
      <section className="hero">
        <h1>Board Games Shop</h1>
      </section>

      <section className="panel filters">
        <label>
          Szukaj
          <input
            type="search"
            placeholder="np. Catan albo Rebel"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label>
          Typ gry
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="all">Wszystkie</option>
            {gameTypes.map((gameType) => (
              <option key={gameType} value={gameType}>
                {gameType}
              </option>
            ))}
          </select>
        </label>

        <label>
          Rodzaj
          <select
            value={expansion}
            onChange={(event) => setExpansion(event.target.value)}
          >
            <option value="all">Wszystkie</option>
            <option value="no">Podstawowe gry</option>
            <option value="yes">Dodatki</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setType("all");
            setExpansion("all");
          }}
        >
          Wyczyść
        </button>
      </section>

      {!user && ready ? (
        <p className="login-hint">
          <Link href="/logowanie">Zaloguj się</Link>, aby kupować, dodawać
          ulubione i przeglądać szczegóły.
        </p>
      ) : null}

      <p className="result-count">Znaleziono: {filteredGames.length}</p>

      <section className="grid">
        {filteredGames.map((game) => {
          const sold = isPurchased(game.id);

          return (
            <article className={`card ${sold ? "sold" : ""}`} key={game.id}>
              <p className="tag">{sold ? "sprzedane" : game.type}</p>
              <h2>{game.title}</h2>
              <p>{game.description[0]}</p>
              <p className="price">{game.price_pln.toFixed(2)} zł</p>
              {user ? (
                <div className="card-actions">
                  <Link className="details-link" href={`/games/${game.id}`}>
                    Szczegóły
                  </Link>
                  <FavoriteButton game={game} />
                  <button
                    className="buy-button"
                    type="button"
                    disabled={sold}
                    onClick={() => buyGame(game)}
                  >
                    {sold ? "Niedostępna" : "Kup"}
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </main>
  );
}
