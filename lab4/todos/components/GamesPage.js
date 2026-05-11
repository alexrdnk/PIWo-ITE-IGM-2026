"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import AuthBox from "@/components/AuthBox";
import { auth, db } from "@/lib/firebase";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [expansion, setExpansion] = useState("all");

  useEffect(() => {
    const stopAuth = onAuthStateChanged(auth, setUser);
    const stopGames = onSnapshot(collection(db, "games"), (snapshot) => {
      const firestoreGames = snapshot.docs.map((gameDoc) => gameDoc.data());
      firestoreGames.sort((a, b) => a.id - b.id);
      setGames(firestoreGames);
    });

    return () => {
      stopAuth();
      stopGames();
    };
  }, []);

  async function buyGame(game) {
    if (!user) {
      alert("Najpierw musisz się zalogować.");
      return;
    }

    await updateDoc(doc(db, "games", String(game.id)), {
      available: false,
      buyerEmail: user.email,
      buyerUid: user.uid,
      soldAt: serverTimestamp(),
    });
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
        <h1>Lab4 - Firebase Board Games Shop</h1>
        <p>Dane pochodzą z Firestore. Zalogowany użytkownik może kupić ofertę.</p>
      </section>

      <AuthBox user={user} />

      <section className="filters">
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

      <p className="result-count">Znaleziono: {filteredGames.length}</p>

      <section className="grid">
        {filteredGames.map((game) => (
          <article
            className={`card ${game.available === false ? "sold" : ""}`}
            key={game.id}
          >
            <div className="image-placeholder">
              {game.images.length > 0 ? game.title : "Brak zdjęcia"}
            </div>

            <div className="card-content">
              <p className="tag">{game.available === false ? "sprzedane" : game.type}</p>
              <h2>{game.title}</h2>
              <p>{game.description[0]}</p>
              <p className="price">{game.price_pln.toFixed(2)} zł</p>
              <Link className="details-link" href={`/games/${game.id}`}>
                Zobacz szczegóły
              </Link>
              <button
                className="buy-button"
                type="button"
                disabled={game.available === false}
                onClick={() => buyGame(game)}
              >
                {game.available === false ? "Oferta niedostępna" : "Kup Teraz"}
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
