import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-7xl font-black text-brand">404</p>
      <h1 className="mt-4 text-3xl font-light">This movie isn&apos;t in our catalogue.</h1>
      <Link
        href="/"
        className="mt-8 inline-block bg-brand px-6 py-3 text-sm font-semibold tracking-wider uppercase hover:bg-brand-hover"
      >
        Back to home
      </Link>
    </div>
  );
}
