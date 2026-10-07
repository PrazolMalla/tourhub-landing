'use client';

import { useEffect, useState } from 'react';
import { getOpenInNewTabMap } from '@/lib/seo';

/**
 * Module-scoped cache so every nav component that mounts (header, mega
 * menu, mobile drawer, …) shares a single bulk request instead of each
 * firing its own. Lives for the lifetime of the page — a hard refresh
 * picks up any change made in the admin panel since.
 */
let cached: Promise<Map<string, boolean>> | null = null;

function fetchMap(): Promise<Map<string, boolean>> {
  if (!cached) {
    cached = getOpenInNewTabMap('static_page').catch(() => new Map());
  }
  return cached;
}

/**
 * Per-page "open in new tab" setting for the site's navigation links —
 * admin-managed from that specific page's own SEO editor (SEO → the page →
 * "Link Behavior"), sourced from the same `/seo/public?entityType=static_page`
 * bulk endpoint everywhere else on the site reads its SEO data from — NOT a
 * separate site-wide switch/endpoint. `pageKey` is the same static-page key
 * used throughout the SEO system (home, about, contact, tours, blog,
 * holidays, vehicles, privacy, terms). Pass `undefined` for links that don't
 * correspond to one of these pages — they just stay same-tab.
 */
export function useOpenInNewTabPref(pageKey?: string): boolean {
  const [openInNewTab, setOpenInNewTab] = useState(false);

  useEffect(() => {
    if (!pageKey) return;
    let cancelled = false;
    fetchMap().then((map) => {
      if (!cancelled) setOpenInNewTab(map.get(pageKey) === true);
    });
    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  return openInNewTab;
}
