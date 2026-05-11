import Link from "next/link";
import { getGames } from "@/lib/games";

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const games = await getGames();
  const search = (params.search || "").toLowerCase();
  const type = params.type || "all";
  const expansion = params.expansion || "all";

  const gameTypes = [...new Set(games.map((game) => game.type))];

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(search) ||
      game.publisher.toLowerCase().includes(search);
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
        <h1>the fiszka - Board Games Shop</h1>
      </section>

      <form className="filters">
        <label>
          Szukaj
          <input
            name="search"
            type="search"
            placeholder="np. Catan albo Rebel"
            defaultValue={params.search || ""}
          />
        </label>

        <label>
          Typ gry
          <select name="type" defaultValue={type}>
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
          <select name="expansion" defaultValue={expansion}>
            <option value="all">Wszystkie</option>
            <option value="no">Podstawowe gry</option>
            <option value="yes">Dodatki</option>
          </select>
        </label>

        <button type="submit">Filtruj</button>
        <Link className="clear-link" href="/">
          Wyczyść
        </Link>
      </form>

      <p className="result-count">Znaleziono: {filteredGames.length}</p>

      <section className="grid">
        {filteredGames.map((game) => (
          <article className="card" key={game.id}>
            <div className="image-placeholder">
              {game.images.length > 0 ? game.title : "Brak zdjęcia"}
            </div>

            <div className="card-content">
              <p className="tag">{game.type}</p>
              <h2>{game.title}</h2>
              <p>{game.description[0]}</p>
              <p className="price">{game.price_pln.toFixed(2)} zł</p>
              <Link className="details-link" href={`/games/${game.id}`}>
                Zobacz szczegóły
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
