import { CalendarDays, Hourglass } from 'lucide-react';
import Link from 'next/link';

import { ImageSlot } from '@/components/common/ImageSlot';
import { RADIUS } from '@/lib/theme';

interface BlogCardProps {
  p: {
    slug: string;
    heroImage: string;
    heroAlt?: string;
    category: string;
    dateLabel: string;
    /** ISO date, e.g. "2026-03-27". Drives the round date badge. */
    publishedAt?: string;
    readTime: string;
    title: string;
    /** One-line teaser shown under the title. */
    excerpt?: string;
  };
  index?: number;
}

function getDateParts(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: d.getUTCDate(),
    month: d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
  };
}

export function BlogCard({ p, index = 0 }: BlogCardProps) {
  const date = getDateParts(p.publishedAt);

  return (
    <Link
      href={`/blog/${p.slug}`}
      aria-label={`Read article: ${p.title}`}
      className={`group h-full w-full flex-col overflow-hidden bg-white ${RADIUS} border transition-shadow duration-300 hover:shadow-[0_4px_0px_rgba(15,10,22,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep ${
        index === 3 ? 'hidden xl:flex' : 'flex'
      }`}
    >
      {/* Media */}
      <div className="relative aspect-[1.6] w-full overflow-hidden">
        <ImageSlot
          src={p.heroImage}
          alt={p.heroAlt || p.title}
          sizes="(max-width: 860px) 90vw, 25vw"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Date badge */}
        {date && (
          <span
            className="
              absolute right-4 top-4 z-10
              flex h-[56px] w-[56px] flex-col items-center justify-center
              rounded-full bg-gold-deep text-white
              shadow-[0_2px_8px_rgba(0,0,0,0.18)]
            "
          >
            <span className="text-[18px] font-bold leading-none tabular-nums">{date.day}</span>
            <span className="mt-[3px] text-[10px] font-semibold uppercase leading-none tracking-[0.06em]">
              {date.month}
            </span>
          </span>
        )}

        {/* Category tag, flush to the photo's bottom-left */}
        <span className="absolute bottom-0 left-0 z-10 bg-gold-deep px-4 py-2 text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-white">
          {p.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-2 text-[22px] font-bold leading-[1.25] tracking-[-0.01em] text-slate-900">
          {p.title}
        </h3>

        {/* {p.excerpt && (
          <p className="mt-2 line-clamp-2 text-[16px] leading-snug text-ink-2/60">{p.excerpt}</p>
        )} */}

        {/* Meta */}
        <div className="mt-auto flex items-center gap-5 pt-6 text-[13px] text-ink-2/60">
          <span className="inline-flex items-center gap-1.5">
            <Hourglass className="h-[15px] w-[15px]" aria-hidden />
            {p.readTime}
          </span>

          {/* No publishedAt? Fall back to the text date so it's never lost */}
          {!date && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-[15px] w-[15px]" aria-hidden />
              {p.dateLabel}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
