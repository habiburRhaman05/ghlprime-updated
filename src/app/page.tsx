import type { Metadata } from 'next'
import HomePage from '../pages/HomePage'

// Ported verbatim from the <Helmet> block that used to open
// src/pages/HomePage.jsx's render (title/description/keywords/canonical/
// og:*/twitter:*/last-modified). The page's JSON-LD <script> tags stayed in
// place inside HomePage.jsx itself -- see the comment there.
export const metadata: Metadata = {
  title: 'GoHighLevel Experts for Agencies | GHL Prime',
  description:
    'Hire a dedicated GoHighLevel AI automation team to set up your CRM, automations, and AI agents  built for agencies and Local Businesses. GHL-certified, US-based, 24/7 support.',
  keywords:
    'GoHighLevel experts, hire GoHighLevel team, GoHighLevel agency, GHL automation, GoHighLevel CRM setup, white-label GoHighLevel support, AI agents, GHL Prime',
  alternates: {
    canonical: 'https://ghlprime.com/',
  },
  openGraph: {
    siteName: 'GHL Prime',
    locale: 'en_US',
    title: 'GoHighLevel Experts for Agencies | GHL Prime',
    description:
      'Hire a dedicated GoHighLevel AI automation team to set up your CRM, automations, and AI agents  built for agencies and Local Businesses. GHL-certified, US-based, 24/7 support.',
    url: 'https://ghlprime.com/',
    images: ['https://ghlprime.com/og-home.png'],
    type: 'website',
  },
  twitter: {
    title: 'GoHighLevel Experts for Agencies | GHL Prime',
    description:
      'Hire a dedicated GoHighLevel AI automation team to set up your CRM, automations, and AI agents  built for agencies and Local Businesses. GHL-certified, US-based, 24/7 support.',
    images: ['https://ghlprime.com/og-home.png'],
  },
  other: {
    'last-modified': '2026-05-24',
  },
}

export default function Page() {
  return <HomePage />
}
