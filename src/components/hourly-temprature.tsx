import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";

interface HourlyTemperatureProps {
  data: ForecastData;
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
}

const HourlyTemperature = ({ data }: HourlyTemperatureProps) => {
  // Get today's forecast data and format for chart

  const chartData: ChartData[] = data.list
    .slice(0, 8) // Get next 24 hours (3-hour intervals)
    .map((item) => ({
      time: format(new Date(item.dt * 1000), "ha"),
      temp: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
    }));

  return (
    <Card className="flex-1 bg-gradient-to-br from-slate-950 to-slate-900 border-none shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white">
          Hourly Temperature
        </CardTitle>
        <p className="text-xs text-slate-400">
          Next 24 hours forecast · Updated live
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-[230px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />

              <Tooltip
                wrapperClassName="backdrop-blur-md"
                cursor={{ stroke: "#334155", strokeWidth: 1 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-md border bg-slate-900/90 p-2 text-white shadow-md">
                        <p className="text-xs mb-1 text-slate-400">{label}</p>
                        <p className="text-sm font-semibold">
                          Temp: {payload[0].value}°
                        </p>
                        <p className="text-xs text-slate-300">
                          Feels like: {payload[1].value}°
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line
                type="monotone"
                dataKey="temp"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={false}
                className="drop-shadow-md"
              />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#64748b"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyTemperature;
