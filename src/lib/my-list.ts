"use client";

import { useSyncExternalStore } from "react";
import type { MovieSummary, SavedMovie } from "./types";

/**
 * "My List" persisted in localStorage.
 *
 * useSyncExternalStore keeps every component (hero, cards, header badge) in
 * sync, and also syncs across browser tabs through the `storage` event.
 * Storage can throw (Safari private mode, blocked third-party storage inside
 * the portfolio iframe), so every access is guarded and falls back to memory.
 */

const KEY = "rekofilm:my-list";
const EMPTY: SavedMovie[] = [];

let memory: SavedMovie[] = EMPTY;
let cache: { raw: string | null; value: SavedMovie[] } | null = null;
const listeners = new Set<() => void>();

function read(): SavedMovie[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return memory;
  }
  // Return a stable reference while the stored string is unchanged,
  // otherwise useSyncExternalStore would re-render forever.
  if (cache && cache.raw === raw) return cache.value;
  let value: SavedMovie[] = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    value = Array.isArray(parsed) ? (parsed as SavedMovie[]) : EMPTY;
  } catch {
    value = EMPTY;
  }
  cache = { raw, value };
  return value;
}

function write(next: SavedMovie[]) {
  memory = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    cache = { raw: null, value: next };
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useMyList() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleMyList(movie: MovieSummary | SavedMovie) {
  const list = read();
  if (list.some((m) => m.id === movie.id)) {
    write(list.filter((m) => m.id !== movie.id));
    return false;
  }
  const saved: SavedMovie = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
  };
  write([saved, ...list]);
  return true;
}
