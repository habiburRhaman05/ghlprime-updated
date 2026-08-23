'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, animate, useInView, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Users, Workflow } from 'lucide-react'
import SiteFooter from '../components/SiteFooter'
import FaqSection from '../components/FaqSection'
import { TEAM_FAQS } from '../data/faqs'
import { CertifiedAdminOverlay, SkillsBadges } from '../components/CertificationBadges'
import CertificationsSection from '../components/CertificationsSection'
import { socialConfig } from '../components/socialConfig'
import { fetchTeamMembers, fetchTeamPageExperts } from '../lib/teamApi'
import Tilt from '../components/motion3d/Tilt'
import ScrollProgress from '../components/motion3d/ScrollProgress'
import { DepthScene, Layer } from '../components/motion3d/DepthScene'
import '../components/pages-v2/pages-v2.css'
import '../components/pages-v2/immersive.css'

const BADGE_ICON = {
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33.26zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.29-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83L11.17 17zm6.48-2.19c-2.29 2.04-5.58 3.44-5.89 3.57L13.31 22l4.05-4.05c.47-.47.68-1.15.55-1.81l-.26-1.33zM9 18c0 .83-.34 1.58-.88 2.12C6.94 21.3 2 22 2 22s.7-4.94 1.88-6.12C4.42 15.34 5.17 15 6 15c1.66 0 3 1.34 3 3zm4-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
    </svg>
  ),
}

const hiringParagraphs = [
  'Every specialist who joins GHL Prime goes through a structured qualification process before working on client accounts. We do not hire generalists and train them on GoHighLevel. We hire people who already have hands-on GHL experience and then deepen their specialization within our team.',
  'Our hiring standards require demonstrated GoHighLevel platform experience, completion of official GHL certification modules in the relevant specialty area, and a technical assessment covering automation logic, workflow debugging, and platform configuration. For AI and development roles, we additionally assess prompt engineering, API integration, and code quality.',
  'Once onboarded, specialists are matched to client accounts based on their primary specialty automation, AI, development, support, or training. No specialist is spread across skill areas where they lack depth. If a client account requires expertise across multiple areas, we assign the relevant specialists rather than expecting one person to do everything.',
  'Our leadership team reviews all major deliverables before they reach clients. The COO, Niyamul Islam Sajal, oversees technical delivery across all accounts. The CEO, Jewel Rana, oversees strategy and client relationships. This two-layer oversight is what lets us make the guarantee that our work is strategy-led, not just task-executed.',
  'We are also a learning organization. When GoHighLevel ships new features and they ship them constantly our team trains on them before client accounts do. When a better way to build something emerges from one project, we document it and share it across the team. Our SOPs evolve with the platform, which means you are never getting advice based on how GHL worked six months ago.',
]

const SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }

const heroStack = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }
const heroLine = {
  hidden: { opacity: 0, rotateX: -50, y: 22 },
  show: { opacity: 1, rotateX: 0, y: 0, transition: SPRING },
}
const heroLineProps = { variants: heroLine, style: { transformOrigin: 'top center', transformPerspective: 1000 } }

