import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchPartnerLogos } from '../../lib/logosApi'

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
}

function LogoMarqueeRow({ items, reverse = false }) {
  const filteredItems = items.filter((logo) => logo?.image_url)
  const trackItems = [...filteredItems, ...filteredItems]

  if (!filteredItems.length) return null

  return (
    <div className={`logo-marquee-row ${reverse ? 'reverse' : ''}`}>
      <div className="logo-marquee-track">
        {trackItems.map((logo, index) => {
          const content = (
            <div className="logo-marquee-card logo-marquee-card-image-only">
              <img src={logo.image_url} alt={logo.name} className="logo-chip-image logo-marquee-image-only" loading="lazy" decoding="async" />
            </div>
          )

          if (logo.website_url) {
            return <a key={`${logo.id || logo.name}-${index}`} href={logo.website_url} target="_blank" rel="noopener noreferrer" className="logo-marquee-link">{content}</a>
          }

          return <div key={`${logo.id || logo.name}-${index}`} className="logo-marquee-link">{content}</div>
        })}
      </div>
    </div>
  )
}

export default function TrustedLogosSection() {
  const [logos, setLogos] = useState([])

  useEffect(() => {
    fetchPartnerLogos().then(setLogos)
  }, [])

  const imageOnlyLogos = logos.filter((logo) => logo?.image_url)

  return (
    <section className="trust-band premium-trust-band">
      <div className="container trust-inner">
        <motion.div className="section-title centered trust-band-title" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
          <span className="eyebrow-label">Trusted environment</span>
          <h2>Trusted by agencies and <br/> <span className="hl">growth-focused businesses</span></h2>
          <p>Built for companies that want their CRM, automation, and client journey to feel more premium and more intentional.</p>
        </motion.div>
        <div className="logo-marquee-shell">
          {imageOnlyLogos.length ? <LogoMarqueeRow items={imageOnlyLogos} /> : null}
        </div>
      </div>
    </section>
  )
}
