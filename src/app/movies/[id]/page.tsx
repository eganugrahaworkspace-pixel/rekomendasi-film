import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToListButton from "@/components/AddToListButton";
import MovieRow from "@/components/MovieRow";
import TrailerButton from "@/components/TrailerButton";
import { StarIcon } from "@/components/icons";
import {
  formatRating,
  formatRuntime,
  pickCertification,
  pickTrailer,
  releaseYear,
  tmdbImage,
  toBackdropItems,
} from "@/lib/format";
import { getGenres, getMovieDetails, TmdbError } from "@/lib/tmdb";

export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

async function loadMovie(rawId: string) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) notFound();
  try {
    return await getMovieDetails(id);
  } catch (error) {
    if (error instanceof TmdbError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = await loadMovie((await params).id);
  const image = tmdbImage(movie.backdrop_path, "w1280");
  return {
    title: `${movie.title} (${releaseYear(movie.release_date)})`,
    description: movie.overview,
    openGraph: { title: movie.title, description: movie.overview, images: image ? [image] : [] },
  };
}

export default async function MovieDetailsPage({ params }: Props) {
  const { id } = await params;
  const [movie, genres] = await Promise.all([loadMovie(id), getGenres()]);

  const trailerKey = pickTrailer(movie.videos?.results);
  const certification = pickCertification(movie);
  const runtime = formatRuntime(movie.runtime);
  const directors = movie.credits?.crew.filter((c) => c.job === "Director") ?? [];
  const cast = movie.credits?.cast.slice(0, 12) ?? [];
  // "Recommendations" is TMDB's collaborative signal; fall back to "similar"
  // (genre/keyword based) for niche titles with no recommendation data.
  const recommended = movie.recommendations?.results.length
    ? movie.recommendations.results
    : (movie.similar?.results ?? []);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        {movie.backdrop_path && (
          <Image
            src={tmdbImage(movie.backdrop_path, "w1280")!}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-top opacity-40"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />

        <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-12 pb-10 sm:px-6 md:grid-cols-[280px_1fr] md:pt-20">
          <div className="relative mx-auto aspect-[2/3] w-56 overflow-hidden shadow-2xl shadow-black/60 md:w-full">
            {movie.poster_path && (
              <Image
                src={tmdbImage(movie.poster_path, "w500")!}
                alt={`${movie.title} poster`}
                fill
                sizes="280px"
                className="object-cover"
              />
            )}
          </div>

          <div className="self-end">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {certification && <span className="bg-accent px-2 py-0.5 font-semibold text-ink">{certification}</span>}
              {runtime && <span className="text-white/80">Duration: {runtime}</span>}
              {movie.status && movie.status !== "Released" && (
                <span className="border border-white/40 px-2 py-0.5 text-white/80">{movie.status}</span>
              )}
            </div>

            <h1 className="mt-4 font-display text-4xl leading-tight font-black text-balance sm:text-6xl">
              {movie.title}
            </h1>
            {movie.tagline && <p className="mt-2 text-lg text-white/70 italic">{movie.tagline}</p>}

            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm tracking-wide uppercase">
              <span className="inline-flex items-center gap-1 font-semibold text-accent">
                <StarIcon width={16} height={16} />
                {formatRating(movie.vote_average)}
                <span className="font-normal text-muted normal-case">
                  ({(movie.vote_count ?? 0).toLocaleString("en-US")} votes)
                </span>
              </span>
              {movie.release_date && <span>{releaseYear(movie.release_date)}</span>}
              <span>{movie.genres.map((g) => g.name).join(". ")}</span>
            </p>

            <p className="mt-5 max-w-3xl leading-relaxed text-white/85">{movie.overview}</p>

            {directors.length > 0 && (
              <p className="mt-4 text-sm text-muted">
                Directed by <span className="text-white">{directors.map((d) => d.name).join(", ")}</span>
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-4">
              {trailerKey && <TrailerButton trailerKey={trailerKey} title={movie.title} />}
              <AddToListButton movie={movie} />
            </div>
          </div>
        </div>
      </section>

      {cast.length > 0 && (
        <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-light">Top Cast</h2>
          <ul className="no-scrollbar mt-5 flex gap-5 overflow-x-auto pb-2">
            {cast.map((person) => (
              <li key={`${person.id}-${person.character}`} className="w-28 shrink-0 text-center">
                <div className="relative mx-auto size-24 overflow-hidden rounded-full bg-ink-soft">
                  {person.profile_path ? (
                    <Image
                      src={tmdbImage(person.profile_path, "w185")!}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="grid size-full place-items-center text-2xl text-muted">
                      {person.name.charAt(0)}
                    </span>
                  )}
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-medium">{person.name}</p>
                <p className="line-clamp-2 text-xs text-muted">{person.character}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <MovieRow
        eyebrow={`If you like ${movie.title}`}
        title="You Might Also Like"
        items={toBackdropItems(recommended, genres)}
      />
    </>
  );
}
