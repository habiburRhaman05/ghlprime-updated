import type { Metadata } from 'next'
import ClientStudiesPage from '../../pages/ClientStudiesPage'

export const metadata: Metadata = {
  title: 'GoHighLevel Case Studies Real Agency Results | GHL Prime',
  description:
    'See how GHL Prime built Voice AI systems, CRM migrations, n8n automations, and AI agents for agencies across home services, SaaS, real estate, and e-commerce.',
  keywords:
    'GoHighLevel case studies, GHL automation results, agency case studies, GoHighLevel success stories, automation case studies',
  alternates: { canonical: 'https://ghlprime.com/case-studies' },
  openGraph: {
    siteName: 'GHL Prime',
    locale: 'en_US',
    title: 'GoHighLevel Case Studies Real Agency Results | GHL Prime',
    description:
      'See how GHL Prime built Voice AI systems, CRM migrations, n8n automations, and AI agents for agencies across home services, SaaS, real estate, and e-commerce.',
    url: 'https://ghlprime.com/case-studies',
    images: ['https://ghlprime.com/og-case-studies.png'],
    type: 'website',
  },
  twitter: {
    title: 'GoHighLevel Case Studies Real Agency Results | GHL Prime',
    description:
      'See how GHL Prime built Voice AI systems, CRM migrations, n8n automations, and AI agents for agencies across home services, SaaS, real estate, and e-commerce.',
    images: ['https://ghlprime.com/og-case-studies.png'],
  },
  other: {
    'last-modified': '2026-05-24',
  },
}

export default function Page() {
  return <ClientStudiesPage />
}
