'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ImageSlot } from './ImageSlot';

const MAX_SLIDES = 2; // only the first two gallery images are ever used
const SLIDE_DELAY_MS = 450; // gives the 2nd image a head start to load

interface TripGalleryProps {
  images: string[];
  alt: string;
  priority?: boolean;
  children?: ReactNode; // overlays (badge, fav button)
}

export function TripGallery({ images, alt, priority, children }: TripGalleryProps) {
  const slides = images.slice(0, MAX_SLIDES);
  const count = slides.length;

  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  // 2nd image is mounted only after the first hover, so cards that are
  // never hovered don't download it.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Hover anywhere on the card (the ancestor with `group`), not just the image.
    const host = root.closest<HTMLElement>('.group') ?? root;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return; // touch fires enter on tap and sticks
      setArmed(true);
      if (count < 2) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      clearTimeout(timer);
      timer = setTimeout(() => setIndex(1), SLIDE_DELAY_MS);
    };

    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(timer);
      setIndex(0);
    };

    host.addEventListener('pointerenter', onEnter);
    host.addEventListener('pointerleave', onLeave);
    return () => {
      clearTimeout(timer);
      host.removeEventListener('pointerenter', onEnter);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [count]);

  return (
    <div
      ref={rootRef}
      className="relative aspect-[1.6] w-full overflow-hidden rounded-[14px] bg-transparent"
    >
      <div
        className="flex h-full w-full transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((src, i) =>
          i === 0 || armed ? (
            // overflow-hidden per slide so the zoomed image can't bleed into its neighbour
            <div key={src} className="relative h-full w-full shrink-0 overflow-hidden">
              <ImageSlot
                src={src}
                alt={i === 0 ? alt : `${alt} – photo ${i + 1}`}
                priority={i === 0 ? priority : false}
                sizes="(max-width: 620px) 78vw, 290px"
                className="
                  absolute inset-0
                  [--slot-bg:#e7e1d5]
                  transition-transform duration-700 ease-out
                  motion-reduce:transition-none
                  group-hover:scale-[1.03]
                "
              />
            </div>
          ) : (
            <div key={src} className="h-full w-full shrink-0" />
          ),
        )}
      </div>

      {count > 1 && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-2.5 z-10 flex justify-center gap-1.5"
        >
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] transition-all duration-300 ${
                i === index ? 'w-4 opacity-100' : 'w-1.5 opacity-60'
              }`}
            />
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
