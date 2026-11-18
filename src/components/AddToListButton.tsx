"use client";

import { toggleMyList, useMyList } from "@/lib/my-list";
import type { MovieSummary, SavedMovie } from "@/lib/types";
import { CheckCircleIcon, PlusCircleIcon } from "./icons";

interface Props {
  movie: MovieSummary | SavedMovie;
  className?: string;
}

export default function AddToListButton({ movie, className = "" }: Props) {
  const list = useMyList();
  const saved = list.some((m) => m.id === movie.id);

  return (
    <button
      type="button"
      onClick={() => toggleMyList(movie)}
      aria-pressed={saved}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-wider uppercase transition-colors ${
        saved
          ? "bg-white/10 text-white ring-1 ring-white/40 hover:bg-white/15"
          : "bg-accent text-ink hover:bg-accent-hover"
      } ${className}`}
    >
      {saved ? <CheckCircleIcon width={18} height={18} /> : <PlusCircleIcon width={18} height={18} />}
      {saved ? "In My List" : "Add List"}
    </button>
  );
}
