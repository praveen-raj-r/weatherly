// src/components/weather/favorite-cities.tsx
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorite";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface FavoriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

function FavoriteCityTablet({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTabletProps) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

  const handleClick = () => {
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex min-w-[260px] items-center gap-3 rounded-xl border bg-card p-4 pr-10 
      shadow-sm transition-all hover:shadow-lg hover:-translate-y-[2px]
      cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
      role="button"
      tabIndex={0}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-7 w-7 rounded-full opacity-70 transition hover:bg-destructive/20 hover:text-destructive hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.error(`Removed ${name} from Favorites`);
        }}
      >
        <X className="h-4 w-4" />
      </Button>

      {isLoading ? (
        // Skeleton Loading
        <div className="flex gap-3 items-center w-full">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="h-6 w-10" />
        </div>
      ) : weather ? (
        <>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
            className="h-10 w-10 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
          />

          <div>
            <p className="font-semibold leading-none">{name}</p>
            <p className="text-xs text-muted-foreground">
              {weather.sys.country}
            </p>
          </div>

          <div className="ml-auto text-right leading-none">
            <p className="text-2xl font-extrabold">
              {Math.round(weather.main.temp)}°
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {weather.weather[0].description}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function FavoriteCities() {
  const { favorites, removeFavorite } = useFavorites();

  if (!favorites.length) return null;

  return (
    <>
      <h1 className="mb-2 text-xl font-semibold tracking-tight flex items-center gap-2">
        ⭐ Favorites
      </h1>

      <ScrollArea className="w-full pb-4">
        <div className="flex gap-4">
          {favorites.map((city) => (
            <FavoriteCityTablet
              key={city.id}
              {...city}
              onRemove={() => removeFavorite.mutate(city.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </>
  );
}
