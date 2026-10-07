'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ReadingTextProps {
  text: string;
  className?: string;
  /** Opacity words start at before they are highlighted. */
  startOpacity?: number;
  /** Seconds between each word lighting up. */
  wordDelay?: number;
}

/** Words brighten one by one automatically, guiding the eye through the text. */
export function ReadingText({
  text,
  className,
  startOpacity = 0.2,
  wordDelay = 0.08,
}: ReadingTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.rt-word',
          { opacity: startOpacity },
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power1.out',
            stagger: wordDelay,
            // Starts once when the paragraph enters view, then plays on its own clock.
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 85%',
              once: true,
            },
          },
        );
      });

      // Respect users who opt out of motion: full opacity, no animation.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.rt-word', { opacity: 1 });
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="rt-word inline-block" style={{ opacity: startOpacity }}>
          {word}&nbsp;
        </span>
      ))}
    </p>
  );
}
