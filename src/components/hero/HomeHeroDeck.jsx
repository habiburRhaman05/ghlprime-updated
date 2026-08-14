import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { Bot, BrainCircuit, CalendarCheck2, Headphones, MessageSquareText, RefreshCw, ShieldCheck } from 'lucide-react'
import './home-hero-deck.css'

/*
 * The homepage hero visual. Deliberately NOT a clone of the service-page
 * mocks (HeroWorkflowLive et al): those each show one service, while the
 * homepage promise is "we run the whole technical side". So this is a
 * composite -- one anchor panel (the delivery board) with satellite cards
 * for the other pillars named in the hero paragraph: AI agents, 24/7
 * white-label support, and GHL certification.
 *
 * Everything inside is decorative: the wrapper carries role="img" + a label
 * and the entire subtree is aria-hidden, so screen readers get one sentence
 * instead of dozens of invented numbers and a feed that mutates every 3.6s.
 *
 * Hard constraint: no <p> anywhere in here. The homepage schema's
 * `speakable` selector is `.hero p` (HomePage.jsx), so a paragraph inside
 * this component would silently leak mock UI text into the speakable
 * extract. Use span/div only.
 */

const NODES = [
  { label: 'Lead In', color: '#8b5cf6', Icon: MessageSquareText },
  { label: 'AI Qualify', color: '#06b6d4', Icon: BrainCircuit },
  { label: 'Book Call', color: '#f59e0b', Icon: CalendarCheck2 },
  { label: 'Nurture', color: '#10b981', Icon: RefreshCw },
]

// Modest, plausible dashboard metrics -- this is a professional services
// site, so nothing here should read as an inflated company claim.
const KPIS = [
  { label: 'Workflows live', value: 128, format: (v) => String(v) },
  { label: 'Tickets solved', value: 4900, format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)) },
  { label: 'First reply', value: 6, format: (v) => `${v}m` },
]

// Same naming convention as the service-page feeds (first name + initial).
const FEED_POOL = [
  { tone: 'green', text: 'Sarah M. — AI agent qualified, call booked' },
  { tone: 'green', text: 'James K. — Sub-account provisioned & branded' },
  { tone: 'blue', text: 'Marcus T. — Support ticket resolved · 4m' },
  { tone: 'green', text: 'Priya R. — Workflow repaired, 0 errors' },
  { tone: 'amber', text: 'Daniel O. — A2P registration approved' },
  { tone: 'blue', text: 'Elena V. — Voice receptionist answered 3 calls' },
]

// Times are positional, not per-item: the top row is always the newest.
const FEED_TIMES = ['just now', '18s ago', '47s ago']

const CREW = ['JR', 'NS', 'AK']

const FEED_MS = 3600
const SPINE_MS = 650
const EASE = [0.22, 1, 0.36, 1]

// Mirrors the matchMedia pattern already used by WhatWeAreSlider.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = (event) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

function useCountUp(target, enabled, delay) {
  const [value, setValue] = useState(enabled ? 0 : target)

  useEffect(() => {
    if (!enabled) {
      setValue(target)
      return undefined
    }

    let frame = null
    let start = null

    const startTimer = window.setTimeout(() => {
      const step = (now) => {
        if (start === null) start = now
        const progress = Math.min((now - start) / 1100, 1)
        // easeOutCubic -- fast arrival, soft landing.
        setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))))
        if (progress < 1) frame = window.requestAnimationFrame(step)
      }
      frame = window.requestAnimationFrame(step)
    }, delay)

    return () => {
      window.clearTimeout(startTimer)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [target, enabled, delay])

  return value
}

function KpiTile({ kpi, animate, delay }) {
  const value = useCountUp(kpi.value, animate, delay)

  return (
    <div className="hh-kpi">
      <span className="hh-kpi-label">{kpi.label}</span>
      <strong className="hh-kpi-value">{kpi.format(value)}</strong>
    </div>
  )
}

