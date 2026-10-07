/** Homepage traveller testimonials (from the original index.html carousel). */

export interface Testimonial {
  /** Quote with the highlighted span wrapped in {{ }} markers. */
  id: string;
  quote: string;
  highlight: string;
  initials: string;
  name: string;
  rating?: number;
  meta: string;
  videoUrl?: string;
  isActive?: boolean;
  source?: string;
}

export const TRIPADVISOR_URL =
  'https://www.tripadvisor.com/Attraction_Review-g293890-d15594374-Reviews-Himalayas_Mountain_Pvt_Ltd-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Regio.html';
