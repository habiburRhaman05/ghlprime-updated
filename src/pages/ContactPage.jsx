import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import SiteFooter from '../components/SiteFooter'

const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/j53xn6YJHwIdPImV00rn/webhook-trigger/788ab1c6-9220-4731-ba35-9919821c2fe2'

const STEPS = [
  { id: 1, title: 'Who are you?' },
  { id: 2, title: 'Your GHL situation' },
  { id: 3, title: 'Scope & timeline' },
  { id: 4, title: 'Anything else?' },
]

const COUNTRIES = [
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'CA', name: 'Canada', dial: '+1' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
  { code: 'AU', name: 'Australia', dial: '+61' },
  { code: 'NZ', name: 'New Zealand', dial: '+64' },
  { code: 'IE', name: 'Ireland', dial: '+353' },
  { code: 'IN', name: 'India', dial: '+91' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
  { code: 'BD', name: 'Bangladesh', dial: '+880' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966' },
  { code: 'SG', name: 'Singapore', dial: '+65' },
  { code: 'MY', name: 'Malaysia', dial: '+60' },
  { code: 'PH', name: 'Philippines', dial: '+63' },
  { code: 'ID', name: 'Indonesia', dial: '+62' },
  { code: 'JP', name: 'Japan', dial: '+81' },
  { code: 'CN', name: 'China', dial: '+86' },
  { code: 'HK', name: 'Hong Kong', dial: '+852' },
  { code: 'KR', name: 'South Korea', dial: '+82' },
  { code: 'TH', name: 'Thailand', dial: '+66' },
  { code: 'VN', name: 'Vietnam', dial: '+84' },
  { code: 'DE', name: 'Germany', dial: '+49' },
  { code: 'FR', name: 'France', dial: '+33' },
  { code: 'IT', name: 'Italy', dial: '+39' },
  { code: 'ES', name: 'Spain', dial: '+34' },
  { code: 'NL', name: 'Netherlands', dial: '+31' },
  { code: 'BE', name: 'Belgium', dial: '+32' },
  { code: 'CH', name: 'Switzerland', dial: '+41' },
  { code: 'AT', name: 'Austria', dial: '+43' },
  { code: 'SE', name: 'Sweden', dial: '+46' },
  { code: 'NO', name: 'Norway', dial: '+47' },
  { code: 'DK', name: 'Denmark', dial: '+45' },
  { code: 'FI', name: 'Finland', dial: '+358' },
  { code: 'PL', name: 'Poland', dial: '+48' },
  { code: 'PT', name: 'Portugal', dial: '+351' },
  { code: 'GR', name: 'Greece', dial: '+30' },
  { code: 'TR', name: 'Turkey', dial: '+90' },
  { code: 'RU', name: 'Russia', dial: '+7' },
  { code: 'UA', name: 'Ukraine', dial: '+380' },
  { code: 'IL', name: 'Israel', dial: '+972' },
  { code: 'EG', name: 'Egypt', dial: '+20' },
  { code: 'ZA', name: 'South Africa', dial: '+27' },
  { code: 'NG', name: 'Nigeria', dial: '+234' },
  { code: 'KE', name: 'Kenya', dial: '+254' },
  { code: 'MX', name: 'Mexico', dial: '+52' },
  { code: 'BR', name: 'Brazil', dial: '+55' },
  { code: 'AR', name: 'Argentina', dial: '+54' },
  { code: 'CL', name: 'Chile', dial: '+56' },
  { code: 'CO', name: 'Colombia', dial: '+57' },
  { code: 'PE', name: 'Peru', dial: '+51' },
]

const Q = {
  describes: {
    label: 'What best describes you?',
    options: ['Agency owner', 'SaaS founder', 'Business owner', 'Freelancer / consultant'],
  },
  situation: {
    label: 'Where are you right now with GoHighLevel?',
    options: [
      'Just getting started — need a full setup',
      'Already have GHL but not using it properly',
      'Need to migrate from another CRM',
      'Set up but automations are broken or incomplete',
    ],
  },
  clients: {
    label: 'How many clients or sub-accounts are you managing?',
    options: ['Just me / pre-launch', '1–5 clients', '6–20 clients', '20+ clients'],
  },
  budget: {
    label: 'What is your monthly budget for this?',
    options: ['$100 – $500', '$500 – $1,500', '$1,500 – $3,000', '$3,000+'],
  },
  timeline: {
    label: 'When do you need to get started?',
    options: ['As soon as possible', 'Within the next month', 'Just exploring for now'],
  },
}

function RadioGroup({ name, question, value, onChange }) {
  return (
    <div className="contact-survey-radio-group" role="radiogroup" aria-label={question.label}>
      <span className="contact-survey-radio-label">{question.label}</span>
      <div className="contact-survey-radio-list">
        {question.options.map((opt) => (
          <label
            key={opt}
            className={`contact-survey-radio-option${value === opt ? ' is-selected' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={(e) => onChange(e.target.value)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default function ContactPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    business: '',
    countryCode: 'US',
    phone: '',
    describes: '',
    situation: '',
    clients: '',
    budget: '',
    timeline: '',
    challenge: '',
  })

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const dial = COUNTRIES.find((c) => c.code === form.countryCode)?.dial || '+1'

  const isStepValid = (s = step) => {
    if (s === 1) {
      const phoneDigits = form.phone.replace(/\D/g, '')
      return (
        form.name.trim().length > 0 &&
        /\S+@\S+\.\S+/.test(form.email) &&
        form.business.trim().length > 0 &&
        form.describes.length > 0 &&
        phoneDigits.length >= 5
      )
    }
    if (s === 2) return form.situation.length > 0
    if (s === 3) return form.clients && form.budget && form.timeline
    return true
  }

  const next = () => setStep((s) => Math.min(4, s + 1))
  const back = () => setStep((s) => Math.max(1, s - 1))

  const handleSubmit = async () => {
    if (step !== 4 || submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'ghlprime.com/contact',
          submitted_at: new Date().toISOString(),
          name: form.name,
          email: form.email,
          business_name: form.business,
          country: form.countryCode,
          phone: `${dial} ${form.phone}`.trim(),
          role: form.describes,
          ghl_situation: form.situation,
          client_volume: form.clients,
          monthly_budget: form.budget,
          timeline: form.timeline,
          biggest_challenge: form.challenge || null,
        }),
      })
      navigate('/contact/thank-you')
    } catch (err) {
      setSubmitError('Something went wrong sending your request. Please try again or email info@ghlprime.com.')
      setSubmitting(false)
    }
  }

  // Stop Enter on text inputs from submitting the form prematurely.
  // Textareas (step 4) keep default Enter behaviour for new lines.
  const blockEnter = (e) => {
    if (e.key !== 'Enter') return
    const tag = (e.target.tagName || '').toUpperCase()
    if (tag === 'TEXTAREA') return
    e.preventDefault()
    if (step < 4 && isStepValid()) next()
  }

  return (
    <main className="contact-page">
      <Helmet>
        <title>Contact GHL Prime — Hire a GoHighLevel Expert Team</title>
        <meta name="description" content="Contact GHL Prime to hire a dedicated GoHighLevel expert for CRM setup, automation, AI agents, and white-label support. Based in Albuquerque, NM." />
        <meta name="keywords" content="contact GHL Prime, hire GoHighLevel expert, GoHighLevel agency contact, GoHighLevel support" />
        <link rel="canonical" href="https://ghlprime.com/contact" />
        <meta property="og:title" content="Contact GHL Prime — Hire a GoHighLevel Expert Team" />
        <meta property="og:description" content="Contact GHL Prime to hire a dedicated GoHighLevel expert for CRM setup, automation, AI agents, and white-label support. Based in Albuquerque, NM." />
        <meta property="og:url" content="https://ghlprime.com/contact" />
        <meta property="og:image" content="https://ghlprime.com/og-contact.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:image" content="https://ghlprime.com/og-contact.png" />
        <meta name="twitter:title" content="Contact GHL Prime — Hire a GoHighLevel Expert Team" />
        <meta name="twitter:description" content="Contact GHL Prime to hire a dedicated GoHighLevel expert for CRM setup, automation, AI agents, and white-label support. Based in Albuquerque, NM." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com' },
            { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://ghlprime.com/contact' },
          ],
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'GHL Prime',
          image: 'https://ghlprime.com/ghl-prime-logo.png',
          url: 'https://ghlprime.com',
          email: 'info@ghlprime.com',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Albuquerque',
            addressRegion: 'NM',
            postalCode: '87110',
            addressCountry: 'US',
          },
          areaServed: 'US',
          priceRange: '$$',
        })}</script>
              <meta name="last-modified" content="2026-05-24" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          '@id': 'https://ghlprime.com/contact#webpage',
          url: 'https://ghlprime.com/contact',
          name: 'Contact GHL Prime — Talk to a GoHighLevel Expert',
          description: 'Reach the GHL Prime team in Albuquerque, NM. Book a free discovery call, email info@ghlprime.com, or hire us directly on Upwork. Same-day reply guaranteed.',
          inLanguage: 'en-US',
          isPartOf: { '@id': 'https://ghlprime.com/#website' },
          about: { '@id': 'https://ghlprime.com/#organization' },
          datePublished: '2024-08-01',
          dateModified: '2026-05-24',
          mainEntity: { '@id': 'https://ghlprime.com/#localbusiness' },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': 'https://ghlprime.com/#localbusiness',
          name: 'GHL Prime',
          image: 'https://ghlprime.com/ghl-prime-logo.png',
          url: 'https://ghlprime.com',
          telephone: '+1-505-207-5189',
          email: 'info@ghlprime.com',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '4801 Lang Ave NE, Suite 110',
            addressLocality: 'Albuquerque',
            addressRegion: 'NM',
            postalCode: '87109',
            addressCountry: 'US',
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
          priceRange: '$$',
          areaServed: ['US', 'CA', 'GB', 'AU'],
        })}</script>
      </Helmet>

      <section className="section section-white contact-page-section">
        <div className="container contact-page-grid contact-page-grid-embed">
          <div className="contact-page-copy">
            <span className="eyebrow-label">Contact</span>
            <h1>Tell us about your GHL setup — get a free consultation.</h1>
            <p>A few quick questions so we know exactly how to help. Takes under a minute — no sales pitch.</p>
            <address style={{ fontStyle: 'normal', lineHeight: 1.7 }}>
              GHL Prime LLC<br />
              4801 Lang Ave NE, Suite 110<br />
              Albuquerque, NM 87109, USA<br />
              Email: <a href="mailto:info@ghlprime.com">info@ghlprime.com</a><br />
              Phone: <a href="tel:+15052075189">+1 505-207-5189</a>
            </address>
            <div className="contact-page-info-cards">
              <div className="contact-info-card">
                <strong>Best for</strong>
                <p>Project inquiries, agency support, white-label execution, and custom builds.</p>
              </div>
              <div className="contact-info-card">
                <strong>What happens next</strong>
                <p>We review your answers and reply within one business day with a clear path forward.</p>
              </div>
            </div>
          </div>

          <div className="contact-form-shell contact-survey-shell">
            <div className="contact-survey-card">
              <ol className="contact-survey-progress">
                {STEPS.map((s) => {
                  const state = s.id === step ? 'is-current' : s.id < step ? 'is-done' : ''
                  return (
                    <li key={s.id} className={`contact-survey-step ${state}`}>
                      <span className="contact-survey-step-num">
                        {s.id < step ? <CheckCircle2 size={14} /> : s.id}
                      </span>
                      <span className="contact-survey-step-label">{s.title}</span>
                    </li>
                  )
                })}
              </ol>

              <div className="contact-survey-form" onKeyDown={blockEnter}>
                {step === 1 && (
                  <fieldset className="contact-survey-fieldset">
                    <legend className="contact-survey-heading">Step 1 — Who are you?</legend>
                    <label className="contact-survey-field">
                      <span>Your name <em className="contact-survey-required">*</em></span>
                      <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" />
                    </label>
                    <label className="contact-survey-field">
                      <span>Email address <em className="contact-survey-required">*</em></span>
                      <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" />
                    </label>
                    <label className="contact-survey-field">
                      <span>Phone number <em className="contact-survey-required">*</em></span>
                      <div className="contact-survey-phone">
                        <select
                          className="contact-survey-phone-country"
                          value={form.countryCode}
                          onChange={(e) => update('countryCode', e.target.value)}
                          aria-label="Country code"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} {c.dial}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => update('phone', e.target.value)}
                          autoComplete="tel"
                          placeholder="Phone number"
                          className="contact-survey-phone-input"
                        />
                      </div>
                    </label>
                    <label className="contact-survey-field">
                      <span>Business name <em className="contact-survey-required">*</em></span>
                      <input type="text" required value={form.business} onChange={(e) => update('business', e.target.value)} autoComplete="organization" />
                    </label>
                    <RadioGroup name="describes" question={Q.describes} value={form.describes} onChange={(v) => update('describes', v)} />
                  </fieldset>
                )}

                {step === 2 && (
                  <fieldset className="contact-survey-fieldset">
                    <legend className="contact-survey-heading">Step 2 — Your current GHL situation</legend>
                    <RadioGroup name="situation" question={Q.situation} value={form.situation} onChange={(v) => update('situation', v)} />
                  </fieldset>
                )}

                {step === 3 && (
                  <fieldset className="contact-survey-fieldset">
                    <legend className="contact-survey-heading">Step 3 — Scope & timeline</legend>
                    <RadioGroup name="clients" question={Q.clients} value={form.clients} onChange={(v) => update('clients', v)} />
                    <RadioGroup name="budget" question={Q.budget} value={form.budget} onChange={(v) => update('budget', v)} />
                    <RadioGroup name="timeline" question={Q.timeline} value={form.timeline} onChange={(v) => update('timeline', v)} />
                  </fieldset>
                )}

                {step === 4 && (
                  <fieldset className="contact-survey-fieldset">
                    <legend className="contact-survey-heading">Step 4 — Anything else?</legend>
                    <label className="contact-survey-field">
                      <span>Briefly describe your biggest challenge right now <em>(optional)</em></span>
                      <textarea
                        rows={5}
                        value={form.challenge}
                        placeholder="e.g. our follow-up sequences keep breaking and we are losing leads..."
                        onChange={(e) => update('challenge', e.target.value)}
                      />
                    </label>
                    {submitError ? <p className="contact-survey-error">{submitError}</p> : null}
                  </fieldset>
                )}

                <div className="contact-survey-actions">
                  {step > 1 ? (
                    <button type="button" className="secondary-pill" onClick={back} disabled={submitting}>
                      <ArrowLeft size={16} /> Back
                    </button>
                  ) : (
                    <span />
                  )}
                  {step < 4 ? (
                    <button type="button" className="primary-pill" onClick={next} disabled={!isStepValid()}>
                      Next <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button type="button" className="primary-pill" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? 'Sending…' : 'Send request'} <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}