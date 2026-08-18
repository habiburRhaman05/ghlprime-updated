import type { Metadata } from 'next'
import TermsPage from '../../pages/TermsPage'

export const metadata: Metadata = {
  title: 'Terms & Conditions | GHL Prime',
  description:
    'The Terms & Conditions governing your use of the GHL Prime LLC website and engagement of our GoHighLevel, automation, AI, and custom development services.',
  keywords: 'GHL Prime terms and conditions, service terms, terms of use',
  alternates: { canonical: 'https://ghlprime.com/terms' },
  openGraph: {
    siteName: 'GHL Prime',
    locale: 'en_US',
    title: 'Terms & Conditions | GHL Prime',
    description:
      'The Terms & Conditions governing your use of the GHL Prime LLC website and engagement of our GoHighLevel, automation, AI, and custom development services.',
    url: 'https://ghlprime.com/terms',
    type: 'website',
  },
  other: {
    'last-modified': '2026-06-02',
  },
}

export default function Page() {
  return <TermsPage />
}
