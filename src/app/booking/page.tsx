import type { Metadata } from 'next'
import BookingPage from '../../pages/BookingPage'

export const metadata: Metadata = {
  title: 'Book a Free Call with GHL Prime Same-Day Reply',
  description:
    'Tell us what your agency needs. We match you with a GHL-certified specialist within 24 hours. Hourly, project, or full-time no contract, no setup fee.',
  keywords: 'book GoHighLevel consultation, free GoHighLevel call, hire GoHighLevel expert, GHL Prime booking',
  alternates: { canonical: 'https://ghlprime.com/booking' },
  openGraph: {
    siteName: 'GHL Prime',
    locale: 'en_US',
    title: 'Book a Free Call with GHL Prime Same-Day Reply',
    description:
      'Tell us what your agency needs. We match you with a GHL-certified specialist within 24 hours. Hourly, project, or full-time no contract, no setup fee.',
    url: 'https://ghlprime.com/booking',
    images: ['https://ghlprime.com/og-booking.png'],
    type: 'website',
  },
  twitter: {
    images: ['https://ghlprime.com/og-booking.png'],
  },
  other: {
    'last-modified': '2026-05-24',
  },
}

export default function Page() {
  return <BookingPage />
}
