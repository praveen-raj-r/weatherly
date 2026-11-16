import { format } from "date-fns";
import type { ForecastData } from "@/api/types";
import { conditionKind, msToKmh } from "@/lib/weather";
import { Card } from "./ui/card";
import { WeatherIcon } from "./weather-icon";

interface WeatherForecastProps {
  data: ForecastData;
}

type ForecastItem = ForecastData["list"][number];

interface DayForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: ForecastItem["weather"][number];
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {
  // Group the 3-hourly entries by day
  const groups = new Map<string, ForecastItem[]>();
  for (const item of data.list) {
    const key = format(new Date(item.dt * 1000), "yyyy-MM-dd");
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  const days: DayForecast[] = [...groups.values()].map((items) => {
    // Representative condition: the entry closest to midday
    const noon =
      items.find((i) => new Date(i.dt * 1000).getHours() >= 12) ?? items[0];
    return {
      date: items[0].dt,
      temp_min: Math.min(...items.map((i) => i.main.temp_min)),
      temp_max: Math.max(...items.map((i) => i.main.temp_max)),
      humidity: Math.round(
        items.reduce((s, i) => s + i.main.humidity, 0) / items.length
      ),
      wind: Math.max(...items.map((i) => i.wind.speed)),
      weather: noon.weather[0],
    };
  });

  const nextDays = days.slice(1, 6);

  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-[15px] font-bold tracking-tight">5-day forecast</h3>
      <ul className="mt-1.5 flex flex-col">
        {nextDays.map((day) => (
          <li
            key={day.date}
            className="flex min-h-16 items-center gap-3 border-b last:border-b-0 sm:gap-4"
            style={{ borderColor: "var(--line)" }}
          >
            <span className="w-11 text-sm font-bold">
              {format(new Date(day.date * 1000), "EEE")}
            </span>
            <WeatherIcon
              kind={conditionKind({ ...day.weather, icon: day.weather.icon.replace("n", "d") })}
              size={28}
              className="text-brand"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium capitalize">
                {day.weather.description}
              </p>
              <p className="mt-px text-xs text-muted-foreground">
                {day.humidity}% humidity · {msToKmh(day.wind)} km/h
              </p>
            </div>
            <div className="flex gap-2.5 text-[15px] tabular-nums">
              <span className="font-bold">{Math.round(day.temp_max)}°</span>
              <span className="text-muted-foreground">
                {Math.round(day.temp_min)}°
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default WeatherForecast;
