import type { ReactNode } from "react";
import { WeatherIcon, type IconKind } from "./weather-icon";
import { openSearch } from "@/lib/search-events";


interface StateCardProps {
  icon: IconKind;
  iconClass?: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function StateCard({
  icon,
  iconClass = "text-brand",
  title,
  description,
  children,
}: StateCardProps) {
  return (
    <div className="glass mx-auto flex min-h-[380px] w-full max-w-xl flex-col items-center justify-center gap-2.5 rounded-5xl p-7 text-center animate-fadein">
      <div className="glass mb-1.5 flex h-[72px] w-[72px] items-center justify-center rounded-4xl">
        <WeatherIcon kind={icon} size={30} className={iconClass} />
      </div>
      <h2 className="text-[21px] font-extrabold tracking-tight">{title}</h2>
      <p className="max-w-[300px] text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {children && <div className="mt-1.5 flex gap-2.5">{children}</div>}
    </div>
  );
}

interface ActionProps {
  icon: IconKind;
  onClick: () => void;
  children: ReactNode;
}

export function StateAction({ icon, onClick, children }: ActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[44px] items-center gap-2 rounded-[14px] bg-brand px-5 text-[15px] font-bold text-brand-foreground transition hover:opacity-90"
    >
      <WeatherIcon kind={icon} size={18} />
      {children}
    </button>
  );
}

export function LocationDenied({ onRetry }: { onRetry?: () => void }) {
  return (
    <StateCard
      icon="pinoff"
      title="Location access is off"
      description="Weatherly can’t read your position. Search for a city instead, or allow location in your browser settings."
    >
      <StateAction icon="search" onClick={openSearch}>
        Search for a city
      </StateAction>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex min-h-[44px] items-center gap-2 rounded-[14px] border px-4 text-[15px] font-semibold transition hover:bg-muted"
        >
          <WeatherIcon kind="pin" size={18} />
          Try again
        </button>
      )}
    </StateCard>
  );
}

export function LoadError({ onRetry }: { onRetry?: () => void }) {
  return (
    <StateCard
      icon="alert"
      iconClass="text-warn"
      title="Couldn’t load the weather"
      description="The weather service didn’t respond. Your favorites are safe — try again in a moment."
    >
      {onRetry && (
        <StateAction icon="refresh" onClick={onRetry}>
          Retry
        </StateAction>
      )}
    </StateCard>
  );
}

export function CityNotFound() {
  return (
    <StateCard
      icon="help"
      title="City not found"
      description="We couldn’t find that city in the weather database. Check the spelling or search again."
    >
      <StateAction icon="search" onClick={openSearch}>
        Search again
      </StateAction>
    </StateCard>
  );
}
