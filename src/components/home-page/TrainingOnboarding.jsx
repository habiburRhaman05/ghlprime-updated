import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import { Headphones, PersonStanding, ShieldCheck, TrendingUp, Users } from 'lucide-react'
import { AgentMock, MockFrame, OverviewMock, WorkflowMock } from './TrainingMockups'
import './training-onboarding.css'

/*
 * "Expert Training & Onboarding"  --  the climb.
 *
 * A horizontal journey: three stations ascending left to right, joined by a
 * drawn stair path, with a walker on a dashed arc between each one and the
 * dashboard mockups climbing with them.
 *
 * GEOMETRY IS THE WHOLE TRICK. Every coordinate below is in one viewBox
 * space (VW x VH). The stage carries that exact aspect ratio, so the SVG
 * path and the percentage-positioned HTML (badges, copy, mockups) resolve to
 * the same pixel at every width. Change a number here and the stair, the
 * stem, the badge and the mock all move together; there is no second set of
 * offsets that can fall out of step.
 *
 * The scroll animation is driven by one progress value for the whole
 * section: it draws the stair path and advances which station is lit.
 *
 * Every string is carried over verbatim from the original section.
 */

/* --- Geometry ------------------------------------------------------------ */
const VW = 1536
const VH = 800

const BADGE_R = 26
const COPY_W = 260
// Sized so the three mockups sit side by side with a small gap and never
// overlap. Overlapping slices a neighbour's UI mid-component, which reads as
// a rendering fault rather than as depth.
const MOCK_W = 470
const MOCK_RATIO = 16 / 10
// Vertical distance from a station's copy top down to the stair tread it
// stands on, then on down to the top of its mockup.
const TREAD_DROP = 230
const MOCK_DROP = 250

// Station tops, highest-numbered highest up. 01 sits lowest, so the eye
// climbs as it reads left to right.
const STATION_Y = [215, 115, 15]
const STATION_X = [205, 695, 1185]

const STATIONS = [
  {
    number: '01',
    title: 'System Walkthrough & Handoff',
    text: 'We walk you through everything we’ve built  how it works, why it’s set up that way, and how to use it confidently with your clients.',
    Mock: WorkflowMock,
    navActive: 'Workflows',
    image: null,
  },
  {
    number: '02',
    title: 'Technical Deep Dive Sessions',
    text: 'Live sessions on GHL, automations, AI agents, and whatever part of the system you want to master. We go deep, not surface-level.',
    Mock: AgentMock,
    navActive: 'Automation',
    image: null,
  },
  {
    number: '03',
    title: 'Ongoing Support & Upskilling',
    text: 'As the platform evolves and your agency grows, we keep you updated  new features, better workflows, smarter approaches. You’re never left behind.',
    Mock: OverviewMock,
    navActive: 'Dashboard',
    image: null,
  },
].map((station, i) => {
  const y = STATION_Y[i]
  const x = STATION_X[i]
  const tread = y + TREAD_DROP
  const mockY = y + MOCK_DROP
  return {
    ...station,
    copy: { x, y, w: COPY_W },
    badge: { x: x - 55, y: y + BADGE_R },
    stem: { x: x - 55, from: y + BADGE_R * 2, to: tread },
    tread,
    mock: { x: x - 185, y: mockY, w: MOCK_W, h: MOCK_W / MOCK_RATIO },
  }
})

// The stair itself: a tread under each station, joined by risers. Built from
// the same tread values the stations use, so it cannot drift from them.
// Starts under station 01's badge rather than at the mock's left edge: a
// tread running out to the left of the first stem reads as an orphan line
// with nothing on it.
const STAIR_PATH = (() => {
  const [a, b, c] = STATIONS
  const endX = c.mock.x + c.mock.w
  const riser1 = b.mock.x - 4
  const riser2 = c.mock.x - 4
  return `M ${a.stem.x} ${a.tread} H ${riser1} V ${b.tread} H ${riser2} V ${c.tread} H ${endX}`
})()

// Walker + dashed arc sit in the clear space over each riser.
const WALKERS = [
  {
    at: { x: 455, y: 372 },
    arc: 'M 487 358 Q 545 315 598 286',
    tip: { x: 604, y: 283, a: -28 },
  },
  {
    at: { x: 945, y: 272 },
    arc: 'M 977 258 Q 1035 215 1088 186',
    tip: { x: 1094, y: 183, a: -28 },
  },
]

const pct = (v, total) => `${(v / total) * 100}%`

const OUTCOMES = [
  {
    eyebrow: 'Confidence to manage your GHL setup',
    title: 'Full technical ownership of your platform',
    Icon: ShieldCheck,
    tone: 'blue',
  },
  {
    eyebrow: 'Understanding of your automations',
    title: 'Ability to explain the system to clients',
    Icon: Users,
    tone: 'indigo',
  },
  {
    eyebrow: 'Access to our expert knowledge',
    title: 'Ongoing upskilling as your agency scales',
    Icon: TrendingUp,
    tone: 'sky',
  },
  {
    eyebrow: 'No more depending on developers',
    title: 'You run it. We support you when needed.',
    Icon: Headphones,
    tone: 'violet',
  },
]

const EASE = [0.22, 1, 0.36, 1]
// Progress at which each station lights up. Spaced so a station lands just
// after the stair line reaches it.
const STATION_AT = [0.06, 0.34, 0.62]

