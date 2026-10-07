'use client';

import { ImageSlot } from '@/components/common/ImageSlot';
import { ChevronLeftIcon, ChevronRightIcon, PinIcon } from '@/components/icons';
import { ROUTES } from '@/lib/constants';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from 'react';

if (typeof window !== 'undefined') gsap.registerPlugin(Draggable);

// Avoids the SSR warning while still positioning cards before first paint on the client.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type Cat = { name: string; meta: string; img: string; filterKey?: string };
type Destination = { word: string; description: string; cats: Cat[]; regionKey?: string };

const DEFAULT_EYEBROW = 'For every kind of traveller';

// ⬇️ Paste your existing data here, unchanged.
const DEFAULT_DESTINATIONS: Destination[] = [/* ...your existing data... */];

const ROTATE_MS = 2000;
const INTERACTION_PAUSE_MS = 8000;

const DESKTOP_MQ = '(min-width: 621px)';
const MOBILE_MQ = '(max-width: 620px)';
const STEP = 235; // px between card centers on desktop
const SLIDE_EASE = 'power3.out';

const slideDuration = (base = 0.8) =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 0.01
    : base;

// Module-level so React Compiler doesn't treat Date.now() as a call made during render.
// It only ever runs from event handlers and effects.
const stamp = (ref: MutableRefObject<number>) => {
  ref.current = Date.now();
};

const CATEGORY_KEYS: Array<[RegExp, string]> = [
  [/student|group/i, 'group'],
  [/trek|hiking|rainforest/i, 'trekking'],
  [/adventure|surf|diving|snorkel|rafting|safari|dune/i, 'adventure'],
  [/temple|religious|pilgrimage/i, 'religious'],
  [/helicopter|heli|luxury/i, 'helicopter'],
  [/city|cultur|heritage|architecture/i, 'city'],
  [/night|stay|getaway|beach|island/i, 'nightstay'],
];

const slugKey = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function templateHref(destination: Destination, category: Cat): string {
  const categoryKey =
    category.filterKey ??
    CATEGORY_KEYS.find(([pattern]) => pattern.test(category.name))?.[1] ??
    'tours';
  const params = new URLSearchParams({ cat: categoryKey, country: slugKey(destination.word) });
  return `${ROUTES.explore}?${params.toString()}#trip-types`;
}

interface CategoriesProps {
  eyebrow?: string;
  destinations?: Destination[];
}

