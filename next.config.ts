import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pin the workspace root to this app. There are stray lockfiles higher up
  // (~/Desktop/pnpm-lock.yaml), so without this Turbopack infers the wrong
  // root and prints a "multiple lockfiles" warning.
  turbopack: { root: __dirname },
  allowedDevOrigins: ['192.168.1.71'],
  // Server Component fetches (src/lib/cms.ts) run in the Node process and never
  // touch the browser, so they can't show up in DevTools Network tab — this
  // prints every one (full URL + cache hit/miss) to the `next dev` terminal.
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'd8j0ntlcm91z4.cloudfront.net' },
      { protocol: 'https', hostname: 'nepalyatratours.com' },
      // Legacy images still hosted on the old domain.
      { protocol: 'https', hostname: 'himalayasmountain.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Backend asset host — trip/team/partner photos uploaded to Cloudinary.
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Local backend asset server (NEXT_PUBLIC_ASSET_BASE_URL) — dev only.
      // For production, add your deployed asset host here too.
      { protocol: 'http', hostname: 'localhost', port: '3000' },
    ],
  },
  async redirects() {
    // Preserve legacy clean-URL behaviour from the old Express server.
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/tours.html', destination: '/tours', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
    ];
  },
};

export default nextConfig;
