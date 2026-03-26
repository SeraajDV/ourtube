import { LoaderCircle } from "lucide-react";

export default function DownloadLoading() {
  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-100 md:px-8">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">
          MP3 Download
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Preparing your download page...
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <LoaderCircle className="size-5 animate-spin text-neutral-200" />
          <p className="text-sm text-neutral-300">
            Loading download details...
          </p>
        </div>
      </div>
    </main>
  );
}
