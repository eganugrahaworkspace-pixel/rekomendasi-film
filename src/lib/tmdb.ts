import "server-only";

import type {
  Genre,
  MovieDetails,
  MovieSummary,
  Paginated,
} from "./types";

/**
 * Server-only TMDB client.
 *
 * The `server-only` import makes the build fail if this module is ever pulled
 * into a Client Component, so the credential can never leak to the browser.
 */

const BASE_URL = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
const ONE_HOUR = 60 * 60;

export class TmdbError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "TmdbError";
  }
}

type Params = Record<string, string | number | undefined>;

async function tmdb<T>(
  path: string,
  params: Params = {},
  revalidate = ONE_HOUR,
): Promise<T> {
  const token = process.env.TMDB_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  if (!token && !apiKey) {
    throw new TmdbError(
      "TMDB credentials are missing. Set TMDB_ACCESS_TOKEN or TMDB_API_KEY (see .env.example).",
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("language", "en-US");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  // v4 token goes in the header; v3 key has to be a query param.
  if (!token && apiKey) url.searchParams.set("api_key", apiKey);

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // Cache responses on the server (ISR) so we stay far below TMDB's rate
    // limit and pages are served fast from Vercel's cache.
    next: { revalidate },
  });

  if (res.status === 404) throw new TmdbError("Not found", 404);
  if (!res.ok) throw new TmdbError(`TMDB request failed: ${res.status} ${path}`, res.status);

  return (await res.json()) as T;
}

/** Drops items that can't be rendered nicely (no artwork). */
const withArtwork = (movies: MovieSummary[]) =>
  movies.filter((m) => m.poster_path && m.backdrop_path);

export async function getTrending(window: "day" | "week" = "week") {
  const data = await tmdb<Paginated<MovieSummary>>(`/trending/movie/${window}`);
  return withArtwork(data.results);
}

export async function getMovieList(
  list: "popular" | "top_rated" | "upcoming" | "now_playing",
  page = 1,
) {
  const data = await tmdb<Paginated<MovieSummary>>(`/movie/${list}`, { page, region: "ID" });
  return { ...data, results: withArtwork(data.results) };
}

export async function getGenres() {
  const data = await tmdb<{ genres: Genre[] }>("/genre/movie/list", {}, ONE_HOUR * 24);
  return data.genres;
}

export async function searchMovies(query: string, page = 1) {
  const data = await tmdb<Paginated<MovieSummary>>("/search/movie", {
    query,
    page,
    include_adult: "false",
  });
  return { ...data, results: data.results.filter((m) => m.poster_path) };
}

export async function discoverByGenre(genreId: number, page = 1) {
  const data = await tmdb<Paginated<MovieSummary>>("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    include_adult: "false",
    "vote_count.gte": 100,
    page,
  });
  return { ...data, results: data.results.filter((m) => m.poster_path) };
}

/** One request returns details + trailer + cast + certification + recommendations. */
export async function getMovieDetails(id: number) {
  return tmdb<MovieDetails>(`/movie/${id}`, {
    append_to_response: "videos,credits,release_dates,recommendations,similar",
  });
}

export async function getRecommendations(id: number) {
  const data = await tmdb<Paginated<MovieSummary>>(`/movie/${id}/recommendations`);
  return withArtwork(data.results);
}
