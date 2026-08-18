import type { Metadata } from 'next'
import AboutPage from '../../pages/AboutPage'

export const metadata: Metadata = {
  title: 'About GHL Prime Your GoHighLevel Backend Team',
  description:
    'GHL Prime is a dedicated GoHighLevel agency built to serve other agencies. Strategy-led delivery, GHL-certified specialists, and fully white-labeled execution.',
  keywords:
    'about GHL Prime, GoHighLevel expert team, GoHighLevel certified agency, GoHighLevel specialists, white-label CRM team',
  alternates: { canonical: 'https://ghlprime.com/about' },
  openGraph: {
    title: 'About GHL Prime Your GoHighLevel Backend Team',
    description:
      'GHL Prime is a dedicated GoHighLevel agency built to serve other agencies. Strategy-led delivery, GHL-certified specialists, and fully white-labeled execution.',
    url: 'https://ghlprime.com/about',
    images: ['https://ghlprime.com/og-about.png'],
    type: 'website',
    siteName: 'GHL Prime',
    locale: 'en_US',
  },
  twitter: {
    title: 'About GHL Prime Your GoHighLevel Backend Team',
    description:
      'GHL Prime is a dedicated GoHighLevel agency built to serve other agencies. Strategy-led delivery, GHL-certified specialists, and fully white-labeled execution.',
    images: ['https://ghlprime.com/og-about.png'],
  },
  other: {
    'last-modified': '2026-05-24',
  },
}

export default function Page() {
  return <AboutPage />
}
