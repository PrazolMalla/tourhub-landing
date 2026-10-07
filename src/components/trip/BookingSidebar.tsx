'use client';

import {
  ArrowRightIcon,
  CalendarCheckIcon,
  ClockIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from '@/components/icons';
import { TEL, waLink } from '@/data/site-config';
import { BORDER, RADIUS, RADIUS_FULL, RADIUS_SM, SHADOW, TEXT, TEXT_MUTED } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface BookingSidebarProps {
  title?: string;
  days?: number;
  price?: string;
  was?: string;
  className?: string;
}

/** Sticky booking card — builds a WhatsApp enquiry from chosen date & travellers. */
export function BookingSidebar({ title, days, price, was, className }: BookingSidebarProps) {
  const [date, setDate] = useState('');
  const [pax, setPax] = useState('1 person');

  const buildMessage = () => {
    let msg = `Hi Nepal Yatra! I'm interested in the "${title ? title : 'Trip'}" ${days ? `(${days} days)` : ''}.`;
    if (date) msg += ` Preferred date: ${date}.`;
    if (pax) msg += ` Travellers: ${pax}.`;
    msg += ' Please share availability and a quote.';
    return waLink(msg);
  };

  return (
    <aside className={cn('sticky top-[200px] flex flex-col gap-[18px]', className)}>
      <div
        className={`reveal overflow-hidden ${RADIUS} ${BORDER} bg-white ${SHADOW}`}
        suppressHydrationWarning
      >
        <div className="px-6 pt-6">
          <div className={`font-mono text-[11px] uppercase tracking-[0.12em] ${TEXT_MUTED}`}>
            From, per person
          </div>
          <div className="mt-[6px] font-serif text-[42px] leading-none">
            {price ? (
              <>
                ${price}
                {was ? (
                  <s
                    className={`ml-2 font-sans text-[18px] ${TEXT_MUTED} [text-decoration-thickness:1px]`}
                  >
                    ${was}
                  </s>
                ) : null}
              </>
            ) : (
              'On request'
            )}
          </div>
        </div>
        {/* <div className="flex items-center gap-[7px] px-6 py-[14px] text-[13.5px] font-bold">
          <ClockIcon style={{ width: 15, height: 15, verticalAlign: -2 }} className="text-gold" />
          Trusted local operator{' '}
          <span className={`font-medium ${TEXT_MUTED}`}>· Based in Thamel, Kathmandu</span>
        </div> */}
        <div className="flex flex-col gap-3 px-6 pb-6 pt-2">
          <div className="flex flex-col gap-[6px]">
            <label className={`font-mono text-[10.5px] uppercase tracking-[0.12em] ${TEXT_MUTED}`}>
              Departure date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full ${RADIUS_SM} ${BORDER} bg-paper px-[14px] py-[13px] font-[inherit] text-[15px] font-semibold ${TEXT} focus:border-gold focus:outline-none`}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className={`font-mono text-[10.5px] uppercase tracking-[0.12em] ${TEXT_MUTED}`}>
              Travellers
            </label>
            <select
              value={pax}
              onChange={(e) => setPax(e.target.value)}
              className={`w-full ${RADIUS_SM} ${BORDER} bg-paper px-[14px] py-[13px] font-[inherit] text-[15px] font-semibold ${TEXT} focus:border-gold focus:outline-none`}
            >
              <option>1 person</option>
              <option>2 people</option>
              <option>3–4 people</option>
              <option>5+ people</option>
              <option>Group / students</option>
            </select>
          </div>
          <a className="btn btn-gold w-full" target="_blank" rel="noopener" href={buildMessage()}>
            Book on WhatsApp <ArrowRightIcon strokeWidth={2.2} />
          </a>
          <a className="btn btn-ghost w-full" href={TEL}>
            Call a trip expert
          </a>
          <p className="book-note">
            No payment now — we reply with a custom quote, usually within 1–2 hrs.
          </p>
        </div>
        <div className="flex items-center gap-3 border-t border-[var(--line)] bg-paper px-6 py-[18px]">
          <div
            className={`flex h-[42px] w-[42px] flex-none items-center justify-center ${RADIUS_FULL} bg-paper-2 text-gold`}
          >
            <PhoneIcon className="h-5 w-5" />
          </div>
          <div className={`text-[13px] ${TEXT_MUTED}`}>
            Speak to a trip expert
            <b className={`block text-[15px] ${TEXT}`}>+977 985-1411830</b>
          </div>
        </div>
      </div>
      <div
        className={`reveal flex flex-col gap-3 ${RADIUS} bg-paper-2 px-6 py-[22px] text-muted`}
        suppressHydrationWarning
      >
        <div className="flex items-center gap-3 text-[14px]">
          <ShieldCheckIcon className="h-[18px] w-[18px] flex-none text-gold" /> Govt. licensed &amp;
          NMA / TAAN affiliated
        </div>
        <div className="flex items-center gap-3 text-[14px]">
          <CalendarCheckIcon className="h-[18px] w-[18px] flex-none text-gold" /> Free cancellation
          up to 30 days
        </div>
        <div className="flex items-center gap-3 text-[14px]">
          <ClockIcon className="h-[18px] w-[18px] flex-none text-gold" /> No-obligation custom quote
          in 1–2 hrs
        </div>
      </div>
    </aside>
  );
}
