import type { Metadata, Viewport } from "next";
import "@fontsource-variable/jost";
import "@fontsource/playfair-display/900.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rekomendasi-film.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RekoFilm — Movie Recommendations",
    template: "%s · RekoFilm",
  },
  description:
    "Discover trending movies, watch trailers, save a personal list and get recommendations based on what you like. Built with Next.js and the TMDB API.",
  openGraph: {
    type: "website",
    siteName: "RekoFilm",
    title: "RekoFilm — Movie Recommendations",
    description: "Trending movies, trailers and personal recommendations.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0e12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
