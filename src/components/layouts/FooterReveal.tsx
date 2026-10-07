'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactNode, useLayoutEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function FooterReveal({ children }: { children: ReactNode }) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const spacingRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const spacing = spacingRef.current;
    const panel = panelRef.current;
    if (!trigger || !spacing || !panel) return;

    const ctx = gsap.context(() => {
      gsap.set(spacing, { paddingTop: 80 });
      gsap
        .timeline({
          scrollTrigger: {
            trigger,
            start: 'top 65%',
            end: 'top 55%',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(panel, { maxWidth: '100%', borderRadius: 0, ease: 'none' }, 0)
        .to(spacing, { paddingTop: 0, ease: 'none' }, 0);
    }, trigger);

    // Absolute Y of the footer trigger in the document
    const getTop = () => trigger.getBoundingClientRect().top + window.scrollY;
    let lastTop = getTop();
    let raf = 0;

    // Anything above the footer growing/shrinking changes document height.
    // Only refresh when the footer's own position actually moved.
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const top = getTop();
        if (Math.abs(top - lastTop) > 1) {
          lastTop = top;
          ScrollTrigger.refresh();
        }
      });
    };

    const ro = new ResizeObserver(check);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={triggerRef} className="relative bg-paper">
      <div ref={spacingRef}>
        <div
          ref={panelRef}
          className="relative mx-auto w-full max-w-[calc(100%-32px)] overflow-hidden rounded-[32px] bg-[#111513] py-10 will-change-[max-width,border-radius] md:max-w-[1200px] md:rounded-[48px]"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
