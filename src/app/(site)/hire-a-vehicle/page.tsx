import { ImageSlot } from '@/components/common/ImageSlot';
import SectionHeader from '@/components/common/SectionHeader';
import { SinglePageHero } from '@/components/common/SinglePageHero';
import { SpecIcon } from '@/components/common/SpecIcon';
import {
  CalendarCheckIcon,
  ChatIcon,
  ClockIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@/components/icons';
import { getVehicles } from '@/lib/cms';
import { ROUTES } from '@/lib/constants';
import { resolveMetadata } from '@/lib/seo';
import {
  BORDER,
  PRIMARY,
  RADIUS,
  RADIUS_CHIP,
  RADIUS_FULL,
  SHADOW_SM,
  TEXT,
  TEXT_ACCENT,
  TEXT_FAINT,
  TEXT_MUTED,
} from '@/lib/theme';
import { CarIcon } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';
import Link from 'next/link';

const B = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DPbgTBNQA8uVZpwmAJg2wq3SQI/';

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    entityType: 'static_page',
    entityId: 'vehicles',
    path: '/hire-a-vehicle',
    fallback: {
      title: 'Hire a Vehicle in Nepal',
      description:
        'Rent a car, jeep, Hiace van or tourist bus with a professional driver across Nepal — airport transfers, city tours and mountain road trips with Nepal Yatra.',
    },
  });
}

const HOWTO = [
  {
    n: '01',
    Icon: ChatIcon,
    title: 'Tell us your plan',
    body: 'Share your route, dates, group size and any luggage or gear so we match the right vehicle.',
  },
  {
    n: '02',
    Icon: CalendarCheckIcon,
    title: 'Get a fixed quote',
    body: 'We reply within 1–2 hours with an all-inclusive price — fuel, driver and taxes, no surprises.',
  },
  {
    n: '03',
    Icon: CarIcon,
    title: 'Meet your driver',
    body: 'Your licensed local driver arrives on time, vehicle cleaned, fuelled and ready to roll.',
  },
  {
    n: '04',
    Icon: ShieldCheckIcon,
    title: 'Travel with ease',
    body: "Relax and enjoy the journey — we're a call or WhatsApp away for anything you need en route.",
  },
];

