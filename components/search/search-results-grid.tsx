import { downloadMp3Redirect } from "@/app/actions/download";
import { Button } from "@/components/ui/button";

export type RawVideo = Record<string, unknown>;

interface SearchResultsGridProps {
  searchQuery: string;
  videos: RawVideo[];
}

function firstString(values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return undefined;
}

function fromRecord(record: unknown, key: string): unknown {
  if (!record || typeof record !== "object") {
    return undefined;
  }

  return (record as Record<string, unknown>)[key];
}

function getThumbnail(video: RawVideo): string | undefined {
  const simpleUrl = firstString([
    video.thumbnail,
    video.thumbnailUrl,
    video.thumbnail_url,
    video.thumb,
    video.image,
  ]);

  if (simpleUrl) {
    return simpleUrl;
  }

  const thumbnails = fromRecord(video, "thumbnails");
  if (Array.isArray(thumbnails)) {
    for (const thumb of thumbnails) {
      const url = firstString([
        fromRecord(thumb, "url"),
        fromRecord(thumb, "src"),
      ]);
      if (url) {
        return url;
      }
    }
  }

  return firstString([
    fromRecord(video, "thumbnail") &&
      fromRecord(fromRecord(video, "thumbnail"), "url"),
  ]);
}

function getChannelAvatar(video: RawVideo): string | undefined {
  const channel = fromRecord(video, "channel");

  return firstString([
    fromRecord(video, "avatar"),
    fromRecord(video, "channelAvatar"),
    fromRecord(channel, "avatar"),
    fromRecord(channel, "thumbnail"),
    fromRecord(channel, "image"),
  ]);
}

function getChannelName(video: RawVideo): string {
  const channel = fromRecord(video, "channel");
  return (
    firstString([
      fromRecord(video, "channelName"),
      fromRecord(video, "author"),
      fromRecord(video, "uploader"),
      fromRecord(channel, "name"),
      fromRecord(channel, "title"),
    ]) ?? "Unknown channel"
  );
}

function getTitle(video: RawVideo): string {
  return (
    firstString([
      video.title,
      fromRecord(video, "name"),
      fromRecord(video, "videoTitle"),
    ]) ?? "Untitled video"
  );
}

function getDuration(video: RawVideo): string | undefined {
  return firstString([
    fromRecord(video, "durationText"),
    fromRecord(video, "lengthText"),
    fromRecord(video, "duration"),
    fromRecord(video, "length"),
  ]);
}

function getVideoUrl(video: RawVideo): string {
  const directUrl = firstString([
    fromRecord(video, "url"),
    fromRecord(video, "videoUrl"),
    fromRecord(video, "link"),
  ]);

  if (directUrl) {
    return directUrl;
  }

  const videoId = firstString([
    fromRecord(video, "videoId"),
    fromRecord(video, "id"),
  ]);

  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  return "#";
}

function getVideoId(video: RawVideo): string | undefined {
  const directId = firstString([
    fromRecord(video, "videoId"),
    fromRecord(video, "id"),
  ]);

  if (directId) {
    return directId;
  }

  const href = getVideoUrl(video);

  if (href === "#") {
    return undefined;
  }

  try {
    const url = new URL(href);
    const queryId = url.searchParams.get("v");

    if (queryId?.trim()) {
      return queryId;
    }

    if (url.hostname === "youtu.be") {
      const pathId = url.pathname.slice(1).trim();
      return pathId || undefined;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function SearchResultsGrid({
  searchQuery,
  videos,
}: SearchResultsGridProps) {
  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-6 text-neutral-100 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-340 space-y-5">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Search: {searchQuery || "All videos"}
          </h1>
          <p className="text-sm text-neutral-400">{videos.length} results</p>
        </div>

        <div className="grid gap-x-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => {
            const title = getTitle(video);
            const channelName = getChannelName(video);
            const thumbnail = getThumbnail(video);
            const avatar = getChannelAvatar(video);
            const duration = getDuration(video);
            const href = getVideoUrl(video);
            const videoId = getVideoId(video);
            const downloadAction = videoId
              ? downloadMp3Redirect.bind(null, videoId)
              : undefined;

            return (
              <article key={`${title}-${index}`} className="space-y-2.5">
                <a
                  href={href}
                  className="group block space-y-2.5"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-800">
                    {thumbnail ? (
                      <div
                        className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.03]"
                        style={{ backgroundImage: `url('${thumbnail}')` }}
                      />
                    ) : (
                      <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(82,82,82,0.6),rgba(38,38,38,1))]" />
                    )}
                    {duration ? (
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
                        {duration}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-neutral-700">
                      {avatar ? (
                        <div
                          className="h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${avatar}')` }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase text-neutral-200">
                          {channelName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-base font-medium leading-snug text-neutral-50 transition-colors group-hover:text-white">
                        {title}
                      </h2>
                    </div>

                    <div className="pt-1 text-lg leading-none text-neutral-500">
                      ⋮
                    </div>
                  </div>
                </a>

                <form action={downloadAction}>
                  <Button
                    type="submit"
                    variant="secondary"
                    className="w-full bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
                    disabled={!videoId}
                  >
                    Download MP3
                  </Button>
                </form>
              </article>
            );
          })}
        </div>

        {!videos.length ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 text-sm text-neutral-400">
            No videos found. Try a different search query.
          </div>
        ) : null}
      </div>
    </div>
  );
}
