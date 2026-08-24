'use client'

import { motion } from 'framer-motion'
import './home-v2.css'

// Hand-drawn marks for the four delivery phases. Each one loops quietly:
// a radar sweeping its scope, a block settling onto the stack, a handoff dot
// travelling between panels, and skill bars climbing.
function PhSvg({ size = 22, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const IconScanRadar = ({ size }) => (
  <PhSvg size={size}>
    <circle cx="12" cy="12" r="7.6" />
    <circle cx="12" cy="12" r="10.2" strokeDasharray="2.4 3.2" opacity=".5" />
    <g className="hv2-sweep">
      <path d="M12 12V5.6" />
      <path d="M12 5.6a6.4 6.4 0 0 1 4.5 1.9" opacity=".45" />
    </g>
    <circle className="hv2-corepulse" cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="16.2" cy="14.6" r=".8" fill="currentColor" stroke="none" opacity=".55" />
    <circle cx="8.6" cy="15.4" r=".65" fill="currentColor" stroke="none" opacity=".4" />
  </PhSvg>
)

const IconBuildBlocks = ({ size }) => (
  <PhSvg size={size}>
    <rect x="3.6" y="13.6" width="7.2" height="6" rx="1.5" />
    <rect x="13.2" y="13.6" width="7.2" height="6" rx="1.5" />
    <g className="hv2-bobber">
      <rect x="8.4" y="4.4" width="7.2" height="6" rx="1.5" />
    </g>
    <path className="hv2-tw" d="M21.2 3.4l.42 1.14 1.14.42-1.14.42-.42 1.14-.42-1.14-1.14-.42 1.14-.42z" fill="currentColor" stroke="none" />
  </PhSvg>
)

const IconHandoffPanels = ({ size }) => (
  <PhSvg size={size}>
    <rect x="3.2" y="7.2" width="6.2" height="9.6" rx="1.7" />
    <rect x="14.6" y="7.2" width="6.2" height="9.6" rx="1.7" />
    <path d="M9.8 12h4.4" />
    <path d="M12.7 10.3L14.4 12l-1.7 1.7" />
    <circle className="hv2-traveldot" r="1.3" fill="currentColor" stroke="none">
      <animateMotion dur="1.7s" repeatCount="indefinite" path="M9.8 12h4.4" />
    </circle>
  </PhSvg>
)

const IconSkillRise = ({ size }) => (
  <PhSvg size={size}>
    <path d="M3.6 19.6h16.8" opacity=".5" />
    <path className="hv2-grow g1" d="M6.6 19.6v-3.2" />
    <path className="hv2-grow g2" d="M11 19.6v-6" />
    <path className="hv2-grow g3" d="M15.4 19.6v-8.8" />
    <circle className="hv2-flashdot" cx="15.4" cy="8.6" r="1.05" fill="currentColor" stroke="none" />
  </PhSvg>
)

const PHASES = [
  {
    icon: IconScanRadar,
    title: 'Scope & audit',
    text: 'We review your account, map the sales process, and identify exactly what needs to be built, fixed, or migrated.',
  },
  {
    icon: IconBuildBlocks,
    title: 'Build the system',
    text: 'Sub-accounts, pipelines, automations, AI agents, and integrations assembled and wired end to end.',
  },
  {
    icon: IconHandoffPanels,
    title: 'Walkthrough & handoff',
    text: 'We walk you through everything we have built, how it works, why it is set up that way, and how to use it confidently with your clients.',
  },
  {
    icon: IconSkillRise,
    title: 'Ongoing support & upskilling',
    text: 'As the platform evolves and your agency grows, we keep you updated, new features, better workflows, smarter approaches.',
  },
]

// The four outcomes the old training / onboarding section promised. They
// belong with the process, not in a section of their own.
const OUTCOMES = [
  { eyebrow: 'Confidence to manage your GHL setup', title: 'Full technical ownership of your platform' },
  { eyebrow: 'Understanding of your automations', title: 'Ability to explain the system to clients' },
  { eyebrow: 'Access to our expert knowledge', title: 'Ongoing upskilling as your agency scales' },
  { eyebrow: 'No more depending on developers', title: 'You run it. We support you when needed.' },
]

const PHASE_SPRING = { type: 'spring', stiffness: 110, damping: 19, mass: 0.9 }

export default function ProcessV2() {
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
          <span className="hv2-eyebrow">How we work</span>
          <h2>You run it. <span className="hv2-hl">We support you when needed.</span></h2>
          <p>No black boxes. You end up owning a system you understand, with a team on call when you want to extend it.</p>
        </motion.div>

        {/* Four phase cards chained by chevrons -- each card arrives out of
            depth, its number disc stamps in with a one-shot ping the moment
            it lands, and the chevron between two cards draws in right as
            the second one arrives, so the chain reads as being assembled
            rather than four boxes that happened to fade in together. */}
        <div className="hv2-phases">
          {PHASES.map(({ title, text }, i) => (
            <motion.div
              className="hv2-phase"
              key={title}
              style={{ transformPerspective: 1000 }}
              initial={{ opacity: 0, z: -130, y: 22 }}
              whileInView={{ opacity: 1, z: 0, y: 0 }}
              whileHover={{ z: 20, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ ...PHASE_SPRING, delay: i * 0.16 }}
            >
              {i > 0 ? (
                <motion.span
                  className="hv2-phase-chevron"
                  aria-hidden="true"
                  initial={{ opacity: 0, x: -6, scale: 0.4, rotate: 45 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1, rotate: 45 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18, delay: i * 0.16 - 0.06 }}
                />
              ) : null}
              <div className="hv2-phase-top">
                <motion.span
                  className="hv2-phase-num"
                  initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
                  whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16, mass: 0.7, delay: i * 0.16 + 0.14 }}
                >
                  {String(i + 1).padStart(2, '0')}
                  <motion.span
                    className="hv2-phase-ping"
                    aria-hidden="true"
                    initial={{ scale: 0.7, opacity: 0.7 }}
                    whileInView={{ scale: 1.9, opacity: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.85, delay: i * 0.16 + 0.2, ease: 'easeOut' }}
                  />
                </motion.span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.div>
          ))}
        </div>

        {/* What ownership looks like afterwards -- one quiet band, each tick
            drawing itself in as its row arrives instead of just appearing. */}
        <motion.div
          className="hv2-own"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
          {OUTCOMES.map((item, i) => (
            <motion.div
              className="hv2-own-item"
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.7, delay: i * 0.1 }}
            >
              <span className="hv2-own-tick" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    d="M4.5 12.5l5 5 10-11"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.45, delay: i * 0.1 + 0.25, ease: 'easeOut' }}
                  />
                </svg>
              </span>
              <div className="hv2-own-copy">
                <strong>{item.title}</strong>
                <span>{item.eyebrow}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
