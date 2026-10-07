import SectionHeader from '@/components/common/SectionHeader';
import { SinglePageHero } from '@/components/common/SinglePageHero';

import { ContactForm } from '@/components/forms/ContactForm';
import { MAPS_URL, waLink } from '@/data/site-config';
import { getContactDetails } from '@/lib/cms';
import { resolveMetadata } from '@/lib/seo';
import { BORDER, RADIUS, TEXT_MUTED } from '@/lib/theme';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    entityType: 'static_page',
    entityId: 'contact',
    path: '/contact',
    fallback: {
      title: 'Contact Us & Ask for a Quote',
      description:
        'Get in touch with Nepal Yatra Tours & Travels in Thamel, Kathmandu. Ask for a free, no-obligation quote — we reply within 1–2 hours.',
    },
  });
}

function InfoCard({
  label,
  value,
  note,
  href,
}: {
  label: string;
  value: string;
  note: string;
  href?: string;
}) {
  const body = (
    <>
      <div>
        <div className={`font-mono text-[10.5px] uppercase tracking-[0.14em] ${TEXT_MUTED}`}>
          {label}
        </div>
        <div className="mt-1 text-base font-bold">{value}</div>
      </div>
      <div className={`text-right text-[13px] ${TEXT_MUTED}`}>{note}</div>
    </>
  );
  const cls = `flex items-center justify-between gap-4 ${RADIUS} ${BORDER} bg-white px-5 py-4`;
  return href ? (
    <a href={href} className={`${cls} transition-colors hover:border-gold`}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export default async function ContactPage() {
  const contactDetails = await getContactDetails();
  if (!contactDetails) return null;

  const telHref = `tel:${contactDetails.phone.replace(/[^\d+]/g, '')}`;

  return (
    <>
      <SinglePageHero
        media={{
          type: 'image',
          src: '/assets/chitwan.webp',
        }}
        title="Beyond the Beaten Path"
        sub="Tell us what draws you to the mountains, and we’ll shape the adventure around you."
        leftImage="/assets/lakhey.webp"
        rightImage="/assets/trekking.webp"
      >
        {/* Scrolls up over the fully-opened hero */}
        <div className="wrap py-[var(--section-py)]">
          <SectionHeader
            eyebrow="Get in touch"
            title="Ask for a Free Quote"
            onDark={true}
            align="center"
          />
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </SinglePageHero>

      {/* Offices + map */}
      <section className="bg-white py-[var(--section-py)]">
        <div className="wrap">
          <SectionHeader eyebrow="Where we are" title="Our Office" align="center" />
          <div className="grid grid-cols-[1fr_1.4fr] items-start gap-[clamp(34px,4vw,64px)] max-[900px]:grid-cols-1">
            <div className="reveal" suppressHydrationWarning>
              <div className={` font-mono text-[10.5px] uppercase tracking-[0.14em] ${TEXT_MUTED}`}>
                Kathmandu, Nepal
              </div>
              <h3 className="mt-2 text-[clamp(22px,2.6vw,28px)] font-bold leading-snug">
                {contactDetails.addressLine1}
                <br />
                {contactDetails.addressLine2}
              </h3>
              {contactDetails.hours && (
                <p className={`mt-2 text-[14px] ${TEXT_MUTED}`}>{contactDetails.hours}</p>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <InfoCard
                  label="WhatsApp 24/7"
                  value={contactDetails.whatsapp}
                  note="Instant reply for routes"
                  href={waLink()}
                />
                <InfoCard
                  label="Direct phone"
                  value={contactDetails.phone}
                  note=""
                  href={telHref}
                />
                <InfoCard
                  label="Email inquiries"
                  value={contactDetails.email}
                  note="Detailed custom quote"
                  href={`mailto:${contactDetails.email}`}
                />
              </div>
            </div>

            <div className="reveal" suppressHydrationWarning>
              <div
                className={`${RADIUS} ${BORDER} relative mt-5 h-[400px] overflow-hidden bg-ink-2`}
              >
                <iframe
                  title="Nepal Yatra office — Shorakhutte, Kathmandu"
                  src={
                    contactDetails.mapEmbedUrl ||
                    'https://www.google.com/maps?q=Shorakhutte,Kathmandu,Nepal&output=embed'
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 ${RADIUS} ${BORDER} bg-gold px-4 py-2.5 text-[13px] font-semibold transition-colors text-white hover:bg-gold-deep`}
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
