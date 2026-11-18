"use client";

import { useRef, useState } from "react";
import { CloseIcon, PlayIcon } from "./icons";

interface Props {
  trailerKey: string;
  title: string;
  className?: string;
}

/**
 * Opens the YouTube trailer in a native <dialog>. The browser handles focus
 * trapping and the Escape key for us. The iframe only mounts while the
 * dialog is open, so no YouTube script loads until the user asks for it.
 */
export default function TrailerButton({ trailerKey, title, className = "" }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    setOpen(true);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={show}
        className={`inline-flex items-center justify-center gap-2 bg-brand px-6 py-3 text-sm font-semibold tracking-wider uppercase transition-colors hover:bg-brand-hover ${className}`}
      >
        <PlayIcon width={16} height={16} />
        Watch Trailer
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialogRef.current && close()}
        aria-label={`${title} trailer`}
        className="m-auto w-[min(1000px,94vw)] bg-transparent p-0 backdrop:bg-black/85"
      >
        <div className="mb-2 flex items-center justify-between text-white">
          <p className="truncate font-medium">{title}</p>
          <button
            type="button"
            onClick={close}
            aria-label="Close trailer"
            className="grid size-9 place-items-center rounded-full hover:bg-white/10"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden bg-black">
          {open && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title={`${title} trailer`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="size-full border-0"
            />
          )}
        </div>
      </dialog>
    </>
  );
}
