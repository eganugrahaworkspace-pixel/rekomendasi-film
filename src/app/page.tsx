import HeroCoverflow, { type HeroMovie } from "@/components/HeroCoverflow";
import MovieRow from "@/components/MovieRow";
import PersonalRecommendations from "@/components/PersonalRecommendations";
import SearchPanel from "@/components/SearchPanel";
import { GithubIcon, GlobeIcon } from "@/components/icons";
import {
  formatRuntime,
  genreNames,
  pickCertification,
  pickTrailer,
  toBackdropItems,
} from "@/lib/format";
import {
  getGenres,
  getMovieDetails,
  getMovieList,
  getRecommendations,
  getTrending,
} from "@/lib/tmdb";
import type { MovieSummary } from "@/lib/types";

// Rebuild the page in the background at most once an hour (ISR).
export const revalidate = 3600;

const HERO_COUNT = 7;

async function buildHero(movies: MovieSummary[], genres: Awaited<ReturnType<typeof getGenres>>) {
  // Details give us runtime, age rating and trailer. If one request fails we
  // still render the card with the data we already have.
  const details = await Promise.allSettled(movies.map((m) => getMovieDetails(m.id)));
  return movies.map((movie, i): HeroMovie => {
    const d = details[i].status === "fulfilled" ? details[i].value : null;
    return {
      ...movie,
      genres: d ? d.genres.slice(0, 4).map((g) => g.name) : genreNames(movie.genre_ids, genres, 4),
      runtime: formatRuntime(d?.runtime),
      certification: d ? pickCertification(d) : null,
      trailerKey: d ? pickTrailer(d.videos?.results) : null,
    };
  });
}

export default async function HomePage() {
  const [trending, genres, popular, topRated, upcoming] = await Promise.all([
    getTrending("week"),
    getGenres(),
    getMovieList("popular"),
    getMovieList("top_rated"),
    getMovieList("upcoming"),
  ]);

  const spotlight = trending[0];
  const [hero, because] = await Promise.all([
    buildHero(trending.slice(0, HERO_COUNT), genres),
    spotlight ? getRecommendations(spotlight.id).catch(() => []) : Promise.resolve([]),
  ]);

  return (
    <>
      <HeroCoverflow movies={hero} />

      <section className="mx-auto mt-12 grid max-w-7xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_minmax(0,36rem)_1fr]">
        <a
          href="https://github.com/eganugrahaworkspace-pixel/rekomendasi-film"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-3 pt-2 text-sm text-white/80 hover:text-white lg:flex"
        >
          <span className="grid size-9 place-items-center rounded-full bg-white/10">
            <GithubIcon width={18} height={18} />
          </span>
          <span>
            See how it&apos;s <span className="text-brand">built</span>
            <br />
            open source on GitHub
          </span>
        </a>

        <SearchPanel genres={genres} />

        <a
          href="https://ega-dev.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center justify-end gap-3 pt-2 text-right text-sm text-white/80 hover:text-white lg:flex"
        >
          <span>
            Made by <span className="text-brand">Ega Nugraha</span>
            <br />
            visit the portfolio
          </span>
          <span className="grid size-9 place-items-center rounded-full bg-white/10">
            <GlobeIcon width={18} height={18} />
          </span>
        </a>
      </section>

      <PersonalRecommendations />

      {spotlight && (
        <MovieRow
          eyebrow={`Because ${spotlight.title} is trending`}
          title="Recommended For You"
          items={toBackdropItems(because, genres)}
          href={`/movies/${spotlight.id}`}
        />
      )}
      <MovieRow
        eyebrow={`Total ${trending.length} this week`}
        title="Trending Now"
        items={toBackdropItems(trending.slice(HERO_COUNT), genres)}
        href="/browse/trending"
      />
      <MovieRow
        eyebrow="Critically acclaimed"
        title="Top Rated"
        items={toBackdropItems(topRated.results, genres)}
        href="/browse/top-rated"
      />
      <MovieRow
        eyebrow="Coming soon"
        title="Upcoming"
        items={toBackdropItems(upcoming.results, genres)}
        href="/browse/upcoming"
      />
      <MovieRow
        eyebrow="What everyone is watching"
        title="Popular"
        items={toBackdropItems(popular.results, genres)}
        href="/browse/popular"
      />
    </>
  );
}
