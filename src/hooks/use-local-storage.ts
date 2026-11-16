import { useCallback, useSyncExternalStore } from "react";

// Shared, module-level store so every component using the same key sees the
// same value and re-renders when any of them (or another tab) changes it.
const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function emit(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

function readValue<T>(key: string, initialValue: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch (error) {
    console.error(error);
  }

  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value: T = initialValue;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch (error) {
      console.error(error);
    }
  }
  // Stable reference for the same raw string (required by useSyncExternalStore)
  cache.set(key, { raw, value });
  return value;
}

function subscribe(key: string, callback: () => void) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(callback);

  const onStorage = (e: StorageEvent) => {
    if (e.key === key || e.key === null) callback();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    set.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const value = useSyncExternalStore(
    (cb) => subscribe(key, cb),
    () => readValue(key, initialValue)
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readValue(key, initialValue);
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch (error) {
        console.error(error);
      }
      emit(key);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [value, setValue] as const;
}
