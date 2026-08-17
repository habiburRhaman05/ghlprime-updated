import type { Metadata } from 'next'
import NotFoundPage from '../pages/NotFoundPage'

// Next automatically renders this file for any route that doesn't match one
// of the app/ route folders, replacing react-router's <Route path="*"> catch-all.
export const metadata: Metadata = {
  title: 'Page Not Found (404) | GHL Prime',
  description:
    'This page does not exist. Browse GoHighLevel services, case studies, and guides from the GHL Prime team instead.',
  robots: 'noindex,follow',
  other: {
    googlebot: 'noindex,follow',
  },
}

export default function NotFound() {
  return <NotFoundPage />
}
