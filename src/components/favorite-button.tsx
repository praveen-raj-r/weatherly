import type { WeatherData } from "@/api/types";
import { useFavorites } from "@/hooks/use-favorite";
import { toast } from "sonner";
import { WeatherIcon } from "./weather-icon";

interface FavoriteButtonProps {
  data: WeatherData;
}

export function FavoriteButton({ data }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removed ${data.name} from Favorites`);
    } else {
      addFavorite.mutate({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      toast.success(`Added ${data.name} to Favorites`);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      aria-pressed={isCurrentlyFavorite}
      aria-label={
        isCurrentlyFavorite
          ? `Remove ${data.name} from favorites`
          : `Add ${data.name} to favorites`
      }
      className="flex h-11 w-11 flex-none items-center justify-center rounded-[14px] transition hover:bg-foreground/10"
    >
      {/* key re-mounts the icon so the pop animation plays on each add */}
      <span
        key={String(isCurrentlyFavorite)}
        className={isCurrentlyFavorite ? "animate-starpop block" : "block"}
      >
        <WeatherIcon
          kind={isCurrentlyFavorite ? "starfill" : "star"}
          size={22}
          className={
            isCurrentlyFavorite ? "text-[#F5B83D]" : "text-muted-foreground"
          }
        />
      </span>
    </button>
  );
}
