'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { fetchShowcaseForPage, fetchShowcaseStats } from '../lib/showcaseApi'
import '../styles/shipped-evidence.css'
import { motion, useInView, useReducedMotion } from 'framer-motion'
function isImageUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim())
}

const COUNT_MS = 1400

// Stat values arrive as one string, e.g. "90+" or "550+" -- split the number
// from its suffix so the number can count up and the suffix can just sit
// there, the same split TrustBandV2 uses for the identical home page band.
function splitStat(raw) {
  const match = String(raw ?? '').match(/^(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { target: 0, suffix: String(raw ?? '') }
  return { target: Number(match[1]), suffix: match[2] }
}

// Counts from 0 to `target` once the bar is on screen -- holding at 0 until
// then matters, a count-up that finishes above the fold is just a static
// number with extra steps. Mirrors TrustBandV2's useCountUp on the home page.
function useCountUp(target, active, reduceMotion) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (reduceMotion || !active) return undefined

    let frame
    let start
    const step = (now) => {
      if (start === undefined) start = now
      const p = Math.min((now - start) / COUNT_MS, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, active, reduceMotion])

  return reduceMotion ? target : value
}

function ShowcaseStat({ stat, active, reduceMotion, index }) {
  const { target, suffix } = splitStat(stat.value)
  const value = useCountUp(target, active, reduceMotion)
  return (
    <motion.div
      className="se-stat"
      style={{ transformPerspective: 900 }}
      initial={{ opacity: 0, z: -240, y: 16 }}
      whileInView={{ opacity: 1, z: 0, y: 0 }}
      whileHover={{ z: 30, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: 'spring', stiffness: 90, damping: 16, mass: 0.9, delay: index * 0.08 }}
    >
      <strong className="se-stat-value">{value}{suffix}</strong>
      <span className="se-stat-label">{stat.label}</span>
    </motion.div>
  )
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
  heading = ``,
  subheading = 'Consumer products running in production at scale each one the origin of an enterprise system. The same engine, two markets, both shipping.',
}) {
  const [items, setItems] = useState([])
  const [stats, setStats] = useState([])
  const [loaded, setLoaded] = useState(false)
  const reduceMotion = useReducedMotion()
  const statBarRef = useRef(null)
  const statBarInView = useInView(statBarRef, { once: true, amount: 0.4 })

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



  return (
    <section className="section shipped-evidence-section">
      <div className="container shipped-evidence-inner">
        {/* <header className="shipped-evidence-head">
          <span className="eyebrow-label">{eyebrow}</span>
          <h2 >Built in public. Adopted <br/> <span>Real Results.</span> </h2>
          {subheading ? <p className="se-subhead">{subheading}</p> : null}
        </header> */}

      <motion.div
          className="section-title centered why-choose-reference-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow-label">Why do agencies hire GHL Prime instead of a freelancer?</span>

          <h2>Focused Expertise. Real <br/> <span>Delivery Power.</span></h2>
          <p>GHL Prime is specialized team backed by Octopi Digital. We don’t do everything we go deep on GHL,automation, AI, and custom dev so your agency has the best possible team behind it.</p>
        </motion.div>
        {/* Ref lives on this wrapper rather than on the conditional content
            below: useInView reads the DOM node at mount, and this element is
            the first one in the tree that is always present, even before
            the stats have loaded. Attaching it to the stats.length-gated div
            instead means useInView initializes against a node that does not
            exist yet on the first render and never notices the real one
            mounting later, so the count-up simply never starts. */}
        <div className="se-stat-bar" ref={statBarRef}>
          {stats.length > 0
            ? stats.map((stat, i) => (
                <ShowcaseStat key={stat.id} stat={stat} index={i} active={statBarInView} reduceMotion={reduceMotion} />
              ))
            : <div>failed to load data</div>}
        </div>

        <div className="se-pairs">
          {items.length >  0 ? items.map((item, index) => {
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
          }) : <div>
            failed to load data
            </div>}
        </div>
      </div>
    </section>
  )
}
