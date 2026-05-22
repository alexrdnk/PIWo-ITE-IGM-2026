const API_URL = "https://szandala.github.io/piwo-api/board-games.json";

export async function getGames() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Nie udalo sie pobrac listy gier.");
  }

  const data = await response.json();
  return data.board_games;
}
