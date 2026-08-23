'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { fetchPartnerLogos } from '../../lib/logosApi'
import './home-v2.css'

const STATS = [
  { label: 'Live products', value: 90, suffix: '+' },
  { label: 'Users served', value: 550, suffix: '+' },
  { label: 'Enterprise systems', value: 15, suffix: '' },
  { label: 'Years in production', value: 7, suffix: '+' },
]

const COUNT_MS = 1500

// Counts from 0 to `target` once the band is on screen. Holding at 0 until
// then matters: a count-up that finishes above the fold is just a static
// number with extra steps.
function useCountUp(target, active, reduceMotion) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (reduceMotion || !active) return undefined

    let frame
    let start
    const step = (now) => {
      if (start === undefined) start = now
      const p = Math.min((now - start) / COUNT_MS, 1)
      // easeOutCubic, so the number decelerates into its final value
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, active, reduceMotion])

  // Derived rather than pushed into state, so the reduced-motion case never
  // needs a synchronous setState inside the effect.
  return reduceMotion ? target : value
}

function Stat({ stat, active, reduceMotion, index }) {
  const value = useCountUp(stat.value, active, reduceMotion)
  return (
    <motion.div
      className="hv2-stat"
      // Arrives out of depth and pushes further forward on hover, the same
      // vocabulary every other surface on the page uses.
      style={{ transformPerspective: 900 }}
      initial={{ opacity: 0, z: -240, y: 16 }}
      whileInView={{ opacity: 1, z: 0, y: 0 }}
      whileHover={{ z: 30, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: 'spring', stiffness: 90, damping: 16, mass: 0.9, delay: index * 0.08 }}
    >
      <span className="hv2-stat-value">{value}{stat.suffix}</span>
      <span className="hv2-stat-label">{stat.label}</span>
    </motion.div>
  )
}

export default function TrustBandV2() {
  const [logos, setLogos] = useState([])
  const reduceMotion = useReducedMotion()
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 })

  useEffect(() => { fetchPartnerLogos().then((list) => setLogos(list || [])) }, [])

  const withImages = logos.filter((l) => l?.image_url)
  // One loop copy has to be at least as wide as the row, or the -50% keyframe
  // exposes a gap. Repeat the set until it is long enough, then duplicate that
  // whole copy so the loop point stays seamless.
  const copies = withImages.length ? Math.max(1, Math.ceil(10 / withImages.length)) : 0
  const oneCopy = Array.from({ length: copies }, () => withImages).flat()
  const track = oneCopy.length ? [...oneCopy, ...oneCopy] : []

  return (
    <>
      {track.length ? (
        <section className="hv2 hv2-marquee-section" aria-label="Brands we work with">
          <div className="hv2-inner">
            <p className="hv2-marquee-label">Trusted by agencies and growth-focused businesses</p>
            <div className="hv2-marquee">
              <div className="hv2-marquee-track">
                {track.map((logo, i) => (
                  <span className="hv2-marquee-item" key={`${logo.id || logo.name}-${i}`} aria-hidden={i >= withImages.length}>
                    {/* Logo URLs come from the admin and some point at hosts
                        that have since gone away. Drop the tile rather than
                        parade a broken-image glyph across the marquee. */}
                    <img
                      src={logo.image_url}
                      alt={i < withImages.length ? logo.name : ''}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="hv2 hv2-section is-paper" ref={statsRef}>
        <div className="hv2-inner">
          <motion.div
            className="hv2-stats"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
          >
            {STATS.map((stat, i) => (
              <Stat key={stat.label} stat={stat} index={i} active={statsInView} reduceMotion={reduceMotion} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
