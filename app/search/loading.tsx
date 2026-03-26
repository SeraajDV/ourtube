import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
  return (
    <div className="space-y-2.5">
      {/* Thumbnail */}
      <Skeleton className="aspect-video w-full rounded-2xl bg-neutral-800" />

      {/* Meta row */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Skeleton className="h-8 w-8 shrink-0 rounded-full bg-neutral-800" />

        {/* Title lines */}
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-full rounded bg-neutral-800" />
          <Skeleton className="h-4 w-3/4 rounded bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-6 text-neutral-100 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-340 space-y-5">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded bg-neutral-800" />
          <Skeleton className="h-4 w-16 rounded bg-neutral-800" />
        </div>

        {/* Card grid */}
        <div className="grid gap-x-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
