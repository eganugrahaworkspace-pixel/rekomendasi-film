import { GithubIcon, GlobeIcon, LinkedinIcon } from "./icons";

const LINKS = [
  { href: "https://ega-dev.vercel.app", label: "Portfolio", Icon: GlobeIcon },
  { href: "https://github.com/megan0088/rekomendasi-film", label: "Source code on GitHub", Icon: GithubIcon },
  { href: "https://linkedin.com/in/ega-nugraha", label: "LinkedIn", Icon: LinkedinIcon },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-white/70">
          <p>
            Built by{" "}
            <a href="https://ega-dev.vercel.app" className="text-brand hover:underline">
              Ega Nugraha
            </a>{" "}
            · Next.js, TypeScript &amp; Tailwind CSS
          </p>
          <p className="mt-1 text-xs text-muted">
            Movie data and images by{" "}
            <a href="https://www.themoviedb.org" className="underline hover:text-white">
              TMDB
            </a>
            . This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm text-white/70 md:text-right">follow the developer</p>
          <ul className="flex gap-3 md:justify-end">
            {LINKS.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon width={18} height={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
