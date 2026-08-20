'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import './faq-v2.css'

const EASE = [0.22, 1, 0.36, 1]

export default function FaqSection({
  eyebrow = 'FAQ',
  title = 'Frequently asked questions',
  intro,
  faqs = [],
  className = '',
}) {
  const [openIndex, setOpenIndex] = useState(0)
  const uid = useId()

  if (!faqs.length) return null

  const toggle = (i) => setOpenIndex((cur) => (cur === i ? -1 : i))

  return (
    <section className={`section faq2 ${className}`.trim()}>
      <div className="container faq2-grid">
        {/* Sticky rail. The heading and the escape hatch stay with the reader
            as they work down a long list, instead of scrolling away at the
            top of a two-column block. */}
        <motion.aside
          className="faq2-rail"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="faq2-eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          {intro ? <p className="faq2-intro">{intro}</p> : null}

          <div className="faq2-help">
            <span className="faq2-help-dot" aria-hidden="true" />
            <div>
              <strong>Still have a question?</strong>
              <p>Ask us directly — same-day reply, no commitment.</p>
            </div>
            <Link href="/booking" className="faq2-help-link">
              Book a free call <ArrowRight size={15} />
            </Link>
          </div>
        </motion.aside>

        <ul className="faq2-list">
          {faqs.map((item, i) => {
            const open = openIndex === i
            const panelId = `${uid}-faq-${i}`
            return (
              <motion.li
                className={`faq2-item${open ? ' is-open' : ''}`}
                key={item.q}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, ease: EASE, delay: Math.min(i, 8) * 0.04 }}
              >
                <span className="faq2-rule" aria-hidden="true" />
                <button
                  type="button"
                  className="faq2-q"
                  onClick={() => toggle(i)}
                  aria-expanded={open}
                  aria-controls={panelId}
                >
                  <span className="faq2-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="faq2-q-text">{item.q}</span>
                  {/* One glyph that rotates into a cross, rather than
                      swapping plus for minus -- the rotation is the tell. */}
                  <motion.span
                    className="faq2-icon"
                    aria-hidden="true"
                    animate={{ rotate: open ? 135 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24, mass: 0.6 }}
                  >
                    <Plus size={17} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      id={panelId}
                      className="faq2-a"
                      role="region"
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        // Spring the height so the panel decelerates into
                        // place instead of stopping on a clock. Damped just
                        // under 1 so it settles without bouncing the layout
                        // below it. Opacity stays a short tween -- fading on
                        // a spring makes the text look like it hesitates.
                        height: { type: 'spring', stiffness: 220, damping: 30, mass: 0.8 },
                        opacity: { duration: 0.22, ease: EASE },
                      }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
