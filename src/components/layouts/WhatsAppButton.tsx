import { waLink } from '@/data/site-config';
import { WhatsAppIcon } from '@/components/icons';
import { RADIUS_FULL } from '@/lib/theme';

/** Floating WhatsApp chat button (bottom-right). */
export function WhatsAppButton() {
  return (
    <a
      className={`fixed right-5 bottom-5 z-70 flex h-14.5 w-14.5 items-center justify-center ${RADIUS_FULL} bg-whatsapp text-white transition-transform duration-250 hover:scale-[1.08] max-[560px]:right-3.5 max-[560px]:bottom-3.5 max-[560px]:h-13 max-[560px]:w-13`}
      href={waLink()}
      aria-label="Chat on WhatsApp"
    >
      <span
        className={`absolute inset-0 ${RADIUS_FULL} shadow-[0_0_0_0_rgba(37,211,102,0.5)] animate-[wapulse_2.2s_infinite]`}
      />
      <WhatsAppIcon className="h-7.5 w-7.5 max-[560px]:h-6.5 max-[560px]:w-6.5" />
    </a>
  );
}
