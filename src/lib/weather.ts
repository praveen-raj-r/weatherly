import type { WeatherCondition } from "@/api/types";

export type ConditionKind =
  | "clear"
  | "clouds"
  | "rain"
  | "snow"
  | "thunder"
  | "night";

/** Map an OpenWeatherMap condition to one of the six design conditions. */
export function conditionKind(w: WeatherCondition | undefined): ConditionKind {
  if (!w) return "clouds";
  const isNight = w.icon.endsWith("n");
  if (w.id >= 200 && w.id < 300) return "thunder";
  if (w.id >= 300 && w.id < 600) return "rain";
  if (w.id >= 600 && w.id < 700) return "snow";
  if (w.id === 800) return isNight ? "night" : "clear";
  return "clouds"; // 7xx atmosphere (mist, fog...) and 80x clouds
}

export const msToKmh = (ms: number) => Math.round(ms * 3.6);

export function windDirection(deg: number) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const d = ((deg % 360) + 360) % 360;
  return dirs[Math.round(d / 45) % 8];
}

export const formatTemp = (t: number) => `${Math.round(t)}°`;
