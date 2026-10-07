'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scroll-reveal driver — mirrors the original app.js/shared.js behaviour.
 * Reveals `.reveal` elements as they enter the viewport.
 *
 * Reveal is driven by a `data-revealed` ATTRIBUTE (not a class) so it never
 * clashes with React-managed `className` during streamed hydration.
 *
 * A MutationObserver re-scans whenever `.reveal` nodes are added or recreated,
 * so content is shown not just on first load but also after client-side
 * navigation, lazily-mounted sections and dev Fast Refresh (HMR) re-renders —
 * which recreate the DOM nodes and would otherwise leave them stuck hidden.
 */
export function RevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const SEL = '.reveal:not([data-revealed])';
    const reveal = (el: Element) => el.setAttribute('data-revealed', '');

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((en) => {
                if (en.isIntersecting) {
                  reveal(en.target);
                  io?.unobserve(en.target);
                }
              });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
          )
        : null;

    // Reveal anything already in (or above) the viewport now; hand off the rest
    // to the IntersectionObserver to reveal as the user scrolls to them.
    const scan = () => {
      document.querySelectorAll<HTMLElement>(SEL).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.98 && r.bottom > -40) reveal(el);
        else if (io) io.observe(el);
        else reveal(el);
      });
    };

    // Initial pass: one frame past the render/hydration commit, with a timeout
    // fallback in case rAF is throttled right after a route change.
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(scan);
    });
    const kick = window.setTimeout(scan, 60);

    // Re-scan on DOM changes (client nav, lazy content, HMR). Coalesce bursts
    // into one scan per frame. We watch childList only — setting `data-revealed`
    // is an attribute change, so it won't retrigger this and cause a loop.
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Hard safety net — force-reveal anything still hidden, so content can never
    // get stuck (e.g. if the timeline stalls or IntersectionObserver is absent).
    const safety = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
        if (parseFloat(getComputedStyle(el).opacity) < 0.05) reveal(el);
      });
    }, 2600);

    return () => {
      io?.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
      if (pending) cancelAnimationFrame(pending);
      window.clearTimeout(kick);
      window.clearTimeout(safety);
    };
  }, [pathname]);

  return null;
}
