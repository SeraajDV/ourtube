"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  DownloadHistoryItem,
  getDownloadHistory,
  subscribeToDownloadHistory,
} from "@/lib/download-history";

function formatDateTime(isoDate: string): string {
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return parsed.toLocaleString();
}

function formatShortDate(isoDate: string): string {
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return parsed.toLocaleDateString();
}

function toDayKey(isoDate: string): string | null {
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function countByChannel(items: DownloadHistoryItem[]) {
  const byChannel = new Map<string, number>();

  for (const item of items) {
    const key = item.channelName || "Unknown channel";
    byChannel.set(key, (byChannel.get(key) ?? 0) + 1);
  }

  return [...byChannel.entries()].sort((a, b) => b[1] - a[1]);
}

function countByDay(items: DownloadHistoryItem[]) {
  const byDay = new Map<string, number>();

  for (const item of items) {
    const dayKey = toDayKey(item.downloadedAt);

    if (!dayKey) {
      continue;
    }

    byDay.set(dayKey, (byDay.get(dayKey) ?? 0) + 1);
  }

  return [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

function isToday(isoDate: string): boolean {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  const now = new Date();

  return (
    parsed.getFullYear() === now.getFullYear() &&
    parsed.getMonth() === now.getMonth() &&
    parsed.getDate() === now.getDate()
  );
}

export default function HistoryPage() {
  const items = useSyncExternalStore(
    subscribeToDownloadHistory,
    getDownloadHistory,
    () => [],
  );

  const analytics = useMemo(() => {
    const totalDownloads = items.length;
    const uniqueVideos = new Set(items.map((item) => item.sourceVideoUrl)).size;
    const channels = countByChannel(items);
    const uniqueChannels = channels.length;
    const topChannel = channels[0] ?? null;
    const downloadsToday = items.filter((item) =>
      isToday(item.downloadedAt),
    ).length;
    const daily = countByDay(items)
      .slice(0, 7)
      .reverse()
      .map(([dayKey, count]) => [formatShortDate(dayKey), count] as const);

    return {
      totalDownloads,
      uniqueVideos,
      uniqueChannels,
      topChannel,
      downloadsToday,
      daily,
    };
  }, [items]);

  const maxDailyCount = analytics.daily.reduce((max, [, count]) => {
    return Math.max(max, count);
  }, 0);

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-100 md:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">
            Download History
          </h1>
          <p className="text-sm text-neutral-400">
            What you downloaded and when, plus quick activity analytics.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild type="button" variant="secondary">
              <Link href="/downloads">Open downloads list</Link>
            </Button>
            <Button asChild type="button" variant="secondary">
              <Link href="/search">Back to search</Link>
            </Button>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              Total downloads
            </p>
            <p className="mt-2 text-2xl font-semibold text-neutral-50">
              {analytics.totalDownloads}
            </p>
          </article>
          <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              Unique videos
            </p>
            <p className="mt-2 text-2xl font-semibold text-neutral-50">
              {analytics.uniqueVideos}
            </p>
          </article>
          <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              Unique channels
            </p>
            <p className="mt-2 text-2xl font-semibold text-neutral-50">
              {analytics.uniqueChannels}
            </p>
          </article>
          <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              Downloads today
            </p>
            <p className="mt-2 text-2xl font-semibold text-neutral-50">
              {analytics.downloadsToday}
            </p>
          </article>
          <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              Top channel
            </p>
            <p className="mt-2 text-sm font-semibold text-neutral-50 line-clamp-2">
              {analytics.topChannel ? analytics.topChannel[0] : "No data"}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              {analytics.topChannel
                ? `${analytics.topChannel[1]} downloads`
                : ""}
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h2 className="text-base font-semibold text-neutral-50">
            Last 7 days activity
          </h2>
          {!analytics.daily.length ? (
            <p className="mt-3 text-sm text-neutral-400">No activity yet.</p>
          ) : (
            <div className="mt-4 grid gap-3">
              {analytics.daily.map(([day, count]) => {
                const widthPercent = maxDailyCount
                  ? Math.max(8, Math.round((count / maxDailyCount) * 100))
                  : 0;

                return (
                  <div key={day} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>{day}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h2 className="text-base font-semibold text-neutral-50">
            Recent downloads
          </h2>
          {!items.length ? (
            <p className="mt-3 text-sm text-neutral-400">
              No downloads saved yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {items.slice(0, 12).map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-neutral-50">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        {item.channelName}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {formatDateTime(item.downloadedAt)}
                      </p>
                    </div>
                    <Button asChild type="button" size="sm" variant="secondary">
                      <a
                        href={item.downloadUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Re-download
                      </a>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
