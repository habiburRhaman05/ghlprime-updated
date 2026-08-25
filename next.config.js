/** @type {import('next').NextConfig} */

// Vite baked the deploy date in via `define: { __BUILD_DATE__ }`
// (vite.config.js). Next has no equivalent global-identifier define, so the
// same value is exposed as an inlined public env var instead and read by
// src/components/SiteFooter.jsx. Computed once per build, exactly as before.
const BUILD_DATE = new Date().toISOString().slice(0, 10)

const nextConfig = {
  // Mirrors the <React.StrictMode> wrapper that src/main.jsx used.
  reactStrictMode: true,

  // Next treats ANY directory literally named `pages` as a Pages Router
  // directory, and src/pages/ already exists in this project as a plain
  // "page components" folder (Vite/CRA-style naming, not file-system
  // routing) full of .jsx files. Left at the default, Next tries to build
  // every one of those .jsx files as its own standalone route, which both
  // conflicts with the real routes below in src/app/ and crashes on files
  // that assume route params. Narrowing pageExtensions to .tsx/.ts stops
  // Next from recognising .jsx/.js files as routable in ANY pages/ or app/
  // directory -- since every real route file under src/app/ is .tsx, this
  // has no effect on actual routing, it just stops src/pages/*.jsx from
  // being misread as routes. This is the one Next-imposed constraint that
  // requires a config change rather than a route file rename.
  pageExtensions: ['tsx', 'ts'],

  // The Life at GHL Prime marquee (src/components/home-v2/LifeAtGhlV2.jsx)
  // is the one place using next/image so far, requesting quality 60 for its
  // small, decorative tiles -- Next 16 rejects any quality not explicitly
  // allow-listed here.
  images: {
    qualities: [60, 75],
  },

  env: {
    NEXT_PUBLIC_BUILD_DATE: BUILD_DATE,
    // Client code (src/lib/supabase.js, src/lib/apiClient.js) reads these under
    // their existing VITE_-prefixed names via process.env. Next only inlines
    // vars into the client bundle when they are listed here (or carry the
    // NEXT_PUBLIC_ prefix); listing the current names instead of renaming them
    // means the Vercel project's existing env vars need no changes at all.
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    VITE_API_URL: process.env.VITE_API_URL,
  },
}

export default nextConfig
