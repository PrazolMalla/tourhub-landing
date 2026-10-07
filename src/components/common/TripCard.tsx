'use client';

import { regionShort } from '@/data/trips';
import { getTripPath } from '@/lib/trip-route';
import type { TripWithSlug } from '@/types/trip';
import {
  ArrowRight,
  CalendarDays,
  Flame,
  MapPin,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TripGallery } from './TripGalley';

const BADGE_STYLES: Record<string, { Icon: LucideIcon; color: string }> = {
  'Top Rated': { Icon: Flame, color: 'text-[#f97316]' },
  Classic: { Icon: Star, color: 'text-[#2563eb]' },
  'Great for groups': { Icon: Users, color: 'text-[#16a34a]' },
};

interface TripCardProps {
  trip: TripWithSlug;
  index?: number;
  showFav?: boolean;
  priority?: boolean;
}

export function TripCard({ trip, index = 0, priority }: TripCardProps) {
  const router = useRouter();

  const region = regionShort(trip);

  const numericPrice = Number(String(trip.price ?? '').replace(/[^0-9.]/g, ''));

  const hasPrice = Number.isFinite(numericPrice) && numericPrice > 0;

  const formattedPrice = hasPrice ? new Intl.NumberFormat('en-US').format(numericPrice) : null;

  const badge = trip.badge ? (BADGE_STYLES[trip.badge] ?? BADGE_STYLES['Top Rated']) : null;

  const gallery = trip.gallery?.length ? trip.gallery : [trip.img];

  const tripPath = getTripPath(trip);

  return (
    <article
      className="
        trip reveal group
        flex w-full flex-col
        cursor-pointer
        rounded-[24px] bg-white p-3
        
        hover:shadow-[0_5px_8px_rgba(15,10,22,0.14)]!
      "
      style={{
        animationDelay: `${(index % 5) * 0.06}s`,
      }}
      onClick={() => router.push(tripPath)}
    >
      {/* Media */}
      <div className="relative aspect-[1.6] w-full overflow-hidden rounded-[14px] bg-transparent">
        <TripGallery images={gallery} alt={trip.title} priority={priority} />

        {badge && (
          <span
            className={`
              absolute left-3 top-3 z-10
              inline-flex items-center gap-1.5
              rounded-full bg-white px-3 py-1.5
              text-[12px] font-semibold leading-none
              ${badge.color}
              shadow-[0_2px_8px_rgba(0,0,0,0.10)]
            `}
          >
            <badge.Icon className="h-[14px] w-[14px]" aria-hidden />
            {trip.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-0.5 pt-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
          <MapPin className="h-[14px] w-[14px]" aria-hidden />
          <span>{region}</span>
        </div>

        <h3 className="mt-2 text-[19px] font-semibold leading-tight tracking-[-0.01em] text-slate-900">
          {trip.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-slate-500">
          {trip.days && (
            <span className="inline-flex items-center gap-1.5 text-slate-700">
              <CalendarDays className="h-[14px] w-[14px]" aria-hidden />
              {trip.days} Days
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-3">
          <div className="border-t border-slate-100 pt-3">
            <p className="flex items-baseline gap-1.5 text-slate-900">
              {hasPrice ? (
                <>
                  <span className="text-[12px] text-slate-500">From</span>

                  <span className="text-[22px] font-semibold leading-none tracking-[-0.01em] tabular-nums">
                    USD {formattedPrice}
                  </span>
                </>
              ) : (
                <span className="text-[15px] font-semibold">
                  {trip.price || 'Price on request'}
                </span>
              )}
            </p>
          </div>

          <Link
            href={tripPath}
            aria-label={`View package: ${trip.title}`}
            onClick={(e) => e.stopPropagation()}
            className="
              mt-3 flex h-11 w-full items-center justify-center gap-2
              bg-gold
              text-[13px] font-semibold text-white
              transition-colors duration-200
              hover:bg-gold-deep hover:text-white
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-gold-deep
            "
          >
            View Package
            <ArrowRight
              className="
                h-4 w-4
                transition-transform duration-200
                group-hover:translate-x-0.5
              "
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
