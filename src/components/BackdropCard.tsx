import Image from "next/image";
import Link from "next/link";
import { formatRating, tmdbImage } from "@/lib/format";
import { StarIcon } from "./icons";

export interface BackdropItem {
  id: number;
  title: string;
  backdrop_path: string | null;
  subtitle: string;
  vote_average: number;
}

/** Landscape card used in the horizontal rows (the "Continue Watching" style). */
export default function BackdropCard({ item }: { item: BackdropItem }) {
  const score = Math.min(100, Math.max(0, item.vote_average * 10));
  return (
    <Link href={`/movies/${item.id}`} className="group block w-full">
      <div className="relative aspect-video overflow-hidden bg-ink-soft">
        {item.backdrop_path && (
          <Image
            src={tmdbImage(item.backdrop_path, "w780")!}
            alt=""
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 40vw, 70vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-black/70 px-1.5 py-0.5 text-xs font-medium text-accent">
          <StarIcon width={12} height={12} />
          {formatRating(item.vote_average)}
        </span>
        {/* Rating meter, styled like the progress bar in the reference design */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
          <div className="h-full bg-brand" style={{ width: `${score}%` }} />
        </div>
      </div>
      <h3 className="mt-3 truncate text-lg font-medium group-hover:text-brand">{item.title}</h3>
      <p className="truncate text-sm text-muted">{item.subtitle}</p>
    </Link>
  );
}
