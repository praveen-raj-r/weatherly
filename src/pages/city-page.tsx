import { useParams, useSearchParams } from "react-router-dom";
import { useWeatherQuery, useForecastQuery } from "@/hooks/use-weather";
import { useWeatherTint } from "@/hooks/use-weather-tint";
import HourlyTemperature from "../components/hourly-temprature";
import WeatherDetails from "../components/weather-details";
import WeatherForecast from "../components/weather-forecast";
import CurrentWeather from "../components/current-weather";
import WeatherSkeleton from "../components/loading-skeleton";
import { FavoriteButton } from "@/components/favorite-button";
import { CityNotFound, LoadError } from "@/components/state-card";

export function CityPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");
  const lat = latParam === null ? NaN : Number(latParam);
  const lon = lonParam === null ? NaN : Number(lonParam);
  const validCoords =
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180;

  const coordinates = validCoords ? { lat, lon } : null;

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  useWeatherTint(weatherQuery.data?.weather[0]);

  if (!validCoords) {
    return <CityNotFound />;
  }

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <LoadError
        onRetry={() => {
          weatherQuery.refetch();
          forecastQuery.refetch();
        }}
      />
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="flex animate-fadein flex-col gap-6 sm:gap-7">
      <div className="flex items-center gap-2.5">
        <h1 className="min-w-0 truncate text-[26px] font-extrabold tracking-tight sm:text-[32px]">
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <FavoriteButton data={{ ...weatherQuery.data, name: params.cityName }} />
      </div>

      <div className="grid items-start gap-3.5 sm:gap-5 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-3.5 sm:gap-5">
          <CurrentWeather
            data={{ ...weatherQuery.data, name: params.cityName }}
            onRefresh={() => {
              weatherQuery.refetch();
              forecastQuery.refetch();
            }}
            refreshing={weatherQuery.isFetching || forecastQuery.isFetching}
          />
          <HourlyTemperature data={forecastQuery.data} />
        </div>
        <div className="flex min-w-0 flex-col gap-3.5 sm:gap-5">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
}
