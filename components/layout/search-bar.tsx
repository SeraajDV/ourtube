"use client";

import { Mic, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (transcript) setQuery(transcript);
  }, [transcript]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening();
    }
  };

  const canUseVoice = hasMounted && browserSupportsSpeechRecognition;
  const isListening = hasMounted && listening;

  return (
    <div className="flex items-center gap-1 w-full max-w-xl">
      <div className="flex items-center flex-1 rounded-full border border-input bg-input/30 px-4 h-10 focus-within:border-ring">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-muted-foreground hover:text-foreground ml-2"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
        <button
          className="ml-3 -mr-2 h-10 w-10 flex items-center justify-center border-l border-input text-muted-foreground hover:text-foreground"
          aria-label="Search"
          onClick={() => router.push(`/search?query=${query}`)}
        >
          <Search size={16} />
        </button>
      </div>
      <button
        onClick={canUseVoice ? toggleListening : undefined}
        disabled={!canUseVoice}
        className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={isListening ? "Stop voice input" : "Search by voice"}
      >
        <Mic size={16} className={isListening ? "text-red-500" : ""} />
      </button>
    </div>
  );
}

export default SearchBar;
