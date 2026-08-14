import { useEffect, useState } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { fetchShowcaseForPage, fetchShowcaseStats } from '../lib/showcaseApi'
import '../styles/shipped-evidence.css'

function isImageUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim())
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.filter(Boolean)
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags)
      if (Array.isArray(parsed)) return parsed.filter(Boolean)
    } catch {
      return tags.split(',').map((t) => t.trim()).filter(Boolean)
    }
  }
  return []
}

// Renders the brand logo inside a fixed-height frame so the FULL logo is always
// visible (contain, never cropped), regardless of the brand's aspect ratio.
// Returns null when there is no icon, so the name simply leads instead.
function OriginLogo({ icon, name }) {
  if (!icon) return null
  if (isImageUrl(icon)) {
    return (
      <div className="se-origin-logo-frame">
        <img
          className="se-origin-logo"
          src={icon}
          alt={name ? `${name} logo` : 'logo'}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.parentElement.style.display = 'none'
          }}
          onLoad={(e) => {
            if (!e.currentTarget.naturalWidth) e.currentTarget.parentElement.style.display = 'none'
          }}
        />
      </div>
    )
  }
  return (
    <div className="se-origin-logo-frame">
      <span className="se-origin-logo-emoji" aria-hidden="true">{icon}</span>
    </div>
  )
}

export default function ShippedEvidenceSection({
  pageKey,
  eyebrow = 'Shipped Evidence',
  heading = 'Built in public. Adopted by enterprise.',
  subheading = 'Consumer products running in production at scale — each one the origin of an enterprise system. The same engine, two markets, both shipping.',
}) {
  const [items, setItems] = useState([])
  const [stats, setStats] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    if (!pageKey) {
      setItems([])
      setLoaded(true)
      return () => {}
    }
    Promise.all([fetchShowcaseForPage(pageKey), fetchShowcaseStats()]).then(([itemsData, statsData]) => {
      if (!active) return
      setItems(Array.isArray(itemsData) ? itemsData : [])
      setStats(Array.isArray(statsData) ? statsData : [])
      setLoaded(true)
    })
    return () => {
      active = false
    }
  }, [pageKey])

  if (!loaded || items.length === 0) return null

  return (
    <section className="section shipped-evidence-section">
      <div className="container shipped-evidence-inner">
        <header className="shipped-evidence-head">
          <span className="se-eyebrow">{eyebrow}</span>
          <h2 className="se-heading">{heading}</h2>
          {subheading ? <p className="se-subhead">{subheading}</p> : null}
        </header>

        {stats.length > 0 ? (
          <div className="se-stat-bar">
            {stats.map((stat) => (
              <div key={stat.id} className="se-stat">
                <strong className="se-stat-value">{stat.value}</strong>
                <span className="se-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="se-pairs">
          {items.map((item, index) => {
            const tags = normalizeTags(item.adaptation_tags)
            const originHref = item.origin_url
              ? (/^https?:\/\//i.test(item.origin_url) ? item.origin_url : `https://${item.origin_url}`)
              : null
            return (
              <article key={item.id} className="se-pair" style={{ ['--i']: index }}>
                <div className="se-pair-origin">
                  <span className="se-kicker">Consumer Origin</span>
                  <OriginLogo icon={item.origin_icon} name={item.origin_name} />
                  <strong className="se-origin-name">{item.origin_name}</strong>
                  {originHref ? (
                    <a className="se-origin-url" href={originHref} target="_blank" rel="noreferrer">
                      {item.origin_url.replace(/^https?:\/\//i, '')} <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  ) : null}
                  {item.origin_description ? <p className="se-origin-desc">{item.origin_description}</p> : null}
                  {item.origin_tagline ? <p className="se-origin-tagline">{item.origin_tagline}</p> : null}
                </div>

                <div className="se-pair-connector" aria-hidden="true">
                  <span className="se-arrow"><ArrowRight size={18} /></span>
                  <span className="se-index">{String(index + 1).padStart(2, '0')}</span>
                </div>

                <div className="se-pair-adaptation">
                  <span className="se-adapt-badge">{item.adaptation_badge || 'Enterprise Adaptation'}</span>
                  <h3 className="se-adapt-name">{item.adaptation_name}</h3>
                  {item.adaptation_description ? <p className="se-adapt-desc">{item.adaptation_description}</p> : null}
                  {tags.length > 0 ? (
                    <div className="se-tags">
                      {tags.map((tag) => (
                        <span key={tag} className="se-tag">{tag}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
