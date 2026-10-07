'use client';

import { TripCard } from '@/components/common/TripCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Slider } from '@/components/ui/slider';
import type { ExploreRegion } from '@/lib/cms';
import { ROUTES } from '@/lib/constants';
import { PRIMARY, TEXT_MUTED } from '@/lib/theme';
import { fetchTours, type TripFacets } from '@/lib/toursApi';
import type { TripWithSlug } from '@/types/trip';
import { useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import { TextMasking } from '../about/TextMasking';

const PAGE_SIZE = 12;

const CHIPS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'trekking', label: 'Trekking' },
  { key: 'tours', label: 'Tours' },
  { key: 'city', label: 'City & Cultural' },
  { key: 'religious', label: 'Pilgrimage' },
  { key: 'helicopter', label: 'Heli & Luxury' },
  { key: 'adventure', label: 'Adventure' },
  { key: 'student', label: 'Student & Group' },
  { key: 'nightstay', label: 'Night Stays' },
];

const DURATIONS: { key: string; label: string }[] = [
  { key: 'd1', label: '1–3 Days' },
  { key: 'd2', label: '4–7 Days' },
  { key: 'd3', label: '8–15 Days' },
];

interface ToursListingProps {
  trips: TripWithSlug[];
  countryOptions: ExploreRegion[];
  regionOptions: ExploreRegion[];
  initialCat?: string;
  initialCountry?: string;
  initialRegion?: string;
}

const getPrice = (price?: string | number) =>
  typeof price === 'number' ? price : Number(price && price.replace(/,/g, ''));

const EMPTY_FACETS: TripFacets = { regions: {}, durations: {} };

function getVisiblePages(page: number, totalPages: number) {
  return Array.from({ length: totalPages }, (_, index) => index + 1).filter((pageNumber) => {
    if (totalPages <= 7) return true;
    return pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - page) <= 1;
  });
}

