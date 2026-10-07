/**
 * Central design tokens — expressed as Tailwind class strings.
 *
 * This is the single source of truth for the look of the whole app: border
 * radius, colors, hover states, text colors, surfaces, borders and shadows.
 * Import these constants in `className` (via a template literal) instead of
 * hard-coding the utility, e.g.
 *
 *   import { RADIUS, SHADOW, PRIMARY, PRIMARY_HOVER } from "@/lib/theme";
 *   <div className={`${SURFACE} ${RADIUS} ${SHADOW} p-6`}>…</div>
 *   <button className={`${PRIMARY} ${PRIMARY_HOVER} ${RADIUS_XS} px-6 py-3`}>…</button>
 *
 * Change a value here once and it updates everywhere it's used.
 * The color/shadow values themselves are defined in globals.css (@theme / :root).
 */

/* ----------------------------- Border radius ----------------------------- */
/** Primary box / card / panel radius (18px). The default "box" radius. */
export const RADIUS = 'rounded-[var(--r-lg)]';
/** Inputs and small controls (10px). */
export const RADIUS_SM = 'rounded-[var(--r)]';
/** Buttons (8px). */
export const RADIUS_XS = 'rounded-[var(--r-sm)]';
/** Pills, chips and tags — flattened to the global 4px box radius. */
export const RADIUS_CHIP = 'rounded-[8px]';
/** Circles — avatars, icon buttons, dots. */
export const RADIUS_FULL = 'rounded-full';

/* -------------------------------- Colors --------------------------------- */
/** Primary action background (valley green). */
export const PRIMARY = 'bg-green-btn';
/** Primary action hover background. */
export const PRIMARY_HOVER = 'hover:bg-gold-deep';
/** Accent / highlight background. */
export const ACCENT = 'bg-gold';
/** Light card surface. */
export const SURFACE = 'bg-white';
/** Alternate (off-white) surface. */
export const SURFACE_ALT = 'bg-paper-2';
/** Dark surface. */
export const SURFACE_DARK = 'bg-ink';

/* --------------------------------- Text ---------------------------------- */
/** Primary text color. */
export const TEXT = 'text-ink';
/** Secondary / muted text. */
export const TEXT_MUTED = 'text-muted';
/** Tertiary / faint text. */
export const TEXT_FAINT = 'text-muted-d';
/** Accent text and links. */
export const TEXT_ACCENT = 'text-gold-deep';
/** Text on dark surfaces. */
export const TEXT_ON_DARK = 'text-white';

/* --------------------------- Borders & shadows --------------------------- */
/** Hairline border. */
export const BORDER = 'border border-[var(--line)]';
/** Card / panel resting shadow — removed (cards are flat at rest). */
export const SHADOW = '';
/** Subtle / small resting shadow — removed (cards are flat at rest). */
export const SHADOW_SM = '';

/* ------------------------------- Composites ------------------------------ */
/** Standard card: light surface + box radius + border + shadow. */
export const CARD = `${SURFACE} ${RADIUS} ${BORDER} ${SHADOW}`;
/** Pill chip: pill radius + light surface. */
export const CHIP = `${RADIUS_CHIP} ${SURFACE}`;
