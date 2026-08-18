'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SiteFooter from '../components/SiteFooter'
import FaqSection from '../components/FaqSection'
import { PAGE_FAQS } from '../data/faqs'

export default function FaqPage() {
  return (
    <main className="faq-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          '@id': 'https://ghlprime.com/faq#breadcrumb',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com/' },
            { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://ghlprime.com/faq' },
          ],
        }) }} />

      <section className="section section-white faq-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="eyebrow-label">FAQ</span>
            <h1>GoHighLevel Expert FAQ</h1>
            <p className="faq-page-intro">
              Everything you want to know before hiring a GoHighLevel expert team.
              If your question is not here, book a free call and ask us directly.
            </p>
            <div className="faq-hero-actions">
              <Link href="/booking" className="primary-pill">Get a free consultation <ArrowRight size={16} /></Link>
              <Link href="/services" className="secondary-pill">See services</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FaqSection
        eyebrow="GHL Prime FAQ"
        title="Common questions about our team and process"
        intro="Pricing, process, white-label, AI agents, SaaS Mode, snapshots, HIPAA, and how to get started."
        faqs={PAGE_FAQS}
      />

      <section className="section section-white faq-bottom-cta">
        <div className="container">
          <div className="final-cta-card">
            <h2>Still have questions?</h2>
            <p>Book a free discovery call and ask us anything. Same-day reply, no commitment.</p>
            <div className="final-cta-actions">
              <Link href="/booking" className="primary-pill large">Book a free discovery call <ArrowRight size={16} /></Link>
              <Link href="/contact" className="secondary-pill">Contact us</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}