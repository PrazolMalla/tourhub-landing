'use client';

import { CheckIcon, CloseIcon } from '@/components/icons';
import { BORDER, RADIUS, RADIUS_FULL, TEXT_ACCENT, TEXT_MUTED } from '@/lib/theme';
import { useId, useRef, useState } from 'react';

type Tab = 'inc' | 'exc';

export function InclusionsTabs({ inc = [], exc = [] }: { inc?: string[]; exc?: string[] }) {
  const uid = useId();

  const [tab, setTab] = useState<Tab>(inc.length ? 'inc' : 'exc');

  const refs = useRef<Record<Tab, HTMLButtonElement | null>>({
    inc: null,
    exc: null,
  });

  const tabs: {
    key: Tab;
    label: string;
    items: string[];
  }[] = [
    {
      key: 'inc',
      label: 'Included',
      items: inc,
    },
    {
      key: 'exc',
      label: 'Not included',
      items: exc,
    },
  ];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    e.preventDefault();

    const next: Tab = tab === 'inc' ? 'exc' : 'inc';

    setTab(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Compact tabs */}
      <div
        role="tablist"
        aria-label="Cost includes and excludes"
        onKeyDown={onKeyDown}
        className={`
          inline-flex items-center
          rounded-full border border-line
          bg-white p-1 w-fit
          ${RADIUS_FULL}
        `}
      >
        {tabs.map(({ key, label, items }) => {
          const active = tab === key;
          const isExc = key === 'exc';

          return (
            <button
              key={key}
              ref={(el) => {
                refs.current[key] = el;
              }}
              id={`${uid}-tab-${key}`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`${uid}-panel-${key}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(key)}
              className={`
                group relative z-10
                flex items-center justify-center
                gap-2
                rounded-full
                px-3 py-1.5
                font-sans text-[13px] font-bold
                transition-all duration-300
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--gold)]
                focus-visible:ring-offset-1
                ${
                  active
                    ? isExc
                      ? 'bg-gold text-white shadow-sm'
                      : 'bg-gold text-white shadow-sm'
                    : 'text-muted hover:text-ink'
                }
              `}
            >
              {/* Icon */}
              <span
                className={`
                  flex h-5 w-5 flex-none
                  items-center justify-center
                  rounded-full
                  transition-colors duration-300
                  ${
                    active
                      ? isExc
                        ? 'bg-white text-gold-deep'
                        : 'bg-white text-gold-deep'
                      : 'bg-black/[0.035] text-muted'
                  }
                `}
              >
                {isExc ? <CloseIcon className="h-3 w-3" /> : <CheckIcon className="h-3 w-3" />}
              </span>

              {/* Label */}
              <span className="whitespace-nowrap">{label}</span>

              {/* Count */}
              <span
                className={`
                  min-w-[20px]
                  rounded-full
                  px-1.5 py-0.5
                  text-center
                  font-mono text-[9px] font-bold
                  leading-none
                  transition-colors duration-300
                  ${
                    active
                      ? isExc
                        ? 'bg-[#f4e5e0] text-[#a94d37]'
                        : 'bg-[var(--gold-soft)] ' + TEXT_ACCENT
                      : 'bg-black/[0.045] text-muted'
                  }
                `}
              >
                {items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div className="mt-4 grid">
        {tabs.map(({ key, items }) => {
          const active = tab === key;
          const isExc = key === 'exc';

          return (
            <div
              key={key}
              id={`${uid}-panel-${key}`}
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${key}`}
              aria-hidden={!active}
              className={`
                [grid-area:1/1]
                overflow-hidden
                bg-white
                ${RADIUS}
                ${BORDER}
                px-5 py-2
                sm:px-6
                transition-[opacity,visibility]
                duration-300
                ${active ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'}
              `}
            >
              <ul className="m-0 grid list-none p-0 sm:grid-cols-2 sm:gap-x-10">
                {items.map((x, i) => (
                  <li
                    key={i}
                    className="
                      flex items-start gap-3
                      border-b border-line
                      py-3.5
                      last:border-b-0
                      sm:[&:nth-last-child(2):nth-child(odd)]:border-b-0
                    "
                  >
                    {/* Item icon */}
                    <span
                      className={`
                        mt-0.5
                        flex h-[22px] w-[22px]
                        flex-none
                        items-center justify-center
                        ${RADIUS_FULL}
                        ${
                          isExc
                            ? 'bg-[#f4e5e0] text-[#a94d37]'
                            : 'bg-[var(--gold-soft)] ' + TEXT_ACCENT
                        }
                      `}
                    >
                      {isExc ? (
                        <CloseIcon className="h-3 w-3" />
                      ) : (
                        <CheckIcon className="h-3 w-3" />
                      )}
                    </span>

                    {/* Item text */}
                    <span
                      className={`
                        text-[15px]
                        leading-snug
                        ${TEXT_MUTED}
                      `}
                    >
                      {x}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
