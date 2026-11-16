import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import type { ForecastData } from "@/api/types";
import { Card } from "./ui/card";

interface HourlyTemperatureProps {
  data: ForecastData;
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
}

const HourlyTemperature = ({ data }: HourlyTemperatureProps) => {
  const gradientId = useId();

  // Next 24 hours (the API provides 3-hour intervals)
  const chartData: ChartData[] = data.list.slice(0, 8).map((item) => ({
    time: format(new Date(item.dt * 1000), "HH:mm"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  }));

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[15px] font-bold tracking-tight">Next 24 hours</h3>
        <div className="flex gap-3.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <i className="h-[3px] w-3.5 rounded-sm bg-brand" />
            Temperature
          </span>
          <span className="flex items-center gap-1.5">
            <i className="h-0 w-3.5 border-t-2 border-dashed border-muted-foreground" />
            Feels like
          </span>
        </div>
      </div>

      <div
        className="mt-4 h-[170px] w-full sm:h-[200px]"
        role="img"
        aria-label="Hourly temperature chart for the next 24 hours"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--brand))" stopOpacity={0.38} />
                <stop offset="100%" stopColor="hsl(var(--brand))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--grid)"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              domain={["dataMin - 2", "dataMax + 2"]}
              tickCount={4}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={(v) => `${Math.round(v)}°`}
            />
            <Tooltip
              cursor={{
                stroke: "hsl(var(--muted-foreground))",
                strokeDasharray: "2 3",
              }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="glass rounded-xl bg-popover px-3 py-2 shadow-lg">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-0.5 text-[15px] font-bold">
                      {payload[0].value}°
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Feels {payload[1]?.value}°
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="hsl(var(--brand))"
              strokeWidth={2.5}
              strokeLinecap="round"
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 6,
                fill: "hsl(var(--brand))",
                stroke: "hsl(var(--popover))",
                strokeWidth: 3,
              }}
            />
            <Line
              type="monotone"
              dataKey="feels_like"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default HourlyTemperature;
