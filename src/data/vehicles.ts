/**
 * Hire-a-vehicle fleet types — shared between `@/lib/cms` (which fetches the
 * live fleet from the backend) and the pages/components that render it.
 */

export type SpecIcon =
  | 'users'
  | 'bag'
  | 'ac'
  | 'trend'
  | 'calendar'
  | 'clock'
  | 'airport'
  | 'drivetrain'
  | 'mountain'
  | 'road';

export interface VehicleSpec {
  icon: SpecIcon;
  label: string;
}

export interface Vehicle {
  /** URL slug — `/hire-a-vehicle/[slug]`. */
  slug: string;
  /** Backend primary key — present when fetched live, used to key admin-managed SEO records. */
  id?: string;
  name: string;
  tag: string;
  /** Short card description. */
  desc: string;
  /** Hero / card image. */
  img: string;
  specs: VehicleSpec[];
  /** Longer detail-page overview paragraphs. */
  overview: string[];
  /** Bullet feature/highlight list shown on the detail page. */
  features: string[];
  /** Who the vehicle suits best — quick fact chips. */
  facts: { label: string; value: string; icon: SpecIcon }[];
  /** Detail-page gallery (falls back to `img`). */
  gallery?: string[];
}
