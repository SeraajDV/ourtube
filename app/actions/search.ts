"use server";

const RAPIDAPI_HOST = "yt-search-and-download-mp3.p.rapidapi.com";
const RAPIDAPI_KEY =
  process.env.RAPIDAPI_KEY ??
  "1f7375e039msh17fdbd9e66664eap1c7999jsn31426c9223e8";

type SearchApiResponse = {
  videos?: unknown[];
  [key: string]: unknown;
};

export async function getSearchResults(query: string, limit = 10) {
  if (!query.trim()) {
    return { videos: [] as unknown[] };
  }

  const encodedQuery = encodeURIComponent(query.trim());
  const url = `https://${RAPIDAPI_HOST}/search?q=${encodedQuery}&limit=${limit}`;

  const options: RequestInit = {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Search request failed with status ${response.status}`);
    }

    const resultText = await response.text();
    return JSON.parse(resultText) as SearchApiResponse;
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    return { videos: [] as unknown[] };
  }
}