export default async function HireVehiclePage() {
  const vehicles = await getVehicles();
  return (
    <>
      <SinglePageHero
        media={{
          type: 'image',
          src: 'https://images.pexels.com/photos/17845049/pexels-photo-17845049.jpeg',
        }}
        title="Hire a vehicle, anywhere in Nepal."
        sub="From airport pick-ups to rugged Himalayan road trips — comfortable, well-maintained vehicles with experienced local drivers who know every bend in the road."
        leftImage="https://images.pexels.com/photos/14663618/pexels-photo-14663618.jpeg"
        rightImage="https://images.unsplash.com/photo-1726802016078-5cfbf05b249d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      <div className="bg-ink-2 text-white border-b border-[color:var(--line-dark)]">
        <div className="wrap grid grid-cols-5 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
          <div className="p-[24px_22px] border-[color:var(--line-dark)] border-l flex gap-[14px] items-center first:border-l-0 max-[900px]:[&:nth-child(odd)]:border-l-0 max-[900px]:border-t max-[900px]:[&:nth-child(-n+2)]:border-t-0 max-[520px]:border-l-0 max-[520px]:border-t max-[520px]:first:border-t-0">
            <div
              className={`w-[42px] h-[42px] flex-none ${RADIUS_FULL} bg-white/[0.06] text-gold flex items-center justify-center`}
            >
              <CarIcon className="w-[20px] h-[20px]" />
            </div>
            <div>
              <div className={`font-mono text-[10.5px] tracking-[0.14em] uppercase ${TEXT_FAINT}`}>
                Fleet
              </div>
              <div className="font-bold text-[15.5px] mt-[3px]">Car · Jeep · Van · Bus</div>
            </div>
          </div>
          <div className="p-[24px_22px] border-[color:var(--line-dark)] border-l flex gap-[14px] items-center first:border-l-0 max-[900px]:[&:nth-child(odd)]:border-l-0 max-[900px]:border-t max-[900px]:[&:nth-child(-n+2)]:border-t-0 max-[520px]:border-l-0 max-[520px]:border-t max-[520px]:first:border-t-0">
            <div
              className={`w-[42px] h-[42px] flex-none ${RADIUS_FULL} bg-white/[0.06] text-gold flex items-center justify-center`}
            >
              <UserIcon className="w-[20px] h-[20px]" />
            </div>
            <div>
              <div className={`font-mono text-[10.5px] tracking-[0.14em] uppercase ${TEXT_FAINT}`}>
                Drivers
              </div>
              <div className="font-bold text-[15.5px] mt-[3px]">Licensed &amp; local</div>
            </div>
          </div>
          <div className="p-[24px_22px] border-[color:var(--line-dark)] border-l flex gap-[14px] items-center first:border-l-0 max-[900px]:[&:nth-child(odd)]:border-l-0 max-[900px]:border-t max-[900px]:[&:nth-child(-n+2)]:border-t-0 max-[520px]:border-l-0 max-[520px]:border-t max-[520px]:first:border-t-0">
            <div
              className={`w-[42px] h-[42px] flex-none ${RADIUS_FULL} bg-white/[0.06] text-gold flex items-center justify-center`}
            >
              <ClockIcon className="w-[20px] h-[20px]" />
            </div>
            <div>
              <div className={`font-mono text-[10.5px] tracking-[0.14em] uppercase ${TEXT_FAINT}`}>
                Booking
              </div>
              <div className="font-bold text-[15.5px] mt-[3px]">Hourly · Daily · Trip</div>
            </div>
          </div>
          <div className="p-[24px_22px] border-[color:var(--line-dark)] border-l flex gap-[14px] items-center first:border-l-0 max-[900px]:[&:nth-child(odd)]:border-l-0 max-[900px]:border-t max-[900px]:[&:nth-child(-n+2)]:border-t-0 max-[520px]:border-l-0 max-[520px]:border-t max-[520px]:first:border-t-0">
            <div
              className={`w-[42px] h-[42px] flex-none ${RADIUS_FULL} bg-white/[0.06] text-gold flex items-center justify-center`}
            >
              <ShieldCheckIcon className="w-[20px] h-[20px]" />
            </div>
            <div>
              <div className={`font-mono text-[10.5px] tracking-[0.14em] uppercase ${TEXT_FAINT}`}>
                Insured
              </div>
              <div className="font-bold text-[15.5px] mt-[3px]">Every journey</div>
            </div>
          </div>
          <div className="p-[24px_22px] border-[color:var(--line-dark)] border-l flex gap-[14px] items-center first:border-l-0 max-[900px]:[&:nth-child(odd)]:border-l-0 max-[900px]:border-t max-[900px]:[&:nth-child(-n+2)]:border-t-0 max-[520px]:border-l-0 max-[520px]:border-t max-[520px]:first:border-t-0">
            <div
              className={`w-[42px] h-[42px] flex-none ${RADIUS_FULL} bg-white/[0.06] text-gold flex items-center justify-center`}
            >
              <PhoneIcon className="w-[20px] h-[20px]" />
            </div>
            <div>
              <div className={`font-mono text-[10.5px] tracking-[0.14em] uppercase ${TEXT_FAINT}`}>
                Support
              </div>
              <div className="font-bold text-[15.5px] mt-[3px]">24 / 7 on the road</div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-paper py-[var(--section-py)]">
        <div className="wrap">
          <SectionHeader eyebrow="Our fleet" title="Choose your ride" />

          <div className="grid grid-cols-3 gap-[22px] max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
            {vehicles.map((v) => (
              <Link
                className={`group reveal bg-white ${BORDER} ${RADIUS} overflow-hidden flex flex-col ${SHADOW_SM} [transition:transform_0.35s_cubic-bezier(0.2,0.7,0.3,1),box-shadow_0.35s] hover:-translate-y-[6px] hover:shadow-[var(--shadow)]`}
                key={v.name}
                href={`${ROUTES.vehicle}/${v.slug}`}
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
                <div className="p-[22px] flex flex-col gap-[14px] flex-1">
                  <h3 className="font-serif text-[27px] leading-[1.08] tracking-[-0.01em]">
                    {v.name}
                  </h3>
                  <p className={`${TEXT_MUTED} text-[14.5px]`}>{v.desc}</p>
                  <div className="flex flex-wrap gap-[8px] mt-auto">
                    {v.specs.map((s, i) => (
                      <span
                        className={`inline-flex items-center gap-[7px] text-[12.5px] font-semibold text-ink-2 bg-paper ${BORDER} ${RADIUS_CHIP} px-[12px] py-[7px]`}
                        key={i}
                      >
                        <SpecIcon name={s.icon} className={`w-[14px] h-[14px] ${TEXT_ACCENT}`} />
                        {s.label}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--line)] pt-[16px] mt-[4px]">
                    <div
                      className={`font-mono text-[11px] tracking-[0.06em] uppercase ${TEXT_MUTED}`}
                    >
                      Pricing
                      <b
                        className={`block font-serif text-[18px] ${TEXT} tracking-normal normal-case mt-[3px]`}
                      >
                        On request
                      </b>
                    </div>
                    <Link
                      className="btn btn-gold px-[18px] py-[11px] text-[14px]"
                      href={`${ROUTES.vehicle}/${v.slug}`}
                    >
                      Get a quote
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="wrap">
          <SectionHeader eyebrow="It's simple" title="How hiring works" />

          <div className="grid grid-cols-4 gap-[20px] max-[860px]:grid-cols-2 max-[480px]:grid-cols-1">
            {HOWTO.map(({ n, Icon, title, body }) => (
              <div className="reveal flex flex-col items-center" key={n} suppressHydrationWarning>
                {/* <div className={`font-mono text-[12px] tracking-[0.14em] ${TEXT_ACCENT} font-bold`}>
                  {n}
                </div> */}
                <div
                  className={`w-[54px] h-[54px] ${RADIUS_FULL} bg-paper-2 text-gold flex items-center justify-center mt-[14px] mb-[16px] mx-0`}
                >
                  <Icon className="w-[24px] h-[24px]" />
                </div>
                <h4 className="font-sans font-extrabold text-[17px] mb-[8px]">{title}</h4>
                <p className={`${TEXT_MUTED} text-[14.5px] text-center`}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
