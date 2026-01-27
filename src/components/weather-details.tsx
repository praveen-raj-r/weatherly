import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sunrise, Sunset, Compass, Gauge } from "lucide-react";
import { format } from "date-fns";
import type { WeatherData } from "@/api/types";

interface WeatherDetailsProps {
  data: WeatherData;
}

const WeatherDetails = ({ data }: WeatherDetailsProps) => {
  const { wind, main, sys } = data;

  // Format time using date-fns
  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "h:mm a");
  };

  // Convert wind degree to direction
  const getWindDirection = (degree: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index =
      Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
    return directions[index];
  };

  const details = [
    {
      title: "Sunrise",
      value: formatTime(sys.sunrise),
      icon: Sunrise,
      color: "text-orange-500",
    },
    {
      title: "Sunset",
      value: formatTime(sys.sunset),
      icon: Sunset,
      color: "text-blue-500",
    },
    {
      title: "Wind Direction",
      value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
      icon: Compass,
      color: "text-green-500",
    },
    {
      title: "Pressure",
      value: `${main.pressure} hPa`,
      icon: Gauge,
      color: "text-purple-500",
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-950 to-slate-900 border-none shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">
          Weather Details
        </CardTitle>
        <p className="text-xs text-slate-400">Extra atmospheric information</p>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-4 my-2">
          {details.map((detail) => {
            const Icon = detail.icon;
            return (
              <div
                key={detail.title}
                className="flex items-center gap-4 rounded-lg bg-slate-900/40 border border-white/10 p-4 transition hover:bg-slate-900/60"
              >
                <div className="p-2 rounded-full bg-slate-800 shadow-sm">
                  <Icon className={`h-6 w-6 ${detail.color}`} />
                </div>

                <div>
                  <p className="text-sm font-medium text-white leading-none">
                    {detail.title}
                  </p>
                  <p className="text-xs text-slate-400 pt-1">{detail.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDetails;