function YearsStat({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const raw = String(value ?? '').trim()
  const num = parseFloat(raw)
  const suffix = Number.isFinite(num) ? raw.replace(/^[0-9.]+/, '') : ''
  const count = useMotionValue(0)
  const display = useTransform(count, (v) => `${Math.round(v)}${suffix}`)

  useEffect(() => {
    if (!inView || !Number.isFinite(num)) return undefined
    const controls = animate(count, num, { duration: 1.6, ease: 'easeOut' })
    return () => controls.stop()
  }, [inView, num, count])

  return (
    <strong ref={ref}>
      {Number.isFinite(num) ? <motion.span>{display}</motion.span> : raw}
    </strong>
  )
}

function ValueCube() {
  return (
    <DepthScene className="iv-cube-scene" strength={18}>
      <Layer depth={-0.9} className="iv-ring-slot">
        <span className="iv-spin r-b" />
      </Layer>
      <Layer depth={0.6}>
        <div className="m3d-float">
          <div className="iv-cube">
            <div className="iv-face front">
              <span className="iv-face-kicker">Core team</span>
              <strong>Built around strategy + systems</strong>
              <p>The team is designed to connect business direction, customer journey thinking, and technical delivery.</p>
            </div>
            <div className="iv-face back">
              <span className="iv-face-mark">GHL</span>
            </div>
            <div className="iv-face right">
              <div className="iv-face-chip">
                <span className="iv-face-chip-icon"><Users size={16} /></span>
                <div>
                  <strong>Focused team</strong>
                  <span>Clear roles, aligned execution</span>
                </div>
              </div>
            </div>
            <div className="iv-face left">
              <div className="iv-face-chip">
                <span className="iv-face-chip-icon"><Workflow size={16} /></span>
                <div>
                  <strong>Systems-first delivery</strong>
                  <span>Built for scale and clarity</span>
                </div>
              </div>
            </div>
            <div className="iv-face top">
              <Sparkles size={56} className="iv-face-ghost" />
            </div>
            <div className="iv-face bottom" />
          </div>
        </div>
      </Layer>
    </DepthScene>
  )
}

function LeaderSpotlight({ leader, index }) {
  const flip = index % 2 === 1
  const badgeIcon = BADGE_ICON[leader.badge_icon] || BADGE_ICON.star
  const socialLinks = socialConfig.filter(({ key }) => leader[key])

  return (
    <article className={`iv-leader${flip ? ' flip' : ''}`}>
      <motion.div
        className="iv-leader-media"
        initial={{ opacity: 0, rotateY: flip ? 24 : -24, x: flip ? 44 : -44 }}
        whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformPerspective: 1300 }}
        transition={SPRING}
      >
        <Tilt max={6} className="iv-photo-frame-wrap">
          <div className="iv-photo-frame">
            <img src={leader.image_url} alt={leader.name} loading="lazy" decoding="async" />
            {leader.badge_label ? (
              <span className="iv-badge-pill">{badgeIcon}{leader.badge_label}</span>
            ) : null}
            {leader.years_experience ? (
              <div className="iv-years-disc">
                <YearsStat value={leader.years_experience} />
                <span>Years</span>
                <span>Experience</span>
              </div>
            ) : null}
          </div>
        </Tilt>
      </motion.div>

      <motion.div
        className="iv-leader-body"
        initial={{ opacity: 0, x: flip ? -36 : 36 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ ...SPRING, delay: 0.08 }}
      >
        <span className="iv-role-tag">{leader.role}</span>
        <h3>{leader.name}</h3>
        <span className="iv-leader-divider" aria-hidden="true" />
        <p>{leader.description}</p>
        {socialLinks.length ? (
          <div className="iv-social-rail">
            {socialLinks.map(({ key, label, svg }) => (
              <a
                key={key}
                href={leader[key]}
                target="_blank"
                rel="noopener noreferrer"
                className={`leader-social-link brand-${key.replace('_url', '')}`}
                aria-label={`${leader.name} on ${label}`}
                title={`${leader.name} on ${label}`}
              >
                {svg}
              </a>
            ))}
          </div>
        ) : null}
      </motion.div>
    </article>
  )
}

function RevealProse({ paragraphs }) {
  return (
    <div className="pv2-prose">
      {paragraphs.map((text, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {text}
        </motion.p>
      ))}
    </div>
  )
}

