'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SectionHeader from '../common/SectionHeader';
import { Navigation } from '../ui/Navigation';
import TeamCard from './TeamCard';
export type TeamIcon = 'mountains' | 'hiker' | 'chat' | 'headset';
export type TeamMember = {
  name: string;
  role: string;
  body: string;
  image: string;
  icon: TeamIcon;
};
export function Team({ items }: { items: TeamMember[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const syncEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncEdges();
    // Fires on breakpoint changes and when items change, not just window resize
    const ro = new ResizeObserver(syncEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncEdges, items.length]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    const card = el?.querySelector<HTMLElement>('[data-card]');
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <section className="section relative overflow-hidden bg-white">
      <div className="wrap">
        <div className="reveal flex items-end justify-between gap-6">
          <SectionHeader title="The people behind it" eyebrow="Our Team" />
        </div>

        <div
          ref={scrollerRef}
          onScroll={syncEdges}
          tabIndex={0}
          aria-label="Our Team"
          className="reveal mt-[40px] flex snap-x snap-mandatory gap-(--gap) overflow-x-auto scroll-smooth pb-2
                     [--gap:14px] [--n:1] sm:[--n:2] lg:[--n:4]
                     [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((member) => (
            <TeamCard
              key={member.name}
              {...member}
              className="shrink-0 snap-start basis-[calc((100%-var(--gap)*(var(--n)-1))/var(--n))]"
            />
          ))}
        </div>

        {(canPrev || canNext) && (
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
