import type { Metadata } from 'next'
import ClientStudyDetailPage, { CASE_STUDY_META } from '../../../pages/ClientStudyDetailPage'
import { SEEDED_CASE_STUDIES } from '../../../lib/caseStudiesApi'

type SnapshotStudy = {
  slug: string
  title?: string
  excerpt?: string
  challenge?: string
  category?: string
}

function findSeededStudy(slug: string) {
  return (SEEDED_CASE_STUDIES as SnapshotStudy[]).find((item) => item.slug === slug) || null
}

// Mirrors ClientStudyDetailPage.jsx's `meta` useMemo: a hardcoded per-slug
// override wins, otherwise it's computed from the seeded study, otherwise null.
function resolveMeta(slug: string) {
  const override = (CASE_STUDY_META as Record<string, { title: string; description: string; canonical: string; image?: string }>)[slug]
  if (override) return override

  const study = findSeededStudy(slug)
  if (study) {
    const canonical = `https://ghlprime.com/case-studies/${slug}`
    const baseTitle = study.title ? `${study.title} GoHighLevel Case Study | GHL Prime` : 'Case Study | GHL Prime'
    const baseDescription = study.excerpt || study.challenge || 'Real GoHighLevel implementation built by GHL Prime.'
    return { title: baseTitle, description: baseDescription, canonical, image: undefined as string | undefined }
  }
  return null
}

export function generateStaticParams() {
  return (SEEDED_CASE_STUDIES as SnapshotStudy[]).map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const meta = resolveMeta(slug)
  const study = findSeededStudy(slug)

  if (!meta) {
    return {
      title: 'Case study not found | GHL Prime',
      description:
        "The case study you're looking for could not be found. Browse all GHL Prime GoHighLevel case studies and automation builds.",
      robots: 'noindex, follow',
    }
  }

  const image = meta.image || 'https://ghlprime.com/og-case-studies.png'
  const keywords = `${study?.category || 'GoHighLevel'} case study, GoHighLevel automation, GHL Prime case study`

  return {
    title: meta.title,
    description: meta.description,
    keywords,
    alternates: { canonical: meta.canonical },
    openGraph: {
      siteName: 'GHL Prime',
      locale: 'en_US',
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
      images: [image],
      type: 'article',
    },
    twitter: {
      images: [image],
    },
    other: {
      'last-modified': '2026-05-24',
    },
  }
}

export default function Page() {
  return <ClientStudyDetailPage />
}
