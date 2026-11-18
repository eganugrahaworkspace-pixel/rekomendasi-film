"use client";

import Link from "next/link";
import { useRef } from "react";
import BackdropCard, { type BackdropItem } from "./BackdropCard";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface Props {
  eyebrow: string;
  title: string;
  items: BackdropItem[];
  href?: string;
}

export default function MovieRow({ eyebrow, title, items, href }: Props) {
  const scroller = useRef<HTMLUListElement>(null);

  if (!items.length) return null;

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
      <div className="relative mb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase">{eyebrow}</p>
        <h2 className="mt-1 text-3xl font-light">{title}</h2>
        <div className="mt-4 flex items-center justify-center gap-2 md:absolute md:right-0 md:bottom-0 md:mt-0">
          {href && (
            <Link href={href} className="mr-2 text-sm text-brand hover:underline">
              See all
            </Link>
          )}
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Scroll ${title} left`}
            className="grid size-10 place-items-center rounded-full bg-white/5 text-sky-400 transition hover:bg-white/10"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Scroll ${title} right`}
            className="grid size-10 place-items-center rounded-full bg-white/5 text-sky-400 transition hover:bg-white/10"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <ul
        ref={scroller}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        {items.map((item) => (
          <li key={item.id} className="w-[70vw] shrink-0 snap-start sm:w-[40vw] lg:w-[calc((100%-5rem)/6)] lg:min-w-[180px]">
            <BackdropCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
