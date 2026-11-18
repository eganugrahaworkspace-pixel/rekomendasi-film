import type { Metadata } from "next";
import Pagination from "@/components/Pagination";
import PosterGrid from "@/components/PosterGrid";
import SearchPanel from "@/components/SearchPanel";
import { discoverByGenre, getGenres, searchMovies } from "@/lib/tmdb";

type Props = { searchParams: Promise<{ q?: string; genre?: string; page?: string }> };

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().slice(0, 100);
  const genreId = Number(params.genre) || undefined;
  const page = Math.min(500, Math.max(1, Number(params.page) || 1));

  const genres = await getGenres();
  const genre = genres.find((g) => g.id === genreId);

  const data = query
    ? await searchMovies(query, page)
    : genre
      ? await discoverByGenre(genre.id, page)
      : null;

  const heading = query ? `Results for “${query}”` : genre ? genre.name : "Find your next movie";
  const keep: Record<string, string> = query ? { q: query } : genre ? { genre: String(genre.id) } : {};

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
      <SearchPanel genres={genres} defaultQuery={query} activeGenre={genre?.id} />

      <h1 className="mt-14 mb-8 text-3xl font-light">
        {heading}
        {data && (
          <span className="ml-3 text-base text-muted">
            {data.total_results.toLocaleString("en-US")} movies
          </span>
        )}
      </h1>

      {data && data.results.length > 0 && (
        <>
          <PosterGrid movies={data.results} />
          <Pagination
            page={page}
            totalPages={Math.min(500, data.total_pages)}
            basePath="/search"
            query={keep}
          />
        </>
      )}
      {data && data.results.length === 0 && (
        <p className="text-muted">No movies found. Try another title or pick a genre above.</p>
      )}
      {!data && <p className="text-muted">Type a movie title, or pick a genre to explore.</p>}
    </div>
  );
}
