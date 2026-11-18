import type { NextConfig } from "next";

// Sites allowed to show this app inside an <iframe> (the portfolio's live
// preview). Everyone else is blocked to prevent clickjacking.
const FRAME_ANCESTORS = ["'self'", "https://ega-dev.vercel.app"].join(" ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // TMDB already serves pre-sized images (w342, w780, w1280...), so we skip
    // Vercel's image optimizer and stay well inside the Hobby plan quota.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: `frame-ancestors ${FRAME_ANCESTORS}` },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
