'use client';

import { ImageSlot } from '@/components/common/ImageSlot';
import { ROUTES } from '@/lib/constants';
import { RADIUS_FULL, TEXT } from '@/lib/theme';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const B = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DPbgTBNQA8uVZpwmAJg2wq3SQI/';

const REGIONS = [
  {
    name: 'Everest',
    region: 'everest',
    meta: 'Khumbu · up to 5,364 m',
    img: `https://images.pexels.com/photos/32132399/pexels-photo-32132399.jpeg`,
  },
  {
    name: 'Annapurna',
    region: 'annapurna',
    meta: '5 Treks',
    img: `https://images.pexels.com/photos/19405393/pexels-photo-19405393.jpeg`,
  },
  {
    name: 'Langtang',
    region: 'langtang',
    meta: '2 Treks',
    img: `https://images.pexels.com/photos/16681482/pexels-photo-16681482.jpeg`,
  },
];

const COUNT = REGIONS.length;

/**
 * Iconic Himalayan regions: one pinned screen. Title stays fixed;
 * images dissolve into each other and the region name swaps as you scroll.
 */
export function Regions() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useGSAP(
    () => {
      const imgs = gsap.utils.toArray<HTMLElement>('[data-img]');
      const copies = gsap.utils.toArray<HTMLElement>('[data-copy]');

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            const t = self.progress * tl.duration();
            setActive(Math.min(COUNT - 1, Math.floor(t + 0.25)));
            // React bails out when the value is unchanged, so this is cheap.
            setScrolled(self.progress > 0.02);
          },
        },
      });

      for (let i = 1; i < COUNT; i++) {
        const t = i - 0.5;

        tl.to(imgs[i], { opacity: 1, duration: 0.5 }, t);
        tl.to(copies[i - 1], { opacity: 0, duration: 0.25 }, t);
        tl.to(copies[i], { opacity: 1, duration: 0.25 }, t + 0.25);
      }

      tl.to({}, { duration: 0.5 });

      // Scroll-indicator dot loop (skipped for reduced motion)
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-scroll-dot]',
          { y: 0, opacity: 1 },
          { y: 14, opacity: 0, duration: 1.2, ease: 'power1.in', repeat: -1 },
        );
      });
    },
    { scope: sectionRef },
  );

  const current = REGIONS[active];

  return (
    <section
      ref={sectionRef}
      id="regions"
      className={`relative ${TEXT} p-6`}
      style={{ height: `${COUNT * 100}svh` }}
    >
      <div className="sticky top-4 h-[95vh] w-full overflow-hidden bg-[#15181b] p-6 text-white">
        {/* Image stack: later images sit above and dissolve in */}
        {REGIONS.map((r, index) => (
          <div
            key={r.name}
            data-img
            className="absolute inset-0"
            style={{ zIndex: index + 1, opacity: index === 0 ? 1 : 0 }}
          >
            <ImageSlot
              src={r.img}
              alt={r.name}
              sizes="100vw"
              priority={index === 0}
              className="h-full w-full [--slot-bg:#15181b]"
            />
          </div>
        ))}

        {/* Overlays (above all images) */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-black/10" />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/3 bg-gradient-to-b from-black/50 to-transparent" />

        {/* Fixed section title */}
        <div className="absolute inset-x-0 top-0 z-20 p-6">
          <div className="wrap">
            <div className="flex flex-col">
              <div className="mb-5 flex w-full">
                <span className="inline-flex items-center gap-[6px] rounded-full border border-white/15 px-3 py-[6px] text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                  Where you&apos;ll wander
                </span>
              </div>
              <div className="flex w-full flex-col gap-6">
                <h2 className="max-w-[640px] font-serif text-[clamp(30px,4vw,52px)] font-normal leading-[1.05] tracking-[-0.02em] text-white">
                  Iconic Himalayan regions
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator: top-right, fades out once scrolling starts */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-6 top-6 z-20 flex flex-col items-center gap-2 text-white/70 transition-opacity duration-500 ${
            scrolled ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.22em]">Scroll</span>
          <div className="flex h-10 w-6 justify-center rounded-full border border-white/30 pt-2">
            <span data-scroll-dot className="h-1.5 w-1 rounded-full bg-white" />
          </div>
        </div>

        {/* Region name + progress + link */}
        <Link
          href={`${ROUTES.explore}?cat=trekking&region=${current.region}`}
          aria-label={`Explore ${current.name}`}
          className="group absolute inset-x-0 bottom-2  left-4 md:left-16 z-20 flex items-end justify-between gap-6 p-2 md:p-6"
        >
          <div className="grid">
            {REGIONS.map((r, index) => (
              <div
                key={r.name}
                data-copy
                className="col-start-1 row-start-1"
                style={{ opacity: index === 0 ? 1 : 0 }}
                aria-hidden={index !== active}
              >
                <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/75">
                  <span className={`h-1.5 w-1.5 ${RADIUS_FULL} bg-gold`} />
                  {String(index + 1).padStart(2, '0')} / {String(COUNT).padStart(2, '0')}
                  <span className="text-white/40">·</span>
                  {r.meta}
                </div>

                <h3 className="font-serif text-[clamp(44px,8vw,120px)] leading-[0.9] tracking-tight">
                  {r.name}
                </h3>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div
            className="mb-4 h-[2px] min-w-6 flex-1 overflow-hidden rounded-full bg-white/25"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-white transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{ width: `${((active + 1) / COUNT) * 100}%` }}
            />
          </div>

          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center ${RADIUS_FULL} border border-white/30 bg-white/10 backdrop-blur-sm transition-all duration-500 group-hover:translate-x-1 group-hover:bg-white group-hover:text-black`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>
      </div>
    </section>
  );
}
