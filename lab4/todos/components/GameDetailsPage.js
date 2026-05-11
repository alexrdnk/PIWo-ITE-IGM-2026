"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import AuthBox from "@/components/AuthBox";
import { auth, db } from "@/lib/firebase";

export default function GameDetailsPage() {
  const params = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stopAuth = onAuthStateChanged(auth, setUser);
    const gameRef = doc(db, "games", String(params.id));
    const stopGame = onSnapshot(gameRef, (snapshot) => {
      setGame(snapshot.exists() ? snapshot.data() : null);
      setLoading(false);
    });

    return () => {
      stopAuth();
      stopGame();
    };
  }, [params.id]);

  async function buyGame() {
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

  if (loading) {
    return <main className="page">Ładowanie...</main>;
  }

  if (!game) {
    return <main className="page">Nie znaleziono gry.</main>;
  }

  return (
    <main className="page">
      <Link className="back-link" href="/">
        Wróć do listy
      </Link>

      <AuthBox user={user} />

      <section className="details">
        <div>
          <p className="tag">{game.available === false ? "sprzedane" : game.type}</p>
          <h1>{game.title}</h1>
          <p className="price">{game.price_pln.toFixed(2)} zł</p>

          <button
            className="buy-button"
            type="button"
            disabled={game.available === false}
            onClick={buyGame}
          >
            {game.available === false ? "Oferta niedostępna" : "Kup Teraz"}
          </button>

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

      <section>
        <h2>Zdjęcia</h2>
        {game.images.length > 0 ? (
          <div className="gallery">
            {game.images.map((image, index) => (
              <div className="image-placeholder large" key={image}>
                {game.title} - zdjęcie {index + 1}
              </div>
            ))}
          </div>
        ) : (
          <div className="image-placeholder">Brak zdjęć dla tej gry</div>
        )}
      </section>
    </main>
  );
}
