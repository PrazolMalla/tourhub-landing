import { MAPS_URL, waLink } from '@/data/site-config';
import { getContactDetails, getPartners } from '@/lib/cms';
import { ROUTES } from '@/lib/constants';
import type { SiteChrome } from '@/types/site';
import Image from 'next/image';
import Link from 'next/link';
import { MailIcon, PhoneIcon, PinIcon } from '../icons';
import { FooterReveal } from './FooterReveal';
import { NewsletterForm } from './NewsletterForm';

/** Global site footer. */
export async function SiteFooter({ chrome }: { chrome?: SiteChrome }) {
  const s = chrome?.settings;

  const phone = s?.phone ?? '';
  const email = s?.email ?? '';
  const address = s?.address ?? '';
  const tel = s?.tel ?? '';
  const mapsUrl = s?.mapsUrl || MAPS_URL;

  const facebook = s?.social?.facebook ?? '';
  const instagram = s?.social?.instagram ?? '';
  const youtube = s?.social?.youtube ?? '';
  const tripadvisor = s?.social?.tripadvisor ?? '';
  const whatsappHref = s?.whatsapp ? `https://wa.me/${s.whatsapp}` : waLink();

  const [contactDetails, partners] = await Promise.all([getContactDetails(), getPartners()]);
  const displayPhone = contactDetails?.phone ?? phone;
  const displayEmail = contactDetails?.email ?? email;
  const displayAddress = contactDetails?.addressLine1 ?? address;

  const dialPhone = displayPhone.replace(/[^\d+]/g, '');
  const phoneHref = dialPhone ? `tel:${dialPhone}` : tel;

  return (
    <footer>
      <FooterReveal>
        <div className="relative overflow-hidden px-6 py-6 text-[#d9d9d3] lg:px-16 lg:py-8">
          <div className="pointer-events-none absolute inset-0">
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#111513]/85" />

            {/* Optional bottom gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#111513]/20 via-[#111513]/30 to-[#111513]/95" />
          </div>

          {/* =========================================================
        MAIN GRID
    ========================================================== */}
          <div
            className="
        relative z-10
        grid gap-10
        pb-12
        sm:grid-cols-2
        lg:grid-cols-[1.5fr_1.2fr_0.8fr_0.8fr]
        lg:gap-12
      "
          >
            {/* =====================================================
          BRAND + NEWSLETTER
      ====================================================== */}
            <div className="min-w-0">
              <Link href="/" aria-label="Nepal Yatra home" className="inline-block">
                <Image
                  src="/assets/logo.png"
                  alt="Tour Hub Nepal"
                  width={260}
                  height={150}
                  className="h-auto w-[170px] object-contain md:w-[190px]"
                />
              </Link>

              <p className="mt-5 max-w-[330px] text-[14px] leading-[1.7] text-white/60">
                Unforgettable journeys through Nepal, crafted with local knowledge and genuine
                Himalayan hospitality.
              </p>

              {/* Newsletter */}
              <div className="mt-7 max-w-[340px]">
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  Stay in the loop
                </p>

                <NewsletterForm />
              </div>
            </div>

            {/* =====================================================
          EXPLORE
      ====================================================== */}
            <div className="min-w-0">
              <h3 className="mb-5 text-[18px] font-semibold tracking-[-0.02em] text-white">
                Explore
              </h3>

              <nav className="flex flex-col items-start text-[14px] text-white/60">
                <FooterLink href={`${ROUTES.explore}?cat=trekking#trip-types`}>Trekking</FooterLink>

                <FooterLink href={`${ROUTES.explore}?cat=tours#trip-types`}>Tours</FooterLink>

                <FooterLink href={`${ROUTES.explore}#destinations`}>Destinations</FooterLink>

                <FooterLink href={`${ROUTES.explore}#trip-types`}>Trip Types</FooterLink>

                <FooterLink href={ROUTES.vehicle}>Hire a Vehicle</FooterLink>
              </nav>
            </div>

            {/* =====================================================
          QUICK LINKS
      ====================================================== */}
            <div className="min-w-0">
              <h3 className="mb-5 text-[18px] font-semibold tracking-[-0.02em] text-white">
                Quick links
              </h3>

              <nav className="flex flex-col items-start text-[14px] text-white/60">
                <FooterLink href={ROUTES.about}>About Us</FooterLink>

                <FooterLink href={ROUTES.blog}>Travel Blog</FooterLink>

                <FooterLink href={ROUTES.contact}>Contact</FooterLink>

                <FooterLink href="/terms">Terms &amp; Conditions</FooterLink>

                <FooterLink href="/privacy">Privacy Policy</FooterLink>
              </nav>
            </div>
            {/* =====================================================
          CONTACT
      ====================================================== */}
            <div className="min-w-0">
              <h3 className="mb-5 text-[18px] font-semibold tracking-[-0.02em] text-white">
                Contact
              </h3>

              <div className="flex flex-col items-start gap-3 text-[14px] leading-[1.6] text-white/60">
                {displayAddress && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex max-w-[330px] items-start gap-3 transition-colors hover:text-white"
                  >
                    <PinIcon className="mt-[3px] h-4 w-4 shrink-0 text-gold" />

                    <span>{displayAddress}</span>
                  </a>
                )}

                {displayPhone && (
                  <a
                    href={phoneHref}
                    className="group flex items-center gap-3 transition-colors hover:text-white"
                  >
                    <PhoneIcon className="h-4 w-4 shrink-0 text-gold" />

                    <span>{displayPhone}</span>
                  </a>
                )}

                {displayEmail && (
                  <a
                    href={`mailto:${displayEmail}`}
                    className="group flex items-start gap-3 break-all transition-colors hover:text-white"
                  >
                    <MailIcon className="mt-[3px] h-4 w-4 shrink-0 text-gold" />

                    <span>{displayEmail}</span>
                  </a>
                )}
              </div>

              {/* Social */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="
                flex h-10 w-10 items-center justify-center
                rounded-full border border-white/15
                bg-black/10 text-white
                backdrop-blur-sm
                transition-all duration-300
                hover:border-gold
                hover:bg-gold
                hover:text-black
              "
                  >
                    <Image
                      src={'/assets/facebook.png'}
                      width={25}
                      height={25}
                      alt={'facebook'}
                      className="size-5"
                    />
                  </a>
                )}

                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="
                flex h-10 w-10 items-center justify-center
                rounded-full border border-white/15
                bg-black/10 text-white
                backdrop-blur-sm
                transition-all duration-300
                hover:border-gold
                hover:bg-gold
                hover:text-black
              "
                  >
                    <Image
                      src={'/assets/instagram.png'}
                      width={25}
                      height={25}
                      alt={'instagram'}
                      className="size-5"
                    />
                  </a>
                )}

                {youtube && (
                  <a
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="
                flex h-10 w-10 items-center justify-center
                rounded-full border border-white/15
                bg-black/10 text-white
                backdrop-blur-sm
                transition-all duration-300
                hover:border-gold
                hover:bg-gold
                hover:text-black
              "
                  >
                    <Image
                      src={'/assets/youtube.png'}
                      width={25}
                      height={25}
                      alt={'youtube'}
                      className="size-5"
                    />
                  </a>
                )}

                {tripadvisor && (
                  <a
                    href={tripadvisor}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TripAdvisor"
                    className="
                flex h-10 w-10 items-center justify-center
                rounded-full border border-white/15
                bg-black/10 text-white
                backdrop-blur-sm
                transition-all duration-300
                hover:border-gold
                hover:bg-gold
                hover:text-black
              "
                  >
                    <Image
                      src={'/assets/tripadvisor.png'}
                      width={25}
                      height={25}
                      alt={'tripadvisor'}
                      className="size-5"
                    />
                  </a>
                )}

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="
              flex h-10 w-10 items-center justify-center
              rounded-full border border-white/15
              bg-black/10 text-white
              backdrop-blur-sm
              transition-all duration-300
              hover:border-gold
              hover:bg-gold
              hover:text-black
            "
                >
                  <Image
                    src={'/assets/whatsapp.png'}
                    width={25}
                    height={25}
                    alt={'whatsapp'}
                    className="size-5"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* =========================================================
    PARTNERS
