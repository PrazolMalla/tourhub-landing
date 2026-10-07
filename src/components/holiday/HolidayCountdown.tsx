'use client';

import { useEffect, useState } from 'react';
import { parseDate } from '@/lib/holiday';
import { RADIUS } from '@/lib/theme';

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Start date has been reached. */
  done: boolean;
  /** End date has fully passed (festival over). */
  ended: boolean;
}

/** Compute the remaining time. Reads the clock — only ever called in callbacks. */
function compute(target: number, endTarget: number): Remaining {
  const now = Date.now();
  const ended = now > endTarget + 86_400_000;
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true, ended };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
    ended: false,
  };
}

interface HolidayCountdownProps {
  /** ISO start date (YYYY-MM-DD) to count down to. */
  startDate: string;
  /** ISO end date — used to show a "happening now" state. */
  endDate: string;
  /** Display label, e.g. "Dashain". */
  name: string;
  /** Render on a dark surface (lighter text). */
  onDark?: boolean;
}

const UNITS: { key: keyof Remaining; label: string }[] = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Mins' },
  { key: 'seconds', label: 'Secs' },
];

/** Live countdown timer to a holiday's start date. Hydration-safe. */
export function HolidayCountdown({ startDate, endDate, name, onDark }: HolidayCountdownProps) {
  const target = parseDate(startDate).getTime();
  const endTarget = parseDate(endDate).getTime();
  // Start null so server and first client render match; fill in after mount.
  const [t, setT] = useState<Remaining | null>(null);

  useEffect(() => {
    // Paint the first value on the next frame (not synchronously in the effect),
    // then tick every second. All clock reads stay inside callbacks.
    const raf = requestAnimationFrame(() => setT(compute(target, endTarget)));
    const id = setInterval(() => setT(compute(target, endTarget)), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [target, endTarget]);

  // Once started, treat as "happening" until the end date has fully passed.
  const happening = Boolean(t?.done && !t.ended);

  const boxCls = onDark
    ? 'bg-white/10 text-white'
    : 'bg-white text-ink shadow-[inset_0_0_0_1px_var(--line)]';
  const labelCls = onDark ? 'text-white/65' : 'text-muted';

  if (happening) {
    return (
      <div
        className={`inline-flex items-center gap-2 ${RADIUS} px-4 py-2.5 font-mono text-[12px] font-bold uppercase tracking-widest ${
          onDark ? 'bg-gold text-[#06210f]' : 'bg-green-btn text-white'
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
        {name} is happening now
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-stretch gap-2.5" aria-label={`Countdown to ${name}`}>
      {UNITS.map((u) => (
        <div
          key={u.key}
          className={`flex min-w-16 flex-col items-center ${RADIUS} px-3.5 py-2.5 ${boxCls}`}
        >
          <span className="font-serif text-[28px] leading-none tabular-nums">
            {t ? String(t[u.key]).padStart(2, '0') : '––'}
          </span>
          <span className={`mt-1 font-mono text-[10px] uppercase tracking-[0.12em] ${labelCls}`}>
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
