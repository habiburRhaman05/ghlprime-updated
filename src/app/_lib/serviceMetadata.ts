import type { Metadata } from 'next'

// Mirrors the title/description/keywords/canonical/og:*/twitter:* computation
// that used to live in src/components/ServiceDetailTemplate.jsx's <Helmet>
// (lines ~528-545 there, before this migration). All 10 app/services/*
// route files call this with their existing `config` object, unchanged.
// The 5 JSON-LD <script> tags stayed inline in ServiceDetailTemplate.jsx
// itself -- see the comment there.
const SITE = 'https://ghlprime.com'

type ServiceConfig = {
  slug: string
  seo: { title: string; description: string; ogImage?: string }
  breadcrumbName: string
}

export function buildServiceMetadata(config: ServiceConfig): Metadata {
  const url = `${SITE}${config.slug}`
  const serviceSlug = config.slug.replace('/services/', '')
  const ogImage = config.seo.ogImage || `${SITE}/og-services-${serviceSlug}.png`
  const keywords = `${config.breadcrumbName}, GoHighLevel services, GoHighLevel expert team, GHL Prime`

  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords,
    // The original Helmet also set robots to "index, follow" here (distinct
    // from the root layout's "index,follow,max-image-preview:large" static
    // default) -- kept as the page-level override, same as every other value
    // this page authored for itself.
    robots: 'index, follow',
    alternates: { canonical: url },
    openGraph: {
      siteName: 'GHL Prime',
      locale: 'en_US',
      type: 'website',
      title: config.seo.title,
      description: config.seo.description,
      url,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.seo.title,
      description: config.seo.description,
      images: [ogImage],
    },
  }
}