========================================================== */}
          {partners.length > 0 && (
            <div className="relative z-10  border-b border-white/10 py-4">
              <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/80">
                Trusted Partners &amp; Affiliations
              </p>

              <ul className="flex flex-wrap items-center gap-3">
                {partners.map((p) => (
                  <li key={p.name}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={p.name}
                      title={p.name}
                      className="
              group flex h-14 w-[100px] items-center justify-center
              rounded-lg bg-white p-2.5
              transition-all duration-300
              hover:-translate-y-0.5 
            "
                    >
                      {p.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.logo}
                          alt={p.name}
                          loading="lazy"
                          decoding="async"
                          className="
                  block max-h-full max-w-full object-contain
                  grayscale
                  transition duration-300
                  group-hover:opacity-100 group-hover:grayscale-0
                "
                        />
                      ) : (
                        <span className="text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-black/60">
                          {p.name}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* =========================================================
        BOTTOM
    ========================================================== */}
          <div
            className="
        relative z-10
        flex flex-col gap-5
        pt-7
        text-[12px] leading-5 text-white/45

        md:flex-row
        md:items-end
        md:justify-between
      "
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span>© 2026 Nepal Yatra Tours &amp; Travels. All rights reserved.</span>

              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy
              </Link>

              <Link href="/terms" className="transition-colors hover:text-white">
                Terms
              </Link>

              <a href="/sitemap.xml" className="transition-colors hover:text-white">
                Sitemap
              </a>
            </div>

            <span className="shrink-0">
              Designed &amp; developed by{' '}
              <Link
                href="https://www.summitbytes.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white/70 transition-colors hover:text-white"
              >
                Summit Bytes Solutions
              </Link>
            </span>
          </div>
        </div>
      </FooterReveal>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="
        group flex items-center gap-2 py-[7px]
        transition-colors duration-200
        hover:text-white
      "
    >
      <span>{children}</span>

      <span
        className="
          translate-x-[-3px]
          text-gold
          opacity-0
          transition-all duration-200
          group-hover:translate-x-0
          group-hover:opacity-100
        "
      ></span>
    </Link>
  );
}
