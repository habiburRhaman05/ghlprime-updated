'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Lightbox from './Lightbox'
import './home-v2.css'

// Same photo set the previous Life At GHL Prime section used, served from
// /public. Split into two rows that scroll in opposite directions.
const FILES = [
  'DSC00041 (1).jpg', 'DSC00043 (1).jpg', 'DSC00056 (1).jpg', 'DSC00064 (1).jpg',
  'DSC00071 (1).jpg', 'DSC00072 (1).jpg', 'DSC00110 (1).jpg', 'DSC00111 (1).jpg',
  'DSC00353 (1).jpg', 'DSC00361 (1).jpg', 'DSC00382 (1).jpg',
]

const SHOTS = FILES.map((file, i) => ({
  id: `life-${i}`,
  src: `/life-at-images/${file.replace(/ /g, '%20')}`,
}))

const half = Math.ceil(SHOTS.length / 2)
const ROWS = [SHOTS.slice(0, half), SHOTS.slice(half)]

export default function LifeAtGhlV2() {
  const [viewing, setViewing] = useState(null)

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
          <span className="hv2-eyebrow">Team culture</span>
          <h2>Life at <span className="hv2-hl">GHL Prime.</span></h2>
          <p>
            The team behind the builds — in one office, working the same hours your clients do,
            and shipping together rather than passing tickets around.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="hv2-life-rows"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        {ROWS.map((row, i) => {
          // A loop copy must span the row, or the -50% keyframe leaves a gap
          // at the end. Repeat the row until it is long enough, then duplicate.
          const copies = Math.max(1, Math.ceil(8 / row.length))
          const oneCopy = Array.from({ length: copies }, () => row).flat()
          const track = [...oneCopy, ...oneCopy]
          return (
            <div className={`hv2-life-row${i % 2 ? ' is-reverse' : ''}`} key={i}>
              <div className="hv2-life-track" style={{ animationDuration: `${52 + i * 10}s` }}>
                {track.map((shot, j) => (
                  <button
                    type="button"
                    className="hv2-life-shot"
                    key={`${shot.id}-${j}`}
                    onClick={() => setViewing(SHOTS.indexOf(shot))}
                    aria-label="View photo full screen"
                  >
                    <img src={shot.src} alt="" loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </motion.div>

      <Lightbox
        images={SHOTS.map((s) => ({ src: s.src, alt: 'Life at GHL Prime' }))}
        index={viewing}
        onClose={() => setViewing(null)}
        onStep={setViewing}
      />
    </section>
  )
}
