export const FAVORITES_STORAGE_PREFIX = "piwo-lab5-favorites";

export const FavoritesActionType = {
  HYDRATE: "HYDRATE",
  RESET: "RESET",
  ADD: "ADD",
  REMOVE: "REMOVE",
  TOGGLE: "TOGGLE",
  CLEAR: "CLEAR",
};

export function getFavoritesStorageKey(userId) {
  return `${FAVORITES_STORAGE_PREFIX}-${userId}`;
}

export const initialFavoritesState = {
  items: [],
  hydrated: false,
  ownerId: null,
};

export function loadFavoritesFromStorage(userId) {
  if (typeof window === "undefined" || !userId) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getFavoritesStorageKey(userId));
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavoritesToStorage(userId, items) {
  if (typeof window === "undefined" || !userId) {
    return;
  }

  window.localStorage.setItem(getFavoritesStorageKey(userId), JSON.stringify(items));
}

export function favoritesReducer(state, action) {
  switch (action.type) {
    case FavoritesActionType.HYDRATE:
      return {
        items: action.payload.items,
        hydrated: true,
        ownerId: action.payload.ownerId,
      };

    case FavoritesActionType.RESET:
      return {
        items: [],
        hydrated: true,
        ownerId: null,
      };

    case FavoritesActionType.ADD: {
      const game = action.payload;
      if (state.items.some((item) => item.id === game.id)) {
        return state;
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: game.id,
            title: game.title,
            price_pln: game.price_pln,
            type: game.type,
          },
        ],
      };
    }

    case FavoritesActionType.REMOVE:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case FavoritesActionType.TOGGLE: {
      const game = action.payload;
      const exists = state.items.some((item) => item.id === game.id);

      if (exists) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== game.id),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: game.id,
            title: game.title,
            price_pln: game.price_pln,
            type: game.type,
          },
        ],
      };
    }

    case FavoritesActionType.CLEAR:
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
}
