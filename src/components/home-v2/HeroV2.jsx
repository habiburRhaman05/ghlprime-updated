'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Inbox, BrainCircuit, PhoneCall, CalendarCheck, Send } from 'lucide-react'
import Tilt from '../motion3d/Tilt'
import './home-v2.css'

const UPWORK = 'https://www.upwork.com/agencies/ghlprime/'

// The stages the hero console walks through on a loop. Deliberately the real
// shape of a lead-handling automation rather than decorative filler, so the
// visual doubles as an explanation of what the agency actually builds.
const PIPELINE = [
  { icon: Inbox, label: 'Lead captured', sub: 'form → webhook', done: 'stored' },
  { icon: BrainCircuit, label: 'AI agent qualifies', sub: 'intent + budget', done: 'scored' },
  { icon: PhoneCall, label: 'Voice follow-up', sub: 'twilio · 10DLC', done: 'answered' },
  { icon: CalendarCheck, label: 'Meeting booked', sub: 'calendar sync', done: 'confirmed' },
  { icon: Send, label: 'CRM updated', sub: 'pipeline stage', done: 'synced' },
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
      <span className="hv2-grid-bg" aria-hidden="true" />
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
            Hire a dedicated team of{' '}
            <span className="hv2-nowrap">
              <span className="go">Go</span><span className="high">High</span><span className="level">Level</span>
            </span>{' '}
            automation experts.
          </motion.h1>

          <motion.p
            className="hv2-lede speakable-intro"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.1 }}
          >
            GHL Prime is a specialist expert team you hire to run the technical side of your
            agency — GHL builds, automation workflows, AI agents, vibe coding, and 24/7 client
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
            <Link href="/services" className="primary-pill large">
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

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.14 }}
        >
          <div className="m3d-float">
          <Tilt className="hv2-console" role="img" aria-label="An automation run: lead captured, qualified by an AI agent, followed up by voice, meeting booked, CRM updated.">
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
                      <span className="hv2-node-icon">
                        {done ? <Check size={17} /> : <Icon size={17} />}
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
          </Tilt>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
