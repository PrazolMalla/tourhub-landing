import { HolidayCard } from '@/components/holiday/HolidayCard';
import { ROUTES } from '@/lib/constants';
import { upcomingHolidays } from '@/lib/holiday';
import type { Holiday } from '@/types/holiday';
import Link from 'next/link';
import SectionHeader from '../common/SectionHeader';

interface UpcomingHolidaysProps {
  holidays: Holiday[];
  /** Max cards to show. */
  limit?: number;
  /** Heading + eyebrow overrides (package pages reuse this). */
  eyebrow?: string;
  title?: string;
  /** Use the off-white surface instead of paper. */
  alt?: boolean;
}

/**
 * "Upcoming festivals & holidays" rail — reused on the homepage and trek/package
 * pages to surface holiday-season treks and discounts.
 */
export function UpcomingHolidays({
  holidays,
  limit = 4,
  eyebrow = 'Plan around the festivals',
  title = 'Upcoming Nepal holidays & festivals',
  alt,
}: UpcomingHolidaysProps) {
  const items = upcomingHolidays(holidays, limit);
  if (items.length === 0) return null;

  return (
    <section className={`section ${alt ? 'bg-paper-2' : 'bg-paper'}`}>
      <div className="wrap">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div className="mt-2 grid grid-cols-4 gap-6 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
          {items.map((h, i) => (
            <HolidayCard key={h.id} holiday={h} index={i} />
          ))}
          <div className="col-span-full flex justify-center mt-6  mb-[-30px]">
            <Link className="btn btn-ghost" href={ROUTES.holidays}>
              View all holidays
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
