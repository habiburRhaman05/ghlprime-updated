'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import './home-v2.css'

const UPWORK = 'https://www.upwork.com/agencies/ghlprime/'

export default function FinalCtaV2() {
  return (
    <section className="hv2 hv2-section is-tint">
      <div className="hv2-inner">
        <motion.div
          className="hv2-cta-panel"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
          <span className="hv2-eyebrow" style={{ position: 'relative', zIndex: 2 }}>Ready when you are</span>
          <h2>You close the clients. <br />We handle everything else.</h2>
          <p>
            Tell us where your agency stands and we will map the build, the automations, and the
            support model. Same-day reply, no commitment.
          </p>
          <div className="hv2-cta-actions">
            <a href={UPWORK} target="_blank" rel="noopener noreferrer" className="primary-pill large">
              Hire Your Expert Team <ArrowRight size={17} />
            </a>
            <Link href="/booking" className="secondary-pill large">
              Book a free call <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