export default function TrainingOnboarding() {
  const reduced = useReducedMotion()
  const stageRef = useRef(null)
  const [reached, setReached] = useState(reduced ? STATIONS.length : 0)

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start 0.85', 'end 0.55'],
  })

  // Progress is monotonic on purpose. Binding the stair straight to scroll
  // would erase the line as the reader scrolls back up, which reads as the
  // journey being undone. Ground already covered stays covered.
  const draw = useMotionValue(reduced ? 1 : 0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced) return

    const target = Math.min(1, Math.max(0, v / 0.78))
    if (target > draw.get()) draw.set(target)

    let next = 0
    STATION_AT.forEach((threshold, i) => {
      if (v >= threshold) next = i + 1
    })
    setReached((prev) => (next > prev ? next : prev))
  })

  return (
    <section className="section section-white training-section jr" id="training">
      <span className="jr-wash" aria-hidden="true" />

      <div className="container jr-inner">
        {/* --- Header --------------------------------------------------- */}
        <motion.div
          className="jr-head"
          initial={{ opacity: 0, y: reduced ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="jr-eyebrow">Expert Training &amp; Onboarding</span>
          <h2 className="jr-heading">
            <span className="jr-heading-dark">We Don’t Just Build.</span>{' '}
            <span className="jr-heading-accent">We Train You to Win.</span>
          </h2>
          <p className="jr-lede">
            Our team trains you hands-on, technically  so you understand your own system, can serve clients better, and don’t depend on anyone to run your business.
          </p>
        </motion.div>

        {/* --- The climb ------------------------------------------------- */}
        <div className="jr-stage" ref={stageRef} style={{ aspectRatio: `${VW} / ${VH}` }}>
          <svg className="jr-lines" viewBox={`0 0 ${VW} ${VH}`} fill="none" aria-hidden="true">
            {/* Ghost of the full stair, so the climb has somewhere to go. */}
            <path className="jr-stair-ghost" d={STAIR_PATH} />
            <motion.path
              className="jr-stair"
              d={STAIR_PATH}
              style={{ pathLength: reduced ? 1 : draw }}
            />

            {STATIONS.map((station, i) => (
              <line
                key={station.number}
                className={`jr-stem${reached > i ? ' is-on' : ''}`}
                x1={station.stem.x}
                y1={station.stem.from}
                x2={station.stem.x}
                y2={station.stem.to}
              />
            ))}

            {WALKERS.map((walker, i) => (
              <g key={walker.arc} className={`jr-arc-group${reached > i ? ' is-on' : ''}`}>
                <path className="jr-arc" d={walker.arc} />
                <path
                  className="jr-arc-tip"
                  d="M -7 -6 L 0 0 L -7 6"
                  transform={`translate(${walker.tip.x} ${walker.tip.y}) rotate(${walker.tip.a})`}
                />
              </g>
            ))}
          </svg>

          {/* Walkers: HTML so the glyph keeps its own proportions. */}
          {WALKERS.map((walker, i) => (
            <div
              key={`w-${walker.at.x}`}
              className={`jr-walker${reached > i ? ' is-on' : ''}`}
              style={{ left: pct(walker.at.x, VW), top: pct(walker.at.y, VH) }}
              aria-hidden="true"
            >
              <PersonStanding size={20} />
            </div>
          ))}

          {STATIONS.map((station, i) => {
            const on = reached > i
            return (
              <div key={station.number} className={`jr-station${on ? ' is-on' : ''}`}>
                <div
                  className="jr-badge"
                  style={{ left: pct(station.badge.x, VW), top: pct(station.badge.y, VH) }}
                  aria-hidden="true"
                >
                  {station.number}
                </div>

                <div
                  className="jr-copy"
                  style={{
                    left: pct(station.copy.x, VW),
                    top: pct(station.copy.y, VH),
                    width: pct(station.copy.w, VW),
                  }}
                >
                  <h3 className="jr-title">{station.title}</h3>
                  <p className="jr-text">{station.text}</p>
                </div>

                <div
                  className="jr-mock"
                  style={{
                    left: pct(station.mock.x, VW),
                    top: pct(station.mock.y, VH),
                    width: pct(station.mock.w, VW),
                    zIndex: 3 + i,
                  }}
                >
                  <MockFrame image={station.image} alt="" active={station.navActive}>
                    <station.Mock />
                  </MockFrame>
                </div>
              </div>
            )
          })}
        </div>

        {/* --- Outcomes -------------------------------------------------- */}
        <div className="jr-outcomes">
          <motion.span
            className="jr-outcomes-label"
            initial={{ opacity: 0, y: reduced ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            What You’ll Walk Away With
          </motion.span>

          <motion.div
            className="jr-outcome-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          >
            {OUTCOMES.map((item, index) => (
              <motion.article
                key={item.title}
                className={`jr-outcome tone-${item.tone}`}
                variants={{
                  hidden: { opacity: 0, y: reduced ? 0 : 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                whileHover={reduced ? undefined : { y: -6 }}
              >
                <span className="jr-outcome-icon"><item.Icon size={22} /></span>
                <div className="jr-outcome-copy">
                  <span className="jr-outcome-idx" aria-hidden="true">{`0${index + 1}`}</span>
                  <strong className="jr-outcome-title">{item.title}</strong>
                  <span className="jr-outcome-eyebrow">{item.eyebrow}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
