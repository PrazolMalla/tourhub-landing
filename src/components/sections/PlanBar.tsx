'use client';
import { SearchIcon } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROUTES } from '@/lib/constants';
import { TEXT, TEXT_MUTED } from '@/lib/theme';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const FIELDS = [
  {
    key: 'destination',
    label: 'Destination',
    options: [
      { value: 'everest', label: 'Everest' },
      { value: 'annapurna', label: 'Annapurna' },
      { value: 'langtang', label: 'Langtang' },
      { value: 'manaslu', label: 'Manaslu' },
      { value: 'mustang', label: 'Mustang / Muktinath' },
      { value: 'east', label: 'East Nepal' },
    ],
  },
  {
    key: 'activity',
    label: 'Activity',
    options: [
      { value: 'trekking', label: 'Trekking' },
      { value: 'adventure', label: 'Adventure' },
      { value: 'religious', label: 'Pilgrimage' },
      { value: 'helicopter', label: 'Heli & Luxury' },
      { value: 'city', label: 'City & Cultural' },
      { value: 'student', label: 'Student & Group' },
      { value: 'nightstay', label: 'Night Stays' },
    ],
  },
  {
    key: 'duration',
    label: 'Duration',
    options: [
      { value: 'd1', label: '1–3 Days' },
      { value: 'd2', label: '4–7 Days' },
      { value: 'd3', label: '8–15 Days' },
    ],
  },
] as const;

const getLabel = (options: readonly { value: string; label: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;

/** Quick-plan search bar that overlaps the hero. */
export function PlanBar() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    destination: FIELDS[0].options[0].value,
    activity: FIELDS[1].options[0].value,
    duration: FIELDS[2].options[0].value,
  });

  const handleSearch = () => {
    const params = new URLSearchParams({
      destination: filters.destination,
      activity: filters.activity,
      duration: filters.duration,
    });

    router.push(`${ROUTES.tours}?${params.toString()}`);
  };
  return (
    <div className="wrap">
      <div className="reveal relative z-5 -mt-11 max-[900px]:mt-6" suppressHydrationWarning>
        <div
          className={`bg-white ${TEXT} rounded-(--r-lg) shadow-(--shadow) p-2.5 grid grid-cols-[1.4fr_1fr_1fr_auto] gap-1.5 border border-(--line) max-[900px]:grid-cols-[1fr_1fr] max-[520px]:grid-cols-[1fr]`}
        >
          {FIELDS.map((f) => (
            <div
              className="px-4 py-3 rounded-(--r) flex flex-col gap-[3px] [transition:background_0.2s] hover:bg-paper not-first:border-l not-first:border-(--line) max-[900px]:not-first:border-l-0 max-[520px]:border-b max-[520px]:border-(--line)"
              key={f.label}
            >
              <label
                className={`font-mono text-[10.5px] tracking-[0.16em] uppercase ${TEXT_MUTED}`}
              >
                {f.label}
              </label>
              <div className={`relative font-bold text-[15.5px] ${TEXT}`}>
                <Select
                  value={filters[f.key]}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      [f.key]: value,
                    }))
                  }
                >
                  <SelectTrigger
                    className={`w-full border-0 bg-transparent p-0 h-auto shadow-none`}
                  >
                    <SelectValue>{getLabel(f.options, filters[f.key])}</SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {f.options.map((o) => (
                      <SelectItem key={o.label} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
          <div className="flex max-[900px]:col-span-full">
            <button
              type="button"
              onClick={handleSearch}
              className="btn btn-ink w-full h-full rounded-(--r)"
            >
              <SearchIcon />
              Find trips
            </button>{' '}
          </div>
        </div>
      </div>
    </div>
  );
}
