'use client';

import { ChevronDownIcon, MenuIcon } from '@/components/icons';
import { ROUTES } from '@/lib/constants';
import type { SiteChrome } from '@/types/site';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MegaMenu } from './MegaMenu';
import { MobileDrawer } from './MobileDrawer';
import { NavLink as Link } from './NavLink';
import { Top10Menu } from './Top10Menu';

/** Active-state helper for top-level nav links. */
function useActive() {
  const pathname = usePathname();
  return (href: string) => (href === ROUTES.home ? pathname === '/' : pathname.startsWith(href));
}

/** Shared base styling for the top-level nav links + dropdown trigger buttons. */
const NAV_LINK = `
  relative inline-flex items-center gap-[6px]
  px-[10px] py-[10px]
  max-[1250]:text-[10px] max-[1250]:p-[6px]
  text-[16px] font-semibold tracking-[0.01em]
  border-b-2
  transition-[color,border-color] duration-300
  hover:text-gold hover:border-gold
  border-transparent
`;

/** Overlay site header: utility top bar + main nav + mega-menus + mobile drawer. */
export function SiteHeader({ chrome }: { chrome?: SiteChrome }) {
  // const scrolled = useScrolled(80);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isActive = useActive();

  const [showHeader, setShowHeader] = useState(true);

  const [hasScrolled, setHasScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [openMega, setOpenMega] = useState<'trekking' | 'tours' | 'top10' | null>(null);

  const lastScrollY = useRef(0);
  const accumulatedScroll = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const BG_THRESHOLD = 40;
    const HERO_HEIGHT = 600;

    const HIDE_DISTANCE = 50;
    const SHOW_DISTANCE = 25;

    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = Math.max(window.scrollY, 0);
        const previousY = lastScrollY.current;
        const delta = currentY - previousY;

        // Background changes shortly after scrolling
        setHasScrolled(currentY > BG_THRESHOLD);

        // Hide/show only allowed after hero
        const isPastHero = currentY > HERO_HEIGHT;
        setPastHero(isPastHero);

        // Mega menu open → freeze navbar
        if (openMega !== null) {
          setShowHeader(true);
          accumulatedScroll.current = 0;
          lastScrollY.current = currentY;
          ticking.current = false;
          return;
        }

        // Hero → navbar always visible
        if (!isPastHero) {
          setShowHeader(true);
          accumulatedScroll.current = 0;
          lastScrollY.current = currentY;
          ticking.current = false;
          return;
        }

        // Reset when scroll direction changes
        if (
          (delta > 0 && accumulatedScroll.current < 0) ||
          (delta < 0 && accumulatedScroll.current > 0)
        ) {
          accumulatedScroll.current = 0;
        }

        accumulatedScroll.current += delta;

        // Hide after intentional downward scroll
        if (accumulatedScroll.current >= HIDE_DISTANCE) {
          setShowHeader(false);
          accumulatedScroll.current = 0;
        }

        // Show after intentional upward scroll
        if (accumulatedScroll.current <= -SHOW_DISTANCE) {
          setShowHeader(true);
          accumulatedScroll.current = 0;
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    lastScrollY.current = window.scrollY;

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [openMega]);

  const trekNav = chrome?.trekNav ?? [];
  const toursNav = chrome?.toursNav ?? [];
  const trekCount = chrome?.trekCount ?? 0;

  /** Per-link class string, adding the active color + underline when active. */
  const linkCls = (href: string) =>
    isActive(href) ? `${NAV_LINK} text-gold border-gold!` : `${NAV_LINK} text-white/85 `;

  return (
    <>
      <div
        id="siteTop"
        onMouseLeave={() => setOpenMega(null)}
        className={`
    fixed
    left-0
    right-0
    top-0
    z-[60]

    transform-gpu
    will-change-transform

    transition-[transform,background-color,box-shadow,backdrop-filter]
    ease-[cubic-bezier(0.22,1,0.36,1)]

    ${
      showHeader || openMega !== null
        ? 'translate-y-0 duration-[380ms]'
        : '-translate-y-full duration-[500ms]'
    }

    ${
      hasScrolled || openMega !== null
        ? `
          bg-[rgba(12,13,14,0.94)]
          backdrop-blur-[14px]
          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        `
        : `
          bg-transparent
          shadow-none
          backdrop-blur-none
        `
    }
  `}
      >
        {/* Main header / nav */}
        <header
          id="header"
          className="transition-[background,box-shadow,border-color] duration-[350ms] border-b border-[color:var(--line-dark)] "
        >
          <div className="wrap">
            <nav className="flex items-center gap-[28px] min-h-[88px] flex-nowrap max-[560px]:gap-[14px] max-[560px]:min-h-[82px]">
              <Link
                href={ROUTES.home}
                pageKey="home"
                aria-label="Nepal Yatra home"
                className="flex flex-col items-center gap-0 mr-auto shrink-0 text-center max-[560px]:gap-[4px] max-[560px]:min-w-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/logo.png" alt="" className=" mb-[6px]  h-[70px]" />
              </Link>

              <div className="flex items-center gap-[8px] max-[1080px]:hidden">
                {/* <Link className={linkCls(ROUTES.home)} href={ROUTES.home} pageKey="home">
                  Home
                </Link> */}

                <div className="nav-item" onMouseEnter={() => setOpenMega('trekking')}>
                  <button
                    className={`${NAV_LINK} ${openMega === 'trekking' ? 'text-white border-primary' : 'text-white/85'}`}
                  >
                    Trekking
                    <ChevronDownIcon
                      className={`
      transition-transform duration-300
      ${openMega === 'trekking' ? 'rotate-180' : ''}
    `}
                    />
                  </button>
                  {trekNav.length > 0 && (
                    <MegaMenu
                      open={openMega === 'trekking'}
                      heading="Treks by Region"
                      viewAllHref={`${ROUTES.tours}?cat=trekking`}
                      viewAllLabel={`View all ${trekCount} treks`}
                      groups={trekNav}
                      param="region"
                    />
                  )}
                </div>

                <div className="nav-item" onMouseEnter={() => setOpenMega('tours')}>
                  <button
                    className={` ${NAV_LINK} ${openMega === 'tours' ? 'text-white border-primary' : 'text-white/85'}`}
                  >
                    Tours
                    <ChevronDownIcon
                      className={`
      transition-transform duration-300
      ${openMega === 'tours' ? 'rotate-180' : ''}
    `}
                    />
                  </button>
                  {toursNav.length > 0 && (
                    <MegaMenu
                      open={openMega === 'tours'}
                      heading="Tours & Stays by Type"
                      viewAllHref={ROUTES.tours}
                      viewAllLabel="View all tours"
                      groups={toursNav}
                      param="cat"
                    />
                  )}
                </div>
                {/* <Link
                  className={linkCls(ROUTES.holidays)}
                  href={ROUTES.holidays}
                  pageKey="holidays"
                >
                  Holidays
                </Link> */}
                <Link
                  className={linkCls(ROUTES.about)}
                  href={ROUTES.about}
                  pageKey="about"
                  onMouseEnter={() => setOpenMega(null)}
                >
                  About
                </Link>
                <Link
                  className={linkCls(ROUTES.blog)}
                  href={ROUTES.blog}
                  pageKey="blog"
                  onMouseEnter={() => setOpenMega(null)}
                >
                  Blog
                </Link>

                <Link
                  className={linkCls(ROUTES.contact)}
                  href={ROUTES.contact}
                  pageKey="contact"
                  onMouseEnter={() => setOpenMega(null)}
                >
                  Contact
                </Link>

                <div className="flex gap-1 ">
                  <div className="nav-item" onMouseEnter={() => setOpenMega('top10')}>
                    <button
                      className={`
      ${NAV_LINK}

      ${openMega === 'top10' ? 'text-white border-primary' : 'text-white/85'}
    `}
                    >
                      Top 10 Treks
                      <ChevronDownIcon
                        className={`
        transition-transform
        duration-300
        ${openMega === 'top10' ? 'rotate-180' : ''}
      `}
                      />
                    </button>
                    <Top10Menu open={openMega === 'top10'} items={chrome?.top10} />
                  </div>

                  <Link
                    className={linkCls(ROUTES.vehicle)}
                    href={ROUTES.vehicle}
                    pageKey="vehicle"
                    onMouseEnter={() => setOpenMega(null)}
                  >
                    Hire a Vehicle
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-[12px] max-[1080px]:hidden">
                <Link className="btn btn-gold" href={ROUTES.contact} pageKey="contact">
                  Book Your Trip
                </Link>
              </div>
              <button
                className="hidden w-[44px] h-[44px] items-center justify-end text-white max-[1080px]:inline-flex max-[560px]:ml-auto"
                aria-label="Open menu"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon className="w-[26px] h-[26px]" />
              </button>
            </nav>
          </div>
        </header>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} chrome={chrome} />
    </>
  );
}
