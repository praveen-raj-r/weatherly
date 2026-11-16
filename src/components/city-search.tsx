import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useLocationSearch, useWeatherQuery } from "@/hooks/use-weather";
import { useSearchHistory } from "@/hooks/use-search-history";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFavorites } from "@/hooks/use-favorite";
import { useDebounce } from "@/hooks/use-debounce";
import { formatTemp } from "@/lib/weather";
import { OPEN_SEARCH_EVENT } from "@/lib/search-events";
import { WeatherIcon } from "./weather-icon";

interface CityOption {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
}

const itemClass =
  "min-h-12 gap-3 rounded-xl px-3 text-[15px] data-[selected=true]:bg-foreground/10 data-[selected=true]:ring-[1.5px] data-[selected=true]:ring-brand";
const sectionClass =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.08em]";

function FavoriteTemp({ lat, lon }: { lat: number; lon: number }) {
  const { data } = useWeatherQuery({ lat, lon });
  if (!data) return null;
  return (
    <span className="font-semibold tabular-nums">
      {formatTemp(data.main.temp)}
    </span>
  );
}

function Place({ city }: { city: CityOption }) {
  return (
    <>
      <span className="font-semibold">{city.name}</span>
      <span className="flex-1 truncate text-[13px] text-muted-foreground">
        {city.state ? `${city.state}, ` : ""}
        {city.country}
      </span>
    </>
  );
}

export function CitySearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300);
  const { data: locations, isLoading } = useLocationSearch(debouncedQuery);
  const { favorites } = useFavorites();
  const { history, clearHistory, addToHistory } = useSearchHistory();

  // ⌘K / Ctrl+K and the "open search" event from the state cards
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
    };
  }, []);

  const handleSelect = (city: CityOption) => {
    addToHistory.mutate({
      query,
      name: city.name,
      lat: city.lat,
      lon: city.lon,
      country: city.country,
      state: city.state,
    });

    setOpen(false);
    setQuery("");
    navigate(
      `/city/${encodeURIComponent(city.name)}?lat=${city.lat}&lon=${city.lon}`
    );
  };

  const searching = query.trim().length > 2;
  const q = query.trim().toLowerCase();
  const matches = (c: { name: string }) => c.name.toLowerCase().includes(q);
  const shownFavorites = favorites.filter(matches);
  const shownHistory = history.filter(matches);
  const showEmpty =
    debouncedQuery.length > 2 &&
    !isLoading &&
    query === debouncedQuery &&
    locations?.length === 0;
  const showLoading = searching && (isLoading || query !== debouncedQuery);
  const isMac =
    typeof navigator !== "undefined" && /Mac/i.test(navigator.platform);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search cities"
        className="flex h-11 w-11 items-center justify-center gap-2.5 rounded-[14px] border bg-foreground/5 text-muted-foreground transition hover:bg-foreground/10 sm:w-[220px] sm:justify-start sm:px-3.5 lg:w-80"
      >
        <WeatherIcon kind="search" size={20} />
        <span className="hidden flex-1 text-left text-[15px] sm:inline">
          Search cities…
        </span>
        <kbd className="hidden rounded-md border px-1.5 py-0.5 text-xs font-semibold sm:inline">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false} className={sectionClass}>
          <CommandInput
            placeholder="Search cities..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[min(560px,60vh)] p-2">
            {showEmpty && (
              <div className="flex flex-col items-center gap-2.5 px-4 py-11 text-center animate-fadein">
                <WeatherIcon
                  kind="help"
                  size={36}
                  strokeWidth={1.3}
                  className="text-muted-foreground"
                />
                <p className="text-[17px] font-bold">No cities found</p>
                <p className="max-w-[300px] text-sm text-muted-foreground">
                  Nothing matches “{query}”. Check the spelling or try a nearby
                  larger city.
                </p>
              </div>
            )}

            {showLoading && (
              <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching…
              </div>
            )}

            {!searching && shownFavorites.length > 0 && (
              <CommandGroup heading="Favorites">
                {shownFavorites.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={`fav-${city.id}`}
                    className={itemClass}
                    onSelect={() => handleSelect(city)}
                  >
                    <WeatherIcon kind="starfill" size={18} className="text-[#F5B83D]" />
                    <Place city={city} />
                    <FavoriteTemp lat={city.lat} lon={city.lon} />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {!searching && shownHistory.length > 0 && (
              <CommandGroup
                heading={
                  <span className="flex items-center">
                    <span className="flex-1">Recent searches</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearHistory.mutate();
                      }}
                      className="-my-3 -mr-2 min-h-[44px] rounded-[10px] px-2.5 text-[13px] font-bold normal-case tracking-normal text-brand"
                    >
                      Clear
                    </button>
                  </span>
                }
              >
                {shownHistory.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`hist-${item.id}`}
                    className={itemClass}
                    onSelect={() => handleSelect(item)}
                  >
                    <WeatherIcon kind="clock" size={18} className="text-muted-foreground" />
                    <Place city={item} />
                    <span className="text-xs text-muted-foreground">
                      {format(item.searchedAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {searching && locations && locations.length > 0 && (
              <CommandGroup heading="Suggestions">
                {locations.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}-${location.lon}`}
                    className={itemClass}
                    onSelect={() => handleSelect(location)}
                  >
                    <WeatherIcon kind="pin" size={18} className="text-brand" />
                    <Place city={location} />
                    <span className="text-xs text-muted-foreground">
                      {Math.abs(location.lat).toFixed(2)}°
                      {location.lat >= 0 ? "N" : "S"}{" "}
                      {Math.abs(location.lon).toFixed(2)}°
                      {location.lon >= 0 ? "E" : "W"}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>

          <div className="hidden gap-4 border-t px-4 py-3 text-xs text-muted-foreground sm:flex">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
            <span>Esc Close</span>
          </div>
        </Command>
      </CommandDialog>
    </>
  );
}

