"use client";

import { Mic, Search, X } from "lucide-react";
import { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");

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
        >
          <Search size={16} />
        </button>
      </div>
      <button
        className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
        aria-label="Search by voice"
      >
        <Mic size={16} />
      </button>
    </div>
  );
}

export default SearchBar;
