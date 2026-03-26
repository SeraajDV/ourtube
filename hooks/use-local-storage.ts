"use client";

import { useCallback, useEffect, useState } from "react";

type UseLocalStorageOptions<T> = {
  initialValue: T;
  readValue: () => T;
  storageKey?: string;
  syncEvent?: string;
};

export function useLocalStorage<T>({
  initialValue,
  readValue,
  storageKey,
  syncEvent,
}: UseLocalStorageOptions<T>): T {
  const [value, setValue] = useState<T>(initialValue);

  const refreshValue = useCallback(() => {
    setValue(readValue());
  }, [readValue]);

  useEffect(() => {
    refreshValue();
  }, [refreshValue]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onStorage = (event: StorageEvent) => {
      if (!storageKey || event.key === null || event.key === storageKey) {
        refreshValue();
      }
    };

    window.addEventListener("storage", onStorage);

    if (syncEvent) {
      window.addEventListener(syncEvent, refreshValue);
    }

    return () => {
      window.removeEventListener("storage", onStorage);

      if (syncEvent) {
        window.removeEventListener(syncEvent, refreshValue);
      }
    };
  }, [refreshValue, storageKey, syncEvent]);

  return value;
}
