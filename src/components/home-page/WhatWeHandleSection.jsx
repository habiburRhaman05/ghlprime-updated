import { motion } from 'framer-motion'
import { Bot, Headphones, Rocket, UserPlus, Workflow } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
}

function SolutionVisual({ variant }) {
  // Each icon now matches what its card is actually about. The previous map
  // paired "no expert on your team" with a grid glyph and "no support" with
  // a wrench, which told the reader nothing.
  const iconMap = {
    crm: UserPlus,        // hire specialists on demand
    support: Rocket,      // launch your SaaS
    backend: Workflow,    // build / fix automations
    ai: Bot,              // AI agents
    team: Headphones,     // 24/7 client support
  }

  const Icon = iconMap[variant] || Workflow

  return (
    <div className="solution-icon-tile">
      <Icon size={22} />
    </div>
  )
}

export default function WhatWeHandleSection() {
  const items = [
    {
      title: 'No GHL Expert on Your Team',
      text: 'Stop paying for a full-time hire you barely need. Tap certified GHL specialists on demand for builds, fixes, strategy, or anything in between.',
      variant: 'crm',
      tags: ['Hire GHL Experts'],
      tone: 'blue',
    },
    {
      title: "Can't Launch Your SaaS Fast Enough",
      text: 'We set up your fully white-labeled CRM from scratch: branded, configured, and client-ready. You own the product. We do the build.',
      variant: 'support',
      tags: ['White-Label Launch'],
      tone: 'green',
    },
    {
      title: 'Broken or Half-Built Automations',
      text: 'Leaking leads, missed follow-ups, workflows that randomly break. We build, audit, and fix automations end-to-end, so every lead is handled perfectly.',
      variant: 'backend',
      tags: ['Full Automation Builds'],
      tone: 'amber',
    },
    {
      title: 'AI Agents That Actually Work for Your Agency',
      text: 'We design, build, and deploy AI agents tailored to your agency\'s workflow. Qualify leads, handle inquiries, run AI call centers, and book meetings 24/7, without you touching a thing.',
      variant: 'ai',
      tags: ['AI Agent Deployment', 'AI Call Centers', 'Lead Qualification'],
      tone: 'violet',
    },
    {
      title: 'No Support = Clients Leave Your Platform',
      text: 'Your clients expect fast answers. We provide round-the-clock GHL expert support, fully under your brand. They think it\'s your team; we make you look like a well-staffed operation.',
      variant: 'team',
      tags: ['24/7 White-Label Support', 'GHL-Certified Team'],
      tone: 'red',
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
          {items.map((item, index) => (
            <motion.article key={item.title} className={`replacement-solution-card modern-solution-stack-card tone-${item.tone} ${index > 2 ? 'wide' : ''}`} initial="hidden" whileInView="show" whileHover={{ y: -8 }} viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
              {/* Icon leads the card. It sat below the body copy before,
                  which put the one scannable element last. */}
              <SolutionVisual variant={item.variant} />
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