/** "Experience <destination> Your Way" — word-flick + GSAP category carousel. */
export function Categories({
  eyebrow = DEFAULT_EYEBROW,
  destinations = DEFAULT_DESTINATIONS,
}: CategoriesProps) {
  const [destIndex, setDestIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const paused = useRef(false);
  const lastInteraction = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carousel = useRef<{ goTo: (index: number) => void } | null>(null);
  const didDrag = useRef(false);
  const activeRef = useRef(0);

  // Keep the mirror in sync after render. Must stay ABOVE the GSAP setup effect:
  // layout effects run in declaration order and the setup reads this ref.
  useIsoLayoutEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  // Preload every destination's images once, up front.
  useEffect(() => {
    destinations.forEach((d) =>
      d.cats.forEach((c) => {
        const img = new window.Image();
        img.src = c.img;
      }),
    );
  }, [destinations]);

  // Rotate destinations, but never while the user is hovering or has just interacted.
  useEffect(() => {
    const id = setInterval(() => {
      if (paused.current) return;
      if (Date.now() - lastInteraction.current < INTERACTION_PAUSE_MS) return;
      setDestIndex((i) => (i + 1) % destinations.length);
      setActiveIndex(0);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [destinations.length]);

  const dest = destinations[destIndex];
  const total = dest.cats.length;

  const select = (index: number) => {
    stamp(lastInteraction);
    setActiveIndex(index);
  };
  const previous = () => select((activeIndex - 1 + total) % total);
  const next = () => select((activeIndex + 1) % total);

  // ── GSAP: one setup per destination (the stage remounts via `key`) ──────────────
  useIsoLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = gsap.utils.toArray<HTMLElement>(track.children);
    const count = cards.length;
    const mm = gsap.matchMedia();

    // Desktop: overlapping coverflow. A single float `pos` drives every card,
    // so jumping several cards at once is still one smooth tween.
    mm.add(DESKTOP_MQ, () => {
      const wrap = gsap.utils.wrap(-count / 2, count / 2);
      const state = { pos: activeRef.current };

      const render = () => {
        cards.forEach((el, i) => {
          const off = wrap(i - state.pos);
          const d = Math.abs(off);
          gsap.set(el, {
            xPercent: -50,
            yPercent: -50,
            x: off * STEP,
            y: d <= 1 ? -14 + 22 * d : 8,
            scale: d <= 1 ? 1.08 - 0.12 * d : d <= 2 ? 0.96 - 0.06 * (d - 1) : 0.9,
            opacity: d <= 2 ? 1 : Math.max(0, 3 - d),
            zIndex: d < 0.5 ? 30 : d < 1.5 ? 20 : 10,
            pointerEvents: d >= 2.5 ? 'none' : 'auto',
          });
        });
      };

      render();

      carousel.current = {
        goTo: (index) => {
          gsap.to(state, {
            pos: state.pos + wrap(index - state.pos), // shortest way around
            duration: slideDuration(),
            ease: SLIDE_EASE,
            overwrite: true,
            onUpdate: render,
          });
        },
      };

      return () => {
        gsap.killTweensOf(state);
        gsap.set(cards, { clearProps: 'transform,opacity,zIndex,pointerEvents' });
      };
    });

    // Mobile: a normal horizontal row (no overlap) that you drag; snaps to the nearest card.
    mm.add(MOBILE_MQ, () => {
      let step = 0;
      let snapped = activeRef.current;

      const measure = () => {
        step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
      };

      const progress = () => {
        const pos = -(gsap.getProperty(track, 'x') as number) / step;
        cards.forEach((el, i) => {
          const d = Math.min(Math.abs(i - pos), 1);
          gsap.set(el, { scale: 1 - 0.08 * d, opacity: 1 - 0.25 * d });
        });
      };

      const slideTo = (index: number, base = 0.8) => {
        gsap.to(track, {
          x: -index * step,
          duration: slideDuration(base),
          ease: SLIDE_EASE,
          overwrite: true,
          onUpdate: progress,
          onComplete: () => drag.update(),
        });
      };

      measure();
      gsap.set(track, { x: -snapped * step });
      progress();

      const [drag] = Draggable.create(track, {
        type: 'x',
        lockAxis: true,
        edgeResistance: 0.85,
        bounds: { minX: -(count - 1) * step, maxX: 0 },
        onPress: () => {
          didDrag.current = false;
          stamp(lastInteraction);
        },
        onDrag: () => {
          didDrag.current = true;
          stamp(lastInteraction);
          progress();
        },
        onDragEnd: () => {
          // Project the release point slightly so a quick flick advances a card.
          const projected = drag.x + drag.deltaX * 6;
          const index = gsap.utils.clamp(0, count - 1, Math.round(-projected / step));
          snapped = index;
          slideTo(index, 0.6);
          setActiveIndex(index);
        },
      });

      carousel.current = {
        goTo: (index) => {
          if (index === snapped) return; // drag-end already handled it
          snapped = index;
          slideTo(index);
        },
      };

      const onResize = () => {
        measure();
        drag.applyBounds({ minX: -(count - 1) * step, maxX: 0 });
        gsap.set(track, { x: -snapped * step });
        drag.update();
        progress();
      };
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
        gsap.killTweensOf(track);
        drag.kill();
        gsap.set([track, ...cards], { clearProps: 'transform,opacity' });
      };
    });

    return () => {
      mm.revert();
      carousel.current = null;
    };
  }, [destIndex, destinations]);

  // Arrows, card clicks, and drag-end all funnel through activeIndex → same tween.
  useEffect(() => {
    carousel.current?.goTo(activeIndex);
  }, [activeIndex]);

  return (
    <section className="section relative isolate overflow-hidden bg-paper">
      <style jsx>{`
        @keyframes flickIn {
          0% {
            opacity: 0;
            transform: translateY(14px) rotateX(35deg);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .flick-word {
          display: inline-block;
          animation: flickIn 0.5s cubic-bezier(0.2, 0.7, 0.3, 1);
          transform-origin: 50% 100%;
        }
        .carousel-fade {
          animation: fadeIn 0.5s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .flick-word,
          .carousel-fade {
            animation: none;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 select-none bg-[url('/assets/bg-pattern.png')] bg-cover  bg-no-repeat opacity-[0.45]"
      />

      <div className="wrap">
        <div className="shead reveal flex w-full flex-col items-center justify-center gap-3 text-center">
          <h2 className="w-full text-[48px]">
            Experience{' '}
            <span key={destIndex} className="flick-word text-gold">
              {dest.word}
            </span>{' '}
            Your Way .
          </h2>
        </div>
      </div>

      {/* Category carousel */}
      <div
        onMouseEnter={() => {
          paused.current = true;
        }}
        onMouseLeave={() => {
          paused.current = false;
        }}
      >
        <div
          key={destIndex}
          ref={stageRef}
          className="carousel-fade relative mt-[44px] h-[500px] w-full overflow-hidden max-[900px]:h-[460px] max-[620px]:h-[calc(103vw+48px)]"
        >
          {/* Desktop: cards are absolutely placed by GSAP. Mobile: this becomes a draggable flex row. */}
          <div
            ref={trackRef}
            className="relative h-full w-full max-[620px]:flex max-[620px]:w-max max-[620px]:min-w-full max-[620px]:cursor-grab max-[620px]:items-center max-[620px]:gap-[16px] max-[620px]:px-[13vw] max-[620px]:active:cursor-grabbing"
          >
            {dest.cats.map((cat, index) => (
              <div
                key={cat.name}
                className="absolute left-1/2 top-1/2 w-[280px] will-change-transform max-[1100px]:w-[250px] max-[800px]:w-[230px] max-[620px]:relative max-[620px]:left-auto max-[620px]:top-auto max-[620px]:w-[74vw] max-[620px]:shrink-0"
              >
                <CategoryCard
                  cat={cat}
                  country={dest.word}
                  href={templateHref(dest, cat)}
                  active={index === activeIndex}
                  onSelect={() => select(index)}
                  dragged={didDrag}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-[10px] flex items-center justify-center gap-[24px]">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous category"
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-black/15 text-ink transition-all duration-200 hover:border-ink hover:bg-ink hover:text-white"
          >
            <ChevronLeftIcon className="h-[18px] w-[18px]" />
          </button>

          <Link
            href={ROUTES.tours}
            className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink underline-offset-4 transition-colors duration-200 hover:text-gold-deep hover:underline"
          >
            Explore Categories
          </Link>

          <button
            type="button"
            onClick={next}
            aria-label="Next category"
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-black/15 text-ink transition-all duration-200 hover:border-ink hover:bg-ink hover:text-white"
          >
            <ChevronRightIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  cat: Cat;
  country: string;
  href: string;
  active: boolean;
  onSelect: () => void;
  dragged: MutableRefObject<boolean>;
}

function CategoryCard({ cat, country, href, active, onSelect, dragged }: CategoryCardProps) {
  const router = useRouter();

  useEffect(() => {
    if (active) router.prefetch(href);
  }, [active, href, router]);

  const handleCardClick = () => {
    if (dragged.current) return; // a drag release is not a tap
    if (active) router.push(href);
    else onSelect();
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={active ? `Explore ${cat.name} in ${country}` : `Select ${cat.name}`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="group relative aspect-[0.72] w-full cursor-pointer select-none overflow-hidden rounded-[8px] bg-[#ddd] shadow-[0_14px_40px_rgba(0,0,0,0.14)] [&_img]:pointer-events-none"
    >
      <ImageSlot
        src={cat.img}
        alt={`${cat.name} photo`}
        sizes="(max-width: 620px) 74vw, 280px"
        className="absolute inset-0 [--slot-bg:#15181b] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.3,1)] group-hover:scale-105"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/5" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-[14px]">
        <div className="mb-[14px] px-[4px]">
          <div className="mb-[6px] flex items-center gap-[5px] font-mono text-[9px] uppercase tracking-[0.12em] text-white/70">
            <PinIcon className="h-[11px] w-[11px]" />
            {country}
          </div>

          <h3 className="font-serif text-[24px] leading-[1] tracking-[-0.025em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.3)]">
            {cat.name}
          </h3>

          <p className="mt-[7px] truncate font-mono text-[9px] uppercase tracking-[0.1em] text-white/65">
            {cat.meta}
          </p>
        </div>
      </div>
    </div>
  );
}
