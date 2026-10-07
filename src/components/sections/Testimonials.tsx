'use client';

import { StarHalfIcon, StarIcon } from '@/components/icons';
import type { Testimonial } from '@/data/testimonials';
import { PRIMARY, RADIUS_FULL, TEXT_MUTED } from '@/lib/theme';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SectionHeader from '../common/SectionHeader';
import { Navigation } from '../ui/Navigation';

export function Stars({ rating = 5 }: { rating?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="flex gap-[3px]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: fullStars }, (_, i) => (
        <StarIcon key={`full-${i}`} className="h-[16px] w-[16px] fill-amber-400 text-amber-400" />
      ))}
      {hasHalfStar && <StarHalfIcon className="h-[16px] w-[16px] text-amber-400" />}
      {Array.from({ length: emptyStars }, (_, i) => (
        <StarIcon key={`empty-${i}`} className="h-[16px] w-[16px] text-amber-400" />
      ))}
    </div>
  );
}

const SOURCES = {
  google: { label: 'Google', logo: '/assets/google.svg', href: 'GOOGLE_REVIEW_URL' },
  tripadvisor: {
    label: 'Tripadvisor',
    logo: '/assets/tripadvisor.svg',
    href: 'TRIPADVISOR_REVIEW_URL',
  },
} as const;

function TestimonialCard({ item }: { item: Testimonial }) {
  const source = SOURCES[item.source === 'google' ? 'google' : 'tripadvisor'];

  return (
    <article
      data-card
      className="flex min-h-[420px] w-[min(86vw,400px)] flex-none snap-start flex-col justify-between rounded-[8px]  p-[18px] pb-[30px] bg-white border"
    >
      <div>
        {/* Top row: avatar + source pill */}
        <div className="flex items-center justify-between">
          <div
            className={`flex h-[62px] w-[62px] items-center justify-center ${RADIUS_FULL} ${PRIMARY} font-serif text-[20px] tracking-[0.02em] text-white`}
          >
            {item.initials}
          </div>
        </div>

        {/* Quote */}
        <div className="mt-6 px-[14px]">
          <span aria-hidden className="block font-serif text-[64px] leading-[0.6] text-gold">
            &ldquo;
          </span>

          <p className=" text-[clamp(14px,2vw,18px)] font-medium leading-[1.22] tracking-[-0.01em]">
            {item.quote && `${item.quote} `}
            {item.highlight && <span className="text-gold">{item.highlight}</span>}
          </p>
        </div>
      </div>

      {/* Author */}
      <div className=" mt-[36px] flex gap-[16px] border-[var(--line)] pl-[20px]">
        <div className="flex flex-col gap-[6px]">
          <div className="text-[17px] font-semibold leading-none">{item.name}</div>
          <div className={`text-[13.5px] leading-[1.4] ${TEXT_MUTED}`}>{item.meta}</div>
          <Link
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${source.label} review`}
            className={`flex h-[40px] items-center gap-2   transition-colors duration-200 hover:bg-white`}
          >
            <Image src={source.logo} alt="" width={22} height={22} />
            <span className="text-[15px] font-semibold">{source.label}</span>
          </Link>
          <Stars rating={item.rating} />
        </div>
      </div>
    </article>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const activeItems = useMemo(() => items.filter((item) => item.isActive), [items]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener('resize', syncEdges);
    return () => window.removeEventListener('resize', syncEdges);
  }, [syncEdges, activeItems.length]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    const card = el?.querySelector<HTMLElement>('[data-card]');
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  if (activeItems.length === 0) return null;

  const navBtn = `flex h-[56px] w-[56px] items-center justify-center ${RADIUS_FULL} bg-ink text-white transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30`;

  return (
    <section className="section relative overflow-hidden bg-white">
      <div className="wrap">
        {/* Header */}
        <div className="reveal flex items-end justify-between gap-6">
          <SectionHeader title="What Our Clients Say" eyebrow="Testimonials" />
        </div>

        {/* Track */}
        <div
          ref={scrollerRef}
          onScroll={syncEdges}
          tabIndex={0}
          aria-label="Traveller testimonials"
          className="reveal mt-[40px] flex snap-x snap-mandatory gap-[14px] overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {activeItems.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
        {activeItems.length > 1 && (
          <Navigation
            onPrevious={() => scrollByCard(-1)}
            onNext={() => scrollByCard(1)}
            previousDisabled={!canPrev}
            nextDisabled={!canNext}
          />
        )}
      </div>
    </section>
  );
}
