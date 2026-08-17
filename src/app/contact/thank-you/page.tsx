import type { Metadata } from 'next'
import ContactThankYouPage from '../../../pages/ContactThankYouPage'

export const metadata: Metadata = {
  title: 'Thank You | GHL Prime',
  description: 'Thank you for contacting GHL Prime.',
  alternates: { canonical: 'https://ghlprime.com/contact/thank-you' },
  robots: 'noindex,follow',
}

export default function Page() {
  return <ContactThankYouPage />
}
