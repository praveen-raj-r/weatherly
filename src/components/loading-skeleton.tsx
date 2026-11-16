import { Skeleton } from "./ui/skeleton";

const WeatherSkeleton = () => {
  return (
    <div
      className="flex flex-col gap-5"
      aria-busy="true"
      aria-label="Loading weather"
    >
      <div className="flex gap-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-28 flex-none rounded-3xl" />
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div className="glass flex flex-col gap-3 rounded-5xl p-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-1.5 h-[76px] w-44 rounded-2xl" />
            <Skeleton className="h-3.5 w-28" />
            <div className="mt-1.5 flex gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 flex-1 rounded-[14px]" />
              ))}
            </div>
          </div>
          <div className="glass flex flex-col gap-3 rounded-3xl p-6">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-1.5 h-24 rounded-[14px]" />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="glass grid grid-cols-2 gap-2 rounded-3xl p-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
          <div className="glass flex flex-col gap-3 rounded-3xl p-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherSkeleton;
