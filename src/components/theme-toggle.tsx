import { useTheme } from "@/context/theme-provider";
import { WeatherIcon } from "./weather-icon";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-11 w-11 flex-none items-center justify-center rounded-[14px] transition hover:bg-foreground/10"
    >
      <WeatherIcon kind={isDark ? "sun" : "night"} size={20} />
    </button>
  );
}
