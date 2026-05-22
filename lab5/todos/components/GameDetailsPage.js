"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import FavoriteButton from "@/components/FavoriteButton";
import LoginPrompt from "@/components/LoginPrompt";
import { useAuth } from "@/context/AuthContext";
import { usePurchases } from "@/context/PurchasesContext";
import { db } from "@/lib/firebase";

export default function GameDetailsPage() {
  const { user, ready } = useAuth();
  const { buyGame: markAsPurchased, isPurchased } = usePurchases();
  const params = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !user) {
      setLoading(false);
      return;
    }

    const gameRef = doc(db, "games", String(params.id));
    const stopGame = onSnapshot(gameRef, (snapshot) => {
      setGame(snapshot.exists() ? snapshot.data() : null);
      setLoading(false);
    });

    return () => stopGame();
  }, [params.id, ready, user]);

  if (!ready || loading) {
    return <main className="page">Ładowanie...</main>;
  }

  if (!user) {
    return (
      <main className="page">
        <LoginPrompt message="Szczegóły gry są dostępne tylko po zalogowaniu." />
      </main>
    );
  }

  if (!game) {
    return <main className="page">Nie znaleziono gry.</main>;
  }

  const sold = isPurchased(game.id);

  return (
    <main className="page">
      <Link className="back-link" href="/">
        Wróć do listy
      </Link>

      <section className="details">
        <div>
          <p className="tag">{sold ? "sprzedane" : game.type}</p>
          <h1>{game.title}</h1>
          <p className="price">{game.price_pln.toFixed(2)} zł</p>

          <div className="details-actions">
            <FavoriteButton game={game} />
            <button
              className="buy-button"
              type="button"
              disabled={sold}
              onClick={() => markAsPurchased(game.id)}
            >
              {sold ? "Niedostępna" : "Kup"}
            </button>
          </div>

          <div className="info-box">
            <p>
              <strong>Wydawca:</strong> {game.publisher}
            </p>
            <p>
              <strong>Liczba graczy:</strong> {game.min_players}-
              {game.max_players}
            </p>
            <p>
              <strong>Czas gry:</strong> {game.avg_play_time_minutes} minut
            </p>
            <p>
              <strong>Rodzaj:</strong>{" "}
              {game.is_expansion ? "dodatek" : "podstawowa gra"}
            </p>
          </div>

          {game.auction && (
            <div className="info-box">
              <h2>Aukcja</h2>
              <p>
                <strong>Cena startowa:</strong>{" "}
                {game.auction.starting_price.toFixed(2)} zł
              </p>
              <p>
                <strong>Aktualna oferta:</strong>{" "}
                {game.auction.current_bid.toFixed(2)} zł
              </p>
            </div>
          )}
        </div>

        <div className="description">
          <h2>Opis</h2>
          {game.description.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
