'use client';

import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useOpenInNewTabPref } from '@/hooks/useOpenInNewTabPref';

type NavLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | 'children'> & {
    children?: ReactNode;
    /**
     * Which static page this link represents (home, about, contact, tours,
     * blog, holidays, vehicles, …) — looks up that page's own, admin-managed
     * "open in new tab" setting (SEO → the page → Link Behavior). Omit for
     * links that don't correspond to a top-level page (e.g. individual trek
     * links) — they stay same-tab.
     */
    pageKey?: string;
  };

/**
 * Drop-in replacement for `next/link` used across the site's navigation
 * chrome (header, mega menus, mobile drawer). Applies that page's own
 * per-page "open in new tab" preference on top of whatever `target`/`rel`
 * the caller already passed.
 */
export function NavLink({ target, rel, pageKey, ...props }: NavLinkProps) {
  const openInNewTab = useOpenInNewTabPref(pageKey);
  return (
    <Link
      {...props}
      target={openInNewTab ? '_blank' : target}
      rel={openInNewTab ? 'noopener noreferrer' : rel}
    />
  );
}
