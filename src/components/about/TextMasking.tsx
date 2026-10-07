'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  src: string;
  masking: string;
  href: string;
  ctaLabel: string;
  quote: string;
};

export function TextMasking({ src, masking, href, ctaLabel, quote }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const maskLayer = useRef<HTMLDivElement>(null);
  const maskText = useRef<HTMLHeadingElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const quoteEl = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=250%',
            pin: stage.current,
            scrub: 0.6,
            anticipatePin: 1,
            // invalidateOnRefresh removed: start values are explicit now
          },
        });

        tl.fromTo(img.current, { scale: 1 }, { scale: 1.25, duration: 1 }, 0)
          .fromTo(
            maskText.current,
            { scale: 1 },
            { scale: 60, ease: 'power3.in', duration: 0.55 },
            0,
          )
          // plain opacity, no visibility toggle: the layer is aria-hidden and
          // pointer-events-none, so it doesn't need to leave the render tree
          .fromTo(maskLayer.current, { opacity: 1 }, { opacity: 0, duration: 0.25 }, 0.35)
          .fromTo(shade.current, { opacity: 0 }, { opacity: 0.55, duration: 0.3 }, 0.5)
          .fromTo(
            quoteEl.current,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.2 },
            0.7,
          );
      });
      // Reduced motion: no pin, no zoom, quote and CTA simply visible
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(maskLayer.current, { autoAlpha: 0 });
        gsap.set(shade.current, { opacity: 0.3 });
        gsap.set(quoteEl.current, { autoAlpha: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-ink">
      <div ref={stage} className="relative isolate h-svh overflow-hidden">
        {/* Real heading for screen readers / SEO; the masked one is decorative */}
        <h2 className="sr-only">{masking}</h2>

        {/* 1. Image */}
        <div ref={img} className="absolute inset-0 will-change-transform">
          <video
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>

        {/* 2. Mask: black layer + white text, multiply => src shows only through the letters */}
        <div
          ref={maskLayer}
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black mix-blend-multiply"
        >
          <span
            ref={maskText}
            className="block text-center font-black uppercase leading-[0.9] tracking-tight text-white will-change-transform text-[clamp(40px,10vw,180px)] max-w-[70%]"
          >
            {masking}
          </span>
        </div>

        {/* 3. Shade for quote legibility */}
        <div ref={shade} className="absolute inset-0 bg-black opacity-0" />

        {/* 4. Quote + CTA. `invisible` until GSAP reveals it, so no flash before hydration
            and no tabbing into an invisible link (autoAlpha toggles visibility) */}
        <div
          ref={quoteEl}
          className="invisible absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-white opacity-0"
        >
          <figure className="max-w-3xl">
            <p className=" text-[12px] uppercase tracking-[0.18em] text-white/80">
              The Journey Awaits
            </p>
            <span aria-hidden className="mt-5 block font-serif text-[64px] leading-[0.6] text-gold">
              &ldquo;
            </span>
            <blockquote className="mt-2 font-serif text-[clamp(26px,4vw,48px)] leading-tight">
              {quote}
            </blockquote>
            <div className="mt-8">
              <Link className="btn btn-gold rounded-lg" href={href}>
                {ctaLabel}
              </Link>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
