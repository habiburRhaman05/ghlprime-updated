'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { fetchCaseStudies } from '../../lib/caseStudiesApi'
import { trackPointer, resetPointer } from '../motion3d/pointer'
import './home-v2.css'

const safeSlug = (slug) => encodeURIComponent(String(slug))

export default function ProofV2() {
  const [studies, setStudies] = useState([])

  useEffect(() => {
    fetchCaseStudies().then((items) => setStudies((items || []).slice(0, 3)))
  }, [])

  // Nothing to prove with an empty list -- the section stays out of the page
  // rather than rendering placeholder cards.
  if (!studies.length) return null

  return (
    <section className="hv2 hv2-section is-white">
      <div className="hv2-inner">
        <motion.div
          className="hv2-head centered"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
          <span className="hv2-eyebrow">Proof of work</span>
          <h2>Systems already <span className="hv2-hl">running in production.</span></h2>
          <p>Real builds for real agencies — the automations, AI agents, and CRMs behind them are live right now.</p>
        </motion.div>

        <div className="hv2-proof">
          {studies.map((study, i) => (
            <motion.div
              key={study.id || study.slug || i}
              style={{ transformOrigin: 'top center', transformPerspective: 1100 }}
              initial={{ opacity: 0, rotateX: -42, y: 26 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: i * 0.09 }}
            >
              <Link
                href={study.slug ? `/case-studies/${safeSlug(study.slug)}` : '/case-studies'}
                className="hv2-proof-card"
                onMouseMove={trackPointer}
                onMouseLeave={resetPointer}
              >
                {study.image ? (
                  <span className="hv2-proof-media">
                    <img src={study.image} alt={study.title || 'Case study'} loading="lazy" decoding="async" />
                  </span>
                ) : null}
                <span className="hv2-proof-body">
                  <span className="hv2-proof-tag">{study.category || 'Case study'}</span>
                  <h3>{study.title}</h3>
                  <p>{study.excerpt || study.challenge}</p>
                  <span className="hv2-proof-link">Read the build <ArrowRight size={16} /></span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
