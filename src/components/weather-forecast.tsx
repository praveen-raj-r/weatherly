/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";

interface WeatherForecastProps {
  data: ForecastData;
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {
  const dailyForecasts = data.list.reduce((acc: any, forecast: any) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    if (!acc[date]) {
      acc[date] = {
        date: forecast.dt,
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }
    return acc;
  }, {});

  const nextDays = Object.values(dailyForecasts).slice(1, 6);

  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border border-white/10 shadow-xl backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl font-semibold text-white">
          5-Day Forecast
        </CardTitle>
        <p className="text-[13px] text-slate-400">
          Daily overview • Next 5 days
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap justify-center gap-3">
          {nextDays.map((day: any) => (
            <div
              key={day.date}
              className="grid grid-cols-3 sm:grid-cols-4 items-center gap-2 sm:gap-4 rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4 transition hover:bg-white/10"
            >
              {/* Date */}
              <div className="flex flex-col text-center sm:text-left">
                <p className="font-medium text-white text-sm">
                  {format(new Date(day.date * 1000), "EEE")}
                </p>
                <p className="text-[13px] text-slate-400">
                  {format(new Date(day.date * 1000), "MMM d")}
                </p>
              </div>

              {/* Weather Icon + Name */}
              <div className="flex flex-col items-center justify-center">
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                  alt={day.weather.description}
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
                <p className="text-[10px] text-slate-400 capitalize">
                  {day.weather.main}
                </p>
              </div>

              {/* Temperature */}
              <div className="flex flex-col items-center justify-center gap-[2px] font-semibold">
                <span className="flex items-center text-blue-400 text-xs sm:text-sm">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {formatTemp(day.temp_min)}
                </span>
                <span className="flex items-center text-red-400 text-xs sm:text-sm">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {formatTemp(day.temp_max)}
                </span>
              </div>

              {/* Humidity + Wind */}
              <div
                className="flex flex-col justify-center items-end gap-[2px] 
              text-[10px] sm:text-xs text-slate-300"
              >
                <span className="flex items-center gap-1">
                  <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                  {day.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                  {day.wind} m/s
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
