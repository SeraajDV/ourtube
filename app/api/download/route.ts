import { NextResponse } from "next/server";

const RAPIDAPI_HOST = "yt-search-and-download-mp3.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

type DownloadApiResponse = {
  success?: boolean;
  message?: string;
  download?: string;
  link?: string;
  [key: string]: unknown;
};

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

function normalizeVideoUrl(videoUrl: string): string {
  try {
    const url = new URL(videoUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Unsupported video URL protocol");
    }

    return url.toString();
  } catch {
    throw new Error("A valid video URL is required");
  }
}

function parseDownloadApiResponse(
  resultText: string,
): DownloadApiResponse | string {
  try {
    return JSON.parse(resultText) as DownloadApiResponse;
  } catch {
    return resultText;
  }
}

function getDownloadLink(
  result: DownloadApiResponse | string,
): string | undefined {
  if (typeof result === "string") {
    return firstString([result]);
  }

  return firstString([
    result.download,
    result.link,
    fromRecord(result, "url"),
    fromRecord(result, "downloadUrl"),
    fromRecord(result, "download_url"),
    fromRecord(result, "mp3"),
    fromRecord(result, "mp3Url"),
    fromRecord(result, "mp3_url"),
    fromRecord(fromRecord(result, "data"), "link"),
    fromRecord(fromRecord(result, "data"), "url"),
    fromRecord(fromRecord(result, "data"), "downloadUrl"),
    fromRecord(fromRecord(result, "data"), "download_url"),
  ]);
}

async function requestMp3Download(videoUrl: string) {
  if (!RAPIDAPI_KEY?.trim()) {
    throw new Error("RAPIDAPI_KEY is not configured");
  }

  const normalizedUrl = normalizeVideoUrl(videoUrl.trim());
  const endpoint = new URL(`https://${RAPIDAPI_HOST}/mp3`);

  endpoint.searchParams.set("url", normalizedUrl);

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const resultText = await response.text();

  if (!response.ok) {
    const message = firstString([
      fromRecord(parseDownloadApiResponse(resultText), "message"),
      resultText,
    ]);

    throw new Error(
      message
        ? `Download request failed: ${message}`
        : `Download request failed with status ${response.status}`,
    );
  }

  return parseDownloadApiResponse(resultText);
}

export async function POST(request: Request) {
  try {
    let body: { videoUrl?: unknown };

    try {
      body = (await request.json()) as { videoUrl?: unknown };
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const videoUrl = body.videoUrl;

    if (typeof videoUrl !== "string" || !videoUrl.trim()) {
      return NextResponse.json(
        { error: "Video URL is required" },
        { status: 400 },
      );
    }

    const result = await requestMp3Download(videoUrl);

    if (typeof result !== "string" && result.success === false) {
      const message = firstString([
        result.message,
        fromRecord(result, "error"),
      ]);

      return NextResponse.json(
        { error: message ?? "Download request was not successful" },
        { status: 502 },
      );
    }

    const downloadUrl = getDownloadLink(result);

    if (!downloadUrl) {
      return NextResponse.json(
        { error: "Download link is unavailable" },
        { status: 502 },
      );
    }

    return NextResponse.json({ downloadUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to prepare download";
    const status =
      message === "Video URL is required" ||
      message === "A valid video URL is required"
        ? 400
        : message === "RAPIDAPI_KEY is not configured"
          ? 500
          : 502;

    return NextResponse.json({ error: message }, { status });
  }
}
