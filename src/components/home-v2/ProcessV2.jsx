'use client'

import { motion } from 'framer-motion'
import './home-v2.css'

// Carried over from the previous training / onboarding section, condensed to
// the four beats an agency actually goes through with us.
const STEPS = [
  {
    title: 'Scope & audit',
    text: 'We review your account, map the sales process, and identify exactly what needs to be built, fixed, or migrated.',
  },
  {
    title: 'Build the system',
    text: 'Sub-accounts, pipelines, automations, AI agents, and integrations assembled and wired end to end.',
  },
  {
    title: 'Walkthrough & handoff',
    text: 'We walk you through everything we have built, how it works, why it is set up that way, and how to use it confidently with your clients.',
  },
  {
    title: 'Ongoing support & upskilling',
    text: 'As the platform evolves and your agency grows, we keep you updated, new features, better workflows, smarter approaches.',
  },
]

// The four outcomes the old training / onboarding section promised. They
// belong with the process, not in a section of their own.
const OUTCOMES = [
  { eyebrow: 'Confidence to manage your GHL setup', title: 'Full technical ownership of your platform' },
  { eyebrow: 'Understanding of your automations', title: 'Ability to explain the system to clients' },
  { eyebrow: 'Access to our expert knowledge', title: 'Ongoing upskilling as your agency scales' },
  { eyebrow: 'No more depending on developers', title: 'You run it. We support you when needed.' },
]

export default function ProcessV2() {
  return (
    <section className="hv2 hv2-section is-white">
      <span className="hv2-grid-bg" aria-hidden="true" />
      <div className="hv2-inner">
        <motion.div
          className="hv2-head centered"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
        >
          <span className="hv2-eyebrow">How we work</span>
          <h2>You run it. <span className="hv2-hl">We support you when needed.</span></h2>
          <p>No black boxes. You end up owning a system you understand, with a team on call when you want to extend it.</p>
        </motion.div>

        <div className="hv2-steps">
          {STEPS.map((step, i) => (
            <motion.div
              className="hv2-step is-lit"
              key={step.title}
              style={{ transformPerspective: 1000 }}
              initial={{ opacity: 0, z: -300, y: 18 }}
              whileInView={{ opacity: 1, z: 0, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: 'spring', stiffness: 74, damping: 17, mass: 0.85, delay: i * 0.1 }}
            >
              <span className="hv2-step-dot" aria-hidden="true" />
              <span className="hv2-step-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="hv2-outcomes">
          {OUTCOMES.map((item, i) => (
            <motion.div
              className="hv2-outcome"
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: i * 0.07 }}
            >
              <span className="hv2-outcome-eyebrow">{item.eyebrow}</span>
              <strong>{item.title}</strong>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
