"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import {
  PurchasesActionType,
  initialPurchasesState,
  purchasesReducer,
} from "@/lib/purchasesReducer";

const PurchasesContext = createContext(null);

export function PurchasesProvider({ children }) {
  const [state, dispatch] = useReducer(purchasesReducer, initialPurchasesState);

  const buyGame = useCallback((gameId) => {
    dispatch({ type: PurchasesActionType.BUY, payload: gameId });
  }, []);

  const isPurchased = useCallback(
    (gameId) => state.ids.includes(gameId),
    [state.ids],
  );

  const value = useMemo(
    () => ({
      buyGame,
      isPurchased,
    }),
    [buyGame, isPurchased],
  );

  return (
    <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>
  );
}

export function usePurchases() {
  const context = useContext(PurchasesContext);

  if (!context) {
    throw new Error("usePurchases musi być użyty wewnątrz PurchasesProvider");
  }

  return context;
}
