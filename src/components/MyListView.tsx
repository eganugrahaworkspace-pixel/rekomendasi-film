"use client";

import Link from "next/link";
import { useMyList } from "@/lib/my-list";
import PosterGrid from "./PosterGrid";

export default function MyListView() {
  const list = useMyList();

  if (!list.length) {
    return (
      <div className="border border-dashed border-line px-6 py-16 text-center">
        <p className="text-lg">Your list is empty.</p>
        <p className="mt-1 text-muted">
          Tap <span className="font-semibold text-accent">Add List</span> on any movie. We&apos;ll recommend
          more like it.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-brand px-6 py-3 text-sm font-semibold tracking-wider uppercase hover:bg-brand-hover"
        >
          Explore movies
        </Link>
      </div>
    );
  }

  return <PosterGrid movies={list} />;
}
