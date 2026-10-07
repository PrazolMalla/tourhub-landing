'use client';

import { HolidayCard } from '@/components/holiday/HolidayCard';
import { SearchIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { sortHolidays } from '@/lib/holiday';
import { fetchHolidays } from '@/services/holidays.public';
import { BORDER, RADIUS, RADIUS_SM, TEXT, TEXT_MUTED } from '@/lib/theme';
import type { Holiday, HolidaySort } from '@/types/holiday';
import { useCallback, useEffect, useMemo, useState } from 'react';

const REGIONS: { key: string; label: string }[] = [
  { key: 'everest', label: 'Everest' },
  { key: 'annapurna', label: 'Annapurna' },
  { key: 'langtang', label: 'Langtang' },
  { key: 'manaslu', label: 'Manaslu' },
  { key: 'mustang', label: 'Mustang' },
];

const SORTS: { key: HolidaySort; label: string }[] = [
  { key: 'date-asc', label: 'Date — soonest first' },
  { key: 'date-desc', label: 'Date — latest first' },
  { key: 'name-asc', label: 'Name — A to Z' },
  { key: 'discount-desc', label: 'Biggest discount' },
];

const PAGE_SIZE = 8;

interface HolidaysListingProps {
  holidays: Holiday[];
}

/** Holidays listing — search by name, filter by region (sidebar), sort and
 *  paginate. Filters query the backend `/holidays/public` endpoint (with backend
 *  pagination); falls back to client-side filtering of the SSR data if the API
 *  is unreachable so it never breaks. */
export function HolidaysListing({ holidays }: HolidaysListingProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [regions, setRegions] = useState<string[]>([]);
  const [sort, setSort] = useState<HolidaySort>('date-asc');
  const [page, setPage] = useState(1);

  // Displayed page + total come from the backend; seeded with the SSR data for
  // an instant first paint.
  const [items, setItems] = useState<Holiday[]>(() =>
    sortHolidays(holidays, 'date-asc').slice(0, PAGE_SIZE),
  );
  const [total, setTotal] = useState(holidays.length);

  // Region facet counts stay computed from the full SSR set (all options shown).
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    holidays.forEach((h) => {
      h.regions.forEach((r) => {
        counts[r] = (counts[r] || 0) + 1;
      });
    });
    return counts;
  }, [holidays]);

  // Debounce the search box so we don't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Client-side filter of the SSR data — used as the offline fallback.
  const clientResult = useCallback(
    (q: string, regs: string[], srt: HolidaySort, pg: number) => {
      const ql = q.trim().toLowerCase();
      const list = holidays.filter((h) => {
        const okRegion = regs.length === 0 || h.regions.some((r) => regs.includes(r));
        const okQuery =
          ql === '' ||
          h.name.toLowerCase().includes(ql) ||
          h.description.toLowerCase().includes(ql) ||
          h.seoKeywords.some((k) => k.toLowerCase().includes(ql));
        return okRegion && okQuery;
      });
      const sorted = sortHolidays(list, srt);
      return { items: sorted.slice((pg - 1) * PAGE_SIZE, pg * PAGE_SIZE), total: sorted.length };
    },
    [holidays],
  );

  // Query the backend whenever a filter / page changes.
  useEffect(() => {
    let cancelled = false;
    fetchHolidays({ search: debouncedQuery, regions, sort, page, limit: PAGE_SIZE })
      .then((res) => {
        if (!cancelled) {
          setItems(res.items);
          setTotal(res.total);
        }
      })
      .catch(() => {
        if (!cancelled) {
          const r = clientResult(debouncedQuery, regions, sort, page);
          setItems(r.items);
          setTotal(r.total);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, regions, sort, page, clientResult]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const pageItems = items;

  // Reset to page 1 whenever a filter changes.
  const resetTo = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const toggleRegion = (val: string) =>
    resetTo(() =>
      setRegions((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val])),
    );

  const clearAll = () => {
    setQuery('');
    setRegions([]);
    setSort('date-asc');
    setPage(1);
  };

  const hasActiveFilters = query !== '' || regions.length > 0 || sort !== 'date-asc';

  return (
    <section className="bg-paper [padding-block:var(--section-py)]">
      <div className="wrap">
        <div className="mb-[30px] flex flex-wrap items-center justify-between gap-[18px]">
          <div className={`font-mono text-[12px] uppercase tracking-[0.08em] ${TEXT_MUTED}`}>
            <b className={TEXT}>{total}</b> holiday{total === 1 ? '' : 's'} found
          </div>
          <div className="flex items-center gap-[10px]">
            <label className="sr-only" htmlFor="holiday-sort">
              Sort holidays
            </label>
            <select
              id="holiday-sort"
              value={sort}
              onChange={(e) => resetTo(() => setSort(e.target.value as HolidaySort))}
              className={`${RADIUS_SM} border border-line bg-white px-4 py-[13px] text-[14px] font-semibold ${TEXT} outline-none transition-colors focus:border-gold`}
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-[248px_1fr] items-start gap-[30px] max-[980px]:grid-cols-[1fr]">
          <aside
            className={`reveal sticky top-[100px] ${RADIUS} ${BORDER} bg-white p-[22px] max-[980px]:static`}
            suppressHydrationWarning
          >
            <div className="border-t border-[var(--line)] py-[16px] first-of-type:border-t-0 first-of-type:pt-0">
              <h4 className="m-0 mb-[14px] font-sans text-[13px] font-extrabold uppercase tracking-[0.06em]">
                Search
              </h4>
              <div className="relative">
                <SearchIcon
                  className={`pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 ${TEXT_MUTED}`}
                />
                <Input
                  type="search"
                  placeholder="Dashain, autumn, Annapurna…"
                  value={query}
                  onChange={(e) => resetTo(() => setQuery(e.target.value))}
                  className="pl-9"
                  aria-label="Search holidays"
                />
              </div>
            </div>

            <div className="border-t border-[var(--line)] py-[16px]">
              <h4 className="m-0 mb-[14px] font-sans text-[13px] font-extrabold uppercase tracking-[0.06em]">
                Region
              </h4>
              {REGIONS.map((r) => (
                <label
                  className={`flex cursor-pointer items-center gap-[10px] py-[7px] text-[14.5px] ${TEXT_MUTED} hover:text-ink`}
                  key={r.key}
                >
                  <input
                    type="checkbox"
                    className="h-[16px] w-[16px] [accent-color:var(--green-btn)]"
                    checked={regions.includes(r.key)}
                    onChange={() => toggleRegion(r.key)}
                  />{' '}
                  {r.label}{' '}
                  <span className={`ml-auto font-mono text-[11px] ${TEXT_MUTED}`}>
                    {regionCounts[r.key] || 0}
                  </span>
                </label>
              ))}
            </div>

            {hasActiveFilters && (
              <div className="border-t border-[var(--line)] py-[16px]">
                <Button variant="ghost" onClick={clearAll} className="w-full">
                  Clear filters
                </Button>
              </div>
            )}
          </aside>

          <div>
            {pageItems.length > 0 ? (
              <>
                <div className="grid grid-cols-4 gap-6 max-[1200px]:grid-cols-3 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1">
                  {pageItems.map((h, i) => (
                    <HolidayCard key={h.id} holiday={h} index={i} priority={i < 3} />
                  ))}
                </div>
                {/* <Pagination
                  className="mt-12"
                  page={current}
                  pageCount={pageCount}
                  onChange={setPage}
                /> */}
              </>
            ) : (
              <EmptyState
                title="No holidays match your search"
                description="Try a different festival name or clear the region filter."
                action={
                  <Button variant="ghost" onClick={clearAll}>
                    Clear filters
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
