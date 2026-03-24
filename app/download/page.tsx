"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { saveDownloadHistoryItem } from "@/lib/download-history";

type DownloadState = {
  pending: boolean;
  error: string | null;
  downloadUrl: string | null;
};

function normalizeParam(value: string | null): string | null {
  if (!value || !value.trim()) {
    return null;
  }

  return value.trim();
}

export default function DownloadPage() {
  const searchParams = useSearchParams();
  const videoUrl = normalizeParam(searchParams.get("videoUrl"));
  const title = normalizeParam(searchParams.get("title"));
  const channelName = normalizeParam(searchParams.get("channelName"));
  const thumbnailUrl = normalizeParam(searchParams.get("thumbnailUrl"));
  const duration = normalizeParam(searchParams.get("duration"));
  const savedDownloadKeyRef = useRef<string | null>(null);
  const [state, setState] = useState<DownloadState>({
    pending: false,
    error: null,
    downloadUrl: null,
  });

  const prepareDownload = useCallback(async () => {
    if (!videoUrl) {
      setState({
        pending: false,
        error: "Missing video URL. Go back and select a video again.",
        downloadUrl: null,
      });
      return;
    }

    setState({ pending: true, error: null, downloadUrl: null });

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      });

      const result = (await response.json()) as {
        downloadUrl?: unknown;
        error?: unknown;
      };

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Failed to prepare download",
        );
      }

      if (
        typeof result.downloadUrl !== "string" ||
        !result.downloadUrl.trim()
      ) {
        throw new Error("Download link is unavailable");
      }

      setState({
        pending: false,
        error: null,
        downloadUrl: result.downloadUrl,
      });
    } catch (error) {
      setState({
        pending: false,
        error:
          error instanceof Error ? error.message : "Failed to prepare download",
        downloadUrl: null,
      });
    }
  }, [videoUrl]);

  useEffect(() => {
    void prepareDownload();
  }, [prepareDownload]);

  useEffect(() => {
    if (!videoUrl || !state.downloadUrl) {
      return;
    }

    const entryKey = `${videoUrl}::${state.downloadUrl}`;
    if (savedDownloadKeyRef.current === entryKey) {
      return;
    }

    saveDownloadHistoryItem({
      sourceVideoUrl: videoUrl,
      downloadUrl: state.downloadUrl,
      title,
      channelName,
      thumbnailUrl,
      duration,
    });

    savedDownloadKeyRef.current = entryKey;
  }, [channelName, duration, state.downloadUrl, thumbnailUrl, title, videoUrl]);

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-100 md:px-8">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">
          MP3 Download
        </h1>

        <p className="mt-2 text-sm text-neutral-400">
          We are preparing the final download link for your selected video.
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <Button asChild type="button" variant="secondary">
            <Link href="/downloads">View download history</Link>
          </Button>
          <Button asChild type="button" variant="secondary">
            <Link href="/search">Back to search</Link>
          </Button>
        </div>

        {state.pending ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <LoaderCircle className="size-5 animate-spin text-neutral-200" />
            <p className="text-sm text-neutral-300">
              Generating your MP3 link. This can take a few seconds.
            </p>
          </div>
        ) : null}

        {state.error ? (
          <div className="mt-8 space-y-4 rounded-2xl border border-red-900/60 bg-red-950/30 p-4">
            <p className="text-sm text-red-300" role="alert">
              {state.error}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={() => void prepareDownload()}>
                Try again
              </Button>
              <Button asChild type="button" variant="secondary">
                <Link href="/search">Back to search</Link>
              </Button>
            </div>
          </div>
        ) : null}

        {state.downloadUrl ? (
          <div className="mt-8 space-y-4 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-4">
            <p className="text-sm text-emerald-300">Your MP3 link is ready.</p>
            <Button
              asChild
              type="button"
              className="bg-emerald-600 text-white hover:bg-emerald-500"
            >
              <a href={state.downloadUrl} rel="noreferrer" target="_blank">
                Get MP3
              </a>
            </Button>
            <Button asChild type="button" variant="secondary">
              <Link href="/downloads">See all downloads</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
