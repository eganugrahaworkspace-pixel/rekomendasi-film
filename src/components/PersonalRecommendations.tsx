"use client";

import { useEffect, useState } from "react";
import { useMyList } from "@/lib/my-list";
import type { BackdropItem } from "./BackdropCard";
import MovieRow from "./MovieRow";

/** Recommendations based on the movies the visitor saved to "My List". */
export default function PersonalRecommendations() {
  const list = useMyList();
  // Most recently saved movies say the most about current taste.
  const seedKey = list
    .slice(0, 5)
    .map((m) => m.id)
    .join(",");
  const [result, setResult] = useState<{ key: string; items: BackdropItem[] } | null>(null);

  useEffect(() => {
    if (!seedKey) return;
    const controller = new AbortController();
    fetch(`/api/recommendations?ids=${seedKey}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: { items: BackdropItem[] }) => setResult({ key: seedKey, items: data.items }))
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setResult({ key: seedKey, items: [] });
        }
      });
    return () => controller.abort();
  }, [seedKey]);

  // Ignore results that belong to an older version of the list.
  if (!seedKey || result?.key !== seedKey || !result.items.length) return null;

  return (
    <MovieRow
      eyebrow={`Based on ${list.length} ${list.length === 1 ? "movie" : "movies"} in your list`}
      title="Picked For You"
      items={result.items}
      href="/my-list"
    />
  );
}
