'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import './service-survey.css'

const DIAL_CODES = ['+1', '+44', '+61', '+91', '+971', '+92', '+234', '+353', '+49', '+33', '+39', '+34', '+27', '+880', '+63']

// GoHighLevel (LeadConnector) inbound webhook every service-page form submission POSTs here.
const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/j53xn6YJHwIdPImV00rn/webhook-trigger/a325877a-48bf-4f92-8bf7-61aece1d7cb9'

export default function ServiceSurveyForm({ form, slug }) {
  const totalSteps = form.steps.length
  const [step, setStep] = useState(1)
  const [data, setData] = useState({ dialCode: '+1' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (name, value) => setData((d) => ({ ...d, [name]: value }))
  const current = form.steps[step - 1]
  const isLast = step === totalSteps

  const stepValid = (() => {
    for (const f of current.fields || []) {
      if (f.required && !String(data[f.name] || '').trim()) return false
    }
    for (const q of current.questions || []) {
      if (!data[q.name]) return false
    }
    return true
  })()

  // One fixed schema for EVERY service form. Fields a given form does not collect
  // are sent as empty strings, so the backend / email template can map once.
  const buildPayload = () => {
    const d = data
    const v = (k) => (d[k] == null ? '' : String(d[k]))
    const lines = []
    for (const s of form.steps) {
      for (const q of s.questions || []) {
        if (d[q.name]) lines.push(`${q.label} ${d[q.name]}`)
      }
      if (s.textarea && d[s.textarea.name]) lines.push(`${s.textarea.label}: ${d[s.textarea.name]}`)
    }
    return {
      // Contact same on every form
      name: v('name'),
      email: v('email'),
      phone: `${d.dialCode || ''} ${d.phone || ''}`.trim(),
      business: v('business'),
      // "About you" only one of these is filled per form, the rest stay empty
      role: v('role'),
      business_type: v('bizType'),
      stage: v('stage'),
      app_type: v('appType'),
      // Free-text needs (all forms)
      needs: v('needsDetail'),
      // Budget / scope subset filled per form, rest empty
      budget: v('budget'),
      sub_accounts: v('subaccounts'),
      lead_volume: v('leadVolume'),
      coverage: v('coverage'),
      // Meta same on every form
      service: slug,
      source: 'Service page survey',
      details: lines.join('\n'),
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      submitted_at: new Date().toISOString(),
    }
  }

  const handleNext = async () => {
    if (!stepValid || submitting) return
    if (!isLast) {
      setStep((s) => s + 1)
      return
    }
    const payload = buildPayload()
    setSubmitting(true)
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      console.error('Lead webhook submit failed:', err)
    }
    console.log('Form submitted:', payload)
    setSubmitting(false)
    setSubmitted(true)
  }

  const handleBack = () => setStep((s) => Math.max(1, s - 1))

  if (submitted) {
    return (
      <div className="svf-card">
        <div className="svf-body svf-success">
          <div className="svf-success-icon"><Check size={26} /></div>
          <h3 className="svf-success-title">{form.success.title}</h3>
          <p className="svf-success-sub">{form.success.subtitle}</p>
          <Link href={form.success.ctaTo || '/booking'} className="svf-cal-btn">
            {form.success.ctaLabel} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }


  return (
    <div className="svf-card">
      {/* Brand header band: everything that stays put across steps lives
          here, so the white body below only ever holds the current step. */}
      <div className="svf-head">
        {form.titlePill ? <span className="svf-pill">{form.titlePill}</span> : null}
        {form.titleSub ? <p className="svf-subtitle">{form.titleSub}</p> : null}

        {/* Step indicator: one static segment per step, filled left-to-right.
            Nothing slides or renumbers between steps -- only the fill changes. */}
        <div className="svf-progress">
          <div className="svf-progress-meta">
            <span className="svf-progress-name">{form.stepLabels[step - 1]}</span>
            <span className="svf-progress-count">{step} / {totalSteps}</span>
          </div>
          <div className="svf-progress-segments">
            {form.stepLabels.map((label, i) => (
              <span
                className={`svf-progress-segment${i < step ? ' is-filled' : ''}`}
                key={label}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="svf-body">
      {/* Keyed on the step number so advancing swaps the whole panel out --
          the fields slide across rather than snapping in place. */}
      <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -18 }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      >
      <div className="svf-eyebrow">{current.eyebrow}</div>
      {current.title ? <div className="svf-title">{current.title}</div> : null}

      {(current.fields || []).map((f) =>
        f.type === 'phone' ? (
          <div className="svf-group" key={f.name}>
            <label className="svf-label">{f.label}{f.required ? <span className="svf-req">*</span> : null}</label>
            <div className="svf-phone-row">
              <select
                className="svf-country"
                value={data.dialCode}
                onChange={(e) => set('dialCode', e.target.value)}
                aria-label="Country dialing code"
              >
                {DIAL_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                className="svf-input"
                type="tel"
                inputMode="tel"
                placeholder="(555) 000-0000"
                value={data[f.name] || ''}
                onChange={(e) => set(f.name, e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="svf-group" key={f.name}>
            <label className="svf-label">{f.label}{f.required ? <span className="svf-req">*</span> : null}</label>
            <input
              className="svf-input"
              type={f.type === 'email' ? 'email' : 'text'}
              placeholder={f.placeholder || ''}
              value={data[f.name] || ''}
              onChange={(e) => set(f.name, e.target.value)}
            />
          </div>
        ),
      )}

      {(current.questions || []).map((q) => (
        <div className="svf-group" key={q.name}>
          <label className="svf-label">{q.label}</label>
          <div className="svf-radios" role="radiogroup" aria-label={q.label}>
            {q.options.map((opt) => {
              const selected = data[q.name] === opt
              return (
                <button
                  type="button"
                  key={opt}
                  className={`svf-radio${selected ? ' selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => set(q.name, opt)}
                >
                  <span className="svf-radio-dot">{selected ? <Check size={11} strokeWidth={3.5} /> : null}</span>
                  <span>{opt}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {current.textarea ? (
        <div className="svf-group">
          <label className="svf-label">{current.textarea.label}</label>
          <textarea
            className="svf-textarea"
            placeholder={current.textarea.placeholder || ''}
            value={data[current.textarea.name] || ''}
            onChange={(e) => set(current.textarea.name, e.target.value)}
          />
        </div>
      ) : null}
      </motion.div>
      </AnimatePresence>

      <div className={`svf-nav${step === 1 ? ' end' : ''}`}>
        {step > 1 ? (
          <button type="button" className="svf-back" onClick={handleBack} disabled={submitting}>
            <ArrowLeft size={15} /> Back
          </button>
        ) : null}
        <button type="button" className="svf-next" onClick={handleNext} disabled={!stepValid || submitting}>
          {submitting ? 'Sending...' : (isLast ? (form.submitLabel || 'Submit') : 'Next')} <ArrowRight size={16} />
        </button>
      </div>
      </div>
    </div>
  )
}