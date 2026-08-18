import type { Metadata } from 'next'
import { Suspense } from 'react'
import BlogIndexPage from '../../pages/BlogIndexPage'

// Original <Helmet> conditionally added `<meta name="robots" content="noindex,follow" />`
// whenever a ?q= search was active client-side (via React state re-render, so
// it only ever reached a crawler that requested /blog?q=... directly).
// generateMetadata's searchParams argument reproduces that exact condition
// for the case that matters -- a direct or indexed request to /blog?q=...
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
  const sp = await searchParams
  const hasQuery = Boolean(sp?.q && sp.q.trim())

  return {
    title: 'GoHighLevel Blog Tips, Guides & Case Studies | GHL Prime',
    description:
      'Expert GoHighLevel tutorials, automation guides, AI agent setup walkthroughs, and GHL case studies from the GHL Prime team.',
    keywords:
      'GoHighLevel blog, GoHighLevel tutorials, GHL automation guides, AI agent guides, GoHighLevel tips, white-label CRM blog',
    alternates: { canonical: 'https://ghlprime.com/blog' },
    ...(hasQuery ? { robots: 'noindex,follow' } : {}),
    openGraph: {
      siteName: 'GHL Prime',
      locale: 'en_US',
      title: 'GoHighLevel Blog Tips, Guides & Case Studies | GHL Prime',
      description:
        'Expert GoHighLevel tutorials, automation guides, AI agent setup walkthroughs, and GHL case studies from the GHL Prime team.',
      url: 'https://ghlprime.com/blog',
      type: 'website',
      images: ['https://ghlprime.com/og-blog.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'GoHighLevel Blog Tips, Guides & Case Studies | GHL Prime',
      description:
        'Expert GoHighLevel tutorials, automation guides, AI agent setup walkthroughs, and GHL case studies from the GHL Prime team.',
      images: ['https://ghlprime.com/og-blog.png'],
    },
    other: {
      'last-modified': '2026-05-24',
    },
  }
}

export default function Page() {
  // BlogIndexPage reads the ?q= search param via next/navigation's
  // useSearchParams(), which requires a Suspense boundary for Next to
  // statically prerender this route (build-time requirement; the original
  // Vite/SPA build had no equivalent constraint since everything was one
  // client bundle). SEEDED_POSTS renders synchronously either way, so this
  // fallback is never visibly shown on a normal load.
  return (
    <Suspense fallback={null}>
      <BlogIndexPage />
    </Suspense>
  )
}
