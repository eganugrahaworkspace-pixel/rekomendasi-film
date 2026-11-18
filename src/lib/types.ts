export interface Genre {
  id: number;
  name: string;
}

/** Shape returned by TMDB list endpoints (trending, search, discover...). */
export interface MovieSummary {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
  vote_count?: number;
  genre_ids?: number[];
}

export interface Video {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
}

export interface ReleaseDates {
  results: {
    iso_3166_1: string;
    release_dates: { certification: string; type: number }[];
  }[];
}

export interface MovieDetails extends MovieSummary {
  tagline?: string;
  runtime: number | null;
  genres: Genre[];
  status?: string;
  original_language?: string;
  videos?: { results: Video[] };
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  release_dates?: ReleaseDates;
  recommendations?: Paginated<MovieSummary>;
  similar?: Paginated<MovieSummary>;
}

export interface Paginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/** Minimal data we persist in localStorage for "My List". */
export interface SavedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
}
