"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface DownloadMp3FormProps {
  disabled: boolean;
  videoUrl: string;
  title: string;
  channelName: string;
  thumbnailUrl?: string;
  duration?: string;
}

function DownloadSubmitButton({
  disabled,
  onClick,
  pending,
}: {
  disabled: boolean;
  onClick: () => void;
  pending: boolean;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
      disabled={disabled || pending}
      onClick={onClick}
    >
      {pending ? "Preparing MP3..." : "Download MP3"}
    </Button>
  );
}

export function DownloadMp3Form({
  disabled,
  videoUrl,
  title,
  channelName,
  thumbnailUrl,
  duration,
}: DownloadMp3FormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  function handleDownload() {
    if (disabled || pending) {
      return;
    }

    setPending(true);

    const params = new URLSearchParams();
    params.set("videoUrl", videoUrl);
    params.set("title", title);
    params.set("channelName", channelName);

    if (thumbnailUrl) {
      params.set("thumbnailUrl", thumbnailUrl);
    }

    if (duration) {
      params.set("duration", duration);
    }

    router.push(`/download?${params.toString()}`);
  }

  return (
    <div>
      <DownloadSubmitButton
        disabled={disabled}
        pending={pending}
        onClick={handleDownload}
      />
    </div>
  );
}
