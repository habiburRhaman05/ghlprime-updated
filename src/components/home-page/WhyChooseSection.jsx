import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck2, Clock3, Code2, Contact, ShieldCheck, TrendingUp, Users } from 'lucide-react'

export default function WhyChooseSection() {
  // Copy is unchanged -- `icon`/`tone` are new, purely visual metadata for
  // the redesigned cards below.
  const items = [
    {
      title: 'GHL-Only Specialists',
      text: 'We don’t do everything. We focus exclusively on GHL and automation  which means you get depth, not breadth.',
      icon: ShieldCheck,
      tone: 'blue',
    },
    {
      title: '24/7 Availability',
      text: 'Your agency doesn’t sleep. Neither do we. Expert support available around the clock for you and your clients.',
      icon: Clock3,
      tone: 'green',
    },
    {
      title: 'Fully White-Labeled',
      text: 'We stay invisible. Your clients see your brand, your team, your expertise. We’re the engine room  you’re the front door.',
      icon: Contact,
      tone: 'purple',
    },
    {
      title: 'Strategy-Led, Not Just Setup',
      text: 'We don’t just click buttons. We design workflows around your sales process and build systems that actually perform.',
      icon: TrendingUp,
      tone: 'amber',
    },
    {
      title: 'We Train Your Team',
      text: 'We don’t keep you in the dark. We train you so you own your system, can speak to it confidently, and aren’t dependent on us forever.',
      icon: Users,
      tone: 'teal',
    },
    {
      title: 'Vibe Coding Capability',
      text: 'When GHL can’t do it natively, we build it. Custom dev, API integrations, bespoke tools  no other GHL team offers this.',
      icon: Code2,
      tone: 'pink',
    },
  ]

  return (
    <section className="section why-choose-section why-choose-reference-section">
     
      <div className="container">
        <motion.div
          className="section-title centered why-choose-reference-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow-label">Why do agencies hire GHL Prime instead of a freelancer?</span>

          <h2>Focused Expertise. Real <br/> <span>Delivery Power.</span></h2>
          <p>GHL Prime is specialized team backed by Octopi Digital. We don’t do everything we go deep on GHL,automation, AI, and custom dev so your agency has the best possible team behind it.</p>
        </motion.div>

        <div className="why-choose-card-grid why-choose-reference-card-grid">
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                className={`why-choose-detail-card tone-${item.tone}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <div className={`homepage-service-icon ${item.tone}`}><Icon size={19} /></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="why-choose-cta-row"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <Link to="/booking" className="primary-pill large why-choose-reference-cta">
            <CalendarCheck2 size={18} />
            Book a Free Call
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
