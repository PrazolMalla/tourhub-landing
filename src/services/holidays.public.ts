/**
 * Client-side holidays query — used by the holidays listing filters so search,
 * region and pagination hit the backend directly (visible as XHR to the API),
 * with the same snake_case → camelCase mapping as the server `cms.ts`.
 */
import type { Holiday, HolidaySort } from '@/types/holiday';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL || 'http://localhost:3000';

const assetUrl = (u?: string): string => (!u ? '' : u.startsWith('http') ? u : `${ASSET_BASE}${u}`);

const SORT_MAP: Record<HolidaySort, { sortBy: string; sortOrder: string }> = {
  'date-asc': { sortBy: 'start_date', sortOrder: 'asc' },
  'date-desc': { sortBy: 'start_date', sortOrder: 'desc' },
  'name-asc': { sortBy: 'name', sortOrder: 'asc' },
  'discount-desc': { sortBy: 'discount_percentage', sortOrder: 'desc' },
};

interface ApiHoliday {
  id: string;
  holiday_name: string;
  slug: string;
  description?: string;
  start_date: string;
  end_date: string;
  banner_image?: string;
  discount_percentage?: number | string;
  is_featured?: boolean;
  is_active?: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  recommended_treks?: string[];
  regions?: string[];
  body?: string[];
  faqs?: { q: string; a: string }[];
  created_at?: string;
  updated_at?: string;
}

function map(h: ApiHoliday): Holiday {
  return {
    id: h.id,
    name: h.holiday_name,
    slug: h.slug,
    description: h.description ?? '',
    startDate: h.start_date,
    endDate: h.end_date,
    bannerImage: assetUrl(h.banner_image),
    discountPercentage: Number(h.discount_percentage ?? 0) || 0,
    isFeatured: Boolean(h.is_featured),
    isActive: h.is_active ?? true,
    seoTitle: h.seo_title ?? h.holiday_name,
    seoDescription: h.seo_description ?? h.description ?? '',
    seoKeywords: h.seo_keywords ?? [],
    recommendedTreks: h.recommended_treks ?? [],
    regions: h.regions ?? [],
    body: h.body ?? [],
    faqs: Array.isArray(h.faqs) ? h.faqs : [],
    createdAt: h.created_at ?? '',
    updatedAt: h.updated_at ?? '',
  };
}

export interface HolidayQuery {
  search?: string;
  regions?: string[];
  sort: HolidaySort;
  page: number;
  limit: number;
}

/** Query the backend public holidays endpoint with filters + pagination. */
export async function fetchHolidays(q: HolidayQuery): Promise<{ items: Holiday[]; total: number }> {
  const { sortBy, sortOrder } = SORT_MAP[q.sort];
  const params = new URLSearchParams({
    page: String(q.page),
    limit: String(q.limit),
    sortBy,
    sortOrder,
  });
  if (q.search?.trim()) params.set('search', q.search.trim());
  (q.regions ?? []).forEach((r) => params.append('region', r));

  const res = await fetch(`${API_BASE}/holidays/public?${params.toString()}`);
  if (!res.ok) throw new Error(`Holidays request failed: ${res.status}`);
  const json = (await res.json()) as { data?: ApiHoliday[]; meta?: { total?: number } };
  const items = (json.data ?? []).map(map);
  return { items, total: json.meta?.total ?? items.length };
}
