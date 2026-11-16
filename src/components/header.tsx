import { Link } from "react-router-dom";
import { CitySearch } from "./city-search";
import { ThemeToggle } from "./theme-toggle";
import { WeatherIcon } from "./weather-icon";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-xl"
      style={{ background: "var(--header-bg)", borderColor: "var(--line)" }}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-7 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg">
          <WeatherIcon kind="clear" size={28} className="text-brand" />
          <span className="text-xl font-extrabold tracking-tight">
            Weatherly
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <CitySearch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
