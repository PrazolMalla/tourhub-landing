'use client';

import { ReadingText } from '@/components/common/ReadingText';
import { ArrowDown } from 'lucide-react';
import { useId, useState } from 'react';

type Props = {
  /** First item is always visible; the rest are collapsed. */
  paragraphs: string[];
  className?: string;
};

export function AboutReadMore({ paragraphs, className }: Props) {
  const [open, setOpen] = useState(false);
  const regionId = useId();
  const [first, ...rest] = paragraphs;

  return (
    <div className="mx-auto max-w-[62ch] text-center">
      <ReadingText text={first ?? ''} className={className} />

      {rest.length > 0 && (
        <>
          {/* grid-rows 0fr -> 1fr animates height without measuring it in JS */}
          <div
            id={regionId}
            inert={!open}
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
              open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              {rest.map((p, i) => (
                <p key={i} className={`${className} mt-6`}>
                  {p}
                </p>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={regionId}
            className="mt-8 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-gold underline-offset-8 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            {open ? 'Read less' : 'Read more'}
            <span
              aria-hidden
              className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            >
              <ArrowDown size={12} />
            </span>
          </button>
        </>
      )}
    </div>
  );
}
