"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs font-semibold tracking-[0.15em] text-brand uppercase">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-light">We couldn&apos;t load the movies right now.</h1>
      <p className="mt-3 text-muted">The movie database may be busy. Please try again in a moment.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 bg-brand px-6 py-3 text-sm font-semibold tracking-wider uppercase hover:bg-brand-hover"
      >
        Try again
      </button>
    </div>
  );
}
