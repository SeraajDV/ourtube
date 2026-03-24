"use client";

import { Mic, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  KeyboardEvent,
  useSyncExternalStore,
  useState,
} from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function subscribeToMount(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const run = () => onStoreChange();
  window.addEventListener("load", run);

  return () => {
    window.removeEventListener("load", run);
  };
}

function getMountedSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return document.readyState !== "loading";
}

function SearchBar() {
  const [query, setQuery] = useState("");
  const hasMounted = useSyncExternalStore(
    subscribeToMount,
    getMountedSnapshot,
    () => false,
  );
  const router = useRouter();
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  const toggleListening = () => {
    if (listening) {
      if (transcript.trim()) {
        setQuery(transcript.trim());
      }
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening();
    }
  };

  const canUseVoice = hasMounted && browserSupportsSpeechRecognition;
  const isListening = hasMounted && listening;
  const searchValue = isListening && transcript.trim() ? transcript : query;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <div className="flex items-center gap-1 w-full max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="flex items-center flex-1 rounded-full border border-input bg-input/30 px-4 h-10 focus-within:border-ring"
      >
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Search"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-muted-foreground hover:text-foreground ml-2"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
        <button
          type="submit"
          className="ml-3 -mr-2 h-10 w-10 flex items-center justify-center border-l border-input text-muted-foreground hover:text-foreground"
          aria-label="Search"
        >
          <Search size={16} />
        </button>
      </form>
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
