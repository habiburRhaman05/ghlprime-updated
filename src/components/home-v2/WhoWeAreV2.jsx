'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LifeBuoy, Award, Rocket } from 'lucide-react'
import { fetchGalleryImages } from '../../lib/galleryApi'
import { trackPointer, resetPointer } from '../motion3d/pointer'
import Lightbox from './Lightbox'
import './home-v2.css'

// Same fallbacks the old What-We-Are slider used, so the collage is never
// empty before the gallery loads (or if it has nothing in it).
const FALLBACK = [
  { id: 'wwa-2', image_url: '/GHL Organized FIle (2).png' },
  { id: 'wwa-1', image_url: '/GHL Organized FIle (1).png' },
  { id: 'wwa-3', image_url: '/GHL Organized FIle (3).png' },
]

// Carried over from the three proof cards under the old section.
const CARDS = [
  // LifeBuoy reads as "someone will help you" better than a headset, which
  // says call-centre; Award reads as earned expertise, which is stronger
  // than a generic tick for a line about specialists; Rocket carries scale,
  // which is what the copy actually promises.
  { icon: LifeBuoy, tone: 'blue', title: '24/7 Support', text: 'Always available when you need us.' },
  { icon: Award, tone: 'gold', title: 'Expert Team', text: 'Specialists in GHL & automation.' },
  { icon: Rocket, tone: 'teal', title: 'Client Growth', text: 'We train, support & help you scale.' },
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
            <h2>We&rsquo;re not software. We&rsquo;re your <span className="hv2-hl">expert team.</span></h2>
            <p>
              Real specialists, not a subscription. You get people who build, fix, and run the
              technical side of your agency — and who your clients never have to meet.
            </p>
          </div>

          <div className="hv2-who-cards">
            {CARDS.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  className="hv2-who-card"
                  key={card.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.1 + i * 0.09 }}
                >
                  <span className={`hv2-who-icon ${card.tone}`}><Icon size={19} /></span>
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
