import { ImageSlot } from '@/components/common/ImageSlot';
import { ClockIcon, ShieldCheckIcon } from '@/components/icons';
import { TRIP_CHECKLIST_SECTION_ID } from '@/lib/checklistShare';
import { RADIUS, RADIUS_FULL, SHADOW, TEXT_FAINT, TEXT_MUTED } from '@/lib/theme';

import { CompassIcon } from 'lucide-react';
import { Suspense } from 'react';
import SectionHeader from '../common/SectionHeader';
import { TripChecklistCta } from './TripChecklistCta';

// const B = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DPbgTBNQA8uVZpwmAJg2wq3SQI/';

const FEATURES = [
  {
    Icon: ShieldCheckIcon,
    title: 'Safe & Reliable Journeys',
    body: 'Experienced guides, trusted partners, and carefully planned itineraries help make every journey safe, smooth, and enjoyable.',
  },
  {
    Icon: CompassIcon,
    title: 'Memorable Experiences',
    body: 'Discover breathtaking destinations, rich cultures, and unforgettable experiences thoughtfully designed for every kind of traveler.',
  },
  {
    Icon: ClockIcon,
    title: 'Hassle-Free Planning',
    body: 'From transportation and accommodation to permits and trip coordination, we take care of the details so you can enjoy the journey.',
  },
];

/** Homepage "who we are" section. */
export function SchoolTripPreview() {
  return (
    <section className="section bg-paper relative scroll-mt-22.5" id={TRIP_CHECKLIST_SECTION_ID}>
      <div className="wrap">
        <div className="grid grid-cols-[1.05fr_1fr] gap-[clamp(36px,5vw,80px)]  max-[900px]:grid-cols-[1fr]">
          <div className="reveal" suppressHydrationWarning>
            <SectionHeader eyebrow="Checklist" title="Download Our Trip Checklist" align="left" />

            <p className={`${TEXT_MUTED}  text-[15px]`}>
              Plan a safe, educational, and memorable school trip with confidence. Our checklist
              covers everything from permissions and packing to travel essentials, helping teachers,
              students, and parents stay fully prepared.
            </p>
            <div className="flex flex-col gap-[6px] mt-[30px]">
              {FEATURES.map(({ Icon, title, body }) => (
                <div className="flex gap-[18px] py-[18px] border-b border-line" key={title}>
                  <div
                    className={`w-[46px] h-[46px] flex-none ${RADIUS_FULL} bg-paper-2 text-gold flex items-center justify-center`}
                  >
                    <Icon className="w-[21px] h-[21px]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-extrabold text-[17px]">{title}</h4>
                    <p className={`${TEXT_MUTED} text-[15px] mt-[4px]`}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <Suspense fallback={<div className="mt-3 h-10.5" />}>
              <TripChecklistCta />
            </Suspense>
          </div>
          <div
            className="relative max-w-[900px]:max-w-[600px] max-[600px]:max-w-[500px] reveal"
            suppressHydrationWarning
          >
            <div
              className={`max-w-[500px] w-full aspect-[4/5] ${RADIUS} overflow-hidden ${SHADOW}`}
            >
              <ImageSlot
                src="https://images.pexels.com/photos/20315033/pexels-photo-20315033.jpeg"
                alt="Guides and trekkers"
                sizes="360px"
              />
            </div>
            <div
              className={`absolute bottom-[-16px] right-[-10px]
    w-[34%] aspect-square
    rounded-2xl overflow-hidden
    border-[6px] border-paper
    ${SHADOW}
    max-[900px]:w-[32%]
    max-[560px]:w-[36%] max-[560px]:right-0`}
            >
              <ImageSlot
                src={`https://images.pexels.com/photos/9187307/pexels-photo-9187307.jpeg`}
                alt="Trail detail"
                sizes="160px"
              />
            </div>
            <div
              className={`absolute top-[24px] left-[-24px] bg-paper-2 text-white ${RADIUS} py-[20px] px-[22px] ${SHADOW} max-[560px]:left-[10px] max-[560px]:py-[5px] max-[560px]:px-[5px]  max-[560px]:-top-[10px]`}
            >
              <div className="font-serif text-[46px] max-[560px]:text-[32px] leading-none text-gold">
                05
              </div>
              <div
                className={`font-mono text-[10.5px] tracking-[0.16em] uppercase ${TEXT_FAINT} mt-[7px] max-w-[14ch]`}
              >
                Years guiding in the Himalaya
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