export default function TeamPage() {
  const [leaders, setLeaders] = useState([])
  const [experts, setExperts] = useState([])

  useEffect(() => {
    fetchTeamMembers().then(setLeaders)
    fetchTeamPageExperts().then(setExperts)
  }, [])

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.16], [0, -70])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.13], [1, 0])

  return (
    <main className="about-page team-page pv2">
      <ScrollProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com' },
            { '@type': 'ListItem', position: 2, name: 'Team', item: 'https://ghlprime.com/team' },
          ],
        }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          '@id': 'https://ghlprime.com/team#webpage',
          url: 'https://ghlprime.com/team',
          name: 'Meet the GHL Prime Team Certified GoHighLevel Specialists',
          description: 'Our GoHighLevel-certified team averages 4+ years of GHL experience. Meet the founders and specialists delivering backend execution under your agency\'s brand.',
          inLanguage: 'en-US',
          isPartOf: { '@id': 'https://ghlprime.com/#website' },
          about: { '@id': 'https://ghlprime.com/#organization' },
          datePublished: '2024-08-01',
          dateModified: '2026-05-24',
          speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.team-hero p', '.faq-question', '.faq-answer'] },
        }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': 'https://ghlprime.com/#jewel-rana',
            name: 'Jewel Rana',
            jobTitle: 'CEO & Co-Founder',
            worksFor: { '@id': 'https://ghlprime.com/#organization' },
            description: 'Business coach and agency leader who has helped freelancers and service providers build profitable careers and scalable service businesses using GoHighLevel and automation.',
            sameAs: ['https://www.linkedin.com/in/thejewelrana/', 'https://www.facebook.com/thenewjewel', 'https://www.upwork.com/freelancers/~013caf34b8df0444cf/', 'https://www.bokaboss.com/'],
            knowsAbout: ['GoHighLevel', 'CRM Setup', 'Agency Growth', 'Marketing Automation', 'Business Coaching'],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': 'https://ghlprime.com/#niyamul-sajal',
            name: 'Niyamul Islam Sajal',
            jobTitle: 'COO & Co-Founder',
            worksFor: { '@id': 'https://ghlprime.com/#organization' },
            description: 'Senior automation engineer with extensive experience building AI-powered systems, CRM infrastructures, and custom integrations for agencies and fast-growing businesses.',
            sameAs: ['https://www.linkedin.com/in/niyamulislam/', 'https://www.facebook.com/niaymul.islam.2025/', 'https://www.upwork.com/freelancers/~010f634a8b80365e7b'],
            knowsAbout: ['GoHighLevel', 'Workflow Automation', 'AI Agents', 'n8n', 'CRM Infrastructure', 'API Integrations'],
          },
        ]) }} />

      {/* ---------------------------------------------------------------- hero */}
      <section className="pv2-section is-tint pv2-hero">
        <span className="pv2-grid-bg" aria-hidden="true" />
        <span className="pv2-bloom one" aria-hidden="true" />
        <span className="pv2-bloom two" aria-hidden="true" />
        <motion.div className="pv2-inner pv2-hero-grid" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div variants={heroStack} initial="hidden" animate="show">
            <motion.span className="pv2-eyebrow" {...heroLineProps}>Team</motion.span>
            <motion.h1 {...heroLineProps}>The people behind GHL Prime.</motion.h1>
            <motion.p className="pv2-lede" {...heroLineProps}>
              GHL Prime combines strategy, automation architecture, and premium system design. The team brings together
              business thinking and technical execution to build cleaner, more scalable GoHighLevel systems.
            </motion.p>
            <motion.div className="pv2-actions" {...heroLineProps}>
              <Link href="/about" className="primary-pill large">About GHL Prime</Link>
              <Link href="/services" className="secondary-pill large">Explore Services</Link>
            </motion.div>
          </motion.div>

          <ValueCube />
        </motion.div>
      </section>

      {/* --------------------------------------------------------- leaders */}
      <section className="pv2-section is-white">
        <div className="pv2-inner">
          <motion.div
            className="pv2-head centered"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={SPRING}
          >
            <span className="pv2-eyebrow">Leaders</span>
            <h2>Meet <span className="pv2-hl">Your Mentors</span></h2>
            <p>Our leaders bring years of experience building automation systems, CRM infrastructures, and AI-powered workflows for growth-focused businesses.</p>
          </motion.div>

          <div className="iv-leaders">
            {leaders.map((leader, index) => (
              <LeaderSpotlight key={leader.id || leader.name} leader={leader} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- experts */}
      <section className="pv2-section is-paper">
        <div className="pv2-inner">
          <motion.div
            className="pv2-head centered"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={SPRING}
          >
            <span className="pv2-eyebrow">Meet The Experts</span>
            <h2>Specialists supporting the work <span className="pv2-hl">behind the scenes.</span></h2>
            <p>Focused team members supporting design, systems, delivery, and execution across GHL Prime projects.</p>
          </motion.div>

          <div className="pv2-experts">
            {experts.map((member, index) => (
              <motion.div
                className="pv2-expert"
                key={member.id || member.name}
                initial={{ opacity: 0, rotateX: -34, y: 22 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                style={{ transformOrigin: 'top center', transformPerspective: 1000 }}
                transition={{ ...SPRING, delay: (index % 5) * 0.07 }}
              >
                <span className="pv2-flip">
                  <span className="pv2-face front">
                    <img src={member.image_url} alt={member.name} loading="lazy" decoding="async" />
                    {index < 5 ? <CertifiedAdminOverlay /> : null}
                  </span>
                  <span className="pv2-face back">
                    <strong>{member.name}</strong>
                    <span>{member.title}</span>
                    <SkillsBadges personIndex={index} />
                  </span>
                </span>
                <span className="pv2-expert-name">{member.name}</span>
                <span className="pv2-expert-role">{member.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="pv2-section is-white" style={{ padding: 0 }}>
        <CertificationsSection />
      </div>

      {/* ------------------------------------------------------------- cta */}
      <section className="pv2-section is-tint">
        <div className="pv2-inner">
          <motion.div
            className="pv2-cta"
            initial={{ opacity: 0, rotateX: 24, y: 30 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ transformOrigin: 'bottom center', transformPerspective: 1200 }}
            transition={SPRING}
          >
            <span className="iv-aurora a1" aria-hidden="true" />
            <span className="iv-aurora a2" aria-hidden="true" />
            <span className="pv2-grid-bg" aria-hidden="true" />
            <span className="pv2-eyebrow" style={{ position: 'relative', zIndex: 2 }}>
              Want to see the team’s work in action?
            </span>
            <h2>Explore the services and client systems shaped by the people behind GHL Prime.</h2>
            <div className="pv2-cta-actions">
              <Link href="/case-studies" className="primary-pill large">View Case Studies <ArrowRight size={16} /></Link>
              <Link href="/services" className="secondary-pill large">Explore Services</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------- hiring */}
      <section className="pv2-section is-white" aria-labelledby="hiring-process-heading">
        <div className="pv2-inner">
          <motion.div
            className="pv2-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={SPRING}
          >
            <span className="pv2-eyebrow">Inside Our Team</span>
            <h2 id="hiring-process-heading">How We Hire and <span className="pv2-hl">Train Our Team</span></h2>
          </motion.div>

          <RevealProse paragraphs={hiringParagraphs} />
        </div>
      </section>

      <FaqSection faqs={TEAM_FAQS} intro="How the team is structured, certified, and how we support yours." />
      <SiteFooter />
    </main>
  )
}
