'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchGalleryImages } from '../../lib/galleryApi'
import { trackPointer, resetPointer } from '../motion3d/pointer'
import Lightbox from './Lightbox'
import './home-v2.css'

// Hand-drawn marks for the proof cards. Stock glyphs read as filler next to
// real product UI, so each card gets a small composed illustration instead:
// a headset with a sparkle, a team cluster, and bars climbing under an arrow.
const svgProps = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
})

function IconSupport({ size = 30 }) {
  return (
    <svg {...svgProps(size)}>
      <circle className="hv2-ring r1" cx="12" cy="12" r="9.4" />
      <circle className="hv2-ring r2" cx="12" cy="12" r="9.4" />
      <path d="M5.4 13.6v-2.1a6.6 6.6 0 0 1 13.2 0v2.1" />
      <rect className="hv2-pulse p1" x="4.5" y="12.8" width="3.5" height="5.4" rx="1.75" fill="currentColor" stroke="none" />
      <rect className="hv2-pulse p2" x="16" y="12.8" width="3.5" height="5.4" rx="1.75" fill="currentColor" stroke="none" />
      <path d="M17.75 18.2v.25a2.75 2.75 0 0 1-2.75 2.75h-2.4" />
      <path className="hv2-tw" d="M19.7 2.8l.6 1.62 1.62.6-1.62.6-.6 1.62-.6-1.62-1.62-.6 1.62-.6z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconTeam({ size = 30 }) {
  return (
    <svg {...svgProps(size)}>
      <circle className="hv2-dot dtA" cx="7.3" cy="9.4" r=".95" fill="currentColor" stroke="none" />
      <circle className="hv2-dot dtB" cx="16.7" cy="9.4" r=".95" fill="currentColor" stroke="none" />
      <path d="M7.3 9.4l1.85-.55M16.7 9.4l-1.85-.55" strokeDasharray="2.6 1.6" opacity=".65" />
      <circle cx="5" cy="10" r="2.35" />
      <circle cx="19" cy="10" r="2.35" />
      <circle className="hv2-beat" cx="12" cy="8.5" r="3.05" />
      <path d="M5.9 19.9c0-3.4 2.7-5.4 6.1-5.4s6.1 2 6.1 5.4" />
      <path d="M.9 18.8c0-2.4 1.65-3.9 4-3.9" />
      <path d="M23.1 18.8c0-2.4-1.65-3.9-4-3.9" />
    </svg>
  )
}

function IconGrowth({ size = 30 }) {
  return (
    <svg {...svgProps(size)}>
      <rect className="hv2-grow g1" x="4" y="14.2" width="3.5" height="7.3" rx="1.2" fill="currentColor" stroke="none" opacity=".7" />
      <rect className="hv2-grow g2" x="10.25" y="11" width="3.5" height="10.5" rx="1.2" fill="currentColor" stroke="none" opacity=".85" />
      <rect className="hv2-grow g3" x="16.5" y="7.8" width="3.5" height="13.7" rx="1.2" fill="currentColor" stroke="none" />
      <path className="hv2-trend" pathLength="100" d="M3 9.8L9 5.3l4.5 3L20.7 2.7" strokeWidth="2" />
      <path className="hv2-tip" pathLength="100" d="M15.9 2.3h5.2v5.2" strokeWidth="2" />
      <circle className="hv2-flashdot" cx="20.7" cy="2.7" r="1.35" fill="currentColor" stroke="none" />
    </svg>
  )
}

// Same fallbacks the old What-We-Are slider used, so the collage is never
// empty before the gallery loads (or if it has nothing in it).
const FALLBACK = [
  { id: 'wwa-2', image_url: '/GHL Organized FIle (2).png' },
  { id: 'wwa-1', image_url: '/GHL Organized FIle (1).png' },
  { id: 'wwa-3', image_url: '/GHL Organized FIle (3).png' },
]

// Carried over from the three proof cards under the old section.
const CARDS = [
  { icon: IconSupport, tone: 'm-sky', title: '24/7 Support', text: 'Always available when you need us.' },
  { icon: IconTeam, tone: 'm-violet', title: 'Expert Team', text: 'Specialists in GHL & automation.' },
  { icon: IconGrowth, tone: 'm-emerald', title: 'Client Growth', text: 'We train, support & help you scale.' },
]

export default function WhoWeAreV2() {
  const [shots, setShots] = useState(FALLBACK)
  const [viewing, setViewing] = useState(null)

  useEffect(() => {
    fetchGalleryImages().then((list) => {
      const withImages = (list || []).filter((g) => g?.image_url).slice(0, 3)
      if (withImages.length === 3) setShots(withImages)
    })
  }, [])

  return (
    <section className="hv2 hv2-section is-white">
      <div className="hv2-inner hv2-who">
        <motion.div
          className="hv2-who-stage"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
        {/* Inner element, not the motion one: framer owns the transform on
            anything it animates, so the pointer tilt needs its own node. */}
        <div className="hv2-who-collage" onMouseMove={trackPointer} onMouseLeave={resetPointer}>
          {shots.map((shot, i) => (
            <button
              type="button"
              className="hv2-who-shot"
              key={shot.id || shot.image_url}
              onClick={() => setViewing(i)}
              aria-label="View photo full screen"
            >
              <img src={shot.image_url} alt="The GHL Prime team" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.08 }}
        >
          <div className="hv2-head" style={{ marginBottom: 0 }}>
            <span className="hv2-eyebrow">What we actually are</span>
            <h2>We&rsquo;re Not Software. We&rsquo;re Your <span className="hv2-hl">Expert Team.</span></h2>
            <p>
              Real specialists, not a subscription. You get people who build, fix, and run the
              technical side of your agency, and who your clients never have to meet.
            </p>
          </div>

          <div className="hv2-who-cards">
            {CARDS.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  className="hv2-who-card ic-hover"
                  key={card.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.1 + i * 0.09 }}
                >
                  <span className={`hv2-who-mark ${card.tone}`}><Icon size={30} /></span>
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <Lightbox
        images={shots.map((s) => ({ src: s.image_url, alt: 'The GHL Prime team' }))}
        index={viewing}
        onClose={() => setViewing(null)}
        onStep={setViewing}
      />
    </section>
  )
}
