"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  getDownloadHistory,
  subscribeToDownloadHistory,
} from "@/lib/download-history";

function formatDownloadedAt(isoDate: string): string {
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return parsed.toLocaleString();
}

export default function DownloadsPage() {
  const items = useSyncExternalStore(
    subscribeToDownloadHistory,
    getDownloadHistory,
    () => [],
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-100 md:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">
            Downloads
          </h1>
          <p className="text-sm text-neutral-400">
            Saved MP3 links for videos you have downloaded.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild type="button" variant="secondary">
              <Link href="/search">Back to search</Link>
            </Button>
          </div>
        </div>

        {!items.length ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 text-sm text-neutral-400">
            No downloads yet. Download an MP3 from search results and it will
            show up here.
          </div>
        ) : null}

        {items.length ? (
          <div className="grid gap-4">
            {items.map((item) => {
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                      {item.thumbnailUrl ? (
                        <div
                          className="h-full w-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url('${item.thumbnailUrl}')`,
                          }}
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <h2 className="line-clamp-2 text-base font-semibold text-neutral-50">
                        {item.title}
                      </h2>
                      <p className="text-sm text-neutral-300">
                        {item.channelName}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                        {item.duration ? <span>{item.duration}</span> : null}
                        <span>{formatDownloadedAt(item.downloadedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      asChild
                      type="button"
                      className="bg-emerald-600 text-white hover:bg-emerald-500"
                    >
                      <a
                        href={item.downloadUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Re-download MP3
                      </a>
                    </Button>
                    <Button asChild type="button" variant="secondary">
                      <a
                        href={item.sourceVideoUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open video
                      </a>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </main>
  );
}
