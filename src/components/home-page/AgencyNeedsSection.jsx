import { motion } from 'framer-motion'
import { Bot, Code2, GraduationCap, Share2, ShieldCheck, Wrench } from 'lucide-react'

export default function AgencyNeedsSection() {
  // title/text copy is unchanged from the original -- only icon + tone are
  // new, purely visual metadata for the redesigned cards below.
  const items = [
    ['GHL Technical Support', 'Direct expert support for setup, troubleshooting, cleanup, and backend execution.', Wrench, 'blue'],
    ['AI Agents & Call Center Setup', 'Deploy AI systems that qualify leads, support clients, and automate repetitive communication.', Bot, 'purple'],
    ['White-Labeled Client Support', 'Stay invisible behind your agency while we help you support clients under your own brand.', ShieldCheck, 'teal'],
    ['API Integrations', 'Connect HighLevel with third-party tools, CRMs, dashboards, and custom workflows.', Share2, 'amber'],
    ['Vibe Coding & Custom Dev', 'If HighLevel can’t do it natively, we can build around it with custom code and automation logic.', Code2, 'green'],
    ['Training & SOP Support', 'We train your team, document the system, and help you scale delivery with more confidence.', GraduationCap, 'red'],
  ]

  return (
    <section className="section homepage-services-redesign agency-needs-section" id="platform">
      <div className="agency-needs-glow a" aria-hidden="true" />
      <div className="agency-needs-glow b" aria-hidden="true" />
      <div className="container">
        <div className="section-title centered light homepage-services-title">
          <span className="eyebrow-label">Everything Your Agency Needs, Done by Experts</span>
          <h2>Technical execution, client support,<br />automation, and training all in <span className="hl">one team.</span></h2>
          <p>Built for agencies and SaaS founders who need real execution power behind their offers.</p>
        </div>
        <div className="homepage-services-grid agency-needs-grid">
          {items.map(([title, text, Icon, tone], index) => (
            <motion.article
              key={title}
              className={`homepage-service-card agency-service-card tone-${tone}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <div className={`homepage-service-icon ${tone}`}><Icon size={19} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
