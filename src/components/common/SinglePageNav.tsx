'use client';

import { ArrowRightIcon } from '@/components/icons';
import { waLink } from '@/data/site-config';
import { useEffect, useRef, useState } from 'react';

type NavItem = { id: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  // { id: 'highlights', label: 'Highlights' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'altitude', label: 'Altitude' },
  { id: 'inclusions', label: 'Includes' },
  { id: 'gallery', label: 'Gallery' },
];

const OFFSET = 130; // sticky top header height + breathing room
const HERO_ID = 'trip-hero';
const END_ID = 'related-trips';

interface SinglePageNavProps {
  available: string[];
  title: string;
  price?: string;
  priceWas?: string;
}

export function SinglePageNav({ available, title, price, priceWas }: SinglePageNavProps) {
  const items = NAV_ITEMS.filter((n) => available.includes(n.id));
  const [active, setActive] = useState<string>(items[0]?.id || '');
  const [visible, setVisible] = useState(false); // false on SSR -> no flash
  const tickingRef = useRef(false);

  useEffect(() => {
    const sectionEls = items
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const heroEl = document.getElementById(HERO_ID);
    const endEl = document.getElementById(END_ID);

    const update = () => {
      tickingRef.current = false;

      // --- active section ---
      let current = sectionEls[0]?.id ?? '';
      for (const el of sectionEls) {
        if (el.getBoundingClientRect().top - OFFSET <= 0) current = el.id;
        else break;
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom && sectionEls.length) current = sectionEls[sectionEls.length - 1].id;
      setActive(current);

      // --- visibility: after hero is fully scrolled past, before "more journeys" enters ---
      const heroPassed = heroEl ? heroEl.getBoundingClientRect().bottom <= 0 : true;
      const endReached = endEl ? endEl.getBoundingClientRect().top <= window.innerHeight : false;
      setVisible(heroPassed && !endReached);
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [available.join(',')]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (OFFSET - 20);
    window.scrollTo({ top, behavior: 'smooth' });
    setActive(id);
  };

  const buildMessage = () => waLink(`Hi Nepal Yatra! I'm interested in "${title}".`);

  if (!items.length) return null;

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed bottom-0 left-1/2 z-30 w-full py-2  -translate-x-1/2 border-t border-[var(--line-dark)] bg-gold transition-all duration-300 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="wrap">
        <nav className="no-scrollbar flex items-center gap-[6px] overflow-x-auto h-16 ">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex-none whitespace-nowrap  px-[16px] py-2 text-[14px] font-bold uppercase tracking-[0.08em] transition-colors ${
                active === item.id ? ' text-black ' : ' text-white hover:text-[var(--ink-2)]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <p></p>
          <div className="ml-auto flex flex-none items-center gap-4 pl-4">
            {price && (
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span className=" text-[14px] uppercase tracking-[0.08em] text-white">From</span>

                <span className="font-serif text-[28px] leading-none font-bold text-white">
                  ${price}
                </span>

                {priceWas && <s className="text-[13px] text-black/50">${priceWas}</s>}
              </div>
            )}

            <a
              className="btn btn-ghost flex-none whitespace-nowrap text-white!"
              target="_blank"
              rel="noopener"
              href={buildMessage()}
            >
              Book on WhatsApp
              <ArrowRightIcon strokeWidth={2.2} />
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