export function ToursListing({
  trips: initialTrips,
  countryOptions,
  regionOptions,
  initialCat,
  initialCountry,
  initialRegion,
}: ToursListingProps) {
  const searchParams = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);

  const [cat, setCat] = useState(searchParams.get('activity') ?? initialCat ?? 'all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [country, setCountry] = useState(searchParams.get('country') ?? initialCountry ?? '');
  const [regions, setRegions] = useState(() => {
    const requestedRegion = searchParams.get('destination') ?? initialRegion;
    return requestedRegion && regionOptions.some((region) => region.key === requestedRegion)
      ? [requestedRegion]
      : [];
  });
  const [durs, setDurs] = useState(() => {
    const duration = searchParams.get('duration');
    return duration ? [duration] : [];
  });
  const [page, setPage] = useState(1);

  const initialPrices = initialTrips.map((t) => getPrice(t.price));
  const minPrice = initialPrices.length ? Math.min(...initialPrices) : 0;
  const maxPrice = initialPrices.length ? Math.max(...initialPrices) : 0;

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [draftPriceRange, setDraftPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  const [trips, setTrips] = useState<TripWithSlug[]>(initialTrips);
  const [total, setTotal] = useState(initialTrips.length);
  const [facets, setFacets] = useState<TripFacets>(EMPTY_FACETS);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const visiblePages = getVisiblePages(page, totalPages);

  useEffect(() => {
    const controller = new AbortController();
    fetchTours(
      {
        cat,
        country: country || undefined,
        regions,
        durations: durs,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        page,
        limit: PAGE_SIZE,
      },
      controller.signal,
    )
      .then((result) => {
        setTrips(result.trips);
        setTotal(result.total);
        setFacets(result.facets);
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('Failed to load tours from backend', err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [cat, country, regions, durs, priceRange, page]);

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) => {
    setLoading(true);
    setPage(1);
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const selectCat = (key: string) => {
    setLoading(true);
    setPage(1);
    setCat(key);
  };

  const commitPriceRange = (value: [number, number]) => {
    setLoading(true);
    setPage(1);
    setPriceRange(value);
  };

  const changePage = (next: number) => {
    if (next < 1 || next > totalPages || next === page) return;
    setLoading(true);
    setPage(next);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const clearFilters = () => {
    setLoading(true);
    setPage(1);
    setCat('all');
    setCountry('');
    setRegions([]);
    setDurs([]);
    setPriceRange([minPrice, maxPrice]);
    setDraftPriceRange([minPrice, maxPrice]);
  };

  const activeFilters = [
    ...(cat !== 'all'
      ? [
          {
            key: 'category',
            label: CHIPS.find((item) => item.key === cat)?.label ?? cat,
            clear: () => {
              setLoading(true);
              setPage(1);
              setCat('all');
            },
          },
        ]
      : []),

    ...(country
      ? [
          {
            key: 'country',
            label: countryOptions.find((item) => item.key === country)?.label ?? country,
            clear: () => {
              setLoading(true);
              setPage(1);
              setCountry('');
            },
          },
        ]
      : []),

    ...regions.map((region) => ({
      key: `region-${region}`,
      label: regionOptions.find((item) => item.key === region)?.label ?? region,
      clear: () => toggle(regions, setRegions, region),
    })),

    ...durs.map((duration) => ({
      key: `duration-${duration}`,
      label: DURATIONS.find((item) => item.key === duration)?.label ?? duration,
      clear: () => toggle(durs, setDurs, duration),
    })),

    ...(priceRange[0] !== minPrice || priceRange[1] !== maxPrice
      ? [
          {
            key: 'price',
            label: `$${priceRange[0]} – $${priceRange[1]}`,
            clear: () => {
              setLoading(true);
              setPage(1);
              setPriceRange([minPrice, maxPrice]);
              setDraftPriceRange([minPrice, maxPrice]);
            },
          },
        ]
      : []),
  ];

  return (
    <section className="bg-white mt-[54px]">
      <div className="wrap">
        <div className="mb-[22px] flex items-center justify-between border-b border-[var(--line)] pb-[14px]">
          <div>
            <span className="font-sans text-[13px] font-semibold">{total} journeys</span>

            {loading && <span className={`ml-[8px] text-[12px] ${TEXT_MUTED}`}>Updating…</span>}
          </div>

          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="group flex items-center gap-[9px] rounded-full border border-[var(--line)] bg-white px-[15px] py-[9px] font-sans text-[12px] font-bold transition-all hover:border-[var(--ink)]"
          >
            <span className="flex flex-col gap-[3px]">
              <span className="block h-[1.5px] w-[13px] bg-current" />
              <span className="block h-[1.5px] w-[9px] bg-current" />
              <span className="block h-[1.5px] w-[13px] bg-current" />
            </span>
            Filters
            {(cat !== 'all' || country || regions.length > 0 || durs.length > 0) && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--green-btn)] px-[5px] text-[9px] text-white">
                {
                  [cat !== 'all', !!country, regions.length > 0, durs.length > 0].filter(Boolean)
                    .length
                }
              </span>
            )}
          </button>
        </div>

        {activeFilters.length > 0 && (
          <div className="mb-[24px] flex flex-wrap items-center gap-[7px]">
            <span className={`mr-[3px] text-[11px] font-medium ${TEXT_MUTED}`}>Filters:</span>

            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={filter.clear}
                className="group inline-flex items-center gap-[7px] rounded-full border border-[var(--line)] bg-white py-[6px] pl-[11px] pr-[7px] font-sans text-[11px] font-semibold transition-all hover:border-[var(--ink)] hover:bg-[#f7f7f3]"
              >
                <span>{filter.label}</span>

                <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#f1f1ed] text-[12px] leading-none text-[#777] transition-colors group-hover:bg-[#deded8] group-hover:text-ink">
                  ×
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={clearFilters}
              className={`ml-[3px] text-[11px] font-semibold underline underline-offset-[3px] ${TEXT_MUTED} transition-colors hover:text-ink`}
            >
              Clear all
            </button>
          </div>
        )}

        <div
          ref={gridRef}
          className="list-grid scroll-mt-[24px]"
          style={{
            opacity: loading ? 0.6 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {trips.length > 0 ? (
            trips.map((trip, i) => (
              <TripCard key={trip.slug} trip={trip} index={i} priority={i < 4} />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                title="No trips match your filters"
                description="Try widening your search — fewer regions or a different duration."
                action={
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            </div>
          )}
        </div>

        <Pagination className="mt-[56px] mb-[40px]">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  changePage(page - 1);
                }}
                className={page === 1 ? 'pointer-events-none opacity-40' : ''}
              />
            </PaginationItem>

            {visiblePages.map((pageNumber, index) => {
              const previousPage = visiblePages[index - 1];

              return (
                <Fragment key={pageNumber}>
                  {previousPage && pageNumber - previousPage > 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNumber}
                      aria-label={`Page ${pageNumber}`}
                      onClick={(event) => {
                        event.preventDefault();
                        changePage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                </Fragment>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  changePage(page + 1);
                }}
                className={page === totalPages ? 'pointer-events-none opacity-40' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <TextMasking
        src="/assets/videos/trekking2.mp4"
        masking="Can't Find Your Trip"
        href={ROUTES.contact}
        ctaLabel="Contact Us"
        quote="Sometimes, the road less traveled leads to the places you were meant to find."
      />

      {filterOpen && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[2px]"
            onClick={() => setFilterOpen(false)}
          />

          <aside className="absolute right-0 top-0 flex h-full w-[min(430px,92vw)] flex-col bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.12)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-[24px] py-[20px]">
              <div>
                <p
                  className={`m-0 mb-[3px] text-[10px] font-bold uppercase tracking-[0.12em] ${TEXT_MUTED}`}
                >
                  Refine your search
                </p>

                <h3 className="m-0 font-sans text-[20px] font-extrabold tracking-[-0.025em]">
                  Filters
                </h3>
              </div>

              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFilterOpen(false)}
                className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#f5f5f1] text-[18px] transition-colors hover:bg-[#eaeae5]"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-[24px] py-[24px]">
              <div className="pb-[25px]">
                <div className="mb-[13px] flex items-center justify-between">
                  <h4 className="m-0 font-sans text-[12px] font-extrabold uppercase tracking-[0.07em]">
                    Journey type
                  </h4>

                  {cat !== 'all' && (
                    <button
                      type="button"
                      onClick={() => {
                        setLoading(true);
                        setPage(1);
                        setCat('all');
                      }}
                      className={`text-[10px] font-semibold ${TEXT_MUTED} hover:text-ink`}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-[7px]">
                  {CHIPS.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => selectCat(c.key)}
                      className={
                        cat === c.key
                          ? `${PRIMARY} rounded-[8px] px-[12px] py-[11px] text-left font-sans text-[11px] font-bold text-white`
                          : `rounded-[8px] border border-[var(--line)] bg-white px-[12px] py-[11px] text-left font-sans text-[11px] font-semibold ${TEXT_MUTED} transition-colors hover:border-[var(--ink)] hover:text-ink`
                      }
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--line)]" />

              <div className="py-[25px]">
                <h4 className="m-0 mb-[13px] font-sans text-[12px] font-extrabold uppercase tracking-[0.07em]">
                  Country
                </h4>

                <div className="space-y-[3px]">
                  {countryOptions.map((option) => (
                    <label
                      key={option.key}
                      className={`flex cursor-pointer items-center gap-[10px] rounded-[8px] px-[10px] py-[9px] text-[13px] ${TEXT_MUTED} transition-colors hover:bg-[#f6f6f2] hover:text-ink`}
                    >
                      <input
                        type="radio"
                        name="country"
                        className="h-[15px] w-[15px] [accent-color:var(--green-btn)]"
                        checked={country === option.key}
                        onChange={() => {
                          setLoading(true);
                          setPage(1);
                          setCountry(option.key);
                        }}
                      />

                      {option.label}
                    </label>
                  ))}
                </div>

                {country && (
                  <button
                    type="button"
                    className={`mt-[7px] text-[10px] font-semibold ${TEXT_MUTED} hover:text-ink`}
                    onClick={() => {
                      setLoading(true);
                      setPage(1);
                      setCountry('');
                    }}
                  >
                    View all countries
                  </button>
                )}
              </div>

              <div className="border-t border-[var(--line)]" />

              <div className="py-[25px]">
                <div className="mb-[13px] flex items-center justify-between">
                  <h4 className="m-0 font-sans text-[12px] font-extrabold uppercase tracking-[0.07em]">
                    Destination
                  </h4>

                  {regions.length > 0 && (
                    <span className={`text-[10px] ${TEXT_MUTED}`}>{regions.length} selected</span>
                  )}
                </div>

                <div className="space-y-[3px]">
                  {regionOptions.map((r) => (
                    <label
                      key={r.key}
                      className={`flex cursor-pointer items-center gap-[10px] rounded-[8px] px-[10px] py-[9px] text-[13px] ${TEXT_MUTED} transition-colors hover:bg-[#f6f6f2] hover:text-ink`}
                    >
                      <input
                        type="checkbox"
                        className="h-[15px] w-[15px] [accent-color:var(--green-btn)]"
                        checked={regions.includes(r.key)}
                        onChange={() => toggle(regions, setRegions, r.key)}
                      />

                      <span className="flex-1">{r.label}</span>

                      <span className="text-[10px]">{facets.regions[r.key] || 0}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--line)]" />

              <div className="py-[25px]">
                <h4 className="m-0 mb-[13px] font-sans text-[12px] font-extrabold uppercase tracking-[0.07em]">
                  Duration
                </h4>

                <div className="space-y-[3px]">
                  {DURATIONS.map((d) => (
                    <label
                      key={d.key}
                      className={`flex cursor-pointer items-center gap-[10px] rounded-[8px] px-[10px] py-[9px] text-[13px] ${TEXT_MUTED} transition-colors hover:bg-[#f6f6f2] hover:text-ink`}
                    >
                      <input
                        type="checkbox"
                        className="h-[15px] w-[15px] [accent-color:var(--green-btn)]"
                        checked={durs.includes(d.key)}
                        onChange={() => toggle(durs, setDurs, d.key)}
                      />

                      <span className="flex-1">{d.label}</span>

                      <span className="text-[10px]">{facets.durations[d.key] || 0}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--line)]" />

              <div className="py-[25px]">
                <div className="mb-[15px] flex items-center justify-between">
                  <h4 className="m-0 font-sans text-[12px] font-extrabold uppercase tracking-[0.07em]">
                    Price range
                  </h4>

                  <span className={`text-[10px] ${TEXT_MUTED}`}>USD</span>
                </div>

                <Slider
                  value={draftPriceRange}
                  min={minPrice}
                  max={maxPrice}
                  step={50}
                  onValueChange={(value) => setDraftPriceRange(value as [number, number])}
                  onValueCommitted={(value) => commitPriceRange(value as [number, number])}
                />

                <div className="mt-[14px] flex items-center justify-between">
                  <span className="rounded-[6px] bg-[#f5f5f1] px-[9px] py-[6px] text-[11px] font-semibold">
                    ${draftPriceRange[0]}
                  </span>

                  <span className="mx-[10px] h-px flex-1 bg-[var(--line)]" />

                  <span className="rounded-[6px] bg-[#f5f5f1] px-[9px] py-[6px] text-[11px] font-semibold">
                    ${draftPriceRange[1]}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--line)] bg-white p-[18px]">
              <div className="flex gap-[8px]">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex-1 rounded-[8px] border border-[var(--line)] px-[15px] py-[12px] font-sans text-[11px] font-bold transition-colors hover:border-[var(--ink)]"
                >
                  Clear filters
                </button>

                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className={`flex-[1.5] ${PRIMARY} rounded-[8px] px-[15px] py-[12px] font-sans text-[11px] font-bold text-white`}
                >
                  Show {total} journeys
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
