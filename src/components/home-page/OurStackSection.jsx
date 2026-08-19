import { motion } from 'framer-motion'
import { STACK_LOGOS } from '../../data/stackLogos'
import './our-stack.css'

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
}

const ROW_COUNT = 3

/* Seconds per full loop, per row. Slightly different values keep the three
   rows from ever lining up into one block that reads as a single slab. */
const ROW_DURATIONS = [42, 52, 46]

function chunkRows(items, rowCount) {
  const perRow = Math.ceil(items.length / rowCount)
  return Array.from({ length: rowCount }, (_, index) => items.slice(index * perRow, (index + 1) * perRow)).filter((row) => row.length)
}

function StackCard({ logo }) {
  if (logo.chip) {
    return (
      <div className="our-stack-card">
        <span className="our-stack-chip" style={{ background: logo.tone }}>{logo.name}</span>
      </div>
    )
  }

  return (
    <div className="our-stack-card">
      {logo.mark ? <img src={logo.mark} alt="" className="our-stack-mark" loading="lazy" decoding="async" /> : null}
      <span className="our-stack-word" style={logo.tone ? { color: logo.tone } : undefined}>{logo.name}</span>
    </div>
  )
}

/*
 * One infinitely scrolling row.
 *
 * The track holds two identical groups and animates to -50% minus half a gap:
 * the half-gap is what keeps the loop seamless, since the two groups sit one
 * gap apart while translating a flat -50% would only cover half of it. Each
 * group repeats the row twice so the strip still overflows a wide desktop
 * viewport when a row only carries six cards.
 */
function StackRow({ items, reverse, duration }) {
  const group = [...items, ...items]

  return (
    <div className={`our-stack-row${reverse ? ' is-reverse' : ''}`}>
      <div className="our-stack-track" style={{ animationDuration: `${duration}s` }}>
        {[0, 1].map((groupIndex) => (
          <div className="our-stack-group" key={groupIndex} aria-hidden={groupIndex === 1 ? 'true' : undefined}>
            {group.map((logo, index) => (
              <StackCard key={`${logo.name}-${index}`} logo={logo} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OurStackSection() {
  const rows = chunkRows(STACK_LOGOS, ROW_COUNT)

  return (
    <section className="section our-stack-section">
      <div className="container">
        <motion.div
          className="section-title centered our-stack-title"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2>Our Stack</h2>
          <p>We combine powerful design tools, modern development frameworks, &amp; smart automation platforms to build digital systems that perform, scale, and convert.</p>
        </motion.div>

        <motion.div
          className="our-stack-rows"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          {rows.map((row, index) => (
            <StackRow key={index} items={row} reverse={index % 2 === 1} duration={ROW_DURATIONS[index % ROW_DURATIONS.length]} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
