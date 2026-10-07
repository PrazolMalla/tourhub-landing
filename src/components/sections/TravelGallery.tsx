'use client';

import gsap from 'gsap';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import { ImageSlot } from '@/components/common/ImageSlot';
import { ArrowUpRight } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

interface GalleryImage {
  src: string;
  alt: string;
}

interface TravelGalleryProps {
  images: GalleryImage[];
  eyebrow?: string;
  title?: string;
  align?: 'left' | 'center' | 'right';
}

/** An image plus its position in the ORIGINAL `images` array (used by the lightbox). */
interface TrackItem {
  image: GalleryImage;
  imageIndex: number;
}

/*
 * Speed is defined in px/second, not "seconds per loop".
 * Duration is derived from the measured track width, so 5 images
 * and 50 images move at the same visual speed.
 */
const SPEED_ROW_ONE = 40; // px/s, moves left
const SPEED_ROW_TWO = 28; // px/s, moves right

/*
 * Each half of a track must be wider than the viewport, otherwise
 * you see blank space at the edge. Widest card is ~500px, so 10 cards
 * comfortably covers ultra-wide screens.
 */
const MIN_CARDS_PER_HALF = 10;

/**
 * Repeat the row's items enough times to overfill the screen, then
 * duplicate that half so translating by -50% loops seamlessly.
 * Both halves are identical, so the seam is invisible.
 */
function buildTrack(items: TrackItem[]): TrackItem[] {
  if (items.length === 0) return [];

  const repeats = Math.ceil(MIN_CARDS_PER_HALF / items.length);
  const half = Array.from({ length: repeats }, () => items).flat();

  return [...half, ...half];
}

