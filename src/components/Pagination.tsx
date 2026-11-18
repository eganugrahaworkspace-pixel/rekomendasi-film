import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface Props {
  page: number;
  totalPages: number;
  basePath: string;
  /** Extra query params to keep (e.g. the search query). */
  query?: Record<string, string>;
}

export default function Pagination({ page, totalPages, basePath, query = {} }: Props) {
  if (totalPages <= 1) return null;

  const href = (p: number) => `${basePath}?${new URLSearchParams({ ...query, page: String(p) })}`;
  const linkClass =
    "inline-flex items-center gap-1 border border-white/30 px-4 py-2 text-sm tracking-wider uppercase hover:border-white";

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={href(page - 1)} className={linkClass} rel="prev">
          <ChevronLeftIcon width={16} height={16} /> Prev
        </Link>
      ) : (
        <span className={`${linkClass} pointer-events-none opacity-30`}>
          <ChevronLeftIcon width={16} height={16} /> Prev
        </span>
      )}
      <span className="text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={linkClass} rel="next">
          Next <ChevronRightIcon width={16} height={16} />
        </Link>
      ) : (
        <span className={`${linkClass} pointer-events-none opacity-30`}>
          Next <ChevronRightIcon width={16} height={16} />
        </span>
      )}
    </nav>
  );
}
