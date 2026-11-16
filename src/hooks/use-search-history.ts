import { useLocalStorage } from "./use-local-storage";

interface SearchHistoryItem {
  id: string;
  query: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  searchedAt: number;
}

export function useSearchHistory() {
  const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>(
    "search-history",
    []
  );

  const addToHistory = {
    mutate: (search: Omit<SearchHistoryItem, "id" | "searchedAt">) => {
      setHistory((prev) => {
        const newSearch: SearchHistoryItem = {
          ...search,
          id: `${search.lat}-${search.lon}-${Date.now()}`,
          searchedAt: Date.now(),
        };
        // Remove duplicates and keep only the last 10 searches
        const filtered = prev.filter(
          (item) => !(item.lat === search.lat && item.lon === search.lon)
        );
        return [newSearch, ...filtered].slice(0, 10);
      });
    },
  };

  const clearHistory = {
    mutate: () => setHistory([]),
  };

  return { history, addToHistory, clearHistory };
}
