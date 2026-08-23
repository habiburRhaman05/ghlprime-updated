'use client'

import { motion } from 'framer-motion'
import { DepthCard } from '../motion3d/Depth'
import './home-v2.css'

// The five card marks are drawn here so each can carry a living detail: an
// expertise plus that pops, a block dropping onto a stack, a lead dot riding
// the automation route, typing dots inside the AI chat bubble, and a lifebuoy
// turning slowly. Loops are pure CSS except the route rider, which uses
// SMIL motion and is hidden for reduced-motion users (see home-v2.css).
function PipeSvg({ size = 22, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function IconExpertPlus({ size }) {
  return (
    <PipeSvg size={size}>
      <circle cx="9.5" cy="8" r="3.4" />
      <path d="M3.2 20c0-3.6 2.8-5.7 6.3-5.7 1.6 0 3 .44 4.1 1.24" />
      <path className="hv2-pluspop" d="M18.2 12.6v5.2M15.6 15.2h5.2" strokeWidth="2" />
    </PipeSvg>
  )
}

function IconBlocksStack({ size }) {
  return (
    <PipeSvg size={size}>
      <path d="M3.5 16.4v3.1M20.5 16.4v3.1" opacity=".7" />
      <rect x="5.6" y="13.4" width="12.8" height="3.6" rx="1.1" opacity=".85" />
      <g className="hv2-dropblock">
        <rect x="7.9" y="8.2" width="8.2" height="3.6" rx="1.1" />
        <path d="M12 2.9l.52 1.42L14 4.84l-1.48.52L12 6.78l-.52-1.42L10 4.84l1.48-.52z" fill="currentColor" stroke="none" />
      </g>
    </PipeSvg>
  )
}

function IconRouteRider({ size }) {
  return (
    <PipeSvg size={size}>
      <path d="M4.5 19.5C12.5 19.5 11.5 4.5 19.5 4.5" opacity=".9" />
      <circle cx="4.5" cy="19.5" r="1.9" />
      <rect x="17.7" y="2.7" width="3.6" height="3.6" rx=".95" />
      <circle className="hv2-traveldot" r="1.45" fill="currentColor" stroke="none">
        <animateMotion dur="2.2s" repeatCount="indefinite" path="M4.5 19.5C12.5 19.5 11.5 4.5 19.5 4.5" />
      </circle>
    </PipeSvg>
  )
}

function IconBotChat({ size }) {
  return (
    <PipeSvg size={size}>
      <path d="M21 14.2a2 2 0 0 1-2 2H8.4L3.6 20.4V5.6A2 2 0 0 1 5.6 3.6H19a2 2 0 0 1 2 2z" />
      <path d="M6.1 1.9v1.7M18.5 1.9v1.7" opacity=".65" />
      <circle className="hv2-type ty1" cx="8.7" cy="9.9" r="1.15" fill="currentColor" stroke="none" />
      <circle className="hv2-type ty2" cx="12" cy="9.9" r="1.15" fill="currentColor" stroke="none" />
      <circle className="hv2-type ty3" cx="15.3" cy="9.9" r="1.15" fill="currentColor" stroke="none" />
    </PipeSvg>
  )
}

function IconLifeRing({ size }) {
  return (
    <PipeSvg size={size}>
      <g className="hv2-slowspin">
        <circle cx="12" cy="12" r="8.6" />
        <path d="M6.05 6.05l3.5 3.5M17.95 6.05l-3.5 3.5M17.95 17.95l-3.5-3.5M6.05 17.95l3.5-3.5" />
      </g>
      <circle className="hv2-ringcore" cx="12" cy="12" r="4.3" />
    </PipeSvg>
  )
}

// Content carried over from the previous "What We Handle For You" section.
const CARDS = [
  {
    icon: IconExpertPlus,
    tone: 'ic-sky',
    tag: 'On demand',
    title: 'No GHL expert on your team',
    text: 'Stop paying for a full-time hire you barely need. Tap certified GHL specialists on demand for builds, fixes, strategy, or anything in between.',
  },
  {
    icon: IconBlocksStack,
    tone: 'ic-violet',
    tag: 'White-label',
    title: "Can't launch your SaaS fast enough",
    text: 'We set up your fully white-labeled CRM from scratch: branded, configured, and client-ready. You own the product. We do the build.',
  },
  {
    icon: IconRouteRider,
    tone: 'ic-amber',
    tag: 'Automation',
    title: 'Broken or half-built automations',
    text: 'Leaking leads, missed follow-ups, workflows that randomly break. We build, audit, and fix automations end-to-end, so every lead is handled perfectly.',
  },
  {
    icon: IconBotChat,
    tone: 'ic-indigo',
    tag: 'AI agents',
    title: 'AI agents that actually work for your agency',
    text: "We design, build, and deploy AI agents tailored to your agency's workflow. Qualify leads, handle inquiries, run AI call centers, and book meetings 24/7, without you touching a thing.",
  },
  {
    icon: IconLifeRing,
    tone: 'ic-teal',
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
              <DepthCard
                className={`hv2-bento-card ${card.tone}`}
                wrapperClassName="hv2-bento-cell"
                key={card.title}
                index={i}
                columns={2}
              >
                <span className="ic hv2-bento-icon m3d-l3"><Icon size={22} /></span>
                <h3 className="m3d-l2">{card.title}</h3>
                <p className="m3d-l1">{card.text}</p>
                <span className="hv2-bento-tag m3d-l2">{card.tag}</span>
              </DepthCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
