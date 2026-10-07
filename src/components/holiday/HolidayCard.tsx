import { ImageSlot } from '@/components/common/ImageSlot';
import { ArrowRightIcon, CalendarCheckIcon } from '@/components/icons';
import { daysUntil, formatDateRange } from '@/lib/holiday';
import { PRIMARY, RADIUS_CHIP, RADIUS_FULL } from '@/lib/theme';
import type { Holiday } from '@/types/holiday';
import Link from 'next/link';

interface HolidayCardProps {
  holiday: Holiday;
  index?: number;
  priority?: boolean;
}

export function HolidayCard({ holiday, index = 0, priority }: HolidayCardProps) {
  const days = daysUntil(holiday.startDate);

  const countdownLabel =
    days > 0 ? `In ${days} day${days === 1 ? '' : 's'}` : days === 0 ? 'Starting Today' : 'On Now';

  return (
    <Link
      href={`/holidays/${holiday.slug}`}
      aria-label={holiday.name}
      className="reveal group relative block aspect-3/4 overflow-hidden"
      style={{ animationDelay: `${(index % 3) * 0.09}s` }}
      suppressHydrationWarning
    >
      <ImageSlot
        src={holiday.bannerImage}
        alt={holiday.name}
        priority={priority}
        sizes="(max-width:620px) 84vw,(max-width:980px) 50vw,33vw"
        className="absolute inset-0 [--slot-bg:#e7e1d5] transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/40" />

      {/* Top */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-start justify-between">
        {holiday.discountPercentage > 0 ? (
          <span
            className={`${PRIMARY} text-white font-mono text-[10.5px] font-bold tracking-widest uppercase px-2.75 py-1.5 ${RADIUS_CHIP}`}
          >
            Save {holiday.discountPercentage}%
          </span>
        ) : (
          <span
            className={`${PRIMARY} text-white font-mono text-[10.5px] font-bold tracking-widest uppercase px-2.75 py-1.5 ${RADIUS_CHIP}`}
          >
            Festival
          </span>
        )}

        <span className="bg-black/35 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.08em] text-white">
          {countdownLabel}
        </span>
      </div>

      {/* Bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 flex flex-col gap-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/75 flex items-center gap-2">
          <CalendarCheckIcon className="w-3.5 h-3.5" />
          {formatDateRange(holiday.startDate, holiday.endDate)}
        </div>

        <h3 className="font-serif text-[24px] leading-[1.08] tracking-[-0.01em] text-white">
          {holiday.name}
        </h3>

        <p className="line-clamp-2 text-[14px] leading-6 text-white/80">{holiday.description}</p>

        <div className="flex items-center justify-between border-t border-white/20 pt-3.5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
              Recommended
            </div>

            <div className="font-serif text-[22px] text-white">
              {holiday.recommendedTreks.length}{' '}
              <span className="font-sans text-[13px] text-white/70">
                Trek{holiday.recommendedTreks.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div
            className={`w-11 h-11 ${RADIUS_FULL} bg-white/15 backdrop-blur flex items-center justify-center text-white transition-all duration-300 group-hover:bg-green-btn`}
          >
            <ArrowRightIcon className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
