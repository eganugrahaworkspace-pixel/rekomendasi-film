"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMyList } from "@/lib/my-list";
import { BookmarkIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/browse/trending", label: "Trending" },
  { href: "/browse/top-rated", label: "Top Rated" },
  { href: "/browse/upcoming", label: "Upcoming" },
  { href: "/my-list", label: "My List" },
];

export default function Header() {
  const pathname = usePathname();
  const myList = useMyList();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="leading-none" onClick={() => setOpen(false)}>
          <span className="block text-2xl font-extrabold tracking-tight text-brand">REKOFILM</span>
          <span className="block text-[10px] tracking-[0.2em] text-white/70 uppercase">
            Movie Recommendations
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[13px] font-medium tracking-wider uppercase">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative py-2 transition-colors ${
                    isActive(item.href) ? "text-brand" : "text-white/85 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-brand" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search movies"
            className="grid size-10 place-items-center rounded-full text-white/90 hover:bg-white/10"
          >
            <SearchIcon width={22} height={22} />
          </Link>
          <Link
            href="/my-list"
            aria-label={`My list, ${myList.length} movies`}
            className="relative grid size-10 place-items-center rounded-full text-white/90 hover:bg-white/10"
          >
            <BookmarkIcon width={20} height={20} />
            {myList.length > 0 && (
              <span className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] leading-4 font-semibold">
                {myList.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-white/90 hover:bg-white/10 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line md:hidden">
          <ul className="px-4 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block py-3 text-sm font-medium tracking-wider uppercase ${
                    isActive(item.href) ? "text-brand" : "text-white/85"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
