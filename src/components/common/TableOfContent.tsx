'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

type Heading = { id: string; text: string; level: number };

/**
 * rail   = desktop sidebar (parent handles sticky positioning)
 * inline = mobile collapsible bar (parent handles sticky positioning)
 */
type Variant = 'rail' | 'inline';

// Distance from viewport top where a heading counts as "current". Match your navbar height + breathing room.
const SCROLL_OFFSET = 112;

function useActiveHeading(headings: Heading[]) {
  const [activeId, setActiveId] = React.useState(headings[0]?.id ?? '');

  React.useEffect(() => {
    if (!headings.length) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      let current = headings[0].id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= SCROLL_OFFSET) current = h.id;
        else break;
      }
      // Short last sections never reach the offset; at page bottom, the last heading wins.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = headings[headings.length - 1].id;
      setActiveId(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

  return [activeId, setActiveId] as const;
}

function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET + 1;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  window.history.replaceState(null, '', `#${id}`);
}

function Item({
  heading,
  state,
  focusable = true,
  onNavigate,
}: {
  heading: Heading;
  state: 'read' | 'active' | 'upcoming';
  focusable?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={`#${heading.id}`}
      tabIndex={focusable ? 0 : -1}
      aria-current={state === 'active' ? 'location' : undefined}
      onClick={(e) => {
        e.preventDefault();
        goTo(heading.id);
        onNavigate?.();
      }}
      className={cn(
        'block rounded-md py-1.5 pr-2 text-[13.5px] leading-snug transition-colors duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        heading.level >= 3 && 'pl-3 text-[13px]',
        state === 'active' && 'font-semibold text-foreground',
        state === 'read' && 'text-foreground/70 hover:text-foreground',
        state === 'upcoming' && 'text-muted-foreground hover:text-foreground',
      )}
    >
      <span className="line-clamp-2">{heading.text}</span>
    </a>
  );
}

export default function TableOfContents({
  headings,
  variant = 'rail',
}: {
  headings: Heading[];
  variant?: Variant;
}) {
  const [activeId] = useActiveHeading(headings);
  const [open, setOpen] = React.useState(false);
  const itemRefs = React.useRef<Map<string, HTMLLIElement>>(new Map());
  const [seg, setSeg] = React.useState({ top: 0, height: 0 });

  const activeIndex = Math.max(
    0,
    headings.findIndex((h) => h.id === activeId),
  );

  // Measure the active row so the gold segment can glide to it (rail only).
  React.useLayoutEffect(() => {
    if (variant !== 'rail') return;
    const el = itemRefs.current.get(activeId);
    if (el) setSeg({ top: el.offsetTop, height: el.offsetHeight });
  }, [activeId, variant, headings]);

  if (!headings.length) return null;

  const stateOf = (i: number) =>
    i === activeIndex ? 'active' : i < activeIndex ? 'read' : 'upcoming';

  if (variant === 'inline') {
    const panelId = 'toc-inline-panel';
    return (
      <div className="overflow-hidden rounded-xl border border-(--line) bg-white/90 shadow-sm backdrop-blur">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-3 px-4 py-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold"
        >
          <span className="text-sm font-semibold">On this page</span>
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
            {headings[activeIndex]?.text}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {activeIndex + 1} of {headings.length}
          </span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className={cn(
              'size-4 shrink-0 text-muted-foreground transition-transform duration-300',
              open && 'rotate-180',
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 7.5 5 5 5-5" />
          </svg>
        </button>

        <div
          id={panelId}
          aria-hidden={!open}
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <ul className="max-h-[50vh] space-y-0.5 overflow-y-auto border-t border-(--line) px-4 py-3">
              {headings.map((h, i) => (
                <li key={h.id}>
                  <Item
                    heading={h}
                    state={stateOf(i)}
                    focusable={open}
                    onNavigate={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav aria-label="Table of contents">
      <div className="mb-4 flex items-baseline justify-between">
        <p className="text-sm font-semibold">On this page</p>
        <span className="text-xs tabular-nums text-muted-foreground">
          {activeIndex + 1} of {headings.length}
        </span>
      </div>

      <div className="relative">
        {/* base rail */}
        <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-(--line)" />
        {/* trail: everything above the current section is "done" */}
        <span
          aria-hidden
          className="absolute left-0 top-0 w-px bg-gold/50 transition-[height] duration-300 ease-out motion-reduce:transition-none"
          style={{ height: seg.top }}
        />
        {/* current section */}
        <span
          aria-hidden
          className="absolute -left-px w-[3px] rounded-full bg-gold transition-[top,height] duration-300 ease-out motion-reduce:transition-none"
          style={{ top: seg.top, height: seg.height }}
        />

        <ol className="space-y-0.5 pl-5">
          {headings.map((h, i) => (
            <li
              key={h.id}
              ref={(el) => {
                if (el) itemRefs.current.set(h.id, el);
                else itemRefs.current.delete(h.id);
              }}
            >
              <Item heading={h} state={stateOf(i)} />
            </li>
          ))}
        </ol>
      </div>

      <button
        type="button"
        onClick={() => {
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        }}
        className="mt-5 pl-5 text-[13px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Back to top
      </button>
    </nav>
  );
}
