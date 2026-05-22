"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { useAuth } from "@/context/AuthContext";
import {
  FavoritesActionType,
  favoritesReducer,
  initialFavoritesState,
  loadFavoritesFromStorage,
  saveFavoritesToStorage,
} from "@/lib/favoritesReducer";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user, ready } = useAuth();
  const [state, dispatch] = useReducer(favoritesReducer, initialFavoritesState);
  const userId = user?.uid ?? null;

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!userId) {
      dispatch({ type: FavoritesActionType.RESET });
      return;
    }

    dispatch({
      type: FavoritesActionType.HYDRATE,
      payload: {
        items: loadFavoritesFromStorage(userId),
        ownerId: userId,
      },
    });
  }, [ready, userId]);

  useEffect(() => {
    if (!state.hydrated || !userId || state.ownerId !== userId) {
      return;
    }

    saveFavoritesToStorage(userId, state.items);
  }, [state.items, state.hydrated, state.ownerId, userId]);

  const addFavorite = useCallback((game) => {
    dispatch({ type: FavoritesActionType.ADD, payload: game });
  }, []);

  const removeFavorite = useCallback((gameId) => {
    dispatch({ type: FavoritesActionType.REMOVE, payload: gameId });
  }, []);

  const toggleFavorite = useCallback((game) => {
    dispatch({ type: FavoritesActionType.TOGGLE, payload: game });
  }, []);

  const clearFavorites = useCallback(() => {
    dispatch({ type: FavoritesActionType.CLEAR });
  }, []);

  const isFavorite = useCallback(
    (gameId) => state.items.some((item) => item.id === gameId),
    [state.items],
  );

  const value = useMemo(
    () => ({
      items: state.items,
      hydrated: state.hydrated,
      count: state.items.length,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      clearFavorites,
      isFavorite,
    }),
    [
      state.items,
      state.hydrated,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      clearFavorites,
      isFavorite,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites musi być użyty wewnątrz FavoritesProvider");
  }

  return context;
}
