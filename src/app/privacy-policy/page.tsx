import type { Metadata } from 'next'
import PrivacyPolicyPage from '../../pages/PrivacyPolicyPage'

export const metadata: Metadata = {
  title: 'Privacy Policy | GHL Prime',
  description:
    'How GHL Prime LLC collects, uses, shares, and protects your personal information across our website, forms, CRM, automations, and SMS communications.',
  keywords: 'GHL Prime privacy policy, data protection, user privacy',
  alternates: { canonical: 'https://ghlprime.com/privacy-policy' },
  openGraph: {
    siteName: 'GHL Prime',
    locale: 'en_US',
    title: 'Privacy Policy | GHL Prime',
    description:
      'How GHL Prime LLC collects, uses, shares, and protects your personal information across our website, forms, CRM, automations, and SMS communications.',
    url: 'https://ghlprime.com/privacy-policy',
    type: 'website',
  },
  other: {
    'last-modified': '2026-06-02',
  },
}

export default function Page() {
  return <PrivacyPolicyPage />
}
