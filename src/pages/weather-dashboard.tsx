import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useWeatherTint } from "@/hooks/use-weather-tint";
import WeatherDetails from "../components/weather-details";
import WeatherForecast from "../components/weather-forecast";
import HourlyTemperature from "../components/hourly-temprature";
import WeatherSkeleton from "../components/loading-skeleton";
import CurrentWeather from "@/components/current-weather";
import { FavoriteCities } from "@/components/favorite-cities";
import { LoadError, LocationDenied } from "@/components/state-card";
import { WeatherIcon } from "@/components/weather-icon";

export function WeatherDashboard() {
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  useWeatherTint(weatherQuery.data?.weather[0]);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError || !coordinates) {
    return (
      <div className="flex flex-col gap-6">
        <FavoriteCities />
        <LocationDenied onRetry={getLocation} />
      </div>
    );
  }

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <div className="flex flex-col gap-6">
        <FavoriteCities />
        <LoadError onRetry={handleRefresh} />
      </div>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  const locationName = locationQuery.data?.[0];

  return (
    <div className="flex animate-fadein flex-col gap-6 sm:gap-7">
      <FavoriteCities />

      <div className="flex items-center gap-2.5">
        <WeatherIcon kind="pin" size={22} className="text-brand" />
        <h1 className="text-[26px] font-extrabold tracking-tight sm:text-[32px]">
          My Location
        </h1>
      </div>

      <div className="grid items-start gap-3.5 sm:gap-5 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-3.5 sm:gap-5">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
            onRefresh={handleRefresh}
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
