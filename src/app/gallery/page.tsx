import type { Metadata } from 'next'
import GalleryPage from '../../pages/GalleryPage'

// SITE_URL + '/gallery' in the original <Helmet>.
export const metadata: Metadata = {
  title: 'Gallery | GHL Prime',
  description:
    'A look inside GHL Prime: our team, events, and the work behind the GoHighLevel builds we ship.',
  keywords: 'GHL Prime gallery, GoHighLevel agency team, GHL Prime culture, agency events',
  alternates: { canonical: 'https://ghlprime.com/gallery' },
  openGraph: {
    siteName: 'GHL Prime',
    locale: 'en_US',
    title: 'Gallery | GHL Prime',
    description: 'A look inside GHL Prime: our team, events, and the work behind the builds we ship.',
    url: 'https://ghlprime.com/gallery',
  },
}

export default function Page() {
  return <GalleryPage />
}
