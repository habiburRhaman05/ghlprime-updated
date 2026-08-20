'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { Bot, Clock, Filter, CalendarCheck } from 'lucide-react'
import Tilt from '../motion3d/Tilt'
import './home-v2.css'

// A real qualification exchange, played back message by message. This is the
// section that has to *show* what an AI automation agency ships, so the
// transcript is the product demo rather than a stock illustration.
const SCRIPT = [
  { from: 'user', text: 'Hi — do you handle GoHighLevel migrations?' },
  { from: 'bot', text: 'We do. Are you moving off HubSpot, Keap, or something else?' },
  { from: 'user', text: 'HubSpot. About 12,000 contacts.' },
  { from: 'bot', text: 'That size migrates cleanly in 1–2 weeks with zero data loss. What is your timeline?' },
  { from: 'user', text: 'Ideally this month.' },
  { from: 'bot', text: 'Booked you with a Certified Admin for Thursday 2pm. Confirmation is in your inbox.' },
]

const POINTS = [
  { icon: Clock, title: 'Answers in seconds, at 3am', text: 'No queue, no missed enquiry, no lead going cold overnight while your team sleeps.' },
  { icon: Filter, title: 'Qualifies before it books', text: 'Intent, budget, and timeline captured up front, so the calls that land are worth taking.' },
  { icon: CalendarCheck, title: 'Writes straight back to your CRM', text: 'Contact, notes, pipeline stage, and calendar entry all updated without anyone touching it.' },
]

const REPLY_MS = 1150
// How long the finished transcript is held before it replays.
const HOLD_MS = 3400

export default function AgentV2() {
  const reduceMotion = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.3 })
  const [played, setPlayed] = useState(0)
  const [typing, setTyping] = useState(false)
  // Reduced motion gets the whole transcript at once rather than a playback.
  const shown = reduceMotion ? SCRIPT.length : played

  useEffect(() => {
    if (reduceMotion || !inView) return undefined

    // Once the exchange finishes, hold it long enough to read, then clear and
    // run it again -- the panel is never a static screenshot while it is on
    // screen. Timers are torn down when the section scrolls away, so the loop
    // costs nothing off-screen and picks up again on the way back.
    if (played >= SCRIPT.length) {
      const restart = setTimeout(() => setPlayed(0), HOLD_MS)
      return () => clearTimeout(restart)
    }

    // The agent "thinks" before each of its own replies; the visitor's lines
    // land immediately, which is what makes the exchange feel like a real one.
    // Both branches flip state from a timer callback, never synchronously.
    const isBot = SCRIPT[played].from === 'bot'
    const think = isBot ? setTimeout(() => setTyping(true), 40) : null
    const advance = setTimeout(() => {
      setTyping(false)
      setPlayed((n) => n + 1)
    }, isBot ? REPLY_MS : 620)

    return () => { if (think) clearTimeout(think); clearTimeout(advance) }
  }, [played, inView, reduceMotion])

  return (
    <section className="hv2 hv2-section is-tint" ref={ref}>
      <div className="hv2-inner hv2-agent">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
          <div className="hv2-head" style={{ marginBottom: 0 }}>
            <span className="hv2-eyebrow">AI agents, deployed</span>
            <h2>Your best closer <span className="hv2-hl">never sleeps.</span></h2>
            <p>
              We design, build, and deploy AI agents tailored to your agency&apos;s workflow —
              qualifying leads, handling inquiries, running AI call centers, and booking
              meetings 24/7, without you touching a thing.
            </p>
          </div>

          <div className="hv2-agent-points">
            {POINTS.map((p) => {
              const Icon = p.icon
              return (
                <div className="hv2-agent-point" key={p.title}>
                  <span className="hv2-agent-point-icon"><Icon size={19} /></span>
                  <div>
                    <h4>{p.title}</h4>
                    <p>{p.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
        <Tilt
          className="hv2-chat"
          role="img"
          aria-label={SCRIPT.map((m) => `${m.from === 'bot' ? 'Agent' : 'Visitor'}: ${m.text}`).join(' ')}
        >
          <div className="hv2-chat-head">
            <span className="hv2-chat-avatar"><Bot size={16} /></span>
            <span>
              <span className="hv2-chat-name">Intake Agent</span>
              <span className="hv2-chat-status">Answers in under 5 seconds</span>
            </span>
            <span className="hv2-chat-badge">Live</span>
          </div>

          <div className="hv2-chat-body" aria-hidden="true">
            <AnimatePresence initial={false}>
              {SCRIPT.slice(0, shown).map((m, i) => (
                <motion.div
                  className={`hv2-msg from-${m.from}`}
                  key={i}
                  style={{ transformPerspective: 700, transformOrigin: 'bottom center' }}
                  initial={{ opacity: 0, rotateX: -55, y: 12 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  exit={{ opacity: 0, rotateX: 30, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.7 }}
                >
                  {m.text}
                </motion.div>
              ))}
            </AnimatePresence>
            {typing ? (
              <div className="hv2-msg from-bot">
                <span className="hv2-typing"><span /><span /><span /></span>
              </div>
            ) : null}
          </div>

          <div className="hv2-chat-foot">
            <span className="hv2-chat-foot-dot" aria-hidden="true" />
            Meeting booked · contact and pipeline stage synced to GoHighLevel
          </div>
        </Tilt>
        </motion.div>
      </div>
    </section>
  )
}
