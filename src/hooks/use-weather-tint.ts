import { useEffect } from "react";
import type { WeatherCondition } from "@/api/types";
import { conditionKind } from "@/lib/weather";

/** Tints the page background to match the current weather condition. */
export function useWeatherTint(weather: WeatherCondition | undefined) {
  const kind = weather ? conditionKind(weather) : undefined;

  useEffect(() => {
    const root = document.documentElement;
    if (kind) root.dataset.condition = kind;
    else delete root.dataset.condition;
    return () => {
      delete root.dataset.condition;
    };
  }, [kind]);
}
