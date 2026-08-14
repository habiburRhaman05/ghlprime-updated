import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import MeetingGallerySection from '../components/MeetingGallerySection'
import SiteFooter from '../components/SiteFooter'
import FaqSection from '../components/FaqSection'
import { BOOKING_FAQS } from '../data/faqs'

export default function BookingPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  return (
    <main className="booking-page">
      <Helmet>
        <title>Book a Free Call with GHL Prime — Same-Day Reply</title>
        <meta name="description" content="Tell us what your agency needs. We match you with a GHL-certified specialist within 24 hours. Hourly, project, or full-time — no contract, no setup fee." />
        <meta name="keywords" content="book GoHighLevel consultation, free GoHighLevel call, hire GoHighLevel expert, GHL Prime booking" />
        <link rel="canonical" href="https://ghlprime.com/booking" />
        <meta property="og:title" content="Book a Free Call with GHL Prime — Same-Day Reply" />
        <meta property="og:description" content="Tell us what your agency needs. We match you with a GHL-certified specialist within 24 hours. Hourly, project, or full-time — no contract, no setup fee." />
        <meta property="og:url" content="https://ghlprime.com/booking" />
        <meta property="og:image" content="https://ghlprime.com/og-booking.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:image" content="https://ghlprime.com/og-booking.png" />
              <meta name="last-modified" content="2026-05-24" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          '@id': 'https://ghlprime.com/booking#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com/' },
            { '@type': 'ListItem', position: 2, name: 'Book a Consultation', item: 'https://ghlprime.com/booking' },
          ],
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://ghlprime.com/booking#webpage',
          url: 'https://ghlprime.com/booking',
          name: 'Book a Free Call with GHL Prime — Same-Day Reply',
          description: 'Tell us what your agency needs. We\'ll match you with a GoHighLevel expert within 24 hours.',
          inLanguage: 'en-US',
          isPartOf: { '@id': 'https://ghlprime.com/#website' },
          about: { '@id': 'https://ghlprime.com/#organization' },
          datePublished: '2024-08-01',
          dateModified: '2026-05-24',
          potentialAction: { '@type': 'ReserveAction', target: 'https://ghlprime.com/booking', name: 'Book a free GHL Prime consultation' },
        })}</script>
      </Helmet>
      <section className="section section-white booking-calendar-section booking-calendar-section-first">
        <div className="container">
          <div className="booking-intro" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2rem' }}>
            <h1>Book a free discovery call</h1>
            <p>Pick a time that works for you. We will learn about your agency, your current GoHighLevel setup, and exactly what you need, then map out a clear plan. Same-day reply, no commitment.</p>
          </div>
          <div className="booking-calendar-shell">
            <iframe
              src="https://scheduler.zoom.us/niya-rv73uc/ghl-prime?embed=true"
              style={{ width: '100%', height: '100%', minHeight: '900px', border: 'none', display: 'block' }}
              title="Book a consultation with GHL Prime"
              frameBorder="0"
            />
          </div>
        </div>
      </section>

      <MeetingGallerySection />
      <FaqSection faqs={BOOKING_FAQS} intro="Timelines, pricing, and what happens after you book a call." />
      <SiteFooter />
    </main>
  )
}