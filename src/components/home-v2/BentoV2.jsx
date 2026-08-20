'use client'

import { motion } from 'framer-motion'
import TiltCard from '../motion3d/TiltCard'
import { UserCheck, Rocket, Workflow, Bot, Headphones } from 'lucide-react'
import './home-v2.css'

// Content carried over from the previous "What We Handle For You" section.
const CARDS = [
  {
    icon: UserCheck,
    tag: 'On demand',
    title: 'No GHL expert on your team',
    text: 'Stop paying for a full-time hire you barely need. Tap certified GHL specialists on demand for builds, fixes, strategy, or anything in between.',
  },
  {
    icon: Rocket,
    tag: 'White-label',
    title: "Can't launch your SaaS fast enough",
    text: 'We set up your fully white-labeled CRM from scratch: branded, configured, and client-ready. You own the product. We do the build.',
  },
  {
    icon: Workflow,
    tag: 'Automation',
    title: 'Broken or half-built automations',
    text: 'Leaking leads, missed follow-ups, workflows that randomly break. We build, audit, and fix automations end-to-end, so every lead is handled perfectly.',
  },
  {
    icon: Bot,
    tag: 'AI agents',
    title: 'AI agents that actually work for your agency',
    text: "We design, build, and deploy AI agents tailored to your agency's workflow. Qualify leads, handle inquiries, run AI call centers, and book meetings 24/7, without you touching a thing.",
  },
  {
    icon: Headphones,
    tag: '24/7',
    title: 'No support = clients leave your platform',
    text: "Your clients expect fast answers. We provide round-the-clock GHL expert support, fully under your brand. They think it's your team; we make you look like a well-staffed operation.",
  },
]

export default function BentoV2() {
  return (
    <section className="hv2 hv2-section is-white">
      <div className="hv2-inner">
        <motion.div
          className="hv2-head centered"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
          <span className="hv2-eyebrow">What we handle for you</span>
          <h2>You get the experts. We work <span className="hv2-hl">behind the scenes.</span></h2>
          <p>
            From white-label launch support to automation builds, AI deployment, and client
            support, we become the technical team your agency can rely on.
          </p>
        </motion.div>

        <div className="hv2-bento">
          {CARDS.map((card, i) => {
            const Icon = card.icon
            return (
              <TiltCard
                className="hv2-bento-card"
                wrapperClassName="hv2-bento-cell"
                key={card.title}
                reveal={{
                  // Hinged along its top edge, so the card swings down into
                  // the grid rather than sliding up into it.
                  style: { transformOrigin: 'top center', transformPerspective: 1100 },
                  initial: { opacity: 0, rotateX: -48, y: 26 },
                  whileInView: { opacity: 1, rotateX: 0, y: 0 },
                  viewport: { once: false, amount: 0.25 },
                  transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: (i % 3) * 0.09 },
                }}
              >
                <span className="hv2-bento-icon"><Icon size={22} /></span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <span className="hv2-bento-tag">{card.tag}</span>
              </TiltCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
