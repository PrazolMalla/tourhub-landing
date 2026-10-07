/** Blog post types (converted from the static `blog/*.html` articles). */

export interface RelatedPost {
  slug: string;
  category: string;
  title: string;
}

export interface BlogPost {
  slug: string;
  /** Backend primary key — present when fetched live, used to key admin-managed SEO records. */
  id?: string;
  title: string;
  description: string;
  category: string;
  /** Human date label, e.g. "15 January 2026". */
  dateLabel: string;
  /** ISO date, e.g. "2026-01-15". */
  datePublished: string;
  /** e.g. "9 min read". */
  readTime: string;
  heroImage: string;
  heroAlt: string;
  /** Pre-rendered article body HTML (uses `.art-*` classes). */
  body: string;
  /** Short card excerpt. */
  excerpt: string;
  /** Featured on the blog index (large card). */
  featured: boolean;
  related: RelatedPost[];
  exploreHref?: string;
  exploreText?: string;
}
