export type DownloadHistoryItem = {
  id: string;
  sourceVideoUrl: string;
  downloadUrl: string;
  title: string;
  channelName: string;
  thumbnailUrl: string | null;
  duration: string | null;
  downloadedAt: string;
};

export type SaveDownloadHistoryInput = {
  sourceVideoUrl: string;
  downloadUrl: string;
  title?: string | null;
  channelName?: string | null;
  thumbnailUrl?: string | null;
  duration?: string | null;
};

export const DOWNLOAD_HISTORY_STORAGE_KEY = "ourtube:download-history:v1";
export const DOWNLOAD_HISTORY_UPDATED_EVENT =
  "ourtube:download-history-updated";
const MAX_HISTORY_ITEMS = 100;

function asString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
}

function normalizeHistoryItem(value: unknown): DownloadHistoryItem | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const id = asString(candidate.id);
  const sourceVideoUrl = asString(candidate.sourceVideoUrl);
  const downloadUrl = asString(candidate.downloadUrl);
  const title = asString(candidate.title);
  const channelName = asString(candidate.channelName);
  const downloadedAt = asString(candidate.downloadedAt);
  const thumbnailUrl = asString(candidate.thumbnailUrl);
  const duration = asString(candidate.duration);

  if (!id || !sourceVideoUrl || !downloadUrl || !downloadedAt) {
    return null;
  }

  return {
    id,
    sourceVideoUrl,
    downloadUrl,
    title: title ?? "Untitled video",
    channelName: channelName ?? "Unknown channel",
    thumbnailUrl,
    duration,
    downloadedAt,
  };
}

function readRawStorage(): DownloadHistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(DOWNLOAD_HISTORY_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => normalizeHistoryItem(item))
      .filter((item): item is DownloadHistoryItem => item !== null);
  } catch {
    return [];
  }
}

function writeRawStorage(items: DownloadHistoryItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    DOWNLOAD_HISTORY_STORAGE_KEY,
    JSON.stringify(items.slice(0, MAX_HISTORY_ITEMS)),
  );
  window.dispatchEvent(new Event(DOWNLOAD_HISTORY_UPDATED_EVENT));
}

export function getDownloadHistory(): DownloadHistoryItem[] {
  const items = readRawStorage();

  return [...items].sort((a, b) => {
    const timeA = Date.parse(a.downloadedAt);
    const timeB = Date.parse(b.downloadedAt);

    return timeB - timeA;
  });
}

export function saveDownloadHistoryItem(input: SaveDownloadHistoryInput) {
  const sourceVideoUrl = asString(input.sourceVideoUrl);
  const downloadUrl = asString(input.downloadUrl);

  if (!sourceVideoUrl || !downloadUrl) {
    return;
  }

  const now = new Date().toISOString();
  const id = `${sourceVideoUrl}::${downloadUrl}`;

  const nextItem: DownloadHistoryItem = {
    id,
    sourceVideoUrl,
    downloadUrl,
    title: asString(input.title) ?? "Untitled video",
    channelName: asString(input.channelName) ?? "Unknown channel",
    thumbnailUrl: asString(input.thumbnailUrl),
    duration: asString(input.duration),
    downloadedAt: now,
  };

  const current = readRawStorage();
  const withoutDuplicate = current.filter((item) => item.id !== id);

  writeRawStorage([nextItem, ...withoutDuplicate]);
}

export function subscribeToDownloadHistory(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === DOWNLOAD_HISTORY_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(DOWNLOAD_HISTORY_UPDATED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(DOWNLOAD_HISTORY_UPDATED_EVENT, onStoreChange);
  };
}
