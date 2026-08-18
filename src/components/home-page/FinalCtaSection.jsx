import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function FinalCtaSection() {
  return (
    <section className="section final-cta-section">
      <div className="container">
        <motion.div
          className="final-cta-card premium-final-cta"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >

          <div className="premium-cta-inner">
            {/* Light-lettering variant -- the panel is navy, so the primary
                /ghl-prime-logo.png (navy lettering) would be invisible on it. */}
            <img src="/footer-logo.png" alt="GHL Prime" className="premium-cta-logo" />

            <span className="cta-label">Ready to scale delivery without doing it all yourself?</span>
            <h2>You Close the Clients. We Handle Everything Else.</h2>

            <div className="final-cta-actions homepage-final-cta-actions">
              <Link href="/booking" className="primary-pill large homepage-cta-btn">
                Get a free consultation
                <ArrowRight size={17} />
              </Link>
              <Link href="/services" className="secondary-pill homepage-cta-btn secondary-homepage-cta-btn">See What We Do</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
