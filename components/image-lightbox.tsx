"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type ImageLightboxProps = {
  src: string;
  alt: string;
  triggerLabel: string;
  className: string;
  width: number;
  height: number;
};

export function ImageLightbox({
  src,
  alt,
  triggerLabel,
  className,
  width,
  height,
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  return (
    <>
      <button
        className={className}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={triggerLabel}
      >
        <Image src={src} alt={alt} width={width} height={height} unoptimized />
        <span>{triggerLabel}</span>
      </button>
      {open && (
        <dialog
          ref={dialogRef}
          className="image-lightbox"
          aria-label={alt}
          onClose={() => setOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) event.currentTarget.close();
          }}
        >
          <button
            className="image-lightbox__close"
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Tutup imej"
          >
            Tutup
          </button>
          <Image src={src} alt={alt} width={width} height={height} unoptimized />
        </dialog>
      )}
    </>
  );
}
