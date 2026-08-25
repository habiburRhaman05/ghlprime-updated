'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import './home-v2.css'

// The six capability marks are hand-drawn so each can carry a living detail:
// a wrench rocking as it works, a bot that blinks, an eye whose pupil keeps
// slipping out of sight, a pulse riding the integration link, a terminal
// cursor blinking, and a runbook check that redraws itself. All loops are
// pure CSS except the link rider (SMIL), which reduced-motion users never see.
function CapSvg({ size = 24, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const IconSupportWrench = ({ size }) => (
  <CapSvg size={size}>
    <g className="hv2-rock">
      <path d="M14.7 6.3a4.4 4.4 0 0 0-5.9 5.5L3.4 17.2a1.9 1.9 0 0 0 2.7 2.7l5.4-5.4a4.4 4.4 0 0 0 5.5-5.9l-2.9 2.9-2.3-2.3z" />
    </g>
    <path className="hv2-tw" d="M19.6 3.4l.5 1.36 1.36.5-1.36.5-.5 1.36-.5-1.36-1.36-.5 1.36-.5z" fill="currentColor" stroke="none" />
  </CapSvg>
)

const IconAgentBot = ({ size }) => (
  <CapSvg size={size}>
    <path d="M12 8V4.9" />
    <circle className="hv2-antenna" cx="12" cy="3.7" r="1.25" fill="currentColor" stroke="none" />
    <rect x="4.5" y="8" width="15" height="11" rx="3" />
    <circle className="hv2-eye" cx="9" cy="12.8" r="1.3" fill="currentColor" stroke="none" />
    <circle className="hv2-eye" cx="15" cy="12.8" r="1.3" fill="currentColor" stroke="none" />
    <path d="M9.6 16.4h4.8" opacity=".7" />
  </CapSvg>
)

const IconGhostEye = ({ size }) => (
  <CapSvg size={size}>
    <path d="M2.5 12S6.1 6 12 6s9.5 6 9.5 6-3.6 6-9.5 6-9.5-6-9.5-6z" />
    <circle className="hv2-pupil" cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
  </CapSvg>
)

const IconLinkPulse = ({ size }) => (
  <CapSvg size={size}>
    <circle cx="5" cy="12" r="2.5" />
    <rect x="16.7" y="9.7" width="4.6" height="4.6" rx="1.2" />
    <path d="M7.5 12h9.2" strokeDasharray="2.4 2" opacity=".75" />
    <circle className="hv2-traveldot" r="1.45" fill="currentColor" stroke="none">
      <animateMotion dur="1.7s" repeatCount="indefinite" path="M5 12L19 12" />
    </circle>
  </CapSvg>
)

const IconTerminalDev = ({ size }) => (
  <CapSvg size={size}>
    <rect x="3" y="4" width="18" height="16" rx="2.4" />
    <path d="M3 8.4h18" opacity=".65" />
    <path d="M6.4 12.4l2.5 2.3-2.5 2.3" />
    <rect className="hv2-cursor" x="11.2" y="14.3" width="3.3" height="2" rx=".45" fill="currentColor" stroke="none" />
  </CapSvg>
)

const IconRunbook = ({ size }) => (
  <CapSvg size={size}>
    <path d="M12 6.8C10.4 5.3 8.2 4.6 5.4 4.6c-.9 0-1.7.08-2.4.22V18c.7-.14 1.5-.22 2.4-.22 2.8 0 5 .72 6.6 2.2 1.6-1.48 3.8-2.2 6.6-2.2.9 0 1.7.08 2.4.22V4.82a11 11 0 0 0-2.4-.22c-2.8 0-5 .72-6.6 2.2z" />
    <path d="M12 6.8v13" opacity=".65" />
    <path className="hv2-draw" d="M8.9 12.2l1.9 1.9 3.8-4" strokeWidth="2" />
  </CapSvg>
)

// Content carried over from the previous "Everything Your Agency Needs" grid,
// re-cut as a selectable list so the section explains one capability at a
// time instead of asking the reader to scan six boxes at once.
const CAPS = [
  {
    icon: IconSupportWrench,
    tone: 'ic-sky',
    title: 'GHL Technical Support',
    text: 'Direct expert support for setup, troubleshooting, cleanup, and backend execution.',
    points: ['Same-day response on build issues', 'Account audits and cleanup', 'Backend execution without hand-holding'],
  },
  {
    icon: IconAgentBot,
    tone: 'ic-violet',
    title: 'AI Agents & Call Center Setup',
    text: 'Deploy AI systems that qualify leads, support clients, and automate repetitive communication.',
    points: ['Lead qualification round the clock', 'Voice and chat agents inside GHL', 'Books straight into your calendar'],
  },
  {
    icon: IconGhostEye,
    tone: 'ic-indigo',
    title: 'White-Labeled Client Support',
    text: 'Stay invisible behind your agency while we help you support clients under your own brand.',
    points: ['Your brand on every touchpoint', 'Clients never know we exist', 'Coverage across US, CA, UK, AU'],
  },
  {
    icon: IconLinkPulse,
    tone: 'ic-teal',
    title: 'API Integrations',
    text: 'Connect HighLevel with third-party tools, CRMs, dashboards, and custom workflows.',
    points: ['Zapier, Slack, Google Workspace', 'Custom endpoints when none exist', 'Webhooks, triggers, and syncs'],
  },
  {
    icon: IconTerminalDev,
    tone: 'ic-amber',
    title: 'Vibe Coding & Custom Dev',
    text: 'If HighLevel can’t do it natively, we can build around it with custom code and automation logic.',
    points: ['Custom dashboards and portals', 'AI-assisted development', 'Logic the platform does not ship'],
  },
  {
    icon: IconRunbook,
    tone: 'ic-emerald',
    title: 'Training & SOP Support',
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
      <div className="hv2-inner">
        <motion.div
          className="hv2-head centered"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
          <span className="hv2-eyebrow">Everything your agency needs</span>
          <h2>One Team for the Whole <span className="hv2-hl">Technical Stack.</span></h2>
        </motion.div>

        <div className="hv2-cap">
          <div className="hv2-cap-list" role="tablist" aria-label="Capabilities">
            {CAPS.map((cap, i) => {
              const RowIcon = cap.icon
              const open = i === active
              return (
                <div className="hv2-cap-row" key={cap.title}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={open}
                    aria-expanded={open}
                    aria-controls={`hv2-cap-inline-${i}`}
                    className={`hv2-cap-item${open ? ' is-active' : ''}`}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                  >
                    <span className="hv2-cap-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="hv2-cap-title">{cap.title}</span>
                    <ChevronRight size={16} className="hv2-cap-chev" />
                  </button>

                  {/* Mobile only (see CSS): the list stacks above the panel
                      once the layout goes single-column, so picking an item
                      near the bottom meant scrolling back up to see it change.
                      Below that breakpoint the same content opens inline,
                      right under the row that was tapped, instead. */}
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        className="hv2-cap-inline"
                        id={`hv2-cap-inline-${i}`}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { type: 'spring', stiffness: 220, damping: 30, mass: 0.8 },
                          opacity: { duration: 0.22 },
                        }}
                      >
                        <div className="hv2-cap-inline-body">
                          <span className={`ic ic-solid hv2-cap-inline-icon ${cap.tone}`}><RowIcon size={19} /></span>
                          <p>{cap.text}</p>
                          <div className="hv2-cap-points">
                            {cap.points.map((p) => (
                              <span className="hv2-cap-point" key={p}><Check size={15} /> {p}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          <div className="hv2-cap-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.title}
                // Swaps by rotating the panel out and the next one in, rather
                // than cross-fading -- the selection reads as one object
                // turning to its next face.
                style={{ transformPerspective: 1200 }}
                initial={{ opacity: 0, z: -260, y: 14 }}
                animate={{ opacity: 1, z: 0, y: 0 }}
                exit={{ opacity: 0, z: -140, transition: { duration: 0.22 } }}
                transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
              >
                <span className={`ic ic-lg ic-solid hv2-cap-panel-icon ${current.tone}`}><Icon size={24} /></span>
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
