import SearchBar from "@/components/layout/search-bar";
import { Music } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
          <Music size={32} />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Download any YouTube video as MP3
          </h1>
          <p className="text-muted-foreground text-lg">
            Search for a video, pick a result, and save the audio to your device
            — free and instant.
          </p>
        </div>
      </div>
    </main>
  );
}
