import type { Metadata } from 'next'
import ServicesPage from '../../pages/ServicesPage'

export const metadata: Metadata = {
  title: 'Hire GoHighLevel Experts Hourly, Project or Full-Time | GHL Prime',
  description:
    'Trained GoHighLevel specialists for CRM setup, automation workflows, AI agents, vibe coding, and 24/7 white-label client support. Hire the way your agency needs.',
  keywords:
    'GoHighLevel services, GoHighLevel setup, GHL automation, AI agents, white-label GoHighLevel support, SaaS mode setup, GoHighLevel integrations, GHL Prime',
  alternates: { canonical: 'https://ghlprime.com/services' },
  openGraph: {
    siteName: 'GHL Prime',
    locale: 'en_US',
    title: 'Hire GoHighLevel Experts Hourly, Project or Full-Time | GHL Prime',
    description:
      'Trained GoHighLevel specialists for CRM setup, automation workflows, AI agents, vibe coding, and 24/7 white-label client support. Hire the way your agency needs.',
    url: 'https://ghlprime.com/services',
    images: ['https://ghlprime.com/og-services.png'],
    type: 'website',
  },
  twitter: {
    title: 'Hire GoHighLevel Experts Hourly, Project or Full-Time | GHL Prime',
    description:
      'Trained GoHighLevel specialists for CRM setup, automation workflows, AI agents, vibe coding, and 24/7 white-label client support. Hire the way your agency needs.',
    images: ['https://ghlprime.com/og-services.png'],
  },
  other: {
    'last-modified': '2026-05-24',
  },
}

export default function Page() {
  return <ServicesPage />
}
