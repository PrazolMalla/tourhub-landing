'use client';

import { PlusIcon } from '@/components/icons';
import {
  PRIMARY,
  RADIUS,
  RADIUS_FULL,
  SHADOW_SM,
  TEXT,
  TEXT_ACCENT,
  TEXT_MUTED,
} from '@/lib/theme';
import type { ItineraryDay } from '@/types/trip';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useId, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

/** Day-by-day timeline. Each day auto-opens once as it scrolls into view; manual toggle still works. */
export function ItineraryAccordion({ days }: { days: ItineraryDay[] }) {
  const uid = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set());

  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prevOpen = useRef<Set<number>>(new Set());
  const reduced = useRef(false);

  const allOpen = open.size === days.length;

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  const openAll = () => setOpen(new Set(days.map((_, i) => i)));
  const closeAll = () => setOpen(new Set());

  /* 1. Scroll triggers: open each day once when it reaches 70% of the viewport */
  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 70%',
          once: true,
          onEnter: () => setOpen((prev) => (prev.has(i) ? prev : new Set(prev).add(i))),
        });
      });
    });

    return () => ctx.revert();
  }, [days.length]);

  /* 2. Animate whatever changed: panel height, connector line, text */
  useEffect(() => {
    const dur = reduced.current ? 0 : 0.55;

    days.forEach((_, i) => {
      const was = prevOpen.current.has(i);
      const is = open.has(i);
      if (was === is) return;

      const panel = panelRefs.current[i];
      const line = lineRefs.current[i];

      if (panel) {
        gsap.to(panel, {
          height: is ? 'auto' : 0,
          duration: dur,
          ease: 'power2.inOut',
          overwrite: 'auto',
          onComplete: () => ScrollTrigger.refresh(),
        });
        const text = panel.querySelector('p');
        if (is && text) {
          gsap.fromTo(
            text,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: dur, delay: dur ? 0.12 : 0, ease: 'power2.out' },
          );
        }
      }

      if (line) {
        gsap.to(line, {
          scaleY: is ? 1 : 0,
          duration: dur * 1.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });

    prevOpen.current = open;
  }, [open, days]);

  const controlBtn = ` text-[11px] font-bold tracking-[0.1em] uppercase px-4 py-2 ${RADIUS_FULL} border border-line bg-white ${TEXT} cursor-pointer [transition:background_0.2s] hover:bg-paper`;

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button type="button" className={controlBtn} onClick={allOpen ? closeAll : openAll}>
          {allOpen ? 'Close all' : 'Open all'}
        </button>
      </div>

      <ol className="flex flex-col m-0 p-0 list-none">
        {days.map((it, i) => {
          const isOpen = open.has(i);
          const isLast = i === days.length - 1;
          const meta = it.meta || [];
          const dayLabel = String(it.d).padStart(2, '0');
          const panelId = `${uid}-panel-${i}`;

          return (
            <li
              key={it.d + i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={`grid grid-cols-[20px_1fr] md:grid-cols-[88px_20px_1fr] gap-x-4 md:gap-x-5 ${
                isLast ? '' : 'pb-6'
              }`}
            >
              {/* Left: day label + altitude (desktop) */}
              <div className="hidden md:block text-right pt-[6px]">
                <div
                  className={` text-[12px] font-bold tracking-[0.06em] [transition:color_0.25s] ${
                    isOpen ? TEXT_ACCENT : TEXT
                  }`}
                >
                  DAY {dayLabel}
                </div>
                {meta[0] && <div className={` text-[10.5px] mt-0.5 ${TEXT_MUTED}`}>{meta[0]}</div>}
              </div>

              {/* Middle: node + connector */}
              <div className="relative flex justify-center" aria-hidden>
                {!isLast && (
                  <>
                    {/* faint base track */}
                    <span className="absolute inset-x-0 mx-auto top-4 -bottom-6 w-px bg-line" />
                    {/* progress line, scaled by GSAP */}
                    <span
                      ref={(el) => {
                        lineRefs.current[i] = el;
                      }}
                      className="absolute inset-x-0 mx-auto top-4 -bottom-6 w-0.5 bg-gold"
                      style={{ transform: 'scaleY(0)', transformOrigin: 'top' }}
                    />
                  </>
                )}
                <span
                  className={`relative z-10 mt-[6px] w-5 h-5 ${RADIUS_FULL} flex items-center justify-center ring-4 ring-white [transition:background_0.25s,border-color_0.25s] ${
                    isOpen ? PRIMARY : 'bg-white border-2 border-line'
                  }`}
                >
                  <span
                    className={`w-2 h-2 ${RADIUS_FULL} [transition:background_0.25s] ${
                      isOpen ? 'bg-white' : 'bg-line'
                    }`}
                  />
                </span>
              </div>

              {/* Right: card */}
              <article
                className={`bg-white! border border-line ${RADIUS} overflow-hidden [transition:box-shadow_0.25s,border-color_0.25s] ${
                  isOpen ? `${SHADOW_SM} border-gold` : ''
                }`}
              >
                <button
                  type="button"
                  className="flex items-start gap-4 py-5 px-6 cursor-pointer w-full text-left"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                >
                  <span className="flex-1 min-w-0">
                    <span
                      className={`md:hidden block text-[11px] font-bold tracking-[0.08em] mb-1.5 ${TEXT_ACCENT}`}
                    >
                      DAY {dayLabel}
                    </span>
                    <span className={`font-bold text-[18px] leading-snug ${TEXT}`}>{it.t}</span>
                  </span>
                  <span
                    className={`flex-none w-[30px] h-[30px] ${RADIUS_FULL} flex items-center justify-center [transition:transform_0.3s,background_0.25s] ${
                      isOpen ? `rotate-45 ${PRIMARY} text-paper` : 'bg-black text-white'
                    }`}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </span>
                </button>

                {/* Height is owned by GSAP: starts at 0, tweens to 'auto' */}
                <div
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  id={panelId}
                  role="region"
                  className="overflow-hidden"
                  style={{ height: 0 }}
                >
                  <p className={`px-6 pt-0 pb-5 m-0 text-[15px] leading-relaxed ${TEXT_MUTED}`}>
                    {it.b || ''}
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
