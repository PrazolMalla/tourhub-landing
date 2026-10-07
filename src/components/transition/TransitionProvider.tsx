'use client';

import gsap from 'gsap';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';

const BRAND = 'Tour Hub Nepal';
const ROUTE_SAFETY_MS = 10000; // navigation never commits
const ASSET_CAP_MS = 6000; // first load: assets never settle

type Ctx = { navigate: (href: string) => void };
const TransitionCtx = createContext<Ctx | null>(null);

export const usePageTransition = () => {
  const ctx = useContext(TransitionCtx);
  if (!ctx) throw new Error('usePageTransition must be used inside <TransitionProvider>');
  return ctx;
};

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const state = useRef({
    busy: true,
    waiting: false,
    pathname,
    timer: 0,
    pulse: null as gsap.core.Tween | null,
    progress: { value: 0 },
  });

  const setProgress = useCallback(() => {
    const value = Math.round(state.current.progress.value);
    if (counterRef.current) counterRef.current.textContent = `${value}%`;
    if (barRef.current) barRef.current.style.width = `${value}%`;
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {}, overlayRef);
    ctxRef.current = ctx;
    return () => {
      window.clearTimeout(state.current.timer);
      ctx.revert();
      ctxRef.current = null;
    };
  }, []);

  // Shared cover: blocks rise, brand enters, brief hold, then pulse while waiting.
  const cover = useCallback(
    (onDone: () => void) => {
      ctxRef.current?.add(() => {
        const progress = state.current.progress;

        gsap.killTweensOf(progress);
        progress.value = 0;
        setProgress();

        gsap.to(progress, {
          value: 90,
          duration: 1.3,
          ease: 'power2.out',
          onUpdate: setProgress,
        });

        gsap.set('.tx-block', { transformOrigin: 'bottom', scaleY: 0 });
        gsap.set('.tx-char', { yPercent: 100, opacity: 1 });
        gsap.set('.tx-loader', { opacity: 1, y: 0, delay: 0.5, ease: 'power2.in' });
        gsap.set('.tx-brand', { visibility: 'visible' });
        gsap.set(overlayRef.current, { display: 'block' });

        gsap
          .timeline({
            onComplete: () => {
              // blocks fully cover the screen, so dropping the curtain is invisible
              gsap.set('.tx-curtain', { display: 'none' });
              state.current.pulse = gsap.to('.tx-char', {
                opacity: 0.35,
                duration: 0.6,
                ease: 'sine.inOut',
                stagger: { each: 0.05, yoyo: true, repeat: -1 },
              });
              onDone();
            },
          })
          .to('.tx-block', { scaleY: 1, duration: 0.6, stagger: 0.08, ease: 'power3.inOut' })
          .to(
            '.tx-char',
            { yPercent: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out' },
            '-=0.25',
          )
          .to({}, { duration: 0.25 });
      });
    },
    [setProgress],
  );

  const reveal = useCallback(() => {
    const s = state.current;
    window.clearTimeout(s.timer);
    s.waiting = false;
    s.pulse?.kill();
    s.pulse = null;

    ctxRef.current?.add(() => {
      const progress = s.progress;

      gsap.killTweensOf(progress); // stop the 0 -> 90 tween so they don't fight
      gsap.to(progress, {
        value: 100,
        duration: 0.25,
        ease: 'power2.in',
        onUpdate: setProgress,
      });

      gsap.set('.tx-char', { opacity: 1 });
      gsap.set('.tx-block', { transformOrigin: 'top' }); // invisible flip, fully scaled

      gsap
        .timeline({
          onComplete: () => {
            gsap.set(overlayRef.current, { display: 'none' });
            s.busy = false;
          },
        })
        // show 100% briefly, then dismiss the loader before the curtain opens
        .to('.tx-loader', { opacity: 0, y: -12, duration: 0.25, ease: 'power2.in' }, 0.2)
        .to('.tx-char', { yPercent: -100, duration: 0.35, stagger: 0.025, ease: 'power3.in' }, 0.2)
        .to(
          '.tx-block',
          { scaleY: 0, duration: 0.6, stagger: 0.08, ease: 'power3.inOut' },
          '-=0.15',
        );
    });
  }, [setProgress]);

  const navigate = useCallback(
    (href: string) => {
      const s = state.current;
      if (s.busy || href === s.pathname) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        router.push(href);
        return;
      }

      s.busy = true;
      cover(() => {
        s.waiting = true;
        router.push(href);
        s.timer = window.setTimeout(reveal, ROUTE_SAFETY_MS);
      });
    },
    [router, cover, reveal],
  );

  // FIRST LOAD: run the cover immediately, lift once fonts + hero are ready.
  // Must stay declared after the gsap.context effect (it needs ctxRef).
  useEffect(() => {
    let cancelled = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const critical = Array.from(
      document.querySelectorAll<HTMLImageElement>('img[data-critical]'),
    ).map((img) => img.decode().catch(() => {}));

    const assets = Promise.race([
      Promise.all([document.fonts?.ready, ...critical]),
      new Promise((r) => setTimeout(r, ASSET_CAP_MS)),
    ]);

    const covered = reduced ? Promise.resolve() : new Promise<void>((resolve) => cover(resolve));

    Promise.all([covered, assets]).then(() => {
      if (cancelled) return;
      if (reduced) {
        gsap.set(overlayRef.current, { display: 'none' });
        state.current.busy = false;
      } else {
        reveal();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [cover, reveal]);

  // New route committed -> reveal
  useEffect(() => {
    const s = state.current;
    s.pathname = pathname;
    if (s.waiting) reveal();
  }, [pathname, reveal]);

  // Document-level interception for CMS-driven links (capture phase)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as Element).closest?.('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;

      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;

      e.preventDefault();
      e.stopPropagation();
      navigate(url.pathname + url.search);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionCtx.Provider value={value}>
      {children}

      {/* Server-rendered covering the page. cover()/reveal() take over after hydration. */}
      <div ref={overlayRef} className="tx-overlay fixed inset-0 z-[9999]" aria-hidden>
        <div className="tx-curtain absolute inset-0 bg-background" />

        <div className="absolute inset-0 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="tx-block h-full w-[calc(20%+1px)] -mr-px bg-neutral-950"
              style={{ transform: 'scaleY(0)' }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <p
            className="tx-brand flex overflow-hidden py-2 text-5xl font-semibold leading-tight tracking-tight text-white md:text-7xl"
            style={{ visibility: 'hidden' }}
          >
            {[...BRAND].map((char, i) => (
              <span key={i} className="tx-char inline-block">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </p>
        </div>

        <div className="tx-loader pointer-events-none absolute inset-0 opacity-0">
          <div className="absolute bottom-40 left-1/2 w-[200px] -translate-x-1/2">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[14px] uppercase tracking-[0.2em] text-white/50">Loading</span>

              <span
                ref={counterRef}
                className="tx-counter text-[14px] font-medium tabular-nums text-white"
              >
                0%
              </span>
            </div>

            <div className="h-[3px] w-full overflow-hidden bg-white/20">
              <div
                ref={barRef}
                className="tx-progress-bar h-full w-0 bg-white"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}
