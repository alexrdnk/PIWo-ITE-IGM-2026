"use client";

import { useFavorites } from "@/context/FavoritesContext";

export default function FavoriteButton({ game }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(game.id);

  return (
    <button
      className={`favorite-button ${active ? "active" : ""}`}
      type="button"
      aria-pressed={active}
      onClick={() => toggleFavorite(game)}
    >
      {active ? "Ulubione" : "Ulubione +"}
    </button>
  );
}
