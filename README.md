# RekoFilm — Movie Recommendations

A movie discovery app with a cinematic 3D coverflow, trailers, a personal watchlist and recommendations based on what you save.

**Live demo:** https://rekomendasi-film.vercel.app · **Portfolio:** https://ega-dev.vercel.app

## Features

- **3D coverflow hero** of this week's trending movies, with age rating, runtime, genres and a trailer modal. Works with keyboard arrows and swipe, and respects `prefers-reduced-motion`.
- **Recommendations**
  - *Recommended For You*: TMDB recommendations for the #1 trending movie.
  - *You Might Also Like* on every movie page, falling back to "similar" titles for niche movies.
  - *Picked For You*: personal picks based on your **My List**. Results from several saved movies are merged and ranked by how many of them recommend the same title.
- **My List**: saved in `localStorage` and synced across tabs through `useSyncExternalStore`.
- **Search and genre browsing**, plus Trending, Top Rated, Upcoming and Popular pages with pagination.
- Movie detail page with cast, director, trailer and Open Graph metadata.

## Tech stack

Next.js 16 (App Router, Server Components, ISR) · React 19 · TypeScript · Tailwind CSS 4 · TMDB API · Vercel

## Architecture decisions

| Decision | Why |
| --- | --- |
| TMDB is called **only on the server** (`src/lib/tmdb.ts` imports `server-only`) | The API credential never reaches the browser. The client-side personal recommendations go through our own Route Handler (`/api/recommendations`). |
| `fetch` with `next.revalidate = 3600` (ISR) | Pages come from Vercel's cache and refresh hourly, so we stay far below TMDB's rate limit. |
| One `append_to_response` request per movie | Details, trailer, cast, certification and recommendations arrive in a single API call instead of five. |
| Custom coverflow instead of a carousel library | Less JavaScript; the effect is just CSS 3D transforms. |
| `images.unoptimized` | TMDB already serves pre-sized images, so Vercel's image optimizer would only use up quota. |
| `frame-ancestors` CSP | Only the portfolio can embed the live preview. This prevents clickjacking. |

## Run locally

```bash
cp .env.example .env.local   # then fill in TMDB_ACCESS_TOKEN (or TMDB_API_KEY)
npm install
npm run dev
```

Get a free credential at https://www.themoviedb.org/settings/api. The "API Read Access Token" is recommended.

Checks: `npm run lint` · `npm run typecheck` · `npm run build`

## Deploy to Vercel

1. Import the GitHub repo at https://vercel.com/new. The framework preset is detected as Next.js.
2. Under **Environment Variables**, add `TMDB_ACCESS_TOKEN` for Production and Preview.
3. Deploy. To change the public URL, set `NEXT_PUBLIC_SITE_URL` so Open Graph links point to the right domain.

---

This product uses the TMDB API but is not endorsed or certified by TMDB.
