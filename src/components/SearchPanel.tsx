import Link from "next/link";
import type { Genre } from "@/lib/types";

interface Props {
  genres: Genre[];
  defaultQuery?: string;
  activeGenre?: number;
}

/**
 * Plain GET form. It works without JavaScript and keeps the search in the URL,
 * so results can be shared and bookmarked.
 */
export default function SearchPanel({ genres, defaultQuery = "", activeGenre }: Props) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <form action="/search" role="search" className="flex border border-white/40 focus-within:border-white">
        <label htmlFor="q" className="sr-only">
          Search movies by title
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder="SEARCH BY NAME OR GENRES"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-5 py-3.5 text-sm tracking-[0.15em] placeholder:text-white/80 focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 text-sm font-medium tracking-[0.15em] text-brand uppercase hover:text-brand-hover"
        >
          Search
        </button>
      </form>
      <ul className="mt-3 flex flex-wrap gap-x-1.5 gap-y-1 text-sm tracking-wider text-muted">
        {genres.map((g, i) => (
          <li key={g.id}>
            <Link
              href={`/search?genre=${g.id}`}
              aria-current={activeGenre === g.id ? "true" : undefined}
              className={activeGenre === g.id ? "text-brand" : "hover:text-white"}
            >
              {g.name}
            </Link>
            {i < genres.length - 1 && <span aria-hidden>,</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
