'use client'

import { motion } from 'framer-motion'
import { DepthCard } from '../motion3d/Depth'
import './home-v2.css'

// The five card marks are drawn here so each can carry a living scene: a
// service bell being struck with chime ripples, a rocket bobbing on its
// flickering flame, meshing gears, an orbiting neural system, and a clock
// whose hand sweeps around the dial. Loops are pure CSS throughout.
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

function IconBellStrike({ size }) {
  return (
    <PipeSvg size={size}>
      <rect x="4.2" y="17.7" width="15.6" height="2.5" rx="1.25" />
      <path d="M6.3 17.7v-1c0-3.8 2.55-6.3 5.7-6.3s5.7 2.5 5.7 6.3v1" />
      <g className="hv2-strike">
        <circle cx="12" cy="8.3" r="1.3" fill="currentColor" stroke="none" />
      </g>
      <path className="hv2-chime c1" d="M17.6 6.4a6.6 6.6 0 0 1 2.5 3.3" />
      <path className="hv2-chime c2" d="M6.4 6.4a6.6 6.6 0 0 0-2.5 3.3" />
    </PipeSvg>
  )
}

function IconRocketLaunch({ size }) {
  return (
    <PipeSvg size={size}>
      <path className="hv2-tw t2" d="M4.6 4.2l.42 1.14.9.42-.9.42-.42 1.14-.42-1.14-.9-.42.9-.42z" fill="currentColor" stroke="none" />
      <g className="hv2-bobber">
        <path d="M12 2.4c2.9 1.75 4.4 4.5 4.4 7.8 0 1.44-.26 2.8-.76 4.06H8.36a10.3 10.3 0 0 1-.76-4.06c0-3.3 1.5-6.05 4.4-7.8z" />
        <circle cx="12" cy="9.3" r="1.55" />
        <path d="M8.36 13.1l-2.5 2.9c.44.86 1.32 1.46 2.4 1.62M15.64 13.1l2.5 2.9c-.44.86-1.32 1.46-2.4 1.62" />
        <g className="hv2-flame">
          <path d="M12 17.6c1.15.55 1.85 1.5 1.85 2.6 0 .72-.34 1.4-.94 1.9L12 22.8l-.91-.7c-.6-.5-.94-1.18-.94-1.9 0-1.1.7-2.05 1.85-2.6z" fill="currentColor" stroke="none" />
        </g>
        <path className="hv2-exhaust e1" d="M8.9 19.2h-2.2M15.1 19.2h2.2" opacity=".7" />
      </g>
    </PipeSvg>
  )
}

function IconGearsMesh({ size }) {
  return (
    <PipeSvg size={size}>
      <g className="hv2-gear gA">
        <circle cx="8.7" cy="14.9" r="4.15" strokeWidth="2.7" strokeDasharray="2.08 2.02" />
        <circle cx="8.7" cy="14.9" r="4.15" />
        <circle cx="8.7" cy="14.9" r="1.35" fill="currentColor" stroke="none" />
      </g>
      <g className="hv2-gear gB">
        <circle cx="16.9" cy="7.2" r="2.95" strokeWidth="2.3" strokeDasharray="1.85 1.78" />
        <circle cx="16.9" cy="7.2" r="2.95" />
        <circle cx="16.9" cy="7.2" r="1.05" fill="currentColor" stroke="none" />
      </g>
    </PipeSvg>
  )
}

function IconNeuralOrbit({ size }) {
  return (
    <PipeSvg size={size}>
      <circle className="hv2-corepulse" cx="12" cy="12" r="2.15" fill="currentColor" stroke="none" />
      <g className="hv2-orbit o1">
        <path d="M12 12L12 3.6" opacity=".6" />
        <circle cx="12" cy="3.6" r="1.3" />
      </g>
      <g className="hv2-orbit o2">
        <path d="M12 12L18.2 15.4" opacity=".6" />
        <circle cx="18.2" cy="15.4" r="1.05" />
      </g>
    </PipeSvg>
  )
}

function IconClockSweep({ size }) {
  return (
    <PipeSvg size={size}>
      <circle cx="12" cy="12" r="8.7" />
      <path d="M12 3.3v1.9M12 18.8v1.9M3.3 12h1.9M18.8 12h1.9" opacity=".7" />
      <g className="hv2-sweep">
        <path d="M12 12V6.4" />
        <circle cx="12" cy="6.4" r="1" fill="currentColor" stroke="none" />
      </g>
      <circle className="hv2-ringcore" cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </PipeSvg>
  )
}

// Content carried over from the previous "What We Handle For You" section.
const CARDS = [
  {
    icon: IconBellStrike,
    tone: 'ic-sky',
    tag: 'On demand',
    title: 'No GHL expert on your team',
    text: 'Stop paying for a full-time hire you barely need. Tap certified GHL specialists on demand for builds, fixes, strategy, or anything in between.',
  },
  {
    icon: IconRocketLaunch,
    tone: 'ic-violet',
    tag: 'White-label',
    title: "Can't launch your SaaS fast enough",
    text: 'We set up your fully white-labeled CRM from scratch: branded, configured, and client-ready. You own the product. We do the build.',
  },
  {
    icon: IconGearsMesh,
    tone: 'ic-amber',
    tag: 'Automation',
    title: 'Broken or half-built automations',
    text: 'Leaking leads, missed follow-ups, workflows that randomly break. We build, audit, and fix automations end-to-end, so every lead is handled perfectly.',
  },
  {
    icon: IconNeuralOrbit,
    tone: 'ic-indigo',
    tag: 'AI agents',
    title: 'AI agents that actually work for your agency',
    text: "We design, build, and deploy AI agents tailored to your agency's workflow. Qualify leads, handle inquiries, run AI call centers, and book meetings 24/7, without you touching a thing.",
  },
  {
    icon: IconClockSweep,
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
                lift={26}
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
