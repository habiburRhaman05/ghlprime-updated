import type { Metadata } from 'next'
import FaqPage from '../../pages/FaqPage'

export const metadata: Metadata = {
  title: 'GoHighLevel Expert FAQ GHL Prime Answers Your Questions',
  description:
    'Answers to the most common questions agencies and SaaS founders ask before hiring GHL Prime pricing, process, white-label, AI agents, SaaS Mode, and more.',
  keywords:
    'GoHighLevel FAQ, GHL Prime FAQ, GoHighLevel help, white-label support questions, GoHighLevel agency FAQ',
  alternates: { canonical: 'https://ghlprime.com/faq' },
  openGraph: {
    siteName: 'GHL Prime',
    locale: 'en_US',
    title: 'GoHighLevel Expert FAQ GHL Prime Answers Your Questions',
    description:
      'Answers to the most common questions agencies and SaaS founders ask before hiring GHL Prime pricing, process, white-label, AI agents, SaaS Mode, and more.',
    url: 'https://ghlprime.com/faq',
    images: ['https://ghlprime.com/og-faq.png'],
    type: 'website',
  },
  twitter: {
    title: 'GoHighLevel Expert FAQ GHL Prime Answers Your Questions',
    description:
      'Answers to the most common questions agencies and SaaS founders ask before hiring GHL Prime pricing, process, white-label, AI agents, SaaS Mode, and more.',
    images: ['https://ghlprime.com/og-faq.png'],
  },
  other: {
    'last-modified': '2026-05-31',
  },
}

export default function Page() {
  return <FaqPage />
}
