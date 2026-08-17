'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SiteFooter from '../components/SiteFooter'
import FaqSection from '../components/FaqSection'
import { TEAM_FAQS } from '../data/faqs'
import LeaderCardGrid from '../components/LeaderCardGrid'
import { CertifiedAdminOverlay, SkillsBadges } from '../components/CertificationBadges'
import CertificationsSection from '../components/CertificationsSection'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Workflow } from 'lucide-react'
import { fetchTeamMembers, fetchTeamPageExperts } from '../lib/teamApi'

export default function TeamPage() {
  const [leaders, setLeaders] = useState([])
  const [experts, setExperts] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetchTeamMembers().then(setLeaders)
    fetchTeamPageExperts().then(setExperts)
  }, [])

  const featuredMember = leaders[activeIndex] || leaders[0]

  return (
    <main className="about-page premium-about-page team-page mentor-team-page">
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
      <section className="about-hero-section">
        <div className="container about-hero-grid">
          <motion.div
            className="about-hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="eyebrow-label">Team</span>
            <h1>The people behind GHL Prime.</h1>
            <p>
              GHL Prime combines strategy, automation architecture, and premium system design. The team brings together
              business thinking and technical execution to build cleaner, more scalable GoHighLevel systems.
            </p>

            <div className="about-hero-actions">
              <Link href="/about" className="secondary-pill">About GHL Prime</Link>
              <Link href="/services" className="primary-pill large">Explore Services</Link>
            </div>
          </motion.div>

          <motion.div
            className="about-hero-visual"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <div className="about-visual-shell team-visual-shell">
              <div className="about-visual-card main">
                <span className="about-card-kicker">Core team</span>
                <strong>Built around strategy + systems</strong>
                <p>The team is designed to connect business direction, customer journey thinking, and technical delivery.</p>
              </div>
              <div className="about-visual-card floating top">
                <Users size={18} />
                <div>
                  <strong>Focused team</strong>
                  <span>Clear roles, aligned execution</span>
                </div>
              </div>
              <div className="about-visual-card floating bottom">
                <Workflow size={18} />
                <div>
                  <strong>Systems-first delivery</strong>
                  <span>Built for scale and clarity</span>
                </div>
              </div>
              <div className="about-orb orb-one" />
              <div className="about-orb orb-two" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section section-white mentor-showcase-section leader-card-section">
        <div className="container">
          <div className="section-title centered compact-team-title">
            <span className="eyebrow-label">Leaders</span>
            <h2>Meet Your Mentors</h2>
            <p>Our leaders bring years of experience building automation systems, CRM infrastructures, and AI-powered workflows for growth-focused businesses.</p>
          </div>
          <LeaderCardGrid leaders={leaders} />
        </div>
      </section>

      <section className="section section-white experts-section">
        <div className="container">
          <div className="section-title centered experts-section-title">
            <span className="eyebrow-label">Meet The Experts</span>
            <h2>Specialists supporting the work behind the scenes.</h2>
            <p>Focused team members supporting design, systems, delivery, and execution across GHL Prime projects.</p>
          </div>

          <div className="experts-grid">
            {experts.map((member, index) => (
              <motion.article
                key={member.id || member.name}
                className="expert-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <div className="expert-card-image-wrap">
                  <img src={member.image_url} alt={member.name} className="expert-card-image" />
                  {index < 5 ? <CertifiedAdminOverlay /> : null}
                </div>
                <div className="expert-card-body">
                  <h3>{member.name}</h3>
                  <p>{member.title}</p>
                  <SkillsBadges personIndex={index} />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <CertificationsSection />

      <section className="section about-final-cta-section">
        <div className="container">
          <motion.div
            className="final-cta-card premium-final-cta"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            <div>
              <span className="cta-label">Want to see the team’s work in action?</span>
              <h2>Explore the services and client systems shaped by the people behind GHL Prime.</h2>
            </div>
            <div className="final-cta-actions">
              <Link href="/case-studies" className="primary-pill large">View Case Studies <ArrowRight size={16} /></Link>
              <Link href="/services" className="secondary-pill">Explore Services</Link>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="section section-white team-hiring-section" aria-labelledby="hiring-process-heading">
        <div className="container">
          <div className="section-title">
            <span className="eyebrow-label">Inside Our Team</span>
            <h2 id="hiring-process-heading">How We Hire and Train Our Team</h2>
          </div>
          <div className="team-hiring-prose">
            <p>Every specialist who joins GHL Prime goes through a structured qualification process before working on client accounts. We do not hire generalists and train them on GoHighLevel. We hire people who already have hands-on GHL experience and then deepen their specialization within our team.</p>
            <p>Our hiring standards require demonstrated GoHighLevel platform experience, completion of official GHL certification modules in the relevant specialty area, and a technical assessment covering automation logic, workflow debugging, and platform configuration. For AI and development roles, we additionally assess prompt engineering, API integration, and code quality.</p>
            <p>Once onboarded, specialists are matched to client accounts based on their primary specialty automation, AI, development, support, or training. No specialist is spread across skill areas where they lack depth. If a client account requires expertise across multiple areas, we assign the relevant specialists rather than expecting one person to do everything.</p>
            <p>Our leadership team reviews all major deliverables before they reach clients. The COO, Niyamul Islam Sajal, oversees technical delivery across all accounts. The CEO, Jewel Rana, oversees strategy and client relationships. This two-layer oversight is what lets us make the guarantee that our work is strategy-led, not just task-executed.</p>
            <p>We are also a learning organization. When GoHighLevel ships new features and they ship them constantly our team trains on them before client accounts do. When a better way to build something emerges from one project, we document it and share it across the team. Our SOPs evolve with the platform, which means you are never getting advice based on how GHL worked six months ago.</p>
          </div>
        </div>
      </section>
            <FaqSection faqs={TEAM_FAQS} intro="How the team is structured, certified, and how we support yours." />
      <SiteFooter />
    </main>
  )
}
