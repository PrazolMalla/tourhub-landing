'use client';

import { ROUTES } from '@/lib/constants';
import type { NavGroup } from '@/types/site';
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Navigation } from '../ui/Navigation';
import { NavLink as Link } from './NavLink';

interface MegaMenuProps {
  open: boolean;
  heading: string;
  viewAllHref: string;
  viewAllLabel: string;
  groups: NavGroup[];
  param: 'region' | 'cat';
}

const ITEMS_PER_PAGE = 4;
const HOVER_INTENT_MS = 90;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function MegaMenu({
  open,
  heading,
  viewAllHref,
  viewAllLabel,
  groups,
  param,
}: MegaMenuProps) {
  const [active, setActive] = useState(0);
  const [page, setPage] = useState(0);

  const gridRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // -1 = went back, 1 = went forward, 0 = category change / open
  const directionRef = useRef<-1 | 0 | 1>(0);

  const current = groups[active] ?? groups[0];
  const trips = current?.[2] ?? [];

  const totalPages = Math.max(1, Math.ceil(trips.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const visibleTrips = trips.slice(safePage * ITEMS_PER_PAGE, (safePage + 1) * ITEMS_PER_PAGE);
  const hasCarousel = totalPages > 1;

  const selectGroup = (index: number) => {
    if (index === active) return;
    directionRef.current = 0;
    setActive(index);
    setPage(0);
  };

  const handleGroupEnter = (index: number) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => selectGroup(index), HOVER_INTENT_MS);
  };

  const cancelHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const goPrev = () => {
    directionRef.current = -1;
    setPage((p) => Math.max(0, p - 1));
  };

  const goNext = () => {
    directionRef.current = 1;
    setPage((p) => Math.min(totalPages - 1, p + 1));
  };

  // Clear any pending hover timer on unmount.
  useEffect(() => cancelHover, []);

  // Animate cards in whenever the visible set changes or the menu opens.
  useEffect(() => {
    const grid = gridRef.current;
    if (!open || !grid) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dir = directionRef.current;
    const fromX = dir * 28;
    const fromY = dir === 0 ? 12 : 0;

    Array.from(grid.children).forEach((el, i) => {
      el.animate(
        [
          { opacity: 0, transform: `translate(${fromX}px, ${fromY}px)` },
          { opacity: 1, transform: 'translate(0, 0)' },
        ],
        { duration: 380, delay: i * 45, easing: EASE, fill: 'backwards' },
      );
    });

    directionRef.current = 0;
  }, [active, safePage, open]);

  return (
    <div
      className={`
        fixed left-0 right-0 top-[86px] z-[50]
        border-t border-[color:var(--line-dark)]
        bg-[rgba(12,13,14,0.93)] text-white backdrop-blur-[14px]
        shadow-[0_20px_40px_rgba(0,0,0,0.25)]
        transition-[opacity,transform,visibility] duration-300 ease-out
        ${
          open
            ? 'visible translate-y-0 opacity-100'
            : 'invisible pointer-events-none -translate-y-2 opacity-0'
        }
      `}
    >
      <div className="wrap">
        <div className="grid min-h-[400px] grid-cols-[280px_1fr]">
          {/* LEFT SIDE */}
          <div className="border-r border-white/10 py-8 pr-8">
            <div className="mb-5 text-[15px] font-semibold uppercase text-[var(--gold)]">
              {heading}
            </div>

            <div className="flex flex-col" onMouseLeave={cancelHover}>
              {groups.map((group, index) => (
                <Link
                  key={group[1]}
                  href={`${ROUTES.tours}?${param}=${group[1]}`}
                  pageKey="tours"
                  onMouseEnter={() => handleGroupEnter(index)}
                  onFocus={() => selectGroup(index)}
                  className={`
                    relative flex min-h-[50px] items-center pr-5
                    text-[15px] font-semibold
                    transition-[color,transform] duration-300 ease-out
                    ${
                      active === index
                        ? 'translate-x-1.5 text-[var(--gold)]'
                        : 'text-white hover:text-[var(--gold)]'
                    }
                  `}
                >
                  {group[0]}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          {current && (
            <div className="overflow-hidden py-7 pl-10">
              {/* Cards */}
              <div ref={gridRef} className="grid grid-cols-4 gap-4">
                {visibleTrips.map((trip) => (
                  <Link
                    key={trip[1]}
                    href={`/trek/${trip[1]}`}
                    className="group relative aspect-[1.12/1] overflow-hidden bg-[#161716]"
                  >
                    <img
                      src={trip[2]}
                      alt={trip[0]}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/20" />

                    {/* Bottom gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

                    {/* Package title */}
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                      <h4 className="max-w-[220px] text-[18px] uppercase leading-[1.45] text-white transition-transform duration-500 ease-out group-hover:-translate-y-1">
                        {trip[0]}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Footer: View all + optional pager */}
              <div className="mt-6 flex items-center justify-between">
                <Link
                  href={viewAllHref}
                  pageKey="tours"
                  className="
                    inline-flex h-[48px] items-center gap-5
                    border border-[var(--gold)] px-8
                    text-[14px] font-semibold text-[var(--gold)]
                    transition-colors duration-300
                    hover:bg-[var(--gold)] hover:text-black
                  "
                >
                  {viewAllLabel}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current">
                    <ArrowDown size={16} />
                  </span>
                </Link>

                {hasCarousel && (
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
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
