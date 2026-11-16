const cloudLow = "M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z";
const cloudHigh = "M7 14a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 5.5 4.3 4.3 0 0 1 17.5 14z";

// "*" = duotone (20% fill), "#" = solid fill, otherwise stroke only
const ICONS = {
  clear: [
    "*M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z",
    "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  ],
  clouds: ["*" + cloudLow],
  rain: ["*" + cloudHigh, "M8 17l-1 3M12 17l-1 3M16 17l-1 3"],
  snow: ["*" + cloudHigh, "M8 18v.01M12 18v.01M16 18v.01M10 21v.01M14 21v.01"],
  thunder: ["*" + cloudHigh, "M12.5 13l-2.5 4h3l-2 4"],
  night: ["*M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"],
  starfill: ["#M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"],
  star: ["M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"],
  sunrise: ["M17 18a5 5 0 0 0-10 0M12 3v6M8.5 5.5L12 2l3.5 3.5M2 18h2M20 18h2M3 22h18"],
  sunset: ["M17 18a5 5 0 0 0-10 0M12 3v6M8.5 6.5L12 10l3.5-3.5M2 18h2M20 18h2M3 22h18"],
  gauge: ["M12 14l4-4M3.3 17a9 9 0 1 1 17.4 0"],
  compass: ["*M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M15.5 8.5l-2 5-5 2 2-5z"],
  pin: ["M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"],
  pinoff: ["M3 3l18 18M12 21s7-6 7-11a7 7 0 0 0-11-5.7M5.3 7.5A7 7 0 0 0 5 10c0 5 7 11 7 11"],
  alert: ["*M12 3L2 20h20z", "M12 10v4M12 17v.01"],
  help: ["*M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.01"],
  search: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3"],
  refresh: ["M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"],
  x: ["M6 6l12 12M18 6L6 18"],
  clock: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2"],
  sun: [
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  ],
} as const;

export type IconKind = keyof typeof ICONS;

interface WeatherIconProps {
  kind: IconKind;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/** Duotone icon set from the redesign. Colored via currentColor. */
export function WeatherIcon({
  kind,
  size = 24,
  strokeWidth = 1.6,
  className,
}: WeatherIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`block flex-none ${className ?? ""}`}
    >
      {ICONS[kind].map((raw) => {
        const f = raw[0];
        if (f === "*")
          return (
            <path key={raw} d={raw.slice(1)} fill="currentColor" fillOpacity={0.2} />
          );
        if (f === "#")
          return <path key={raw} d={raw.slice(1)} fill="currentColor" />;
        return <path key={raw} d={raw} />;
      })}
    </svg>
  );
}
