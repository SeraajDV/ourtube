import { Skeleton } from "@/components/ui/skeleton";

export default function DownloadsLoading() {
  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-100 md:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">
            Downloads
          </h1>
          <p className="text-sm text-neutral-400">
            Loading your saved MP3 links...
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-20 w-32 shrink-0 rounded-lg bg-neutral-800" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-4/5 bg-neutral-800" />
                <Skeleton className="h-4 w-1/2 bg-neutral-800" />
                <Skeleton className="h-3 w-1/3 bg-neutral-800" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-36 bg-neutral-800" />
              <Skeleton className="h-10 w-28 bg-neutral-800" />
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-20 w-32 shrink-0 rounded-lg bg-neutral-800" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4 bg-neutral-800" />
                <Skeleton className="h-4 w-2/5 bg-neutral-800" />
                <Skeleton className="h-3 w-1/4 bg-neutral-800" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-36 bg-neutral-800" />
              <Skeleton className="h-10 w-28 bg-neutral-800" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
