import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Check, Copy } from 'lucide-react'
import SiteFooter from '../components/SiteFooter'
import { fetchCaseStudyBySlug, SEEDED_CASE_STUDIES } from '../lib/caseStudiesApi'

const SEEDED_STUDIES = SEEDED_CASE_STUDIES

function findSeededStudy(slug) {
  return SEEDED_STUDIES.find((item) => item.slug === slug) || null
}

const CASE_STUDY_META = {
  'monkeyman-tree-service-automation': {
    title: 'Voice AI Case Study: Monkeyman Tree Service | GHL Prime',
    description: 'How GHL Prime deployed a 24/7 Voice AI agent and GoHighLevel automation for Monkeyman Tree Service stopping missed calls and capturing thousands in lost revenue.',
    canonical: 'https://ghlprime.com/case-studies/monkeyman-tree-service-automation',
    image: 'https://ghlprime.com/og-cs-monkeyman.png',
  },
  'b2b-saas-onboarding-n8n': {
    title: 'SaaS Onboarding Automation via n8n Case Study | GHL Prime',
    description: 'How we used n8n to untangle a broken SaaS onboarding flow, delivering a frictionless automated experience that eliminated churn at the point of activation.',
    canonical: 'https://ghlprime.com/case-studies/b2b-saas-onboarding-n8n',
    image: 'https://ghlprime.com/og-cs-saas-onboarding.png',
  },
  'hvac-voice-ai-dispatch-automation': {
    title: 'HVAC Voice AI & Dispatch Automation Case Study | GHL Prime',
    description: 'How a 24/7 Voice AI agent bridged the gap between off-hours HVAC emergencies and morning dispatch, capturing thousands in previously lost revenue.',
    canonical: 'https://ghlprime.com/case-studies/hvac-voice-ai-dispatch-automation',
    image: 'https://ghlprime.com/og-cs-hvac.png',
  },
  'real-estate-lead-qualification-ghl-ai': {
    title: 'Real Estate Lead Qualification with GHL & AI | GHL Prime',
    description: 'How GHL automation and instant AI follow-up transformed a broken real estate pipeline into a hands-free booking machine with measurable revenue impact.',
    canonical: 'https://ghlprime.com/case-studies/real-estate-lead-qualification-ghl-ai',
    image: 'https://ghlprime.com/og-cs-re-qualification.png',
  },
  'ai-ghostwriting-style-replication': {
    title: 'AI Content Generation & Style Replication Case Study | GHL Prime',
    description: 'An advanced Make.com pipeline that analyzes existing articles to extract a style guide, then uses AI to generate perfectly on-brand drafts at scale.',
    canonical: 'https://ghlprime.com/case-studies/ai-ghostwriting-style-replication',
    image: 'https://ghlprime.com/og-cs-ghostwriting.png',
  },
  'ai-data-enrichment-pipeline': {
    title: 'AI Company Data Enrichment Pipeline (n8n) | GHL Prime',
    description: 'An automated n8n pipeline that enriches company records from Google Sheets finding verified Facebook pages using an AI agent with confidence scoring.',
    canonical: 'https://ghlprime.com/case-studies/ai-data-enrichment-pipeline',
    image: 'https://ghlprime.com/og-cs-enrichment.png',
  },
  'automated-real-estate-lead-pipeline': {
    title: 'Automated Real Estate Lead Generation Pipeline | GHL Prime',
    description: 'An n8n workflow that scrapes Propwire for new listings, filters for first-time appearances, and syncs fresh leads to Google Sheets fully hands-free.',
    canonical: 'https://ghlprime.com/case-studies/automated-real-estate-lead-pipeline',
    image: 'https://ghlprime.com/og-cs-leadpipeline.png',
  },
  'conversational-commerce-messenger-chatbot': {
    title: 'Conversational Commerce Bot for BrainyBox (Messenger) | GHL Prime',
    description: 'A Facebook Messenger AI chatbot handling product discovery by text or image, multilingual conversation management, and full WooCommerce order processing.',
    canonical: 'https://ghlprime.com/case-studies/conversational-commerce-messenger-chatbot',
    image: 'https://ghlprime.com/og-cs-brainybox.png',
  },
  'automated-pdf-generation': {
    title: 'Automated PDF Application Generator (Veritas Pathways) | GHL Prime',
    description: 'An n8n workflow that captures student application data, generates branded HTML documents, converts to PDF, and emails to admissions zero manual work.',
    canonical: 'https://ghlprime.com/case-studies/automated-pdf-generation',
    image: 'https://ghlprime.com/og-cs-pdf.png',
  },
  'stateless-ai-internal-operations': {
    title: 'Stateless AI Assistant for Internal Operations | GHL Prime',
    description: 'An internal AI assistant with forced live data tool calls and strict ID-resolution protocols delivering accurate, secure natural-language access to company data.',
    canonical: 'https://ghlprime.com/case-studies/stateless-ai-internal-operations',
    image: 'https://ghlprime.com/og-cs-stateless.png',
  },
  'ai-support-dynamic-verification': {
    title: 'AI Customer Support with OTP Verification (OptimalMD) | GHL Prime',
    description: 'A dual-mode AI support agent with secure OTP authentication general info for guests and personalized automated actions for verified users.',
    canonical: 'https://ghlprime.com/case-studies/ai-support-dynamic-verification',
    image: 'https://ghlprime.com/og-cs-optimalmd.png',
  },
  'gohighlevel-and-cinc-ai-agent-integration': {
    title: 'GoHighLevel + CINC AI Agent Integration | GHL Prime',
    description: 'Connecting GoHighLevel with CINC to create a fully automated real estate pipeline AI qualification, instant GHL sync, and 80% accuracy rate on lead routing.',
    canonical: 'https://ghlprime.com/case-studies/gohighlevel-and-cinc-ai-agent-integration',
    image: 'https://ghlprime.com/og-cs-cinc.png',
  },
  'property-developer-ghl-nurture-automation': {
    title: 'Property Developer Lead Nurture Automation | GHL Prime',
    description: 'How a mid-sized development firm stopped losing after-hours inquiries with a custom GoHighLevel nurture sequence a 40% lift in lead conversion in 90 days.',
    canonical: 'https://ghlprime.com/case-studies/property-developer-ghl-nurture-automation',
    image: 'https://ghlprime.com/ghl-prime-logo.png',
  },
}

