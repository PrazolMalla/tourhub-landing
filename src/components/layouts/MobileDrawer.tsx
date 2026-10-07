'use client';

import { CloseIcon, MailIcon, PhoneIcon } from '@/components/icons';
import { ROUTES } from '@/lib/constants';
import { RADIUS_SM, TEXT_FAINT } from '@/lib/theme';
import type { SiteChrome } from '@/types/site';
import { useEffect } from 'react';
import { NavLink as Link } from './NavLink';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  chrome?: SiteChrome;
}

const TREK_REGIONS: [string, string][] = [
  ['All Treks', '?cat=trekking'],
  ['Everest Region', '?region=everest'],
  ['Annapurna Region', '?region=annapurna'],
  ['Langtang Region', '?region=langtang'],
  ['Manaslu Region', '?region=manaslu'],
  ['Mustang / Muktinath', '?region=mustang'],
  ['East Nepal', '?region=east'],
];

const TOUR_TYPES: [string, string][] = [
  ['City & Cultural Tours', '?cat=city'],
  ['Pilgrimage Tours', '?cat=religious'],
  ['Heli & Luxury', '?cat=helicopter'],
  ['Adventure & Rafting', '?cat=adventure'],
  ['Student & Group Tours', '?cat=student'],
  ['Night Stays & Getaways', '?cat=nightstay'],
];

/** Slide-in mobile navigation drawer with region/type accordions. */
export function MobileDrawer({ open, onClose, chrome }: MobileDrawerProps) {
  const phone = chrome?.settings?.phone ?? '';
  const email = chrome?.settings?.email ?? '';
  const tel = chrome?.settings?.tel ?? '';
  // Lock body scroll while open + close on Escape.
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const linkClass =
    'px-[14px] py-[15px] text-[18px] font-semibold border-b border-[var(--line-dark)] flex justify-between items-center';
  const ctClass = 'font-mono text-[12px] text-gold';
  const accClass = 'border-b border-[var(--line-dark)]';
  const summaryClass =
    "list-none cursor-pointer px-[14px] py-[15px] text-[18px] font-semibold text-white flex justify-between items-center [&::-webkit-details-marker]:hidden after:content-['+'] after:text-gold after:text-[22px] after:leading-none after:font-normal [[open]>&]:after:content-['\\2013']";
  const subClass = 'flex flex-col pb-[10px]';
  const subLinkClass = `pt-[10px] pr-[14px] pb-[10px] pl-[26px] text-[15px] ${TEXT_FAINT} hover:text-white active:text-white`;

  return (
    <div className={`fixed inset-0 z-[90] ${open ? 'visible' : 'invisible'}`}>
      <div
        className={`absolute inset-0 bg-[rgba(8,8,9,0.6)] [transition:opacity_0.3s] ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`absolute top-0 right-0 h-full w-[min(380px,86vw)] bg-ink text-white [transition:transform_0.35s_cubic-bezier(0.3,0.8,0.3,1)] p-[22px] overflow-y-auto flex flex-col gap-[6px] ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-[18px]">
          <span className="flex items-center gap-[10px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-mark.png" alt="" className="h-[40px] " />
          </span>
          <button
            className={`w-[42px] h-[42px] text-white inline-flex items-center justify-center ${RADIUS_SM} bg-white/[0.07]`}
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>

        <details className={accClass}>
          <summary className={summaryClass}>
            Trekking <span className={ctClass}>18</span>
          </summary>
          <div className={subClass}>
            {TREK_REGIONS.map(([label, q]) => (
              <Link
                key={q}
                className={subLinkClass}
                href={`${ROUTES.tours}${q}`}
                pageKey="tours"
                onClick={onClose}
              >
                {label}
              </Link>
            ))}
          </div>
        </details>

        <details className={accClass}>
          <summary className={summaryClass}>Tours &amp; Stays</summary>
          <div className={subClass}>
            {TOUR_TYPES.map(([label, q]) => (
              <Link
                key={q}
                className={subLinkClass}
                href={`${ROUTES.tours}${q}`}
                pageKey="tours"
                onClick={onClose}
              >
                {label}
              </Link>
            ))}
          </div>
        </details>

        <Link className={linkClass} href={ROUTES.tours} pageKey="tours" onClick={onClose}>
          All Treks &amp; Tours <span className={ctClass}>35</span>
        </Link>
        <Link className={linkClass} href={ROUTES.about} pageKey="about" onClick={onClose}>
          About
        </Link>
        <Link className={linkClass} href={ROUTES.blog} pageKey="blog" onClick={onClose}>
          Blog
        </Link>

        <Link className={linkClass} href={ROUTES.contact} pageKey="contact" onClick={onClose}>
          Contact
        </Link>

        <div className="mt-[18px] flex flex-col gap-[10px]">
          <Link className="btn btn-gold" href={ROUTES.contact} pageKey="contact" onClick={onClose}>
            Book Your Trip
          </Link>
          <Link
            className="btn btn-ghost-d"
            href={ROUTES.vehicle}
            pageKey="vehicles"
            onClick={onClose}
          >
            Hire a Vehicle
          </Link>
        </div>

        <div className="mt-[22px] text-[13px] text-muted-d flex flex-col gap-[10px]">
          <a href={tel} className="flex gap-[9px] items-center">
            <PhoneIcon className="size-[15px] text-gold" /> {phone}
          </a>
          <a href={`mailto:${email}`} className="flex gap-[9px] items-center">
            <MailIcon className="size-[15px] text-gold" /> {email}
          </a>
        </div>
      </div>
    </div>
  );
}
