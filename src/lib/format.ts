import type { Genre, MovieDetails, Video } from "./types";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

// Sizes TMDB actually serves for posters/backdrops/profiles.
export type ImageSize = "w185" | "w342" | "w500" | "w780" | "w1280" | "original";

export function tmdbImage(path: string | null | undefined, size: ImageSize = "w500") {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export function releaseYear(date?: string) {
  return date ? date.slice(0, 4) : "";
}

export function formatRuntime(minutes: number | null | undefined) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m.toString().padStart(2, "0")}min` : `${m}min`;
}

export function formatRating(vote: number | undefined) {
  return vote ? vote.toFixed(1) : "–";
}

export function genreNames(ids: number[] | undefined, genres: Genre[], max = 3) {
  if (!ids) return [];
  const byId = new Map(genres.map((g) => [g.id, g.name]));
  return ids
    .map((id) => byId.get(id))
    .filter((name): name is string => Boolean(name))
    .slice(0, max);
}

/** Prefer an official YouTube trailer, then any trailer, then a teaser. */
export function pickTrailer(videos: Video[] | undefined) {
  if (!videos?.length) return null;
  const yt = videos.filter((v) => v.site === "YouTube");
  return (
    yt.find((v) => v.type === "Trailer" && v.official) ??
    yt.find((v) => v.type === "Trailer") ??
    yt.find((v) => v.type === "Teaser") ??
    null
  )?.key ?? null;
}

/** Age rating (e.g. "13+", "PG-13") – Indonesia first, then US. */
export function pickCertification(details: MovieDetails) {
  const results = details.release_dates?.results ?? [];
  for (const country of ["ID", "US"]) {
    const entry = results.find((r) => r.iso_3166_1 === country);
    const cert = entry?.release_dates.find((d) => d.certification)?.certification;
    if (cert) return cert;
  }
  return null;
}

/** Maps TMDB list results to the props the landscape cards need. */
export function toBackdropItems(
  movies: { id: number; title: string; backdrop_path: string | null; release_date?: string; vote_average: number; genre_ids?: number[] }[],
  genres: Genre[],
) {
  return movies
    .filter((m) => m.backdrop_path)
    .map((m) => ({
      id: m.id,
      title: m.title,
      backdrop_path: m.backdrop_path,
      vote_average: m.vote_average,
      subtitle: [releaseYear(m.release_date), genreNames(m.genre_ids, genres, 2).join(", ")]
        .filter(Boolean)
        .join("  ·  "),
    }));
}
