import { NextResponse, type NextRequest } from "next/server";
import { toBackdropItems } from "@/lib/format";
import { getGenres, getRecommendations } from "@/lib/tmdb";
import type { MovieSummary } from "@/lib/types";

const MAX_SEEDS = 5;
const MAX_RESULTS = 20;

/**
 * GET /api/recommendations?ids=603,550
 *
 * Merges TMDB recommendations for several "seed" movies (the user's list).
 * Movies recommended by more seeds rank higher. Runs on the server, so the
 * TMDB credential stays private while the browser still gets personal picks.
 */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("ids") ?? "";
  const ids = [...new Set(raw.split(","))]
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, MAX_SEEDS);

  if (!ids.length) {
    return NextResponse.json({ error: "Provide ?ids=<comma separated TMDB movie ids>" }, { status: 400 });
  }

  try {
    const [genres, ...lists] = await Promise.all([
      getGenres(),
      ...ids.map((id) => getRecommendations(id).catch(() => [] as MovieSummary[])),
    ]);

    const seen = new Set(ids);
    const scored = new Map<number, { movie: MovieSummary; hits: number }>();
    for (const list of lists) {
      for (const movie of list) {
        if (seen.has(movie.id)) continue;
        const entry = scored.get(movie.id);
        if (entry) entry.hits += 1;
        else scored.set(movie.id, { movie, hits: 1 });
      }
    }

    const ranked = [...scored.values()]
      .sort((a, b) => b.hits - a.hits || b.movie.vote_average - a.movie.vote_average)
      .slice(0, MAX_RESULTS)
      .map((e) => e.movie);

    return NextResponse.json(
      { items: toBackdropItems(ranked, genres) },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch (error) {
    console.error("[api/recommendations]", error);
    return NextResponse.json({ error: "Could not load recommendations" }, { status: 502 });
  }
}
