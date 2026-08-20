'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Check, LifeBuoy, Bot, ShieldCheck, Plug, Code2, GraduationCap } from 'lucide-react'
import './home-v2.css'

// Content carried over from the previous "Everything Your Agency Needs" grid,
// re-cut as a selectable list so the section explains one capability at a
// time instead of asking the reader to scan six boxes at once.
const CAPS = [
  {
    icon: LifeBuoy,
    title: 'GHL technical support',
    text: 'Direct expert support for setup, troubleshooting, cleanup, and backend execution.',
    points: ['Same-day response on build issues', 'Account audits and cleanup', 'Backend execution without hand-holding'],
  },
  {
    icon: Bot,
    title: 'AI agents & call center setup',
    text: 'Deploy AI systems that qualify leads, support clients, and automate repetitive communication.',
    points: ['Lead qualification round the clock', 'Voice and chat agents inside GHL', 'Books straight into your calendar'],
  },
  {
    icon: ShieldCheck,
    title: 'White-labeled client support',
    text: 'Stay invisible behind your agency while we help you support clients under your own brand.',
    points: ['Your brand on every touchpoint', 'Clients never know we exist', 'Coverage across US, CA, UK, AU'],
  },
  {
    icon: Plug,
    title: 'API integrations',
    text: 'Connect HighLevel with third-party tools, CRMs, dashboards, and custom workflows.',
    points: ['Zapier, Slack, Google Workspace', 'Custom endpoints when none exist', 'Webhooks, triggers, and syncs'],
  },
  {
    icon: Code2,
    title: 'Vibe coding & custom dev',
    text: 'If HighLevel can’t do it natively, we can build around it with custom code and automation logic.',
    points: ['Custom dashboards and portals', 'AI-assisted development', 'Logic the platform does not ship'],
  },
  {
    icon: GraduationCap,
    title: 'Training & SOP support',
    text: 'We train your team, document the system, and help you scale delivery with more confidence.',
    points: ['Live technical deep dives', 'Documented runbooks', 'Ongoing upskilling as you grow'],
  },
]

export default function CapabilitiesV2() {
  const [active, setActive] = useState(0)
  const current = CAPS[active]
  const Icon = current.icon

  return (
    <section className="hv2 hv2-section is-tint">
      <span className="hv2-grid-bg" aria-hidden="true" />
      <div className="hv2-inner">
        <motion.div
          className="hv2-head centered"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
          <span className="hv2-eyebrow">Everything your agency needs</span>
          <h2>One team for the whole <span className="hv2-hl">technical stack.</span></h2>
        </motion.div>

        <div className="hv2-cap">
          <div className="hv2-cap-list" role="tablist" aria-label="Capabilities">
            {CAPS.map((cap, i) => (
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`hv2-cap-item${i === active ? ' is-active' : ''}`}
                key={cap.title}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
              >
                <span className="hv2-cap-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="hv2-cap-title">{cap.title}</span>
                <ChevronRight size={16} className="hv2-cap-chev" />
              </button>
            ))}
          </div>

          <div className="hv2-cap-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.title}
                // Swaps by rotating the panel out and the next one in, rather
                // than cross-fading -- the selection reads as one object
                // turning to its next face.
                style={{ transformPerspective: 1200, transformOrigin: 'left center' }}
                initial={{ opacity: 0, rotateY: 42, x: -14 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: -28, x: 10 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
              >
                <span className="hv2-cap-panel-icon"><Icon size={24} /></span>
                <h3>{current.title}</h3>
                <p>{current.text}</p>
                <div className="hv2-cap-points">
                  {current.points.map((p) => (
                    <span className="hv2-cap-point" key={p}><Check size={16} /> {p}</span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
