import Image from "next/image";
import Link from "next/link";
import { formatRating, releaseYear, tmdbImage } from "@/lib/format";
import type { MovieSummary, SavedMovie } from "@/lib/types";
import { StarIcon } from "./icons";

type GridMovie = Pick<MovieSummary | SavedMovie, "id" | "title" | "poster_path" | "release_date" | "vote_average">;

export default function PosterGrid({ movies }: { movies: GridMovie[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {movies.map((movie) => (
        <li key={movie.id}>
          <Link href={`/movies/${movie.id}`} className="group block">
            <div className="relative aspect-[2/3] overflow-hidden bg-ink-soft">
              {movie.poster_path ? (
                <Image
                  src={tmdbImage(movie.poster_path, "w342")!}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 45vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="grid size-full place-items-center p-3 text-center text-sm text-muted">
                  No poster
                </div>
              )}
            </div>
            <h3 className="mt-2 line-clamp-2 font-medium group-hover:text-brand">{movie.title}</h3>
            <p className="flex items-center gap-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1 text-accent">
                <StarIcon width={12} height={12} />
                {formatRating(movie.vote_average)}
              </span>
              {releaseYear(movie.release_date)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
