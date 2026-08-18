import type { Metadata } from 'next'
import ContactPage from '../../pages/ContactPage'

export const metadata: Metadata = {
  title: 'Contact GHL Prime Hire a GoHighLevel Expert Team',
  description:
    'Contact GHL Prime to hire a dedicated GoHighLevel expert for CRM setup, automation, AI agents, and white-label support. Based in Albuquerque, NM.',
  keywords: 'contact GHL Prime, hire GoHighLevel expert, GoHighLevel agency contact, GoHighLevel support',
  alternates: { canonical: 'https://ghlprime.com/contact' },
  openGraph: {
    siteName: 'GHL Prime',
    locale: 'en_US',
    title: 'Contact GHL Prime Hire a GoHighLevel Expert Team',
    description:
      'Contact GHL Prime to hire a dedicated GoHighLevel expert for CRM setup, automation, AI agents, and white-label support. Based in Albuquerque, NM.',
    url: 'https://ghlprime.com/contact',
    images: ['https://ghlprime.com/og-contact.png'],
    type: 'website',
  },
  twitter: {
    title: 'Contact GHL Prime Hire a GoHighLevel Expert Team',
    description:
      'Contact GHL Prime to hire a dedicated GoHighLevel expert for CRM setup, automation, AI agents, and white-label support. Based in Albuquerque, NM.',
    images: ['https://ghlprime.com/og-contact.png'],
  },
  other: {
    'last-modified': '2026-05-24',
  },
}

export default function Page() {
  return <ContactPage />
}
