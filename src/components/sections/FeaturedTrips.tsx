'use client';

import { TripCard } from '@/components/common/TripCard';
import { ROUTES } from '@/lib/constants';
import { TEXT } from '@/lib/theme';
import type { TripWithSlug } from '@/types/trip';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import EmptyState from '../common/EmptyState';
import SectionHeader from '../common/SectionHeader';
import { Navigation } from '../ui/Navigation';

const DEFAULT_EYEBROW = 'Pick from the best';
const DEFAULT_TITLE = 'Trending Himalayan treks.';
const DEFAULT_DESCRIPTION = 'Top-rated, customizable trips our travelers love.';

const GAP = 20;
const DEFAULT_PER_VIEW = 4;

interface FeaturedTripsProps {
  trips: TripWithSlug[];
  eyebrow?: string;
  title?: string;
  description?: string;
  filters?: { key: string; label: string }[];
}

const getCards = (track: HTMLElement | null) => Array.from(track?.children ?? []) as HTMLElement[];

const offsetOf = (vp: HTMLElement, card: HTMLElement) =>
  card.getBoundingClientRect().left - vp.getBoundingClientRect().left;

export function FeaturedTrips({
  trips,
  eyebrow = DEFAULT_EYEBROW,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: FeaturedTripsProps) {
  const [filter] = useState('all');
  const [start, setStart] = useState(0);
  const [perView, setPerView] = useState(DEFAULT_PER_VIEW);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const visible = trips.filter((trip) => filter === 'all' || trip.region === filter);

  const total = visible.length;

  const maxStart = Math.max(0, total - perView);
  const shown = Math.min(start + perView, total);
  const progress = total === 0 ? 0 : (shown / total) * 100;

  const canPrev = start > 0;
  const canNext = start < maxStart;

  /**
   * Scroll directly to the requested card.
   *
   * Using the card's offset relative to the scroll container
   * keeps the movement consistent regardless of the current
   * scroll position.
   */
  const scrollToCard = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const vp = viewportRef.current;
    const card = getCards(trackRef.current)[index];

    if (!vp || !card) return;

    const paddingLeft = parseFloat(getComputedStyle(vp).paddingLeft) || 0;

    const target = vp.scrollLeft + offsetOf(vp, card) - paddingLeft;

    vp.scrollTo({
      left: Math.max(0, target),
      behavior,
    });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, maxStart));

      setStart(nextIndex);

      requestAnimationFrame(() => {
        scrollToCard(nextIndex, 'smooth');
      });
    },
    [maxStart, scrollToCard],
  );

  const next = useCallback(() => {
    if (!canNext) return;
    goTo(start + 1);
  }, [canNext, goTo, start]);

  const previous = useCallback(() => {
    if (!canPrev) return;
    goTo(start - 1);
  }, [canPrev, goTo, start]);

  /**
   * Measure how many cards fit.
   * Only reposition when the viewport actually changes size.
   */
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const measure = () => {
      const card = getCards(trackRef.current)[0];
      if (!card) return;

      const cs = getComputedStyle(vp);

      const inner =
        vp.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);

      const cardWidth = card.getBoundingClientRect().width;

      const fit = Math.max(1, Math.floor((inner + GAP + 1) / (cardWidth + GAP)));

      setPerView((current) => {
        if (current === fit) return current;
        return fit;
      });
    };

    const ro = new ResizeObserver(measure);

    ro.observe(vp);

    measure();

    return () => ro.disconnect();
  }, []);

  /**
   * Keep the selected card aligned after perView changes,
   * but don't interfere with normal scrolling.
   */
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const cards = getCards(trackRef.current);
    const card = cards[start];

    if (!card) return;

    const paddingLeft = parseFloat(getComputedStyle(vp).paddingLeft) || 0;

    const target = vp.scrollLeft + offsetOf(vp, card) - paddingLeft;

    vp.scrollTo({
      left: Math.max(0, target),
      behavior: 'smooth',
    });
  }, [perView]);

  /**
   * Sync with manual scrolling / swiping.
   */
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    let timeout: number;

    const handleScroll = () => {
      window.clearTimeout(timeout);

      timeout = window.setTimeout(() => {
        const cards = getCards(trackRef.current);

        if (cards.length === 0) return;

        const scrollable = vp.scrollWidth > vp.clientWidth + 2;

        /**
         * If we're at the absolute end, pin the state
         * to the final possible card.
         */
        if (scrollable && vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 2) {
          setStart(maxStart);
          return;
        }

        let closest = 0;
        let min = Infinity;

        cards.forEach((card, i) => {
          const distance = Math.abs(offsetOf(vp, card));

          if (distance < min) {
            min = distance;
            closest = i;
          }
        });

        setStart(Math.min(closest, maxStart));
      }, 80);
    };

    vp.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.clearTimeout(timeout);
      vp.removeEventListener('scroll', handleScroll);
    };
  }, [maxStart]);

  return (
    <section className={`section bg-paper ${TEXT}`} id="trips">
      <div className="wrap">
        <SectionHeader title={title} eyebrow={eyebrow} />

        {visible.length === 0 ? (
          <div className="reveal" suppressHydrationWarning>
            <EmptyState
              title="No treks found"
              description="There are currently no treks available in this region. Please try another category."
            />
          </div>
        ) : (
          <>
            {/* Carousel */}
            <div className="relative reveal" suppressHydrationWarning>
              <div
                ref={viewportRef}
                className="
                  overflow-x-auto overflow-y-hidden
                  px-[2px] pt-[6px] pb-[18px]
                  [scroll-snap-type:x_mandatory]
                  [-webkit-overflow-scrolling:touch]
                  scroll-smooth
                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden
                  max-[620px]:px-0
                "
              >
                <div ref={trackRef} className="trip-track flex gap-[20px]">
                  {visible.map((trip, index) => (
                    <TripCard key={trip.slug} trip={trip} index={index} priority={index < 4} />
                  ))}
                </div>
              </div>
            </div>

            {/* Progress */}
            {total > 1 && (
              <div className="mt-[8px] flex w-full justify-center">
                <div
                  role="progressbar"
                  aria-label="Trip carousel progress"
                  aria-valuemin={0}
                  aria-valuemax={total}
                  aria-valuenow={shown}
                  className="relative h-[3px] w-full max-w-[120px] overflow-hidden rounded-full bg-gold-soft"
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gold-deep transition-[width] duration-500 ease-out motion-reduce:transition-none"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            {total > 1 && (
              <Navigation
                onPrevious={previous}
                onNext={next}
                previousDisabled={!canPrev}
                nextDisabled={!canNext}
                center={
                  <Link
                    href={ROUTES.tours}
                    className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink underline-offset-4 transition-colors duration-200 hover:text-gold-deep hover:underline"
                  >
                    See more packages
                  </Link>
                }
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
