# Nepal Yatra — Next.js frontend

Production conversion of the legacy static site (Nepal Yatra Tours & Travels)
to a modern **Next.js (App Router) + TypeScript + Tailwind CSS v4 + ShadCN-style UI + Axios**
application, managed with **PNPM**.

## Stack
- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme` tokens)
- **ShadCN-style UI** primitives (Radix + CVA) styled to the existing design system
- **Axios** service layer with interceptors
- **React Hook Form + Zod** for forms
- **next/font** (DM Serif Display, Plus Jakarta Sans, Space Mono)

## Commands

```bash
pnpm install      # install dependencies
pnpm dev          # start dev server (http://localhost:3000)
pnpm build        # production build (SSG/SSR)
pnpm start        # serve the production build
pnpm lint         # eslint
```

Optional env (`.env.local`):

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.example.com   # defaults to /api (legacy Express endpoints)
```

## Structure

```
src/
├── app/
│   ├── layout.tsx              # root: fonts, metadata, RevealProvider
│   ├── robots.ts, sitemap.ts   # generated SEO routes
│   ├── not-found.tsx
│   └── (site)/                 # public site route group (header/footer/WhatsApp chrome)
│       ├── layout.tsx, loading.tsx, error.tsx
│       ├── page.tsx            # home
│       ├── about, contact, tours, hire-a-vehicle, privacy, terms
│       ├── trek/[slug]         # trip detail (SSG, 35 pages)
│       └── blog, blog/[slug]   # blog index + 22 articles (SSG)
├── components/
│   ├── ui/                     # ShadCN-style primitives (button, input, dialog, ...)
│   ├── common/                 # ImageSlot, TripCard, PageBanner, RevealProvider, ...
│   ├── layouts/                # SiteHeader, MegaMenu, MobileDrawer, SiteFooter, ...
│   ├── sections/               # homepage + listing sections
│   ├── forms/                  # ContactForm, HireForm (RHF + Zod)
│   ├── trip/                   # AltitudeChart, ItineraryAccordion, BookingSidebar, ...
│   └── icons.tsx               # centralised SVG icon set
├── data/                       # typed static content (trips, blog, site-config, ...)
├── services/                   # api / auth / user / enquiry (Axios)
├── hooks/                      # useCountUp, useScrolled, useEnquiry
├── lib/                        # utils (cn), constants
├── types/                      # trip, blog, site, api
└── app/globals.css             # Tailwind v4 theme + ported component CSS
```

## Design system

Design tokens live in `globals.css` under Tailwind's `@theme` (exposed as utilities
like `bg-gold`, `text-ink`, `font-serif`) and as the original CSS variables
(`--gold`, `--ink`, `--r-lg`, ...). The finely-tuned component CSS from the original
`styles.css` / `components.css` / `pages.css` is preserved verbatim so the UI is
identical, with the `<image-slot>` web component replaced by the React `<ImageSlot>`
(next/image + gradient placeholder fallback).

## Content

All trip and blog content is converted to **typed static data** under `src/data`
(`trips.generated.json`, `blog.generated.json`, `site-config.generated.json`) and
rendered with `generateStaticParams` for SSG. Re-run the conversion against the legacy
files if the source data changes.

## Notes

- Forms submit best-effort to the enquiry API and open WhatsApp with a summary —
  matching the original behaviour. The CMS/admin + Express endpoints are a planned
  later phase (`auth.service.ts` / `user.service.ts` are scaffolded for it).
