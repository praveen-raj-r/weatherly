import { useLocalStorage } from "./use-local-storage";

export interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>(
    "favorites",
    []
  );

  const addFavorite = {
    mutate: (city: Omit<FavoriteCity, "id" | "addedAt">) => {
      const id = `${city.lat}-${city.lon}`;
      setFavorites((prev) =>
        prev.some((fav) => fav.id === id)
          ? prev
          : [...prev, { ...city, id, addedAt: Date.now() }]
      );
    },
  };

  const removeFavorite = {
    mutate: (cityId: string) => {
      setFavorites((prev) => prev.filter((city) => city.id !== cityId));
    },
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite: (lat: number, lon: number) =>
      favorites.some((city) => city.lat === lat && city.lon === lon),
  };
}
