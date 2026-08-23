'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchTeamMembers, fetchTeamPageExperts } from '../../lib/teamApi'
import { socialConfig } from '../socialConfig'
import './home-v2.css'

// The home page shows a curated ten of the expert list; the Team page still
// shows everyone. Matched on name rather than position so reordering in the
// admin can never silently drop a different person than the one intended.
const HOME_EXPERT_EXCLUDE = new Set(['Habibur Rahman'])
const HOME_EXPERT_LIMIT = 10

// Certification marks, carried over from the previous CertificationsSection.
const CERTS = [
  { title: 'A2P Compliance', image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/6809495041e8e478540a0fc9.png' },
  { title: 'Course Creator', image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/6809495041e8e45bd10a0fc8.png' },
  { title: 'SaaSPRENEUR Local Hero', image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/680949503e3c66b620e619d1.png' },
  { title: 'AI Employee', image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/680a7b4f4dd5ff729ab2a907.png' },
  { title: 'HIPAA Compliance', image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/680a7b4f9269efa6bde5bf39.png' },
  { title: 'Paid Ads', image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/680a7b4f8776df24f56abd1e.png' },
]

export default function TeamV2() {
  const [leaders, setLeaders] = useState([])
  const [experts, setExperts] = useState([])

  useEffect(() => { fetchTeamMembers().then((list) => setLeaders((list || []).slice(0, 3))) }, [])
  useEffect(() => {
    fetchTeamPageExperts().then((list) => {
      const curated = (list || []).filter((m) => !HOME_EXPERT_EXCLUDE.has((m.name || '').trim()))
      setExperts(curated.slice(0, HOME_EXPERT_LIMIT))
    })
  }, [])

  return (
    <section className="hv2 hv2-section is-tint">
      <span className="hv2-grid-bg" aria-hidden="true" />
      <div className="hv2-inner">
        <motion.div
          className="hv2-head centered"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
          <span className="hv2-eyebrow">The people behind it</span>
          <h2>Meet <span className="hv2-hl">your mentors.</span></h2>
          <p>
            Our leaders bring years of experience building automation systems, CRM
            infrastructures, and AI-powered workflows for growth-focused businesses.
          </p>
        </motion.div>

        {leaders.length ? (
          <div className="hv2-team">
            {leaders.map((leader, i) => (
              <motion.article
                className="hv2-team-card"
                key={leader.id || leader.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: i * 0.1 }}
              >
                {leader.image_url ? (
                  <span className="hv2-team-stage">
                    <img src={leader.image_url} alt={leader.name} loading="lazy" decoding="async" />
                  </span>
                ) : null}
                <div className="hv2-team-body">
                  <h3>{leader.name}</h3>
                  <span className="hv2-team-role">{leader.role}</span>
                  <span className="hv2-team-divider" aria-hidden="true" />
                  {leader.description ? <p>{leader.description}</p> : null}
                  {(() => {
                    // Only the platforms this record actually carries a URL for.
                    const links = socialConfig.filter(({ key }) => leader[key])
                    if (!links.length) return null
                    return (
                      <div className="hv2-team-socials">
                        {links.map(({ key, label, svg }) => (
                          <a
                            key={key}
                            className={`hv2-team-social brand-${key.replace('_url', '')}`}
                            href={leader[key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${leader.name} on ${label}`}
                            title={`${leader.name} on ${label}`}
                          >
                            {svg}
                          </a>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </motion.article>
            ))}
          </div>
        ) : null}

        {experts.length ? (
          <div className="hv2-experts">
              {experts.map((member, i) => (
                <motion.div
                  className="hv2-expert hv2-expert-static"
                  key={member.id || member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: (i % 5) * 0.05 }}
                >
                  <span className="hv2-expert-photo">
                    <img src={member.image_url} alt={member.name} loading="lazy" decoding="async" />
                  </span>
                  <strong className="hv2-expert-name">{member.name}</strong>
                  <span className="hv2-expert-role">{member.title}</span>
                </motion.div>
              ))}
          </div>
        ) : null}

        <motion.div
          className="hv2-certs"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
          <p className="hv2-certs-label">Certifications</p>
          <p className="hv2-certs-lede">
            GHL Prime holds official GoHighLevel certifications including Certified Admin, the
            highest certification available on the platform, plus A2P Compliance, HIPAA
            Compliance, AI Employee, SaaS Mode, and 7 additional specializations.
          </p>
          <div className="hv2-certs-row">
            {CERTS.map((c) => (
              <span className="hv2-cert" key={c.title} title={c.title}>
                <img src={c.image} alt={c.title} loading="lazy" decoding="async" />
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
