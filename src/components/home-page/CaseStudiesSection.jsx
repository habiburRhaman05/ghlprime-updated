import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { fetchCaseStudies } from '../../lib/caseStudiesApi'

function safeSlug(slug) {
  if (!slug) return ''
  return String(slug).replace(/^case-studies\//, '').replace(/^\/+/, '')
}

export default function CaseStudiesSection() {
  const [caseStudies, setCaseStudies] = useState([])

  useEffect(() => {
    fetchCaseStudies().then((items) => setCaseStudies((items || []).slice(0, 3)))
  }, [])

  const renderCard = (study, index) => {
    const studyPath = study && study.slug ? `/case-studies/${safeSlug(study.slug)}` : '/case-studies'

    return (
      <Link
        key={`study-${(study && (study.id || study.slug || study.title)) || 'study'}-${index}`}
        href={studyPath}
        className="case-study-slider-card clickable"
      >
        <div className="case-study-slider-visual">
          {study && study.image ? <img src={study.image} alt={study.title || 'Case study'} className="case-study-slider-image" loading="lazy" decoding="async" /> : null}
          <div className="case-study-slider-overlay">
            <span className="case-study-slider-tag">{(study && study.category) || 'Case Study'}</span>
          </div>
        </div>
        <div className="case-study-slider-body">
          <h3>{(study && study.title) || 'Add your next case study here'}</h3>
          <p>{(study && (study.excerpt || study.challenge)) || 'Showcase a real client win with a short summary from the backend.'}</p>
          <span className="case-study-slider-arrow" aria-hidden="true">
            <ArrowRight size={18} />
          </span>
        </div>
      </Link>
    )
  }

  return (
    <section className="section case-studies-reference-section">
      <div className="container">
        <div className="case-studies-reference-head">
          <div className="case-studies-reference-copy">
            <span className="eyebrow-label">Case Studies</span>
            <h2>Real Work. <span>Real Results.</span></h2>
            <p>Real client wins from agencies, SaaS founders, and businesses that shipped with the GHL Prime team working behind the scenes.</p>
          </div>
        </div>

        <div className="case-studies-grid">
          {caseStudies.map((study, index) => renderCard(study, index))}
        </div>

        <Link href="/case-studies" className="secondary-pill case-studies-reference-cta">View All Case Studies</Link>
      </div>
    </section>
  )
}