export default function ClientStudyDetailPage() {
  const { slug } = useParams()
  const seededStudy = findSeededStudy(slug)
  const [study, setStudy] = useState(seededStudy)
  const [status, setStatus] = useState(seededStudy ? 'found' : 'loading') // 'loading' | 'found' | 'notfound'
  const [copied, setCopied] = useState(false)

  // Re-seed synchronously during render when the slug changes (SPA navigation)
  // so real snapshot content is present on the first frame. This is React's
  // documented "adjust state while rendering" pattern it never wipes a
  // snapshot match to a loading/empty state.
  const [renderedSlug, setRenderedSlug] = useState(slug)
  if (renderedSlug !== slug) {
    setRenderedSlug(slug)
    setStudy(seededStudy)
    setStatus(seededStudy ? 'found' : 'loading')
  }
  const meta = useMemo(() => {
    if (slug && CASE_STUDY_META[slug]) return CASE_STUDY_META[slug]
    if (study && slug) {
      const canonical = `https://ghlprime.com/case-studies/${slug}`
      const baseTitle = study.title ? `${study.title} GoHighLevel Case Study | GHL Prime` : 'Case Study | GHL Prime'
      const baseDescription = study.excerpt || study.challenge || 'Real GoHighLevel implementation built by GHL Prime.'
      return { title: baseTitle, description: baseDescription, canonical }
    }
    return null
  }, [slug, study])

  useEffect(() => {
    let cancelled = false
    const seeded = findSeededStudy(slug)

    fetchCaseStudyBySlug(slug)
      .then((result) => {
        if (cancelled) return
        if (result) {
          setStudy(result)
          setStatus('found')
        } else if (!seeded) {
          setStatus('notfound')
        }
      })
      .catch(() => {
        if (!cancelled && !seeded) setStatus('notfound')
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const shareUrl = useMemo(() => {
    if (typeof window !== 'undefined') return window.location.href
    return slug ? `https://ghlprime.com/case-studies/${slug}` : 'https://ghlprime.com/case-studies'
  }, [slug])

  // While navigating between slugs the effect re-fetches; treat a study that
  // belongs to a previous slug as still-loading so we never flash stale content.
  const isStaleStudy = study && study.slug && slug && study.slug !== slug

  if (status === 'loading' || isStaleStudy) {
    return (
      <main className="section section-white client-study-detail-page">
        <Helmet>
          <title>Loading case study… | GHL Prime</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="container client-study-state" role="status" aria-live="polite">
          <span className="client-study-state-spinner" aria-hidden="true" />
          <p className="client-study-state-text">Loading case study…</p>
        </div>
      </main>
    )
  }

  if (status === 'notfound' || !study) {
    return (
      <main className="section section-white client-study-detail-page">
        <Helmet>
          <title>Case study not found | GHL Prime</title>
          <meta name="description" content="The case study you're looking for could not be found. Browse all GHL Prime GoHighLevel case studies and automation builds." />
          <meta name="robots" content="noindex, follow" />
          {meta ? <link rel="canonical" href={meta.canonical} /> : null}
        </Helmet>
        <div className="container client-study-notfound">
          <span className="eyebrow-label">404 Case Study</span>
          <h1>Case study not found</h1>
          <p className="client-study-notfound-intro">
            The case study you're looking for doesn't exist, may have been moved, or isn't
            published yet. Explore our other GoHighLevel and automation builds instead.
          </p>
          <div className="client-study-notfound-actions">
            <Link to="/case-studies" className="primary-pill large">Browse all case studies</Link>
            <Link to="/booking" className="secondary-pill">Book a free consultation</Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    )
  }

  const assignedTeam = (study.assigned_team_members || []).map((item) => item.team_member).filter(Boolean)

  async function handleCopyShareUrl() {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        const input = document.createElement('input')
        input.value = shareUrl
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }

      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="section section-white client-study-detail-page">
      {meta ? (
        <Helmet>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          <meta name="keywords" content={`${study.category || 'GoHighLevel'} case study, GoHighLevel automation, GHL Prime case study`} />
          <link rel="canonical" href={meta.canonical} />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:url" content={meta.canonical} />
          <meta property="og:type" content="article" />
          <meta property="og:image" content={meta.image || 'https://ghlprime.com/og-case-studies.png'} />
          <meta name="twitter:image" content={meta.image || 'https://ghlprime.com/og-case-studies.png'} />
          <meta name="last-modified" content="2026-05-24" />
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com/' },
              { '@type': 'ListItem', position: 2, name: 'Case Studies', item: 'https://ghlprime.com/case-studies' },
              { '@type': 'ListItem', position: 3, name: meta.title, item: meta.canonical },
            ],
          })}</script>
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            '@id': meta.canonical + '#article',
            headline: meta.title,
            description: meta.description,
            url: meta.canonical,
            image: study.image || 'https://ghlprime.com/ghl-prime-logo.png',
            datePublished: '2024-08-01',
            dateModified: '2026-05-24',
            inLanguage: 'en-US',
            author: { '@id': 'https://ghlprime.com/#organization' },
            publisher: { '@id': 'https://ghlprime.com/#organization' },
            articleSection: study.category || 'Case Study',
            mainEntityOfPage: { '@type': 'WebPage', '@id': meta.canonical + '#webpage' },
            about: { '@id': 'https://ghlprime.com/#organization' },
            isPartOf: { '@id': 'https://ghlprime.com/#website' },
          })}</script>
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': meta.canonical + '#webpage',
            url: meta.canonical,
            name: meta.title,
            description: meta.description,
            inLanguage: 'en-US',
            isPartOf: { '@id': 'https://ghlprime.com/#website' },
            primaryImageOfPage: { '@type': 'ImageObject', url: study.image || 'https://ghlprime.com/ghl-prime-logo.png' },
            datePublished: '2024-08-01',
            dateModified: '2026-05-24',
          })}</script>
        </Helmet>
      ) : null}
      <div className="container client-study-detail">
        <Link to="/case-studies" className="text-link">← Back to Case Studies</Link>
        <span className={`client-study-tag ${study.accent || 'emerald'}`}>{study.category}</span>
        <h1>{study.title}</h1>
        <p className="client-study-headline-result">{study.headline_result || study.outcome}</p>
        <p className="client-study-detail-excerpt">{study.excerpt}</p>

        <figure className="client-study-detail-image-wrap compact-hero">
          <img src={study.image} alt={study.image_caption || study.title} className="client-study-detail-image" loading="eager" decoding="async" />
          <figcaption className="client-study-image-caption">{study.image_caption || 'Before vs. After: Automation Setup'}</figcaption>
        </figure>

        <section className="client-study-at-a-glance" aria-labelledby="at-a-glance-heading">
          <h2 id="at-a-glance-heading" className="client-study-section-heading">At a glance</h2>
          <div className="client-study-detail-grid">
            <div className="case-block">
              <h3>Challenge</h3>
              <p>{study.challenge}</p>
            </div>
            <div className="case-block">
              <h3>Solution</h3>
              <p>{study.solution}</p>
            </div>
            <div className="case-block">
              <h3>Outcome</h3>
              <p className="highlight-outcome">{study.outcome}</p>
            </div>
          </div>
        </section>

        {(study.flow && study.flow.length) ? (
          <section className="client-study-how" aria-labelledby="how-it-worked-heading">
            <h2 id="how-it-worked-heading" className="client-study-section-heading">How It Worked</h2>
            <ol className="client-study-flow">
              {study.flow.map((step, i) => (
                <li key={step.label} className="client-study-flow-step">
                  <span className="client-study-flow-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="client-study-flow-copy">
                    <h3 className="client-study-flow-label">{step.label}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : (
          <section className="client-study-how" aria-labelledby="how-it-worked-heading">
            <h2 id="how-it-worked-heading" className="client-study-section-heading">How It Worked</h2>
            <ol className="client-study-flow">
              {(study.body || []).map((paragraph, i) => (
                <li key={i} className="client-study-flow-step">
                  <span className="client-study-flow-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="client-study-flow-copy">
                    <p>{paragraph}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {assignedTeam.length > 0 ? (
          <section className="assigned-team-section" aria-labelledby="assigned-team-heading">
            <div className="section-title">
              <span className="eyebrow-label">Assigned Teammates</span>
              <h2 id="assigned-team-heading">Who worked on this project</h2>
            </div>
            <div className="assigned-team-grid">
              {assignedTeam.map((member) => (
                <article key={member.id} className="assigned-team-card">
                  <div className="assigned-team-image-wrap">
                    <img src={member.image_url} alt={member.name} className="assigned-team-image" />
                  </div>
                  <div>
                    <h3>{member.name}</h3>
                    <strong>{member.role}</strong>
                    <p>{member.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="client-study-closing-cta" aria-labelledby="closing-cta-heading">
          <h2 id="closing-cta-heading">Want a system like this in your agency?</h2>
          <p>If this is the kind of build your operation is missing, GHL Prime can scope and ship something similar for your team in 1&ndash;2 weeks. No long sales cycle just a short scoping call and a clear plan.</p>
          <div className="client-study-closing-cta-actions">
            <Link to="/booking" className="primary-pill large">Get a free consultation</Link>
            <Link to="/case-studies" className="secondary-pill">See more case studies</Link>
          </div>
        </section>

        <button type="button" className={`client-study-share-box client-study-share-button ${copied ? 'copied' : ''}`} onClick={handleCopyShareUrl}>
          <div className="client-study-share-copy">
            <strong>Sharable Link</strong>
            <p>{shareUrl}</p>
          </div>
          <span className="client-study-share-action" aria-live="polite">
            {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
          </span>
        </button>
      </div>
      <SiteFooter />
    </main>
  )
}