export default function HomeHeroDeck() {
  const reduced = usePrefersReducedMotion()
  const [feedTick, setFeedTick] = useState(0)
  const [spineStep, setSpineStep] = useState(0)

  useEffect(() => {
    if (reduced) return undefined
    const id = setInterval(() => setFeedTick((tick) => tick + 1), FEED_MS)
    return () => clearInterval(id)
  }, [reduced])

  useEffect(() => {
    if (reduced) return undefined
    // NODES.length + 1 leaves one empty beat, so the sequence reads as a
    // run that restarts rather than an unbroken chase.
    const id = setInterval(() => setSpineStep((step) => (step + 1) % (NODES.length + 1)), SPINE_MS)
    return () => clearInterval(id)
  }, [reduced])

  // Counting *down* from the tick means an incrementing tick pushes a new
  // row in at the top and retires the oldest from the bottom.
  const visibleFeed = useMemo(() => (
    FEED_TIMES.map((time, offset) => {
      const seq = feedTick - offset
      const index = ((seq % FEED_POOL.length) + FEED_POOL.length) % FEED_POOL.length
      return { ...FEED_POOL[index], time, key: seq }
    })
  ), [feedTick])

  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, { stiffness: 140, damping: 18 })
  const rotateY = useSpring(tiltY, { stiffness: 140, damping: 18 })

  const handlePointerMove = (event) => {
    if (reduced || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    // ±3.5deg. Any more and the mock stops looking like a product shot.
    tiltY.set(px * 7)
    tiltX.set(py * -7)
  }

  const resetTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  return (
    <div
      className="hh-visual"
      role="img"
      aria-label="GHL Prime delivery dashboard showing live GoHighLevel automations, an AI receptionist, and 24/7 white-label client support"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="hh-deck-stage" aria-hidden="true">
        <span className="hh-deck-dots" />
        <span className="hh-deck-glow" />

        <motion.div className="hh-deck" style={{ rotateX, rotateY }}>
          {/* Offset slab behind the panel -- the layered-stack cue that
              gives the composition depth without another gradient. */}
          <span className="hh-deck-plinth" />

          <div className="hh-panel">
            <div className="hh-chrome">
              <span className="hh-chrome-dots"><i /><i /><i /></span>
              <span className="hh-url">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="hh-url-text">app.gohighlevel.com/agency/delivery</span>
              </span>
              <span className="hh-live">
                <span className="hh-pulse" />
                <span className="hh-live-text">Live — 24/7</span>
              </span>
            </div>

            <div className="hh-panel-body">
              <div className="hh-panel-head">
                <span className="hh-panel-head-copy">
                  <span className="hh-panel-title">Client Delivery Board</span>
                  <span className="hh-panel-sub">GHL Prime · under your brand</span>
                </span>
                {/* The visual proof of "Hire a Dedicated Team". */}
                <span className="hh-crew">
                  {CREW.map((initials) => (
                    <span className="hh-crew-face" key={initials}>{initials}</span>
                  ))}
                  <span className="hh-crew-more">+9</span>
                </span>
              </div>

              <div className="hh-kpi-row">
                {KPIS.map((kpi, index) => (
                  <KpiTile key={kpi.label} kpi={kpi} animate={!reduced} delay={950 + index * 90} />
                ))}
              </div>

              <div className="hh-spine">
                {NODES.map((node, index) => (
                  <div className="hh-spine-item" key={node.label}>
                    <div
                      className={`hh-node${spineStep === index ? ' is-active' : ''}`}
                      style={{ '--node-color': node.color }}
                    >
                      <span className="hh-node-icon"><node.Icon size={14} /></span>
                      <span className="hh-node-label">{node.label}</span>
                    </div>
                    {index < NODES.length - 1 ? (
                      <span className={`hh-conn${spineStep === index ? ' is-active' : ''}`}>
                        <span className="hh-conn-line" />
                        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="hh-feed">
                <div className="hh-feed-head">
                  <span className="hh-pulse" />
                  <span className="hh-feed-title">Live Activity</span>
                  <span className="hh-feed-updated">Updated just now</span>
                </div>
                <div className="hh-feed-rows">
                  <AnimatePresence initial={false} mode="popLayout">
                    {visibleFeed.map((row) => (
                      <motion.div
                        key={row.key}
                        layout
                        className="hh-feed-row"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <span className={`hh-feed-dot tone-${row.tone}`} />
                        <span className="hh-feed-text">{row.text}</span>
                        <span className="hh-feed-time">{row.time}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="hh-statusbar">
              <span>0 errors</span>
              <i />
              <span>100% delivered</span>
              <i />
              <span>SLA 99.9%</span>
            </div>
          </div>

          {/* Satellites live in their own layer so they can be lifted on the
              Z axis independently of the panel, and so mobile can drop them
              back into normal flow with one rule. */}
          <div className="hh-orbit">
            <div className="hh-float hh-float-ai">
              <div className="hh-float-in">
                <div className="hh-float-inner">
                  <span className="hh-float-top">
                    <span className="hh-float-icon tone-blue"><Bot size={15} /></span>
                    <span className="hh-float-title">AI Receptionist</span>
                  </span>
                  <span className="hh-wave">
                    <i /><i /><i /><i /><i />
                  </span>
                  <span className="hh-float-meta">Answered 41 calls today</span>
                </div>
              </div>
              {/* Signal line from this card into the AI Qualify node. */}
              <svg className="hh-signal" viewBox="0 0 82 44" fill="none">
                <path className="hh-signal-base" d="M2 8 H32 Q48 8 48 26 H80" />
                <path className="hh-signal-dash" d="M2 8 H32 Q48 8 48 26 H80" />
              </svg>
            </div>

            <div className="hh-float hh-float-support">
              <div className="hh-float-in">
                <div className="hh-float-inner">
                  <span className="hh-float-top">
                    <span className="hh-float-icon tone-green"><Headphones size={15} /></span>
                    <span className="hh-float-title">24/7 White-Label Support</span>
                  </span>
                  <span className="hh-float-row">
                    <span className="hh-crew compact">
                      {CREW.map((initials) => (
                        <span className="hh-crew-face" key={initials}>{initials}</span>
                      ))}
                    </span>
                    <span className="hh-float-status">
                      <span className="hh-pulse" />
                      Live now
                    </span>
                  </span>
                  <span className="hh-float-meta">6m avg reply · your brand</span>
                </div>
              </div>
            </div>

            <div className="hh-float hh-float-cert">
              <div className="hh-float-in">
                <div className="hh-float-inner">
                  <span className="hh-float-top">
                    <img
                      className="hh-cert-logo"
                      src="/gohighlevel.png"
                      alt=""
                      width="18"
                      height="18"
                      loading="eager"
                      decoding="async"
                    />
                    <span className="hh-float-title">Certified Admin</span>
                  </span>
                  <span className="hh-cert-badge">
                    <ShieldCheck size={13} />
                    Highest GHL certification
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
