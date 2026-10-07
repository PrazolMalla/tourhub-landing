'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

interface SectionHeaderProps {
  title?: string;
  eyebrow?: string;
  className?: string;
  titleClassName?: string;
  onDark?: boolean;
  align?: 'left' | 'center' | 'right';
}

const alignment = {
  left: {
    eyebrow: 'justify-start',
    titleWrap: 'items-start',
    title: 'text-left',
  },
  center: {
    eyebrow: 'justify-center',
    titleWrap: 'items-center',
    title: 'text-center',
  },
  right: {
    eyebrow: 'justify-end',
    titleWrap: 'items-end',
    title: 'text-right',
  },
} as const;

export default function SectionHeader({
  title,
  eyebrow,
  className = '',
  titleClassName = '',
  onDark = false,
  align = 'left',
}: SectionHeaderProps) {
  const text = onDark ? 'text-white' : 'text-[#181914]';
  const currentAlignment = alignment[align];

  const rootRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const titleEl = titleRef.current;
      if (!titleEl) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let split: SplitText | undefined;
        let cancelled = false;

        document.fonts.ready.then(() => {
          if (cancelled) return;

          split = SplitText.create(titleEl, {
            type: 'words,chars',
            autoSplit: true,
            onSplit(self) {
              gsap.set(titleEl, { autoAlpha: 1 });

              return gsap.from(self.chars, {
                autoAlpha: 0,
                filter: 'blur(6px)',
                yPercent: 25,
                duration: 0.35,
                ease: 'power2.out',
                stagger: { each: 0.035 },
                scrollTrigger: {
                  trigger: titleEl,
                  start: 'top 85%',
                  end: 'bottom top',
                  // onEnter | onLeave | onEnterBack | onLeaveBack
                  toggleActions: 'restart reset restart reset',
                },
              });
            },
          });
        });

        if (eyebrowRef.current) {
          gsap.from(eyebrowRef.current, {
            autoAlpha: 0,
            y: 12,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 88%',
              end: 'bottom top',
              toggleActions: 'restart reset restart reset',
            },
          });
        }

        return () => {
          cancelled = true;
          split?.revert();
        };
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(titleEl, { autoAlpha: 1 });
      });
    },
    {
      scope: rootRef,
      dependencies: [title],
    },
  );

  return (
    <div ref={rootRef} className={`relative flex w-full flex-col py-8 md:py-12 ${className}`}>
      {eyebrow && (
        <div ref={eyebrowRef} className={`mb-5 flex w-full ${currentAlignment.eyebrow}`}>
          <span
            className={`
              inline-flex
              items-center
              gap-[6px]
              rounded-full
              border
              px-3
              py-[6px]
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.22em]
              ${onDark ? 'border-white/15 text-white/70' : 'border-black/10 text-[#181914]/70'}
            `}
          >
            {eyebrow}
          </span>
        </div>
      )}

      <div className={`flex w-full flex-col gap-6 ${currentAlignment.titleWrap}`}>
        {title && (
          <h2
            ref={titleRef}
            aria-label={title}
            className={`
              invisible
              max-w-[640px]
              font-serif
              text-[clamp(30px,4vw,52px)]
              font-normal
              leading-[1.05]
              tracking-[-0.02em]
              ${text}
              ${currentAlignment.title}
              ${titleClassName}
            `}
          >
            {title}
          </h2>
        )}
      </div>
    </div>
  );
}
