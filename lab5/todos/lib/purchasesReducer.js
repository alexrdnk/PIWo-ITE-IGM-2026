export const PurchasesActionType = {
  BUY: "BUY",
};

export const initialPurchasesState = {
  ids: [],
};

export function purchasesReducer(state, action) {
  switch (action.type) {
    case PurchasesActionType.BUY: {
      const gameId = action.payload;

      if (state.ids.includes(gameId)) {
        return state;
      }

      return {
        ids: [...state.ids, gameId],
      };
    }

    default:
      return state;
  }
}
