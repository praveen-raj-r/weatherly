import { format } from "date-fns";
import type { WeatherData } from "@/api/types";
import { windDirection } from "@/lib/weather";
import { Card } from "./ui/card";
import { WeatherIcon, type IconKind } from "./weather-icon";

interface WeatherDetailsProps {
  data: WeatherData;
}

const WeatherDetails = ({ data }: WeatherDetailsProps) => {
  const { wind, main, sys } = data;
  const time = (ts: number) => format(new Date(ts * 1000), "HH:mm");

  const details: { kind: IconKind; label: string; value: string }[] = [
    { kind: "sunrise", label: "Sunrise", value: time(sys.sunrise) },
    { kind: "sunset", label: "Sunset", value: time(sys.sunset) },
    {
      kind: "compass",
      label: "Wind direction",
      value: `${windDirection(wind.deg)} · ${wind.deg}°`,
    },
    { kind: "gauge", label: "Pressure", value: `${main.pressure} hPa` },
  ];

  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-[15px] font-bold tracking-tight">Details</h3>
      <div className="mt-3.5 grid grid-cols-2 gap-2">
        {details.map((d) => (
          <div key={d.label} className="chip flex min-w-0 flex-col gap-1 p-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <WeatherIcon kind={d.kind} size={16} />
              {d.label}
            </span>
            <span className="whitespace-nowrap text-[15px] font-bold tabular-nums sm:text-[17px]">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeatherDetails;
