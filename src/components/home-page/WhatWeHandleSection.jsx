import { motion } from 'framer-motion'
import EvidenceVisual from './EvidenceVisuals'

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
}


export default function WhatWeHandleSection() {
  // Ordered for the bento layout: the two content-heavy cards (AI agents,
  // white-label support) lead as the feature + tall card, the three compact
  // ones tile underneath. Content itself is unchanged -- this is placement.
  const items = [
    {
      title: 'AI Agents That Actually Work for Your Agency',
      text: 'We design, build, and deploy AI agents tailored to your agency\'s workflow. Qualify leads, handle inquiries, run AI call centers, and book meetings 24/7, without you touching a thing.',
      variant: 'ai',
      tags: ['AI Agent Deployment', 'AI Call Centers', 'Lead Qualification'],
      feature: true,
    },
    {
      title: 'No Support = Clients Leave Your Platform',
      text: 'Your clients expect fast answers. We provide round-the-clock GHL expert support, fully under your brand. They think it\'s your team; we make you look like a well-staffed operation.',
      variant: 'team',
      tags: ['24/7 White-Label Support', 'GHL-Certified Team'],
    },
    {
      title: 'No GHL Expert on Your Team',
      text: 'Stop paying for a full-time hire you barely need. Tap certified GHL specialists on demand for builds, fixes, strategy, or anything in between.',
      variant: 'crm',
      tags: ['Hire GHL Experts'],
    },
    {
      title: "Can't Launch Your SaaS Fast Enough",
      text: 'We set up your fully white-labeled CRM from scratch: branded, configured, and client-ready. You own the product. We do the build.',
      variant: 'support',
      tags: ['White-Label Launch'],
    },
    {
      title: 'Broken or Half-Built Automations',
      text: 'Leaking leads, missed follow-ups, workflows that randomly break. We build, audit, and fix automations end-to-end, so every lead is handled perfectly.',
      variant: 'backend',
      tags: ['Full Automation Builds'],
    },
  ]

  return (
    <section className="section section-white replacement-solutions-section" id="process">
      <div className="container">
        <div className="section-title centered replacement-solutions-title">
          <span className="eyebrow-label">What We Handle For You</span>
          <h2>You Get the Experts. We Work <span className="hl">Behind the Scenes.</span></h2>
          <p>From white-label launch support to automation builds, AI deployment, and client support, we become the technical team your agency can rely on.</p>
        </div>
        <div className="replacement-solutions-grid modern-stack-grid">
          {items.map((item) => (
            <motion.article key={item.title} className={`replacement-solution-card modern-solution-stack-card${item.feature ? ' feature' : ''}`} initial="hidden" whileInView="show" whileHover={item.feature ? { y: -4 } : { y: -6 }} viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
              {/* The feature card keeps the icon tile -- it is the one
                  enclosed navy card and reads fine with a mark. Every other
                  card leads with an evidence visual instead: a small, real UI
                  fragment showing the thing the copy describes, rather than a
                  generic glyph that only names it. */}
              {/* Every card leads with an evidence visual: a small, real UI
                  fragment showing the thing the copy describes, rather than a
                  generic glyph that only names it. The feature card takes the
                  dark variant since it sits on navy. */}
              <EvidenceVisual variant={item.variant} dark={item.feature} />
              <div className="solution-copy align-left">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <div className="stack-tag-row">{item.tags.map((tag) => <span key={tag} className="stack-tag">{tag}</span>)}</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
