import type { Crumb } from '@/components/common/PageBanner';
import { Eyebrow } from '@/components/ui/typography';
import { waLink } from '@/data/site-config';
import { formatDateRange } from '@/lib/holiday';
import { RADIUS_CHIP } from '@/lib/theme';
import type { Holiday } from '@/types/holiday';
import Link from 'next/link';
import { Fragment } from 'react';
import { HeroHeading } from '../common/HeroHeading';
import { HolidayCountdown } from './HolidayCountdown';

interface FeaturedHolidayBannerProps {
  holiday: Holiday;
  /** When set, the banner doubles as the page hero (breadcrumbs + header gap). */
  crumbs?: Crumb[];
}

/**
 * Full-width featured holiday banner with a live countdown and high-conversion
 * CTAs. Driven by the next featured holiday (admin `is_featured`). Pass `crumbs`
 * to use it as the page hero (adds a breadcrumb nav and header-clearing space).
 */
export function FeaturedHolidayBanner({ holiday, crumbs }: FeaturedHolidayBannerProps) {
  const asHero = Boolean(crumbs?.length);
  return (
    <section
      className={`relative flex items-end overflow-hidden bg-ink text-white ${asHero ? 'min-h-[clamp(550px,40vh,430px)]' : ''}`}
    >
      <div className="absolute inset-0 z-0 after:absolute after:inset-0 after:content-[''] after:[background:linear-gradient(180deg,rgba(10,11,12,0.5)_0%,rgba(10,11,12,0.35)_45%,rgba(10,11,12,0.78)_100%)]">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${holiday.bannerImage})` }}
        />
      </div>

      <div
        className={`wrap relative z-2 ${
          asHero ? 'pt-35 pb-[clamp(40px,5vw,64px)]' : 'py-[clamp(48px,7vw,88px)]'
        }`}
      >
        <div className="max-w-[640px]">
          {crumbs?.length ? (
            <nav className="mb-4.5 flex flex-wrap items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-white/72">
              {crumbs.map((c, i) => (
                <Fragment key={c.label}>
                  {c.href ? (
                    <Link className="hover:text-white" href={c.href}>
                      {c.label}
                    </Link>
                  ) : (
                    <span>{c.label}</span>
                  )}
                  {i < crumbs.length - 1 ? <span className="opacity-50">/</span> : null}
                </Fragment>
              ))}
            </nav>
          ) : null}
          <Eyebrow onDark>Festival season offer</Eyebrow>
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/80">
              {formatDateRange(holiday.startDate, holiday.endDate)}
            </span>
            {holiday.discountPercentage > 0 ? (
              <span
                className={`bg-gold px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[#06210f] ${RADIUS_CHIP}`}
              >
                Save {holiday.discountPercentage}%
              </span>
            ) : null}
          </div>
          <HeroHeading title={holiday.name} subtitle={holiday.description} />

          <div className="mt-7">
            <HolidayCountdown
              startDate={holiday.startDate}
              endDate={holiday.endDate}
              name={holiday.name}
              onDark
            />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="btn btn-gold" href={`/holidays/${holiday.slug}`}>
              Explore treks
            </Link>
            <a
              className="btn btn-ghost-d"
              target="_blank"
              rel="noopener"
              href={waLink(`Hi! I'm interested in a ${holiday.name} trekking offer.`)}
            >
              Claim the offer
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
