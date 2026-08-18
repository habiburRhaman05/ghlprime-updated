import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { motion } from 'framer-motion'
import HeroAutomationCore from './HeroAutomationCore'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
const HeroBanner = ({activePill,rotatingPills}) => {
  return (
     <section className="hero container homepage-hero-v3">
        {/* <div className="hh-ambient" aria-hidden="true">
          <span className="hh-aurora a" />
          <span className="hh-aurora b" />
          <span className="hh-aurora c" />
          <span className="hh-noise" />
        </div> */}

        <div className="hh-grid">
          <div className="hero-copy hh-copy">
            <div className="hh-pill-slot">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePill}
                  className="rotating-hero-pill hh-pill"
                  initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                >
                  {rotatingPills[activePill]}
                </motion.div>
              </AnimatePresence>
            </div>

            <h1>
        
              <span className="hh-line">Hire a Dedicated Team of</span>
             
              <span className="hh-line">
                <span className="homepage-hero-ghl-inline">
                  <span className="homepage-hero-ghl-word"><span className="ghl-go">Go</span><span className="ghl-high">High</span><span className="ghl-level">Level</span></span>
                  <span className="hh-accent-word">Automation
                    
                    {/* <span className="hh-accent-sweep" aria-hidden="true" /> */}
                    
                    </span>{' '}
                </span>
              </span>
              <span className="hh-line">
               
                Experts for Your Agency
              </span>
              <span className="hh-line"> and Local Business.</span>

            </h1>

            <p className="speakable-intro hh-lede">GHL Prime is a specialist expert team you hire to run the technical side of your agency  GHL builds, automation workflows, AI agents, vibe coding, and 24/7 client support. All under your brand.</p>

            <div className="hero-cta hh-cta">
              <a href="https://www.upwork.com/agencies/ghlprime/" target="_blank" rel="noopener noreferrer" className="primary-pill large hh-cta-primary">
                Hire Your Expert Team
                <ArrowRight size={17} />
              </a>
              <Link href="/services" className="secondary-pill hh-cta-ghost">
                See What We Do
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <HeroAutomationCore />
        </div>
      </section>
  )
}

export default HeroBanner