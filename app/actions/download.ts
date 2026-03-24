"use server";

import { redirect } from "next/navigation";

const RAPIDAPI_HOST = "yt-search-and-download-mp3.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;

type DownloadApiResponse = {
  link?: string;
  [key: string]: unknown;
};

export async function downloadMp3(videoId: string) {
  if (!videoId.trim()) {
    throw new Error("Video ID is required");
  }

  const url = `https://${RAPIDAPI_HOST}/mp3?id=${encodeURIComponent(videoId.trim())}`;

  const options: RequestInit = {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Download request failed with status ${response.status}`);
  }

  const result = await response.text();
  return JSON.parse(result) as DownloadApiResponse;
}

export async function downloadMp3Redirect(videoId: string) {
  const result = await downloadMp3(videoId);

  if (typeof result.link !== "string" || !result.link.trim()) {
    throw new Error("Download link is unavailable");
  }

  redirect(result.link);
}
