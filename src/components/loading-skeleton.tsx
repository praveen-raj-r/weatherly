import { Skeleton } from "./ui/skeleton";

const WeatherSkeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Current Weather Card */}
      <div className="flex items-center gap-4 p-4 rounded-xl border bg-card">
        <Skeleton className="h-16 w-16 rounded-full" /> {/* weather icon */}
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" /> {/* city name */}
          <Skeleton className="h-4 w-20" /> {/* country or description */}
        </div>
        <Skeleton className="h-10 w-16 rounded-md" /> {/* temperature */}
      </div>

      {/* Daily Forecast Horizontal */}
      <div className="flex gap-4 overflow-x-auto justify-center pb-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 items-center p-4 rounded-xl border bg-card min-w-[90px]"
          >
            <Skeleton className="h-4 w-10" /> {/* day name */}
            <Skeleton className="h-10 w-10 rounded-full" /> {/* icon */}
            <Skeleton className="h-4 w-12" /> {/* temp */}
          </div>
        ))}
      </div>

      {/* Highlights (humidity, wind, etc) */}
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="p-4 rounded-xl border bg-card">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherSkeleton;
