'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  src: string;
  /** Travel in % of the layer's own height, each direction. Keep ≤ 16 with the default overscan. */
  travel?: number;
  /** Tailwind classes for the scrim that keeps the form legible. */
  overlayClassName?: string;
};

export function ParallaxBackground({ src, travel = 12, overlayClassName = 'bg-ink/10' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const layer = layerRef.current;
    if (!wrap || !layer) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        layer,
        { yPercent: -travel },
        {
          yPercent: travel,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: wrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    });

    return () => mm.revert();
  }, [travel]);

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={layerRef}
        className="absolute inset-x-0 -top-1/4 -bottom-1/4 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${src})` }}
      />
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}
