'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Plane, Stage } from '../motion3d/Depth'
import './home-v2.css'

// Carried over from the old Vibe Coding capability chips.
const CHIPS = [
  'Custom Integrations',
  'API Connections',
  'Custom Dashboards',
  'AI-Assisted Dev',
  'Webhooks & Triggers',
  'Third-Party Syncs',
]

// Each line is [class, text]; 'c' comment, 'k' keyword, 's' string, '' plain.
const LINES = [
  [['c', '// GHL has no native endpoint for this. So we built one.']],
  [['k', 'export async function'], ['', ' syncDealToClientPortal(deal) {']],
  [['', '  '], ['k', 'const'], ['', ' contact = '], ['k', 'await'], ['', ' ghl.contacts.get(deal.contactId);']],
  [['', '  '], ['k', 'const'], ['', ' portal  = '], ['k', 'await'], ['', ' portalApi.upsert({']],
  [['', '    email: contact.email,']],
  [['', '    stage: deal.pipelineStage,']],
  [['', '    value: deal.monetaryValue,']],
  [['', '  });']],
  [['', '']],
  [['', '  '], ['c', '// fire the client-facing automation back inside GHL']],
  [['', '  '], ['k', 'await'], ['', ' ghl.workflows.trigger('], ['s', '"portal-updated"'], ['', ', {']],
  [['', '    contactId: contact.id, portalUrl: portal.url,']],
  [['', '  });']],
  [['', '']],
  [['', '  '], ['k', 'return'], ['', ' { ok: '], ['k', 'true'], ['', ', synced: portal.id };']],
  [['', '}']],
]

const CPS = 42 // lines are revealed a character at a time at this rate

export default function VibeCodingV2() {
  const reduceMotion = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  // Character offset each line starts at, so a line can work out how much of
  // itself is visible without the render carrying a running total.
  const { starts, total } = useMemo(() => {
    const out = []
    let n = 0
    for (const line of LINES) {
      out.push(n)
      n += line.reduce((len, [, text]) => len + text.length, 0) + 1
    }
    return { starts: out, total: n }
  }, [])

  const [typed, setTyped] = useState(0)

  useEffect(() => {
    if (reduceMotion || !inView) return undefined
    if (typed >= total) return undefined
    let frame
    let previous
    let carry = 0
    const step = (now) => {
      if (previous === undefined) previous = now
      carry += ((now - previous) / 1000) * CPS * 6
      previous = now
      if (carry >= 1) {
        const chars = Math.floor(carry)
        carry -= chars
        setTyped((n) => Math.min(total, n + chars))
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
    // `typed` is read once for the stop condition but deliberately kept out of
    // the deps: it changes every frame and would restart the loop each time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion, total])

  const done = reduceMotion || typed >= total

  return (
    <section className="hv2 hv2-section is-paper" ref={ref}>
      <div className="hv2-inner hv2-vibe">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
          <div className="hv2-head" style={{ marginBottom: 0 }}>
            <span className="hv2-eyebrow">Vibe coding</span>
            <h2>If GHL Can&rsquo;t Do It, <span className="hv2-hl">We Build It.</span></h2>
            <p>
              When the platform stops short, we write the layer that closes the gap, custom
              endpoints, dashboards, and logic wired straight back into your workflows.
            </p>
          </div>

          <div className="hv2-vibe-chips">
            {CHIPS.map((chip, i) => (
              <motion.span
                className="hv2-vibe-chip"
                key={chip}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: i * 0.05 }}
              >
                <Check size={14} aria-hidden="true" />
                {chip}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
        <Stage className="hv2-editor-stage" perspective={1400} travel={26}>
        <Plane className="hv2-stage-glow" z={-170} lag={0.55} aria-hidden="true" />
        <Plane
          className="hv2-editor"
          z={0}
          delay={0.06}
          role="img"
          aria-label="A custom GoHighLevel integration being written: syncDealToClientPortal pushes a deal into a client portal and triggers a portal-updated workflow back inside GHL."
        >
          <div className="hv2-editor-bar">
            <span className="hv2-dots" aria-hidden="true"><span /><span /><span /></span>
            <span className="hv2-editor-file">sync-deal-to-portal.ts</span>
          </div>
          <pre className="hv2-editor-body" aria-hidden="true">
            {LINES.map((line, i) => {
              const available = done ? Infinity : typed - starts[i]
              const lineLength = line.reduce((len, [, t]) => len + t.length, 0)
              const onCursorLine = !done && available >= 0 && available <= lineLength
              let consumed = 0
              return (
                <span className="hv2-editor-line" key={i}>
                  {available > 0
                    ? line.map(([cls, text], j) => {
                        const visible = Math.max(0, Math.min(text.length, available - consumed))
                        consumed += text.length
                        return visible ? <span className={cls} key={j}>{text.slice(0, visible)}</span> : null
                      })
                    : null}
                  {onCursorLine ? <span className="hv2-caret" /> : null}
                </span>
              )
            })}
          </pre>
        </Plane>
        </Stage>
        </motion.div>
      </div>
    </section>
  )
}
