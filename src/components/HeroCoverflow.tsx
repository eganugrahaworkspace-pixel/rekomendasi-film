"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { formatRating, releaseYear, tmdbImage } from "@/lib/format";
import type { MovieSummary } from "@/lib/types";
import AddToListButton from "./AddToListButton";
import TrailerButton from "./TrailerButton";
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, StarIcon } from "./icons";

export interface HeroMovie extends MovieSummary {
  genres: string[];
  runtime: string | null;
  certification: string | null;
  trailerKey: string | null;
}

const AUTOPLAY_MS = 7000;

/** Position of a card relative to the active one, wrapped around the ring. */
function offsetFrom(index: number, active: number, total: number) {
  let d = (((index - active) % total) + total) % total;
  if (d > total / 2) d -= total;
  return d;
}

/**
 * 3D transform for each slot. The outer edge of side cards tilts toward the
 * viewer, as in the reference design.
 */
function cardStyle(d: number): CSSProperties {
  const abs = Math.abs(d);
  const side = Math.sign(d);
  const shift = [0, 80, 128][abs] ?? 160;
  const scale = [1, 0.84, 0.72][abs] ?? 0.6;
  const rotate = abs === 0 ? 0 : 32;
  return {
    transform: `translateX(-50%) translateX(${side * shift}%) rotateY(${side * -rotate}deg) scale(${scale})`,
    zIndex: 10 - abs,
    opacity: abs > 2 ? 0 : 1,
    pointerEvents: abs > 2 ? "none" : "auto",
    filter: abs === 0 ? "none" : `brightness(${abs === 1 ? 0.7 : 0.5})`,
  };
}

export default function HeroCoverflow({ movies }: { movies: HeroMovie[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const total = movies.length;

  const go = useCallback(
    (step: number) => setActive((i) => (((i + step) % total) + total) % total),
    [total],
  );

  useEffect(() => {
    if (paused || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, go, total]);

  if (!total) return null;
  const current = movies[active];

  return (
    // The outer cards extend past the screen edge; clip them here so the page
    // never scrolls sideways. `clip` (unlike `hidden`) keeps sticky elements working.
    <div className="overflow-x-clip">
    <section
      aria-roledescription="carousel"
      aria-label="Trending movies"
      className="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <p className="sr-only" aria-live="polite">
        Slide {active + 1} of {total}: {current.title}
      </p>

      <div
        className="relative h-[460px] touch-pan-y [perspective:1400px] sm:h-[520px]"
        onPointerDown={(e) => (pointerStart.current = e.clientX)}
        onPointerUp={(e) => {
          if (pointerStart.current === null) return;
          const dx = e.clientX - pointerStart.current;
          pointerStart.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        {movies.map((movie, i) => {
          const d = offsetFrom(i, active, total);
          const isActive = d === 0;
          return (
            <article
              key={movie.id}
              aria-roledescription="slide"
              aria-label={movie.title}
              aria-hidden={!isActive}
              className="preserve-3d absolute top-0 left-1/2 h-full w-[min(78vw,420px)] overflow-hidden shadow-2xl shadow-black/70 transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] sm:w-[440px]"
              style={cardStyle(d)}
            >
              <Image
                src={tmdbImage(movie.poster_path, "w780")!}
                alt=""
                fill
                priority={i === 0}
                sizes="(min-width: 640px) 440px, 78vw"
                className="object-cover"
              />
              {!isActive && (
                <button
                  type="button"
                  className="absolute inset-0 cursor-pointer"
                  aria-label={`Show ${movie.title}`}
                  tabIndex={-1}
                  onClick={() => setActive(i)}
                />
              )}
              {isActive && <ActiveOverlay movie={movie} />}
            </article>
          );
        })}

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous movie"
          className="absolute top-1/2 left-0 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-lg transition hover:bg-white sm:left-2"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next movie"
          className="absolute top-1/2 right-0 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-lg transition hover:bg-white sm:right-2"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </section>
    </div>
  );
}

function ActiveOverlay({ movie }: { movie: HeroMovie }) {
  const year = releaseYear(movie.release_date);
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
      <Link
        href={`/movies/${movie.id}`}
        className="absolute inset-0"
        aria-label={`${movie.title} details`}
      />

      <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-3 text-sm">
        {movie.certification && (
          <span className="bg-accent px-2 py-1 font-semibold text-ink">{movie.certification}</span>
        )}
        {movie.runtime && <span className="text-white/90 drop-shadow">Duration: {movie.runtime}</span>}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-6 text-center">
        <h2 className="font-display text-4xl leading-[1.05] font-black text-balance drop-shadow-lg sm:text-5xl">
          {movie.title}
        </h2>
        <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 text-xs tracking-wide text-white/90 uppercase sm:text-sm">
          <span className="inline-flex items-center gap-1 font-semibold text-accent">
            <StarIcon width={14} height={14} />
            {formatRating(movie.vote_average)}
          </span>
          {year && <span>({year})</span>}
          {movie.genres.length > 0 && <span>{movie.genres.join(". ")}</span>}
        </p>
        <div className="pointer-events-auto mt-5 flex w-full flex-wrap justify-center gap-3 sm:gap-6">
          {movie.trailerKey ? (
            <TrailerButton trailerKey={movie.trailerKey} title={movie.title} className="min-w-36" />
          ) : (
            <Link
              href={`/movies/${movie.id}`}
              className="inline-flex min-w-36 items-center justify-center gap-2 bg-brand px-6 py-3 text-sm font-semibold tracking-wider uppercase hover:bg-brand-hover"
            >
              <PlayIcon width={16} height={16} /> Details
            </Link>
          )}
          <AddToListButton movie={movie} className="min-w-36" />
        </div>
      </div>
    </>
  );
}
