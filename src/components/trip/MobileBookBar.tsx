import { waLink } from '@/data/site-config';

interface MobileBookBarProps {
  title?: string;
  days?: number;
  price?: string;
}

/** Fixed bottom booking bar shown on small screens. */
export function MobileBookBar({ title, days, price }: MobileBookBarProps) {
  const href = waLink(
    `Hi Nepal Yatra! I'm interested in the "${title}" (${days} days). Please share availability and a quote.`,
  );
  return (
    <div
      className="hidden max-[980px]:fixed max-[980px]:bottom-0 max-[980px]:left-0 max-[980px]:right-0 max-[980px]:z-60 max-[980px]:flex max-[980px]:items-center max-[980px]:gap-3.5 max-[980px]:p-[12px_16px_calc(12px+env(safe-area-inset-bottom))] max-[980px]:bg-[rgba(255,255,255,0.96)] max-[980px]:[backdrop-filter:saturate(140%)_blur(10px)] max-[980px]:border-t max-[980px]:border-t-(--line)"
      aria-hidden="true"
    >
      <div className="max-[980px]:flex max-[980px]:flex-none max-[980px]:flex-col max-[980px]:leading-[1.05]">
        <span className="max-[980px]:font-mono max-[980px]:text-[9.5px] max-[980px]:uppercase max-[980px]:tracking-[0.12em] max-[980px]:text-muted">
          From
        </span>
        <span className="max-[980px]:font-serif max-[980px]:text-[24px]">
          {price ? `$${price}` : 'On request'}
        </span>
      </div>
      <a className="btn btn-gold max-[980px]:flex-1" target="_blank" rel="noopener" href={href}>
        Book on WhatsApp
      </a>
    </div>
  );
}
