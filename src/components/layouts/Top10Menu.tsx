'use client';

import { ROUTES } from '@/lib/constants';
import type { ChromeTop10Item } from '@/types/site';
import { useEffect, useRef, useState } from 'react';
import { Navigation } from '../ui/Navigation';

import { NavLink as Link } from './NavLink';

interface Top10MenuProps {
  items?: ChromeTop10Item[];
  open: boolean;
}

const ITEMS_PER_PAGE = 5;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function Top10Menu({ items, open }: Top10MenuProps) {
  const list = items ?? [];
  const [page, setPage] = useState(0);

  const gridRef = useRef<HTMLDivElement>(null);
  // -1 = went back, 1 = went forward, 0 = menu opened
  const directionRef = useRef<-1 | 0 | 1>(0);

  const totalPages = Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * ITEMS_PER_PAGE;
  const visible = list.slice(start, start + ITEMS_PER_PAGE);
  const hasCarousel = totalPages > 1;

  const goPrev = () => {
    directionRef.current = -1;
    setPage((p) => Math.max(0, p - 1));
  };

  const goNext = () => {
    directionRef.current = 1;
    setPage((p) => Math.min(totalPages - 1, p + 1));
  };

  // Return to the first page after the close transition finishes,
  // so the cards don't swap while the menu is still fading out.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setPage(0), 320);
    return () => clearTimeout(t);
  }, [open]);

  // Preload every image once the menu first opens so page changes don't blink.
  useEffect(() => {
    if (!open) return;
    list.forEach((trek) => {
      const img = new Image();
      img.src = trek.img;
    });
  }, [open, list]);

  // Animate cards on open and on every page change.
  useEffect(() => {
    const grid = gridRef.current;
    if (!open || !grid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dir = directionRef.current;
    const fromX = dir * 28;
    const fromY = dir === 0 ? 12 : 0;
    const baseDelay = dir === 0 ? 80 : 0;

    Array.from(grid.children).forEach((el, i) => {
      el.animate(
        [
          { opacity: 0, transform: `translate(${fromX}px, ${fromY}px)` },
          { opacity: 1, transform: 'translate(0, 0)' },
        ],
        { duration: 380, delay: baseDelay + i * 45, easing: EASE, fill: 'backwards' },
      );
    });

    directionRef.current = 0;
  }, [safePage, open]);

  return (
    <div
      className={`
        fixed left-0 right-0 top-[86px] z-[50]
        border-t border-white/10
        bg-[rgba(12,13,14,0.94)] text-white backdrop-blur-[14px]
        shadow-[0_20px_40px_rgba(0,0,0,0.25)]
        transition-[opacity,transform,visibility] duration-300
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${
          open
            ? 'visible translate-y-0 opacity-100'
            : 'invisible pointer-events-none -translate-y-2 opacity-0'
        }
      `}
    >
      <div className="wrap py-8">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Nepal Yatra Selection
            </span>
            <h3 className="font-serif text-[28px] leading-none">Top 10 Treks in Nepal</h3>
          </div>

          <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">
            Hand-picked favourites
          </span>
        </div>

        {/* Trek cards (clipped so the slide never spills outside the grid) */}
        <div className="overflow-hidden">
          <div ref={gridRef} className="grid grid-cols-5 gap-3">
            {visible.map((trek, i) => (
              <Link
                key={trek.url}
                href={trek.url}
                className="group relative aspect-[1.15/1] overflow-hidden bg-white/5"
              >
                <img
                  src={trek.img}
                  alt={trek.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />

                {/* image darkness */}
                <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/10" />

                {/* gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />

                {/* Number (global rank, not per page) */}
                <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-[10px] font-semibold text-white backdrop-blur-md">
                  {String(start + i + 1).padStart(2, '0')}
                </span>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h4 className="line-clamp-2 text-[15px] font-semibold leading-[1.3] text-white transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
                    {trek.name}
                  </h4>

                  <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.08em] text-white/60">
                    <span>{trek.days}</span>
                    <span className="text-[var(--gold)]">From ${trek.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom: pager + see all */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
          {hasCarousel ? (
            <Navigation
              onPrevious={goPrev}
              onNext={goNext}
              previousDisabled={safePage === 0}
              nextDisabled={safePage === totalPages - 1}
              center={
                <span className="min-w-[45px] text-center text-[13px] text-white/50">
                  {safePage + 1} / {totalPages}
                </span>
              }
              onDark={true}
            />
          ) : (
            <span />
          )}

          <Link
            href={ROUTES.tours}
            pageKey="tours"
            className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--gold)]"
          >
            See all treks & tours
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
