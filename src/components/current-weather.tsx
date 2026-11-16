import { format } from "date-fns";
import type { WeatherData, GeocodingResponse } from "@/api/types";
import {
  conditionKind,
  formatTemp,
  msToKmh,
  windDirection,
} from "@/lib/weather";
import { WeatherIcon } from "./weather-icon";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const CurrentWeather = ({
  data,
  locationName,
  onRefresh,
  refreshing,
}: CurrentWeatherProps) => {
  const {
    weather: [current],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed, deg },
  } = data;

  const city = locationName?.name ?? data.name;
  const region = [locationName?.state, locationName?.country ?? data.sys.country]
    .filter(Boolean)
    .join(", ");

  const chips = [
    { label: "High / Low", value: `${formatTemp(temp_max)} / ${formatTemp(temp_min)}` },
    { label: "Humidity", value: `${humidity}%` },
    { label: "Wind", value: `${msToKmh(speed)} km/h ${windDirection(deg)}` },
  ];

  return (
    <article className="glass flex flex-col rounded-5xl p-5 sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-semibold">{city}</h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">{region}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[13px] text-muted-foreground sm:inline">
            Updated {format(new Date(data.dt * 1000), "HH:mm")}
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Refresh weather"
              className="flex h-11 w-11 flex-none items-center justify-center rounded-[14px] transition hover:bg-foreground/10 disabled:opacity-60"
            >
              <WeatherIcon
                kind="refresh"
                size={20}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          )}
        </div>
      </div>

      <div className="my-4 flex items-center justify-between gap-3 sm:my-5 sm:mb-7">
        <div>
          <div className="-ml-1 text-[96px] font-light leading-[0.9] tracking-[-0.06em] tabular-nums sm:text-[128px]">
            {Math.round(temp)}°
          </div>
          <p className="mt-1 text-xl font-semibold capitalize">
            {current.description}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Feels like {formatTemp(feels_like)}
          </p>
        </div>
        <WeatherIcon
          kind={conditionKind(current)}
          size={112}
          strokeWidth={1.2}
          className="h-[84px] w-[84px] text-brand sm:h-28 sm:w-28"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {chips.map((c) => (
          <div key={c.label} className="chip flex min-w-0 flex-col gap-1 p-3">
            <span className="text-xs font-semibold text-muted-foreground">
              {c.label}
            </span>
            <span className="whitespace-nowrap text-[15px] font-bold tabular-nums sm:text-[17px]">
              {c.value}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
};

export default CurrentWeather;
