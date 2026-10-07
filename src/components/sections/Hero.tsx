'use client';

import type { GoogleReview } from '@/lib/cms';
import { ROUTES } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

type Slide = {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
};

// Swap these for your own destinations — image hosts must be allowed in next.config.
// Needs at least 4 slides: the strip shows 3½ cards, so fewer would repeat.
const SLIDES: Slide[] = [
  {
    id: 'everest',
    name: 'Mt. Everest',
    description: 'Experience the mystical Highlands under twilight skies and misty lochs.',
    image:
      'https://images.pexels.com/photos/18651260/pexels-photo-18651260.jpeg?auto=compress&cs=tinysrgb&w=1600',
    href: ROUTES.tours,
  },
  {
    id: 'annapurna',
    name: 'Mt. Annapurna',
    description: 'Chase the Northern Lights under star-lit skies along scenic fjord roads.',
    image:
      'https://images.pexels.com/photos/23826433/pexels-photo-23826433.jpeg?auto=compress&cs=tinysrgb&w=1600',
    href: ROUTES.tours,
  },
  {
    id: 'pokhara',
    name: 'Pokhara',
    description: 'Wander dramatic, mist-laden mountain paths that feel straight out of a dream.',
    image:
      'https://images.pexels.com/photos/37836764/pexels-photo-37836764.jpeg?auto=compress&cs=tinysrgb&w=1600',
    href: ROUTES.tours,
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu',
    description: 'Discover serene mountain temples shrouded in dusk and ancient forest trails.',
    image:
      'https://images.pexels.com/photos/28831413/pexels-photo-28831413.jpeg?auto=compress&cs=tinysrgb&w=1600',
    href: ROUTES.tours,
  },
  {
    id: 'Bali',
    name: 'Bali',
    description: 'Discover serene mountain temples shrouded in dusk and ancient forest trails.',
    image: 'https://images.pexels.com/photos/27375300/pexels-photo-27375300.jpeg',
    href: ROUTES.tours,
  },
];

// Speed knobs: change the "1.2s" below to speed the zoom up or slow it down.
// `hero-zoom` and `hero-rise` are defined in globals.css. Both are skipped for reduced motion.
const ZOOM =
  '[animation:hero-zoom_1.2s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:[animation:none]';
const RISE = 'opacity-0 motion-reduce:opacity-100 motion-reduce:[animation:none]';

const ARROW =
  'grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition duration-300 hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95';

const mod = (a: number, m: number) => ((a % m) + m) % m;

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

type Rect = { top: number; left: number; width: number; height: number };

