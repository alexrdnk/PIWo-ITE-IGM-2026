import Link from "next/link";
import { notFound } from "next/navigation";
import { getGames } from "@/lib/games";

export default async function GameDetails({ params }) {
  const { id } = await params;
  const games = await getGames();
  const game = games.find((item) => item.id === Number(id));

  if (!game) {
    notFound();
  }

  return (
    <main className="page">
      <Link className="back-link" href="/">
        Wróć do listy
      </Link>

      <section className="details">
        <div>
          <p className="tag">{game.type}</p>
          <h1>{game.title}</h1>
          <p className="price">{game.price_pln.toFixed(2)} zł</p>

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
