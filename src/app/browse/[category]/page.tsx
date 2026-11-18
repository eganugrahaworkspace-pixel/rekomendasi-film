import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import PosterGrid from "@/components/PosterGrid";
import { getMovieList, getTrending } from "@/lib/tmdb";

export const revalidate = 3600;

const CATEGORIES = {
  trending: { title: "Trending This Week", list: null },
  popular: { title: "Popular", list: "popular" },
  "top-rated": { title: "Top Rated", list: "top_rated" },
  upcoming: { title: "Upcoming", list: "upcoming" },
} as const;

type Category = keyof typeof CATEGORIES;
type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

const isCategory = (value: string): value is Category => value in CATEGORIES;

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: isCategory(category) ? CATEGORIES[category].title : "Browse" };
}

export default async function BrowsePage({ params, searchParams }: Props) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const config = CATEGORIES[category];
  // TMDB caps list pagination at 500 pages.
  const page = Math.min(500, Math.max(1, Number((await searchParams).page) || 1));

  const data = config.list
    ? await getMovieList(config.list, page)
    : { results: await getTrending("week"), total_pages: 1 };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
      <p className="text-xs font-semibold tracking-[0.15em] uppercase">Browse</p>
      <h1 className="mt-1 mb-8 text-4xl font-light">{config.title}</h1>
      <PosterGrid movies={data.results} />
      <Pagination page={page} totalPages={Math.min(500, data.total_pages)} basePath={`/browse/${category}`} />
    </div>
  );
}