/** Homepage hero — destination carousel. */
export function Hero(_props: { googleReview?: GoogleReview | null }) {
  const n = SLIDES.length;
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const [{ pos, prev, animate, from }, setState] = useState<{
    pos: number;
    prev: number;
    animate: boolean;
    from: Rect | null;
  }>({ pos: 0, prev: 0, animate: false, from: null });

  const current = mod(pos, n);

  const goTo = (targetPos: number, zoomFromK: number) => {
    if (targetPos === pos) return;

    let box: Rect | null = null;
    const section = sectionRef.current;
    const card = cardRefs.current.get(zoomFromK);
    if (section && card) {
      const s = section.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      box = { top: c.top - s.top, left: c.left - s.left, width: c.width, height: c.height };
    }

    setState({ pos: targetPos, prev: current, animate: true, from: box });
  };

  const next = () => goTo(pos + 1, pos + 1);
  // Going back, the new slide lands in the first slot, so the zoom starts from that slot.
  const previous = () => goTo(pos - 1, pos);

  const slide = SLIDES[current];

  // Cards from one slot left of the first (invisible) to one slot past the last (off-screen).
  const ks = Array.from({ length: n + 2 }, (_, j) => pos - 1 + j);

  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (paused || mq.matches) return;

    const AUTOPLAY_MS = 3000;
    const id = setInterval(() => {
      goTo(pos + 1, pos + 1);
    }, AUTOPLAY_MS);

    return () => clearInterval(id);
  }, [pos, paused]);

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured destinations"
      className="relative min-h-[clamp(620px,100vh,960px)] overflow-clip bg-black "
    >
      <h1 className="sr-only">Walk where the Himalaya touches the sky.</h1>

      {/* Full-bleed layers. All stay mounted (images preloaded); only classes change. */}
      {SLIDES.map((s, i) => {
        const isCurrent = i === current;
        const isPrev = i === prev && !isCurrent;
        const layer = isCurrent ? `z-20 ${animate ? ZOOM : ''}` : isPrev ? 'z-10' : 'invisible z-0';
        const zoomFrom: CSSProperties | undefined =
          isCurrent && from
            ? ({
                '--zt': `${from.top}px`,
                '--zl': `${from.left}px`,
                '--zw': `${from.width}px`,
                '--zh': `${from.height}px`,
              } as CSSProperties)
            : undefined;

        return (
          <div
            key={s.id}
            aria-hidden={!isCurrent}
            style={zoomFrom}
            className={`absolute top-0 left-0 h-full w-full overflow-hidden ${layer}`}
          >
            <Image
              src={s.image}
              alt={s.name}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
            />
            {/* Scrim so the white text stays readable on bright photos */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
          </div>
        );
      })}

      {/* Keyed on the slide so the text animation replays after the zoom lands */}
      <div className="wrap relative h-[100vh]">
        <div
          key={slide.id}
          className="absolute top-1/2 left-[clamp(20px,6vw,100px)] z-30 w-[min(560px,calc(100%-clamp(20px,6vw,100px)-20px))] -translate-y-1/2 font-sans text-[#eee]"
        >
          <h2
            className={`text-[clamp(28px,5vw,40px)] leading-tight uppercase ${RISE}
           leading-[1.08] tracking-[-0.01em] [animation:hero-rise_1.2s_ease-in-out_0.5s_forwards]`}
          >
            {slide.name}
          </h2>
          <p
            className={`mt-[10px] mb-5 ${RISE} [animation:hero-rise_1.2s_ease-in-out_0.8s_forwards]`}
          >
            {slide.description}
          </p>
          <div className="flex gap-4">
            <Link
              href={slide.href}
              className={`inline-block rounded-[10px] btn btn-gold text-sm text-black transition-colors duration-500 hover:bg-white ${RISE} [animation:hero-rise_1.2s_ease-in-out_1.1s_forwards]`}
            >
              Book Your Trip
            </Link>
            <Link
              className={`inline-block rounded-[10px] btn btn-ghost-d text-sm text-black transition-colors duration-500 hover:bg-white ${RISE} [animation:hero-rise_1.2s_ease-in-out_1.1s_forwards]`}
              href={ROUTES.about}
            >
              Explore Packages
            </Link>
          </div>
        </div>

        <div
          className="absolute right-0 bottom-[clamp(20px,4vw,48px)] z-30 flex flex-col gap-4"
          style={
            {
              '--card': 'clamp(64px,16vw,150px)',
              '--gap': '12px',
              width: 'calc(var(--card) * 3.5 + var(--gap) * 3)',
            } as CSSProperties
          }
        >
          <div role="group" aria-label="Choose a destination">
            <div className="relative" style={{ height: 'calc(var(--card) * 4 / 3)' }}>
              {/* One track that slides by a step per move. Cards never move relative to it, so the
                slide is a single transform and the entering/leaving cards ride along with it. */}
              <div
                className="absolute top-0 left-0 h-full w-full transition-transform duration-[800ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none"
                style={{ transform: `translateX(calc((var(--card) + var(--gap)) * ${-pos}))` }}
              >
                {ks.map((k) => {
                  const rel = k - pos; // 0 = active = first slot
                  const s = SLIDES[mod(k, n)];
                  const active = rel === 0;
                  const clickable = rel >= 0 && rel <= 3;

                  return (
                    <button
                      key={k}
                      ref={(el) => {
                        if (el) cardRefs.current.set(k, el);
                        else cardRefs.current.delete(k);
                      }}
                      type="button"
                      onClick={() => goTo(k, k)}
                      tabIndex={clickable ? 0 : -1}
                      aria-hidden={!clickable}
                      aria-label={`Show ${s.name}`}
                      aria-current={active}
                      style={{ transform: `translateX(calc((var(--card) + var(--gap)) * ${k}))` }}
                      className={`absolute top-0 left-0 aspect-[3/4] w-[var(--card)] cursor-pointer overflow-hidden rounded-2xl ring-2 transition-[opacity,box-shadow] duration-[800ms] focus-visible:ring-white motion-reduce:transition-none ${
                        active
                          ? 'ring-white'
                          : rel < 0
                            ? 'pointer-events-none opacity-0 ring-transparent'
                            : ' ring-transparent '
                      }`}
                    >
                      <Image src={s.image} alt="" fill sizes="150px" className="object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2 text-left text-xs text-white max-sm:hidden">
                        {s.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Arrows line up with the first card; progress bar fills the gap; counter closes the row */}
          <div className="flex items-center gap-4 pr-[clamp(20px,4vw,64px)]">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous destination"
                className={ARROW}
              >
                <Chevron direction="left" />
              </button>
              <button type="button" onClick={next} aria-label="Next destination" className={ARROW}>
                <Chevron direction="right" />
              </button>
            </div>

            <div
              className="h-[2px] min-w-6 flex-1 overflow-hidden rounded-full bg-white/25"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-white transition-[width] duration-700 ease-out motion-reduce:transition-none"
                style={{ width: `${((current + 1) / n) * 100}%` }}
              />
            </div>

            <span className="font-sans text-sm text-white tabular-nums" aria-live="polite">
              {current + 1}/{n}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
