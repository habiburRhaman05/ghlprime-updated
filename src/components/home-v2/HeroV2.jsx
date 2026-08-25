'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import './home-v2.css'

const UPWORK = 'https://www.upwork.com/agencies/ghlprime/'

const TRUST = ['GoHighLevel Certified Admins', 'White-labeled under your brand', '24/7 coverage']

export default function HeroV2({ activePill, rotatingPills }) {
  return (
    <section className="hv2 hv2-section is-tint hv2-hero">
      <span className="hv2-bloom one" aria-hidden="true" />
      <span className="hv2-bloom two" aria-hidden="true" />

      <div className="hv2-inner hv2-hero-grid">
        <div>
          <div className="hv2-pill-slot">
            <AnimatePresence mode="wait">
              <motion.span
                key={activePill}
                className="hv2-pill"
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
              >
                <span className="hv2-pill-dot" aria-hidden="true" />
                {rotatingPills[activePill]}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
          >
            Hire a Dedicated Team of{' '}
            <span className="hv2-nowrap">
              <span className="go">Go</span><span className="high">High</span><span className="level">Level</span>
            </span>{' '}
            Automation Experts.
          </motion.h1>

          <motion.p
            className="hv2-lede speakable-intro"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.1 }}
          >
            GHL Prime is a specialist expert team you hire to run the technical side of your
            agency, GHL builds, automation workflows, AI agents, vibe coding, and 24/7 client
            support. All under your brand.
          </motion.p>

          <motion.div
            className="hv2-hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.18 }}
          >
            <a href={UPWORK} target="_blank" rel="noopener noreferrer" className="primary-pill large">
              Hire Your Expert Team <ArrowRight size={17} />
            </a>
            <Link href="/services" className="secondary-pill large">
              See What We Do <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            className="hv2-hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.32 }}
          >
            {TRUST.map((t) => (
              <span className="hv2-trust-item" key={t}><Check size={15} /> {t}</span>
            ))}
          </motion.div>
        </div>

        <div className="hv2-hero-photo">
          <motion.div
            className="hv2-hero-photo-row"
            initial={{ opacity: 0, y: -44, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 130, damping: 15, mass: 0.9, delay: 0.15 }}
          >
            <Image
              src="/db3.png"
              alt="A GoHighLevel dashboard managed by GHL Prime"
              fill
              priority
              sizes="(max-width: 900px) 90vw, 640px"
            />
          </motion.div>
          <motion.div
            className="hv2-hero-photo-row"
            initial={{ opacity: 0, y: 44, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 130, damping: 15, mass: 0.9, delay: 0.3 }}
          >
            <Image
              src="/dashboard5.png"
              alt="A GoHighLevel reporting dashboard managed by GHL Prime"
              fill
              sizes="(max-width: 900px) 90vw, 640px"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
