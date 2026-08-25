'use client'

import { motion } from 'framer-motion'
import { STACK_LOGOS } from '../../data/stackLogos'
import './home-v2.css'

const ROWS = 3

// Every row carries the whole logo set, each one rotated by a third so the
// rows still read as different. Splitting the set into three short rows left
// a single loop copy narrower than the viewport, and the -50% scroll keyframe
// then exposed the gap at the end of each row.
function rotatedRows(list, rows) {
  const step = Math.ceil(list.length / rows)
  return Array.from({ length: rows }, (_, i) => {
    const offset = i * step
    return [...list.slice(offset), ...list.slice(0, offset)]
  })
}

function Chip({ logo }) {
  return (
    <span className="hv2-stack-chip">
      {logo.mark
        ? <img src={logo.mark} alt="" loading="lazy" decoding="async" />
        : <span className="hv2-stack-dot" style={{ background: logo.tone || '#1895ff' }} aria-hidden="true" />}
      {logo.name}
    </span>
  )
}

export default function StackV2() {
  const rows = rotatedRows(STACK_LOGOS, ROWS)

  return (
    <section className="hv2 hv2-section is-paper">
      <div className="hv2-inner">
        <motion.div
          className="hv2-head centered"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
          <span className="hv2-eyebrow">Our stack</span>
          <h2>Enterprise Tech Delivered by <span className="hv2-hl">Our Expert Teams.</span></h2>
          <p>
            We combine powerful design tools, modern development frameworks, and smart automation
            platforms to build digital systems that perform, scale, and convert.
          </p>
        </motion.div>

        <div className="hv2-stack-rows">
          {rows.map((row, i) => {
            // Each row is duplicated so the -50% scroll keyframe loops seamlessly.
            const track = [...row, ...row]
            return (
              <div className={`hv2-stack-row${i % 2 ? ' is-reverse' : ''}`} key={i}>
                <div className="hv2-stack-track" style={{ animationDuration: `${38 + i * 7}s` }}>
                  {track.map((logo, j) => (
                    <Chip logo={logo} key={`${logo.name}-${j}`} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
