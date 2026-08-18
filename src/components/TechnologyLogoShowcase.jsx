'use client'

import { useEffect, useState } from 'react'
import { CalendarCheck2, ShieldCheck, TrendingUp, Users, Zap } from 'lucide-react'
import { fetchTechnologyLogos } from '../lib/technologyLogosApi'

function shuffle(items = []) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[randomIndex]] = [next[randomIndex], next[index]]
  }
  return next
}

const outcomes = [
  { icon: Zap, title: 'Faster', text: 'Lead response time', colorClass: 'amber' },
  { icon: ShieldCheck, title: 'Clear', text: 'Pipeline visibility', colorClass: 'blue' },
  { icon: CalendarCheck2, title: 'Higher', text: 'Booking consistency', colorClass: 'green' },
  { icon: TrendingUp, title: 'Reduced', text: 'Manual administrative work', colorClass: 'red' },
  { icon: ShieldCheck, title: 'Stronger', text: 'Follow-up discipline', colorClass: 'purple' },
  { icon: Users, title: 'Better', text: 'Team CRM adoption', colorClass: 'violet' },
]

const slotClasses = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'bottom-far-right']

export default function TechnologyLogoShowcase() {
  const [logos, setLogos] = useState([])
  const [visibleLogos, setVisibleLogos] = useState([])

  useEffect(() => {
    fetchTechnologyLogos().then((data) => {
      setLogos(data)
      setVisibleLogos(shuffle(data).slice(0, Math.min(7, data.length)))
    })
  }, [])

  useEffect(() => {
    if (!logos.length) return undefined

    const interval = setInterval(() => {
      setVisibleLogos(shuffle(logos).slice(0, Math.min(7, logos.length)))
    }, 3200)

    return () => clearInterval(interval)
  }, [logos])

  return (
    <section className="section section-white technology-showcase-section">
      <div className="container technology-outcomes-shell">
        <div className="section-title centered technology-outcomes-title">
          <h2>What Our Systems Are Designed To Improve</h2>
          <p>Measurable outcomes for service-based businesses.</p>
        </div>

        <div className="technology-floating-logos-stage">
          {visibleLogos.map((logo, index) => (
            <article key={`${logo.id || logo.name}-${index}`} className={`technology-floating-logo ${slotClasses[index % slotClasses.length]}`}>
              <img src={logo.image_url} alt={logo.name} className="technology-floating-logo-image" />
            </article>
          ))}
        </div>

        <div className="technology-outcomes-grid">
          {outcomes.map(({ icon: Icon, title, text, colorClass }) => (
            <article key={title} className="technology-outcome-card">
              <div className={`technology-outcome-icon ${colorClass}`}><Icon size={17} /></div>
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
