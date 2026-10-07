'use client';

import { DownloadIcon } from 'lucide-react';
import { useId, useState } from 'react';

import { ArrowRightIcon } from '@/components/icons';
import { waLink } from '@/data/site-config';
import { BORDER, RADIUS, RADIUS_SM } from '@/lib/theme';

type Props = {
  /** Display price, e.g. "1,390" */
  price?: string;
  seasonLabel?: string;
  pdfHref?: string;
  title?: string;
  days?: number;
};

const usd = (p?: string) => (p ? `$${p}` : 'Enquire');

export function BookingForm({ price, seasonLabel, pdfHref, title, days }: Props) {
  const uid = useId();
  const [date, setDate] = useState('');
  const [pax, setPax] = useState('1 person');

  const buildMessage = () => {
    let msg = `Hi Nepal Yatra! I'm interested in the "${
      title || 'Trip'
    }"${days ? ` (${days} days)` : ''}.`;

    msg += ' Please share availability and a quote.';

    return waLink(msg);
  };

  return (
    <aside
      className={`${RADIUS} min-h-[360px] border border-t-[3px] border-t-gold bg-transparent p-6 text-ink shadow-xl `}
      aria-labelledby={`${uid}-title`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <h3 id={`${uid}-title`} className="m-0 mt-1 text-[22px] font-extrabold text-white">
            Book Your Trip
          </h3>
        </div>

        {seasonLabel && (
          <span className={`flex-none ${RADIUS} bg-paper px-2.5 py-1 text-[11px] text-muted-d`}>
            {seasonLabel}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mt-5 pb-5">
        <p className="m-0 text-[10.5px] font-bold uppercase tracking-[0.12em] text-white">
          All-inclusive fixed price
        </p>

        <p className="m-0 mt-1 font-serif text-[34px] font-bold leading-none text-white">
          {usd(price)}

          {price && (
            <span className="ml-1.5 font-sans text-[13px] font-normal text-white">/ person</span>
          )}
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-3  pb-6 pt-2">
        <div className="flex flex-col gap-[6px]">
          <label className={` text-[10.5px] uppercase tracking-[0.12em] text-white`}>
            Departure date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full ${RADIUS_SM} ${BORDER} bg-transparent px-[14px] py-[13px] font-[inherit] text-[15px] font-semibold text-white focus:border-gold focus:outline-none`}
          />
        </div>
        <a className="btn btn-gold w-full" target="_blank" rel="noopener" href={buildMessage()}>
          Book on WhatsApp <ArrowRightIcon strokeWidth={2.2} />
        </a>
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-3 text-[12.5px] text-gold">
        {pdfHref ? (
          <a href={pdfHref} download className="inline-flex items-center gap-1.5 underline">
            <DownloadIcon className="h-3.5 w-3.5" />
            Download PDF dossier
          </a>
        ) : (
          <span />
        )}

        <span>No hidden surcharges</span>
      </div>
    </aside>
  );
}
