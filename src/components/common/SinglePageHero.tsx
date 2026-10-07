'use client';

import Image from 'next/image';
import { type ReactNode, useCallback, useEffect, useRef } from 'react';
import { HeroHeading } from './HeroHeading';

// ---- Tuning ---------------------------------------------------------------
const PIN_DISTANCE = 1.2; // scroll runway for the expansion, in viewport heights
const START_INSET_Y = 15;
const START_INSET_X_DESKTOP = 38;
const START_INSET_X_MOBILE = 14;
const IMAGE_ZOOM = 0.1;
const SIDE_EXIT = 0.5;
const COVER_FADE = 0.7; // how far (in vh) the children must rise before the hero is fully dimmed
// ---------------------------------------------------------------------------

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export type HeroMedia =
  { type: 'image'; src: string; alt?: string } | { type: 'video'; src: string; poster?: string };

type SinglePageHeroProps = {
  media: HeroMedia;
  title?: string;
  sub?: string;
  /** Optional bottom-left image (desktop only). */
  leftImage?: string;
  /** Optional top-right image (desktop only). */
  rightImage?: string;
  /** Rendered over the pinned hero, scrolling up once the hero has fully opened. */
  children?: ReactNode;
};

export function SinglePageHero({
  media,
  title,
  sub,
  leftImage,
  rightImage,
  children,
}: SinglePageHeroProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // The zoom target is a <video> or a <div> depending on media.type.
  const bgRef = useRef<HTMLElement | null>(null);
  const setBg = useCallback((el: HTMLElement | null) => {
    bgRef.current = el;
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const runway = runwayRef.current;
    const frame = frameRef.current;
    const bg = bgRef.current;
    const overlay = overlayRef.current;
    if (!wrapper || !runway || !frame || !bg || !overlay) return;

    const video = bg instanceof HTMLVideoElement ? bg : null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const apply = (p: number) => {
      const e = easeOut(p);
      const startX = window.innerWidth < 768 ? START_INSET_X_MOBILE : START_INSET_X_DESKTOP;
      const insetX = startX * (1 - e);
      const insetY = START_INSET_Y * (1 - e);

      frame.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`;
      bg.style.transform = `scale(${1 + IMAGE_ZOOM * (1 - e)})`;
      overlay.style.opacity = String(e);

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

    // As the children (form) rise over the hero: fade the heading, dim the image for legibility.
    const applyCover = () => {
      const cover = coverRef.current;
      if (!cover) return;
      const vh = window.innerHeight;
      const q = clamp01((vh - cover.getBoundingClientRect().top) / (vh * COVER_FADE));
      if (contentRef.current) contentRef.current.style.opacity = String(1 - q);
      if (dimRef.current) dimRef.current.style.opacity = String(q);
    };

    if (reduceMotion) {
      video?.pause(); // poster stays visible
      runway.style.height = '0px';
      apply(1);
      const onScrollRM = () => applyCover();
      applyCover();
      window.addEventListener('scroll', onScrollRM, { passive: true });
      return () => window.removeEventListener('scroll', onScrollRM);
    }

    let raf = 0;

    const update = () => {
      const scrollable = runway.offsetHeight;
      if (scrollable > 0) {
        apply(clamp01(-wrapper.getBoundingClientRect().top / scrollable));
      }
      applyCover();
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    // Stop decoding video once the hero is off-screen
    let io: IntersectionObserver | undefined;
    if (video) {
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
      io.observe(wrapper);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [media.type]);

  const initialScale = { transform: `scale(${1 + IMAGE_ZOOM})` };

  return (
    // Sticky below pins for the wrapper's whole height: runway + children.
    <section ref={wrapperRef} className="relative bg-black text-white">
      {/* sticky breaks if any ancestor has overflow hidden/auto. Use overflow-x: clip on layout wrappers. */}
      <div className="sticky top-0 z-0 flex h-[100svh] items-end overflow-hidden">
        {/* Center media */}
        <div
          ref={frameRef}
          className="absolute inset-0 z-[1] overflow-hidden"
          style={{
            clipPath: `inset(${START_INSET_Y}% ${START_INSET_X_DESKTOP}% ${START_INSET_Y}% ${START_INSET_X_DESKTOP}%)`,
          }}
        >
          {media.type === 'video' ? (
            <video
              ref={setBg}
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={initialScale}
              src={media.src}
              poster={media.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          ) : (
            <div
              ref={setBg}
              className="absolute inset-0 will-change-transform"
              style={initialScale}
            >
              <Image
                src={media.src}
                alt={media.alt ?? ''}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}

          <div ref={overlayRef} className="absolute inset-0" style={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.15)_35%,rgba(0,0,0,0.9)_100%)]" />
          </div>

          {/* Extra dim while the form covers the hero */}
          <div ref={dimRef} className="absolute inset-0 bg-black/45" style={{ opacity: 0 }} />
        </div>

        {/* Left side image (bottom-left) */}
        {leftImage && (
          <div
            ref={leftRef}
            aria-hidden="true"
            className="absolute bottom-[6svh] left-[45px] z-[1] hidden h-[54svh] w-[20vw] will-change-transform md:block"
          >
            <Image src={leftImage} alt="" fill sizes="20vw" className="object-cover" />
          </div>
        )}

        {/* Right side image (top-right) */}
        {rightImage && (
          <div
            ref={rightRef}
            aria-hidden="true"
            className="absolute right-[45px] top-[10svh] z-[1] hidden h-[54svh] w-[20vw] will-change-transform md:block"
          >
            <Image src={rightImage} alt="" fill sizes="20vw" className="object-cover" />
          </div>
        )}

        {/* Heading */}
        <div
          ref={contentRef}
          className="relative z-[2] w-full pb-[clamp(34px,5vw,60px)] pt-[140px]"
        >
          <div className="wrap flex flex-col items-center">
            <HeroHeading title={title} subtitle={sub} />
          </div>
        </div>
      </div>

      {/* Scroll runway: this is what drives the expansion while the hero stays pinned */}
      <div ref={runwayRef} aria-hidden style={{ height: `${PIN_DISTANCE * 100}svh` }} />

      {/* Covers the pinned hero once it is fully open */}
      {children && (
        <div ref={coverRef} className="relative z-10">
          {children}
        </div>
      )}
    </section>
  );
}
