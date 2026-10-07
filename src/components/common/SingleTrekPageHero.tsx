'use client';

import { PinIcon } from '@/components/icons';
import { ROUTES } from '@/lib/constants';
import { RADIUS_CHIP } from '@/lib/theme';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { HeroHeading } from './HeroHeading';
import { ParallaxBackground } from './ParallaxBackground';

const CAT_LABEL: Record<string, string> = {
  trekking: 'Trekking',
  adventure: 'Adventure',
  religious: 'Pilgrimage',
  city: 'City & Culture',
  student: 'Student Tour',
  nightstay: 'Night Stay',
  helicopter: 'Helicopter',
  tours: 'Tours',
};

// ---- Tuning ---------------------------------------------------------------
const PIN_DISTANCE = 1.2; // extra scroll (in viewport heights) while pinned
const START_INSET_Y = 15; // % cropped from top & bottom of the center image at start
const START_INSET_X_DESKTOP = 38; // % cropped from left & right at start (bigger = narrower)
const START_INSET_X_MOBILE = 14;
const IMAGE_ZOOM = 0.1; // center image starts 10% zoomed in, settles to 1
const SIDE_EXIT = 0.5; // side images are fully gone by 50% of the scroll progress
// ---------------------------------------------------------------------------

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const CHIP_BASE = `inline-flex items-center gap-[7px] px-[13px] py-[7px] font-mono text-[11px] font-bold uppercase tracking-[0.1em]  [&_svg]:h-[13px] [&_svg]:w-[13px]`;

type TripHeroProps = {
  trip: {
    title: string;
    sub?: string;
    regionL?: string;
    region?: string;
    badge?: string;
    diff?: string;
    img: string;
    gallery?: string[];
  };
  pcat: string;
};

export function SingleTrekPageHero({ trip, pcat }: TripHeroProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null); // clipped window (center image)
  const bgRef = useRef<HTMLDivElement>(null); // the image inside the window
  const overlayRef = useRef<HTMLDivElement>(null); // dark overlay, fades in on scroll
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Two side images come from the gallery
  const leftImg = trip.gallery?.[1] ?? trip.gallery?.[0];
  const rightImg = trip.gallery?.[2] ?? trip.gallery?.[0];

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const frame = frameRef.current;
    const bg = bgRef.current;
    const overlay = overlayRef.current;
    if (!wrapper || !frame || !bg || !overlay) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const apply = (p: number) => {
      const e = easeOut(p);
      const startX = window.innerWidth < 768 ? START_INSET_X_MOBILE : START_INSET_X_DESKTOP;
      const insetX = startX * (1 - e);
      const insetY = START_INSET_Y * (1 - e);

      // Center image grows to full width/height
      frame.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`;
      bg.style.transform = `scale(${1 + IMAGE_ZOOM * (1 - e)})`;

      // Dark overlay: none at the start, full at the end
      overlay.style.opacity = String(e);

      // Side images slide out and fade
      const s = easeOut(Math.min(1, p / SIDE_EXIT));
      if (leftRef.current) {
        leftRef.current.style.transform = `translate3d(${-s * 100}%, 0, 0)`;
        leftRef.current.style.opacity = String(1 - s);
      }
      if (rightRef.current) {
        rightRef.current.style.transform = `translate3d(${s * 100}%, 0, 0)`;
        rightRef.current.style.opacity = String(1 - s);
      }
    };

    if (reduceMotion) {
      // No pinning or scroll-jacking: show the final state immediately
      wrapper.style.height = '100svh';
      apply(1);
      return;
    }

    let raf = 0;

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight; // distance the hero stays pinned
      if (scrollable <= 0) return;
      apply(Math.min(1, Math.max(0, -rect.top / scrollable)));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    // Outer: provides the scroll runway
    <section
      ref={wrapperRef}
      className="relative bg-black text-white"
      style={{ height: `${100 + PIN_DISTANCE * 100}svh` }}
    >
      {/* Inner: pinned viewport.
          NOTE: sticky breaks if any ancestor has overflow hidden/auto.
          Use overflow-x: clip on layout wrappers instead. */}
      <div className="sticky top-0 flex h-[100svh] items-end overflow-hidden">
        {/* Center image: a full-size layer clipped down to a portrait window */}
        <div
          ref={frameRef}
          className="absolute inset-0 z-[1] overflow-hidden"
          style={{
            clipPath: `inset(${START_INSET_Y}% ${START_INSET_X_DESKTOP}% ${START_INSET_Y}% ${START_INSET_X_DESKTOP}%)`,
          }}
        >
          <div ref={bgRef} className="absolute inset-0 bg-cover bg-center will-change-transform">
            <ParallaxBackground src={trip.img} />
          </div>

          {/* Overlay: starts fully transparent, fades in as the image grows */}
          <div ref={overlayRef} className="absolute inset-0" style={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.15)_35%,rgba(0,0,0,0.9)_100%)]" />
          </div>
        </div>

        {/* Left side image (bottom-left) */}
        {leftImg && (
          <div
            ref={leftRef}
            aria-hidden="true"
            className="absolute bottom-[6svh] left-[45px] z-[1] hidden h-[54svh] w-[20vw] will-change-transform md:block"
          >
            <img src={leftImg} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        {/* Right side image (top-right) */}
        {rightImg && (
          <div
            ref={rightRef}
            aria-hidden="true"
            className="absolute right-[45px] top-[10svh] z-[1] hidden h-[54svh] w-[20vw] will-change-transform md:block"
          >
            <img src={rightImg} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-[2] w-full pb-[clamp(34px,5vw,60px)] pt-[140px]">
          <div className="wrap flex flex-col items-center">
            <Link
              className={`${CHIP_BASE} ${RADIUS_CHIP} bg-transparent`}
              href={`${ROUTES.tours}?region=${trip.region}`}
            >
              <PinIcon /> {trip.regionL}
            </Link>
            <HeroHeading title={trip.title} subtitle={trip.sub} />

            {/* <div className="mt-[20px] flex flex-wrap gap-[10px]">
              <span className={`${CHIP_BASE} ${RADIUS_CHIP} bg-[var(--green-btn)] text-white`}>
                {trip.badge || 'Featured'}
              </span>

              <Link
                className={`${CHIP_BASE} ${RADIUS_CHIP} bg-[rgba(255,255,255,0.14)]`}
                href={`${ROUTES.tours}?cat=${pcat}`}
              >
                {CAT_LABEL[pcat] || 'Tours'}
              </Link>

              <span className={`${CHIP_BASE} ${RADIUS_CHIP} bg-[rgba(255,255,255,0.14)]`}>
                {trip.diff || 'Easy'}
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
