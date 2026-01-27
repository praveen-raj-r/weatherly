import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import type { WeatherData, GeocodingResponse } from "@/api/types";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}

const CurrentWeather = ({ data, locationName }: CurrentWeatherProps) => {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  // Format temperature
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 shadow-xl border-none">
      <CardContent className="p-6">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          {/* Location + Temperature */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white flex items-center">
                {locationName?.name}
                {locationName?.state && (
                  <span className="text-sm text-slate-400 ml-2">
                    ({locationName.state})
                  </span>
                )}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {locationName?.country}
              </p>
            </div>

            {/* Temperature */}
            <div className="flex items-start gap-4">
              <p className="text-8xl font-bold tracking-tight text-white leading-none">
                {formatTemp(temp)}
              </p>

              <div className="space-y-2 pt-2">
                <p className="text-sm text-slate-400">
                  Feels like{" "}
                  <span className="font-medium text-white">
                    {formatTemp(feels_like)}
                  </span>
                </p>

                <div className="flex gap-3 text-sm font-medium">
                  <span className="flex items-center gap-1 text-blue-400">
                    <ArrowDown className="h-4 w-4" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    <ArrowUp className="h-4 w-4" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            {/* Weather Stats */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Droplets className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Humidity</p>
                  <p className="text-sm font-semibold text-white">
                    {humidity}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Wind</p>
                  <p className="text-sm font-semibold text-white">
                    {speed} m/s
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Icon */}
          <div className="flex flex-col items-center">
            <img
              src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
              alt={currentWeather.description}
              className="h-40 w-40 md:h-52 md:w-52 drop-shadow-lg"
            />
            <p className="text-lg font-medium text-slate-200 capitalize mt-3 tracking-wide">
              {currentWeather.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
