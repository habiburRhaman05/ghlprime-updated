'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

export default function FaqSection({
  eyebrow = 'FAQ',
  title = 'Frequently asked questions',
  intro,
  faqs = [],
  className = '',
}) {
  const [openIndex, setOpenIndex] = useState(0)

  if (!faqs.length) return null

  const toggle = (i) => setOpenIndex((cur) => (cur === i ? -1 : i))

  const renderItem = (item, i) => {
    const open = openIndex === i
    return (
      <li key={item.q} className={`faq-item${open ? ' is-open' : ''}`}>
        <button
          type="button"
          className="faq-question"
          onClick={() => toggle(i)}
          aria-expanded={open}
          aria-controls={`faq-panel-${i}`}
        >
          <span className="faq-question-text">{item.q}</span>
          <span className="faq-question-icon" aria-hidden="true">
            {open ? <Minus size={18} /> : <Plus size={18} />}
          </span>
        </button>
        <div
          id={`faq-panel-${i}`}
          className="faq-answer"
          role="region"
          aria-hidden={!open}
        >
          <p>{item.a}</p>
        </div>
      </li>
    )
  }

  // Two independently-flowing columns (not a CSS grid) so expanding an item
  // in one column can't force the other column's row to stretch/shift.
  const leftFaqs = faqs.filter((_, i) => i % 2 === 0)
  const rightFaqs = faqs.filter((_, i) => i % 2 === 1)

  return (
    <section className={`section section-white faq-section ${className}`.trim()}>
      <div className="container faq-container">
        <div className="section-title centered faq-title-block">
          <span className="eyebrow-label">{eyebrow}</span>
          <h2>{title}</h2>
          {intro ? <p>{intro}</p> : null}
        </div>
        <div className="faq-list">
          <ul className="faq-column">{leftFaqs.map((item, idx) => renderItem(item, idx * 2))}</ul>
          <ul className="faq-column">{rightFaqs.map((item, idx) => renderItem(item, idx * 2 + 1))}</ul>
        </div>
      </div>
    </section>
  )
}
