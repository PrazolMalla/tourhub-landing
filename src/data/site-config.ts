import type { SiteConfig } from '@/types/site';
import generated from './site-config.generated.json';

/**
 * Site configuration — converted from the legacy CMS `site-config.js` (`HM_CFG`).
 * Single source of truth for contact details, nav menus and homepage stats.
 */
export const SITE_CONFIG = generated as unknown as SiteConfig;

/** WhatsApp number (digits only) for `wa.me` links. */
export const WHATSAPP = SITE_CONFIG.whatsapp || '9779841906050';

/** Display phone, e.g. "+977 985-1411830". */
export const PHONE = SITE_CONFIG.phone || '+977 985-1411830';

/** `tel:` href derived from the phone number. */
export const TEL = `tel:+${PHONE.replace(/[^0-9]/g, '') || '9779851411830'}`;

export const EMAIL = SITE_CONFIG.email || 'info@nepalyatratours.com';

export const ADDRESS = SITE_CONFIG.address || 'Shorakhutte, Kathmandu, Nepal';

export const MAPS_URL = 'https://maps.app.goo.gl/jBhK3VHiy7udFw4u6?g_st=aw';

/** Build a `wa.me` link with an optional prefilled message. */
export function waLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