export default function TravelGallery({
  images,
  eyebrow = 'Glimpse',
  title = 'Travel in motion',
  align = 'left',
}: TravelGalleryProps) {
  const [index, setIndex] = useState(-1);

  const rowOneRef = useRef<HTMLDivElement>(null);
  const rowTwoRef = useRef<HTMLDivElement>(null);

  /*
   * Split images between the two rows, remembering each image's
   * original index so the lightbox opens the right slide even if
   * two images share the same src.
   */
  const rowOne = useMemo<TrackItem[]>(
    () => images.map((image, imageIndex) => ({ image, imageIndex })).filter((_, i) => i % 2 === 0),
    [images],
  );

  const rowTwo = useMemo<TrackItem[]>(
    () => images.map((image, imageIndex) => ({ image, imageIndex })).filter((_, i) => i % 2 !== 0),
    [images],
  );

  const trackOne = useMemo(() => buildTrack(rowOne), [rowOne]);
  const trackTwo = useMemo(() => buildTrack(rowTwo), [rowTwo]);

  useLayoutEffect(() => {
    const row1 = rowOneRef.current;
    const row2 = rowTwoRef.current;
    if (!row1 || !row2) return;

    // Endless motion is an accessibility problem for some people.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let ctx: gsap.Context | undefined;

    const build = () => {
      ctx?.revert();

      ctx = gsap.context(() => {
        const cleanups: Array<() => void> = [];

        const makeMarquee = (el: HTMLDivElement, speed: number, reverse: boolean) => {
          // Real pixel width of ONE half of the track.
          const distance = el.scrollWidth / 2;
          if (distance <= 0) return;

          const tween = gsap.fromTo(
            el,
            { xPercent: reverse ? -50 : 0 },
            {
              xPercent: reverse ? 0 : -50,
              duration: distance / speed, // constant px/s
              repeat: -1,
              ease: 'none',
            },
          );

          // Mouse only: on touch, pointerenter fires on tap and
          // would leave the row stuck paused.
          const pause = (e: PointerEvent) => {
            if (e.pointerType === 'mouse') tween.pause();
          };
          const play = (e: PointerEvent) => {
            if (e.pointerType === 'mouse') tween.play();
          };

          el.addEventListener('pointerenter', pause);
          el.addEventListener('pointerleave', play);

          cleanups.push(() => {
            el.removeEventListener('pointerenter', pause);
            el.removeEventListener('pointerleave', play);
          });
        };

        makeMarquee(row1, SPEED_ROW_ONE, false);
        makeMarquee(row2, SPEED_ROW_TWO, true);

        return () => cleanups.forEach((fn) => fn());
      });
    };

    build();

    // Card widths change at the md breakpoint, so re-measure on resize.
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    });
    ro.observe(row1.parentElement as HTMLElement);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, [trackOne, trackTwo]);

  const slides = useMemo(
    () =>
      images.map((image) => ({
        src: image.src,
        alt: image.alt,
      })),
    [images],
  );

  if (images.length === 0) return null;

  return (
    <>
      <section className="overflow-hidden bg-paper py-4">
        {/* Heading */}
        <div className="wrap">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeader eyebrow={eyebrow} title={title} align={align} />
          </div>
        </div>

        {/* Gallery */}
        <div className="space-y-3 md:space-y-4">
          {/* ROW 1 */}
          <div className="w-full overflow-hidden">
            <div ref={rowOneRef} className="flex w-max gap-3 will-change-transform md:gap-4">
              {trackOne.map((item, i) => (
                <GalleryCard
                  key={`row-1-${i}`}
                  image={item.image}
                  // Stable width slot: position within the ORIGINAL row,
                  // so both halves render identical widths.
                  slot={i % rowOne.length}
                  // Second half is a visual clone only.
                  isClone={i >= trackOne.length / 2}
                  onClick={() => setIndex(item.imageIndex)}
                />
              ))}
            </div>
          </div>

          {/* ROW 2 */}
          <div className="w-full overflow-hidden">
            <div ref={rowTwoRef} className="flex w-max gap-3 will-change-transform md:gap-4">
              {trackTwo.map((item, i) => (
                <GalleryCard
                  key={`row-2-${i}`}
                  image={item.image}
                  slot={(i % rowTwo.length) + 1}
                  isClone={i >= trackTwo.length / 2}
                  onClick={() => setIndex(item.imageIndex)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        on={{
          view: ({ index: currentIndex }) => setIndex(currentIndex),
        }}
        carousel={{
          imageFit: 'contain',
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
        className="gallery-lightbox"
      />
    </>
  );
}

interface GalleryCardProps {
  image: GalleryImage;
  slot: number;
  isClone: boolean;
  onClick: () => void;
}

/*
 * Different widths stop the gallery from looking
 * like a generic card carousel.
 */
const CARD_WIDTHS = [
  'w-[300px] md:w-[430px]',
  'w-[230px] md:w-[320px]',
  'w-[340px] md:w-[500px]',
  'w-[260px] md:w-[360px]',
];

function GalleryCard({ image, slot, isClone, onClick }: GalleryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      // Cloned cards are decorative: hide from screen readers and
      // keep them out of the tab order so keyboard users see each
      // photo once.
      aria-hidden={isClone || undefined}
      tabIndex={isClone ? -1 : 0}
      aria-label={isClone ? undefined : `View larger: ${image.alt}`}
      className={`group relative h-[210px] shrink-0 cursor-zoom-in overflow-hidden md:h-[290px] ${
        CARD_WIDTHS[slot % CARD_WIDTHS.length]
      }`}
    >
      <ImageSlot
        src={image.src}
        alt={image.alt}
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover

          transition-transform
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover:scale-[1.04]
        "
        sizes="(max-width: 768px) 80vw, 500px"
      />

      {/* cinematic overlay */}
      <div
        className="
          absolute
          inset-0
          bg-black/[0.08]

          transition-colors
          duration-500

          group-hover:bg-black/[0.02]
        "
      />

      {/* Hover icon */}
      <div
        className="
          absolute
          left-1/2
          top-1/2

          flex
          h-12
          w-12
          -translate-x-1/2
          -translate-y-1/2
          scale-75
          items-center
          justify-center

          rounded-full

          bg-white/90
          text-[17px]
          text-black

          opacity-0
          backdrop-blur-md

          transition-all
          duration-300

          group-hover:scale-100
          group-hover:opacity-100
        "
      >
        <ArrowUpRight strokeWidth={1} />
      </div>
    </button>
  );
}
