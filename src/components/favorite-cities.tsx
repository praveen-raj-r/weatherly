import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import { useFavorites } from "@/hooks/use-favorite";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { conditionKind, formatTemp } from "@/lib/weather";
import { WeatherIcon } from "./weather-icon";

interface FavoriteCityTileProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

function FavoriteCityTile({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTileProps) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

  const open = () =>
    navigate(`/city/${encodeURIComponent(name)}?lat=${lat}&lon=${lon}`);

  return (
    <div className="relative flex-none snap-start">
      <button
        onClick={open}
        aria-label={`Open weather for ${name}`}
        className="glass flex h-[150px] w-[150px] flex-col rounded-3xl p-3.5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:h-[164px] sm:w-[172px]"
      >
        {isLoading || !weather ? (
          <>
            <Skeleton className="h-[30px] w-[30px] rounded-full" />
            <div className="mt-auto w-full space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-6 w-14" />
            </div>
          </>
        ) : (
          <>
            <WeatherIcon
              kind={conditionKind(weather.weather[0])}
              size={30}
              className="text-brand"
            />
            <div className="mt-auto w-full">
              <p className="truncate text-[15px] font-bold tracking-tight">
                {name}
              </p>
              <p className="mt-px text-xs text-muted-foreground">
                {weather.sys.country}
              </p>
              <div className="mt-2 flex items-baseline justify-between gap-1">
                <span className="text-[26px] font-light tracking-tight tabular-nums">
                  {formatTemp(weather.main.temp)}
                </span>
                <span className="truncate text-xs capitalize text-muted-foreground">
                  {weather.weather[0].main}
                </span>
              </div>
            </div>
          </>
        )}
      </button>

      <button
        onClick={() => {
          onRemove(id);
          toast.error(`Removed ${name} from Favorites`);
        }}
        aria-label={`Remove ${name} from favorites`}
        className="absolute right-0.5 top-0.5 flex h-11 w-11 items-center justify-center rounded-[14px] text-muted-foreground transition hover:text-foreground"
      >
        <WeatherIcon kind="x" size={16} />
      </button>
    </div>
  );
}

export function FavoriteCities() {
  const { favorites, removeFavorite } = useFavorites();

  if (!favorites.length) return null;

  return (
    <section aria-label="Favorites" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 className="overline">Favorites</h2>
        <span className="text-[13px] text-muted-foreground">
          {favorites.length} {favorites.length === 1 ? "city" : "cities"}
        </span>
      </div>
      <div
        className="-mx-4 flex snap-x snap-proximity gap-3 overflow-x-auto px-4 pb-3.5 pt-1.5 sm:-mx-7 sm:px-7 lg:-mx-12 lg:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {favorites.map((city) => (
          <FavoriteCityTile
            key={city.id}
            {...city}
            onRemove={() => removeFavorite.mutate(city.id)}
          />
        ))}
      </div>
    </section>
  );
}
