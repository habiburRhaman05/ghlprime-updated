'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  CheckCheck,
} from 'lucide-react'
import { Plane, Stage } from '../motion3d/Depth'
import './home-v2.css'

const UPWORK = 'https://www.upwork.com/agencies/ghlprime/'

// The pipeline icons are drawn here rather than pulled from a glyph set so
// each stage can carry its own living detail -- a lead dropping into the
// funnel, stars that twinkle, waves that ripple, a check drawing itself and
// a bolt that flashes. The looping parts are pure CSS (see home-v2.css).
function PipeSvg({ size = 17, children }) {
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

function IconFunnel({ size }) {
  return (
    <PipeSvg size={size}>
      <path d="M3.2 4h17.6l-6.6 7.6v7.2l-4.4-2.5v-4.7L3.2 4z" />
      <circle className="hv2-drop" cx="12" cy="1.6" r="1.15" fill="currentColor" stroke="none" />
    </PipeSvg>
  )
}

function IconSpark({ size }) {
  return (
    <PipeSvg size={size}>
      <path className="hv2-tw" d="M12 4.2l1.35 3.9L17.2 9.5l-3.85 1.4L12 14.8l-1.35-3.9L6.8 9.5l3.85-1.4z" fill="currentColor" stroke="none" />
      <path className="hv2-tw t2" d="M18.4 13.4l.75 2.05 2 .75-2 .75-.75 2-.75-2-2-.75 2-.75z" fill="currentColor" stroke="none" opacity=".85" />
      <path className="hv2-tw t3" d="M5.6 15.2l.55 1.55 1.55.55-1.55.55-.55 1.55-.55-1.55L3.5 17.3l1.55-.55z" fill="currentColor" stroke="none" opacity=".7" />
    </PipeSvg>
  )
}

function IconVoice({ size }) {
  return (
    <PipeSvg size={size}>
      <g transform="translate(0.4 3.2) scale(.78)">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </g>
      <path className="hv2-wave w1" d="M15.2 5a6.2 6.2 0 0 1 4.6 4.6" />
      <path className="hv2-wave w2" d="M15.9 2.1a9 9 0 0 1 6.4 6.4" />
    </PipeSvg>
  )
}

function IconCalendar({ size }) {
  return (
    <PipeSvg size={size}>
      <rect x="3.2" y="4.6" width="17.6" height="16" rx="2.6" />
      <path d="M8 2.6v4M16 2.6v4M3.2 9.6h17.6" />
      <path className="hv2-draw" d="M8.4 14.6l2.5 2.5 4.7-5" strokeWidth="2.1" />
    </PipeSvg>
  )
}

function IconDatabase({ size }) {
  return (
    <PipeSvg size={size}>
      <ellipse cx="10.2" cy="5.4" rx="6.7" ry="2.6" />
      <path d="M3.5 5.4v13.2c0 1.44 3 2.6 6.7 2.6 1.1 0 2.14-.1 3.05-.28" />
      <path d="M16.9 5.4v5" />
      <path d="M3.5 12c0 1.44 3 2.6 6.7 2.6 1.06 0 2.06-.09 2.96-.26" />
      <path className="hv2-bolt" d="M17.9 10.2l-3.4 5h2.6l-1 4.6 3.9-5.6h-2.6z" fill="currentColor" stroke="none" />
    </PipeSvg>
  )
}

// The stages the hero console walks through on a loop. Deliberately the real
// shape of a lead-handling automation rather than decorative filler, so the
// visual doubles as an explanation of what the agency actually builds.
const PIPELINE = [
  { icon: IconFunnel, tone: 'ic-sky', label: 'Lead captured', sub: 'form → webhook', done: 'stored' },
  { icon: IconSpark, tone: 'ic-violet', label: 'AI agent qualifies', sub: 'intent + budget', done: 'scored' },
  { icon: IconVoice, tone: 'ic-amber', label: 'Voice follow-up', sub: 'twilio · 10DLC', done: 'answered' },
  { icon: IconCalendar, tone: 'ic-teal', label: 'Meeting booked', sub: 'calendar sync', done: 'confirmed' },
  { icon: IconDatabase, tone: 'ic-emerald', label: 'CRM updated', sub: 'pipeline stage', done: 'synced' },
]

const TRUST = ['GoHighLevel Certified Admins', 'White-labeled under your brand', '24/7 coverage']

const STEP_MS = 1250

export default function HeroV2({ activePill, rotatingPills }) {
  const reduceMotion = useReducedMotion()
  // -1 keeps every node idle for one beat before the run starts, so the
  // sequence reads as "waiting → firing" rather than already mid-flight.
  const [stage, setStage] = useState(reduceMotion ? PIPELINE.length : -1)

  useEffect(() => {
    if (reduceMotion) return undefined
    const timer = setInterval(() => {
      setStage((s) => (s >= PIPELINE.length ? -1 : s + 1))
    }, STEP_MS)
    return () => clearInterval(timer)
  }, [reduceMotion])

  return (
    <section className="hv2 hv2-section is-tint hv2-hero">
      <span className="hv2-bloom one" aria-hidden="true" />
      <span className="hv2-bloom two" aria-hidden="true" />

      <div className="hv2-inner hv2-hero-grid">
        <div>
          <div className="hv2-pill-slot">
            <AnimatePresence mode="wait">
              <motion.span
                key={activePill}
                className="hv2-pill"
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
              >
                <span className="hv2-pill-dot" aria-hidden="true" />
                {rotatingPills[activePill]}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
          >
            Hire a Dedicated Team of{' '}
            <span className="hv2-nowrap">
              <span className="go">Go</span><span className="high">High</span><span className="level">Level</span>
            </span>{' '}
            Automation Experts.
          </motion.h1>

          <motion.p
            className="hv2-lede speakable-intro"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.1 }}
          >
            GHL Prime is a specialist expert team you hire to run the technical side of your
            agency, GHL builds, automation workflows, AI agents, vibe coding, and 24/7 client
            support. All under your brand.
          </motion.p>

          <motion.div
            className="hv2-hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.18 }}
          >
            <a href={UPWORK} target="_blank" rel="noopener noreferrer" className="primary-pill large">
              Hire Your Expert Team <ArrowRight size={17} />
            </a>
            <Link href="/services" className="secondary-pill large">
              See What We Do <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            className="hv2-hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.32 }}
          >
            {TRUST.map((t) => (
              <span className="hv2-trust-item" key={t}><Check size={15} /> {t}</span>
            ))}
          </motion.div>
        </div>

        {/* The hero visual is a set of surfaces at different depths inside one
            perspective, not a single panel being rotated: the console sits at
            the origin, the status chips float in front of it, and a glow
            plate sits well behind. Moving the pointer separates them. */}
        <Stage className="hv2-hero-stage" perspective={1500} travel={34}>
          <Plane className="hv2-stage-glow" z={-180} lag={0.55} delay={0} aria-hidden="true" />

          <Plane className="hv2-stage-console" z={0} delay={0.08}>
            <div
              className="hv2-console"
              role="img"
              aria-label="An automation run: lead captured, qualified by an AI agent, followed up by voice, meeting booked, CRM updated."
            >
              <div className="hv2-console-bar">
                <span className="hv2-dots" aria-hidden="true"><span /><span /><span /></span>
                <span className="hv2-console-title">lead-engine.workflow</span>
                <span className="hv2-console-live">live</span>
              </div>

              <div className="hv2-console-body">
                <div className="hv2-flow">
                  {PIPELINE.map((node, i) => {
                    const Icon = node.icon
                    const done = stage > i
                    const active = stage === i
                    return (
                      <div
                        className={`hv2-node${active ? ' is-active' : ''}${done ? ' is-done' : ''}`}
                        key={node.label}
                      >
                        <span className={`ic ic-sm hv2-node-icon ${node.tone}`}>
                          {done ? <CheckCheck size={17} /> : <Icon size={17} />}
                        </span>
                        <span>
                          <span className="hv2-node-label">{node.label}</span>
                          <span className="hv2-node-sub">{node.sub}</span>
                        </span>
                        <span className="hv2-node-state">
                          {done ? node.done : active ? 'running' : 'queued'}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="hv2-console-foot">
                  <span className="hv2-console-metric">avg handoff <strong>0.8s</strong></span>
                  <span className="hv2-console-metric">humans involved <strong>0</strong></span>
                </div>
              </div>
            </div>
          </Plane>
        </Stage>
      </div>
    </section>
  )
}
