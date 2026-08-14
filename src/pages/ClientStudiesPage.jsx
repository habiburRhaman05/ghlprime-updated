import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import SiteFooter from '../components/SiteFooter'
import FaqSection from '../components/FaqSection'
import { CASE_STUDIES_FAQS } from '../data/faqs'
import { motion } from 'framer-motion'
import { fetchCaseStudies, SEEDED_CASE_STUDIES } from '../lib/caseStudiesApi'

const SEEDED_STUDIES = SEEDED_CASE_STUDIES

function safeSlug(slug) {
  if (!slug) return ''
  return String(slug).replace(/^case-studies\//, '').replace(/^\/+/, '')
}

export default function ClientStudiesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [studies, setStudies] = useState(SEEDED_STUDIES)

  useEffect(() => {
    let cancelled = false
    fetchCaseStudies()
      .then((result) => {
        if (cancelled) return
        if (Array.isArray(result) && result.length) setStudies(result)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    const dynamicCategories = Array.from(
      new Set(
        studies
          .map((item) => item.category)
          .filter(Boolean),
      ),
    )

    return ['All', ...dynamicCategories]
  }, [studies])

  const filteredStudies = useMemo(() => {
    if (activeCategory === 'All') return studies
    return studies.filter((item) => item.category === activeCategory)
  }, [activeCategory, studies])

  return (
    <main className="client-studies-page">
      <Helmet>
        <title>GoHighLevel Case Studies — Real Agency Results | GHL Prime</title>
        <meta name="description" content="See how GHL Prime built Voice AI systems, CRM migrations, n8n automations, and AI agents for agencies across home services, SaaS, real estate, and e-commerce." />
        <meta name="keywords" content="GoHighLevel case studies, GHL automation results, agency case studies, GoHighLevel success stories, automation case studies" />
        <link rel="canonical" href="https://ghlprime.com/case-studies" />
        <meta property="og:title" content="GoHighLevel Case Studies — Real Agency Results | GHL Prime" />
        <meta property="og:description" content="See how GHL Prime built Voice AI systems, CRM migrations, n8n automations, and AI agents for agencies across home services, SaaS, real estate, and e-commerce." />
        <meta property="og:url" content="https://ghlprime.com/case-studies" />
        <meta property="og:image" content="https://ghlprime.com/og-case-studies.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="GoHighLevel Case Studies — Real Agency Results | GHL Prime" />
        <meta name="twitter:description" content="See how GHL Prime built Voice AI systems, CRM migrations, n8n automations, and AI agents for agencies across home services, SaaS, real estate, and e-commerce." />
        <meta name="twitter:image" content="https://ghlprime.com/og-case-studies.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com' },
            { '@type': 'ListItem', position: 2, name: 'Case Studies', item: 'https://ghlprime.com/case-studies' },
          ],
        })}</script>
              <meta name="last-modified" content="2026-05-24" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': 'https://ghlprime.com/case-studies#webpage',
          url: 'https://ghlprime.com/case-studies',
          name: 'GoHighLevel Case Studies — Real Agency Results | GHL Prime',
          description: 'See how GHL Prime built Voice AI systems, CRM migrations, n8n automations, and AI agents for agencies across home services, SaaS, real estate, and e-commerce.',
          inLanguage: 'en-US',
          isPartOf: { '@id': 'https://ghlprime.com/#website' },
          about: { '@id': 'https://ghlprime.com/#organization' },
          datePublished: '2024-08-01',
          dateModified: '2026-05-24',
        })}</script>
      </Helmet>
      <section className="section section-white client-studies-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="eyebrow-label">Case Studies</span>
            <h1 className="client-studies-title">Real Systems. Real Workflow Improvements.</h1>
            <p className="client-studies-intro">Explore selected projects where GHL Prime helped businesses improve CRM structure, automation, follow-up, lead routing, and AI-enabled customer journeys.</p>
          </motion.div>

          <div className="client-study-filters">
            {categories.map((category) => (
              <button key={category} type="button" className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>
                {category}
              </button>
            ))}
          </div>

          <div className="client-study-grid">
            {filteredStudies.map((study, index) => (
              <motion.article
                key={study.slug}
                className="client-study-card client-study-card-compact"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link to={`/case-studies/${safeSlug(study.slug)}`} className="client-study-card-link" aria-label={`Read the ${study.title} case study`}>
                  <div className="client-study-image-wrap compact">
                    <img src={study.image} alt={study.title} className="client-study-image" loading="lazy" decoding="async" />
                  </div>
                  <div className="client-study-body compact">
                    <span className={`client-study-tag ${study.accent || 'emerald'}`}>{study.category}</span>
                    <h3>{study.title}</h3>
                    <p className="client-study-excerpt compact-listing-excerpt">{study.excerpt || study.challenge}</p>
                    <span className="text-link compact-read-more">Read More</span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {!filteredStudies.length ? (
            <div className="client-studies-empty-state">
              <h3>No client studies available right now.</h3>
              <p>New projects will appear here once they are published.</p>
            </div>
          ) : null}

          <div className="client-studies-bottom-cta">
            <h2>Want a similar system for your business?</h2>
            <p>Let's discuss how GHL Prime can transform your workflows, automate your processes, and scale your operations.</p>
            <div className="final-cta-actions">
              <Link to="/booking" className="primary-pill large">Get a free consultation</Link>
              <Link to="/team" className="secondary-pill">Meet the Team</Link>
            </div>
          </div>
        </div>
      </section>
      <FaqSection faqs={CASE_STUDIES_FAQS} intro="How our white-label engagements and ongoing work are structured." />
      <SiteFooter />
    </main>
  )
}
