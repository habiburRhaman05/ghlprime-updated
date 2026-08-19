'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, ShieldCheck, Zap, TrendingUp } from 'lucide-react'
import './agency-needs.css'

/*
 * "Everything Your Agency Needs, Done by Experts".
 *
 * Matches the supplied design (public/services-assests/
 * section-design-main.png): deep blue gradient band, centred header, six
 * white cards each led by its own illustration, translucent trust bar below.
 *
 * The six card titles/descriptions are unchanged from the original section.
 * ghl-card-N.png maps 1:1 to the card order below.
 *
 * LINK BEHAVIOUR: the "View service" affordance is visible at rest rather
 * than revealed on hover. Touch devices have no hover state, so a
 * hover-only control would be unreachable on phones and tablets -- hover
 * enriches it (arrow travel, card lift, illustration scale) instead of
 * being the only way to find it. Each card is fully clickable via the
 * stretched link in agency-needs.css, so the whole tile is one big target.
 *
 * `href`s point at real routes only. There is no dedicated API Integrations
 * page and no #integrations anchor on /services (the homepage JSON-LD
 * references one that does not exist), so that card links to /services
 * rather than to a dead fragment.
 */

const ITEMS = [
  {
    title: 'GHL Technical Support',
    text: 'Direct expert support for setup, troubleshooting, cleanup, and backend execution.',
    img: '/services-assests/ghl-card-1.png',
    href: '/services/ghl-setup',
  },
  {
    title: 'AI Agents & Call Center Setup',
    text: 'Deploy AI systems that qualify leads, support clients, and automate repetitive communication.',
    img: '/services-assests/ghl-card-2.png',
    href: '/services/ai-agent-builder',
  },
  {
    title: 'White-Labeled Client Support',
    text: 'Stay invisible behind your agency while we help you support clients under your own brand.',
    img: '/services-assests/ghl-card-3.png',
    href: '/services/white-label-support',
  },
  {
    title: 'API Integrations',
    text: 'Connect HighLevel with third-party tools, CRMs, dashboards, and custom workflows.',
    img: '/services-assests/ghl-card-4.png',
    href: '/services',
  },
  {
    title: 'Vibe Coding & Custom Dev',
    text: 'If HighLevel can’t do it natively, we can build around it with custom code and automation logic.',
    img: '/services-assests/ghl-card-5.png',
    href: '/services/vibe-coding',
  },
  {
    title: 'Training & SOP Support',
    text: 'We train your team, document the system, and help you scale delivery with more confidence.',
    img: '/services-assests/ghl-card-6.png',
    href: '/services#training',
  },
]

// Trust bar. Each entry is two lines in the design, so the break is stored
// rather than relying on container width to wrap it in the right place.
const TRUST = [
  { a: 'Built by experts.', b: 'Focused on your growth.', Icon: Users, tone: 'blue' },
  { a: 'Trusted by', b: 'Top Agencies', Icon: ShieldCheck, tone: 'green' },
  { a: 'Fast Response', b: '& Delivery', Icon: Zap, tone: 'amber' },
  { a: 'Scalable Systems', b: 'That Grow With You', Icon: TrendingUp, tone: 'sky' },
]

export default function AgencyNeedsSection() {
  return (
    <section className="section an-section" id="platform">
      {/* Corner dot texture + soft arcs, per the design. Decorative only. */}
      <span className="an-dots" aria-hidden="true" />
      <span className="an-arc an-arc-a" aria-hidden="true" />
      <span className="an-arc an-arc-b" aria-hidden="true" />

      <div className="container an-inner">
        <motion.div
          className="an-head"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="an-eyebrow">Everything Your Agency Needs, Done by Experts</span>
          <h2 className="an-heading">
            Technical execution, client support,<br />automation, and training
            <br />all in <span className="an-heading-accent">one team.</span>
          </h2>
          <p className="an-lede">
            Built for agencies and SaaS founders who need real execution power behind their offers.
          </p>
        </motion.div>

        <motion.div
          className="an-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          {ITEMS.map((item) => (
            <motion.article
              key={item.title}
              className="an-card"
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <div className="an-card-visual">
                {/* Decorative: the heading and body below carry the meaning. */}
                <img src={item.img} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              </div>
              <h3 className="an-card-title">{item.title}</h3>
              <p className="an-card-text">{item.text}</p>
              <Link href={item.href} className="an-card-link">
                {/* The accessible name has to name the destination: six links
                    all reading "View service" is ambiguous out of context
                    for a screen reader listing links. */}
                <span aria-hidden="true">View service</span>
                <span className="an-sr-only">{`View service: ${item.title}`}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </motion.article>
          ))}
        </motion.div>

 
      </div>
    </section>
  )
}
