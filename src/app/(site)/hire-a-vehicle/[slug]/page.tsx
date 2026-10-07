import GalleryLightbox from '@/components/common/GalleryLightbox';
import { ImageSlot } from '@/components/common/ImageSlot';
import SectionHeader from '@/components/common/SectionHeader';
import { SinglePageHero } from '@/components/common/SinglePageHero';
import { SpecIcon } from '@/components/common/SpecIcon';
import { HireForm } from '@/components/forms/HireForm';
import { ArrowRightIcon, CheckIcon } from '@/components/icons';
import { Eyebrow } from '@/components/ui/typography';
import { getRelatedVehicles, getVehicleBySlug, getVehicles } from '@/lib/cms';
import { ROUTES, SITE_NAME, SITE_URL } from '@/lib/constants';
import {
  getSeoRecord,
  isStructuredDataEnabled,
  resolveMetadata,
  safeJsonLdString,
} from '@/lib/seo';
import {
  BORDER,
  PRIMARY,
  RADIUS,
  RADIUS_CHIP,
  RADIUS_FULL,
  TEXT_ACCENT,
  TEXT_FAINT,
  TEXT_MUTED,
} from '@/lib/theme';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return {};
  return resolveMetadata({
    entityType: 'vehicle',
    entityId: vehicle.id ?? '',
    path: `/hire-a-vehicle/${slug}`,
    fallback: {
      // Bare title — the root layout's `title.template` appends " | {SITE_NAME}"
      // automatically; adding it here too would double it up.
      title: `Hire a ${vehicle.name}`,
      description: vehicle.desc,
      image: vehicle.img || undefined,
      ogType: 'article',
    },
  });
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const related = await getRelatedVehicles(slug, 3);
  const gallery = vehicle.gallery?.length ? vehicle.gallery : [vehicle.img];
  const url = `${SITE_URL}/hire-a-vehicle/${slug}`;
  const seo = await getSeoRecord('vehicle', vehicle.id ?? '');

  const jsonLd = !isStructuredDataEnabled(seo)
    ? null
    : {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Product',
            name: vehicle.name,
            description: vehicle.desc,
            image: vehicle.img,
            url,
            category: 'Vehicle hire',
            brand: { '@type': 'Brand', name: SITE_NAME },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: '0',
              availability: 'https://schema.org/InStock',
              url,
              priceSpecification: { '@type': 'PriceSpecification', valueAddedTaxIncluded: true },
            },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Hire a Vehicle',
                item: `${SITE_URL}${ROUTES.vehicle}`,
              },
              { '@type': 'ListItem', position: 3, name: vehicle.name, item: url },
            ],
          },
        ],
      };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(jsonLd) }}
        />
      )}

      <SinglePageHero
        media={{
          type: 'image',
          src: vehicle.img,
        }}
        title={vehicle.name}
        sub={vehicle.desc}
      />

      {/* Fact bar */}
      <div className="border-b border-[color:var(--line-dark)] bg-ink-2 text-white">
        <div className="wrap grid grid-cols-4 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
          {vehicle.facts.map((f) => (
            <div
              className="flex items-center gap-[14px] border-l border-[color:var(--line-dark)] p-[24px_22px] first:border-l-0 max-[900px]:odd:border-l-0 max-[900px]:border-t max-[900px]:[&:nth-child(-n+2)]:border-t-0 max-[520px]:border-l-0 max-[520px]:border-t max-[520px]:first:border-t-0"
              key={f.label}
            >
              <div
                className={`flex h-[42px] w-[42px] flex-none items-center justify-center ${RADIUS_FULL} bg-white/[0.06] text-gold`}
              >
                <SpecIcon name={f.icon} className={`h-[20px] w-[20px] text-white`} />
              </div>
              <div>
                <div
                  className={`font-mono text-[10.5px] uppercase tracking-[0.14em] ${TEXT_FAINT}`}
                >
                  {f.label}
                </div>
                <div className="mt-[3px] text-[15.5px] font-bold">{f.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail + quote form */}
      <section className="bg-paper py-[var(--section-py)]">
        <div className="wrap">
          <div className="grid grid-cols-[1fr_minmax(480px,580px)] items-start gap-[clamp(28px,3vw,52px)] max-[1100px]:grid-cols-[1fr]">
            <div>
              <div
                className="reveal mb-[44px]  [&_p]:mb-[16px] [&_p]:text-[15px] [&_p]:text-muted [&_p:last-child]:mb-0"
                suppressHydrationWarning
              >
                <SectionHeader eyebrow="About this vehicle" title={vehicle.name} align="left" />

                {vehicle.overview.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <div className="mt-[18px] flex flex-wrap gap-[8px]">
                  {vehicle.specs.map((s, i) => (
                    <span
                      className={`inline-flex items-center gap-[7px] text-[12.5px] font-semibold text-ink-2 bg-white ${BORDER} ${RADIUS_CHIP} px-[12px] py-[7px]`}
                      key={i}
                    >
                      <SpecIcon name={s.icon} className={`h-[14px] w-[14px] ${TEXT_ACCENT}`} />
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="reveal mb-[44px] [&>.eyebrow]:mb-[14px] [&_h2]:mb-[20px] [&_h2]:text-[clamp(28px,3.4vw,42px)] [&_h2]:tracking-[-0.014em]"
                suppressHydrationWarning
              >
                <Eyebrow>What you get</Eyebrow>
                <h2>Features &amp; comfort</h2>
                <ul className="m-0 grid list-none grid-cols-2 gap-[14px] p-0 max-[620px]:grid-cols-1 [&_li]:flex [&_li]:items-start [&_li]:gap-[13px] [&_li]:rounded-[var(--r-lg)] [&_li]:border [&_li]:border-[var(--line)] [&_li]:bg-white [&_li]:px-[18px] [&_li]:py-[16px] [&_li_svg]:mt-px [&_li_svg]:h-[20px] [&_li_svg]:w-[20px] [&_li_svg]:flex-none [&_li_svg]:text-gold-deep [&_li_span]:text-[15px] [&_li_span]:font-semibold [&_li_span]:text-[var(--ink-2)]">
                  {vehicle.features.map((h, i) => (
                    <li key={i}>
                      <CheckIcon />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="reveal [&>.eyebrow]:mb-[14px] [&_h2]:mb-[20px] [&_h2]:text-[clamp(28px,3.4vw,42px)] [&_h2]:tracking-[-0.014em]"
                suppressHydrationWarning
              >
                <SectionHeader eyebrow="A glimpse" title="Gallery" align="left" />
                <GalleryLightbox images={gallery} alt={vehicle.name} />
              </div>
            </div>

            {/* Quote form — sticky on desktop */}
            <div className="sticky top-[100px] max-[980px]:static" id="quote">
              <HireForm defaultVehicle={vehicle.name} source={`hire-${vehicle.slug}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Related vehicles */}
      <section className="section bg-white">
        <div className="wrap">
          <SectionHeader
            title="More of our fleet"
            eyebrow="Other vehicles you can hire"
            align="left"
          />

          <div className="grid grid-cols-3 gap-[22px] max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
            {related.map((v) => (
              <Link
                key={v.slug}
                href={`${ROUTES.vehicle}/${v.slug}`}
                className={`group reveal bg-white ${BORDER} ${RADIUS} overflow-hidden flex flex-col [transition:transform_0.35s_cubic-bezier(0.2,0.7,0.3,1),box-shadow_0.35s] hover:-translate-y-[6px] hover:shadow-[var(--shadow)]`}
                suppressHydrationWarning
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
                  <ImageSlot
                    src={v.img}
                    alt={`${v.name} photo`}
                    sizes="(max-width: 640px) 90vw, 33vw"
                    className="[--slot-bg:#e7e1d5] transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] group-hover:scale-[1.05]"
                  />
                  <span
                    className={`absolute top-[14px] left-[14px] z-[2] ${PRIMARY} text-white font-mono text-[10.5px] font-bold tracking-[0.1em] uppercase px-[11px] py-[6px] ${RADIUS_CHIP}`}
                  >
                    {v.tag}
                  </span>
                </div>
                <div className="p-[22px] flex flex-col gap-[10px] flex-1">
                  <h3 className="font-serif text-[24px] leading-[1.08] tracking-[-0.01em]">
                    {v.name}
                  </h3>
                  <p className={`${TEXT_MUTED} text-[14px]`}>{v.desc}</p>
                  <span
                    className={`mt-auto inline-flex items-center gap-[6px] text-[13px] font-bold ${TEXT_ACCENT}`}
                  >
                    Get a quote <ArrowRightIcon className="h-[14px] w-[14px]" strokeWidth={2.2} />
                  </span>
                </div>
              </Link>
            ))}
            <div className="col-span-full flex justify-center mt-6">
              <Link className="btn btn-ghost" href={ROUTES.vehicle}>
                View all vehicles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
