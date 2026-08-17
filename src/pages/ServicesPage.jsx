import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import SiteFooter from '../components/SiteFooter'
import FaqSection from '../components/FaqSection'
import { SERVICES_FAQS } from '../data/faqs'
import { ArrowRight, Bot, BriefcaseBusiness, Clock3, Code2, CreditCard, Headset, LayoutDashboard, Link2, MessageSquareText, Network, Settings2, Users, Workflow, Wrench, Check, X, Minus, User, TrendingUp } from 'lucide-react'

const hireModels = [
  {
    title: 'Hourly Experts',
    subtitle: 'Hire expert help only when you need it.',
    items: [
      'Perfect for quick fixes and small tasks',
      'No long-term commitment',
      'Great for support, troubleshooting, edits',
    ],
  },
  {
    title: 'Project Basis',
    subtitle: 'Hire our team for a full project buildout.',
    items: [
      'Best for CRM builds, automation systems, AI setup',
      'Fixed-scope delivery with expert execution',
      'Our most popular hire model',
    ],
    featured: true,
  },
  {
    title: 'Full-Time Expert',
    subtitle: 'Plug in a dedicated GHL expert to your team.',
    items: [
      'Ideal for agencies scaling fast',
      'Works like your in-house team member',
      'White-labeled, always-on support',
    ],
  },
]

const expertHandles = [
  { title: 'GoHighLevel Setup & SaaS Configuration', text: 'Launch sub-accounts, snapshots, whitelabel setup, settings, domains, calendars, pipelines, and full CRM structure.', icon: Settings2 },
  { title: 'Workflow Automation', text: 'Build and optimize workflows that actually work lead routing, nurture, onboarding, reactivation, reminders, and internal automations.', icon: Workflow },
  { title: 'AI Agents & Call Center Setup', text: 'Deploy AI chat agents, voice agents, qualification systems, and AI call flows connected directly to your GHL workflows.', icon: Bot },
  { title: 'White-Labeled Client Support', text: 'Need support under your own brand? We provide invisible expert help that feels like part of your internal team.', icon: Headset },
  { title: 'API Integrations & Custom Connections', text: 'Connect GHL with third-party tools, internal systems, payment platforms, reporting dashboards, and custom workflows.', icon: Link2 },
  { title: 'Vibe Coding & Custom Development', text: 'If GHL can’t do it natively, we build around it with custom code, interfaces, automations, and lightweight software solutions.', icon: Code2 },
  { title: 'Sub-Account / SaaS Fulfillment', text: 'We support your client accounts behind the scenes so your SaaS or agency offer stays clean, consistent, and scalable.', icon: LayoutDashboard },
  { title: 'Client Onboarding & Payment Setup', text: 'Forms, funnels, Stripe setup, onboarding flow, Twilio, email config, onboarding pipelines, and everything clients need to get started.', icon: CreditCard },
]

const steps = [
  {
    number: '01',
    title: 'Tell us what you need',
    text: 'Book a free call. We listen, map your setup, and figure out the right hire model full-time, part-time, or task-based.',
    pills: ['same-day reply', 'no commitment'],
    time: '~30 min',
  },
  {
    number: '02',
    title: 'We match you an expert',
    text: "You're paired with a GHL-certified specialist from our team. No generalists, no guessing and you interview them before saying yes.",
    pills: ['4+ yrs avg GHL experience', 'swap anytime'],
    time: '~24 hr',
  },
  {
    number: '03',
    title: 'They get to work',
    text: 'Your expert plugs in immediately building automations, handling support, training your team all under your brand. Invisible to your clients.',
    pills: ['white-labeled', 'daily status updates'],
    time: '~48 hr',
  },
  {
    number: '04',
    title: 'You focus on growth',
    text: 'The tech is handled. You close clients, pitch new business, and scale without ever touching the back-end again.',
    metric: 'avg +30% revenue at 90 days',
    time: 'day 7+',
  },
]

const skills = [
  'GoHighLevel', 'Workflow Automation', 'AI Agents', 'Vibe Coding', 'API Integrations', 'Zapier & Make', 'Email & SMS Marketing', 'Funnel Builds', 'Whitelabel CRM Setup', 'Client Onboarding', 'SaaS Fulfillment', 'Sub-Account Management', 'Stripe & Payment Setup', 'Twilio & Telephony', 'Custom Reporting', 'AI Chatbot Builds',
]

const comparisonRows = [
  ['Hire in under 24 hours', { kind: 'no', text: 'takes weeks' }, { kind: 'neutral', text: 'you, today' }, { kind: 'yes', text: 'same day' }],
  ['100% under your brand', { kind: 'neutral', text: 'varies' }, { kind: 'yes', text: 'obviously' }, { kind: 'yes', text: 'always' }],
  ['Scale hours up or down', { kind: 'no', text: 'contract-locked' }, { kind: 'neutral', text: 'your bandwidth' }, { kind: 'yes', text: 'on demand' }],
  ['Coverage at 3 a.m.', { kind: 'no', text: 'business hours' }, { kind: 'no', text: 'you sleep' }, { kind: 'yes', text: 'always on' }],
  ['Trains your in-house team', { kind: 'no', text: 'rarely' }, { kind: 'neutral', text: 'n/a' }, { kind: 'yes', text: 'included' }],
  ['GHL-certified expertise', { kind: 'neutral', text: 'sometimes' }, { kind: 'no', text: 'learning curve' }, { kind: 'yes', text: 'every expert' }],
]

function CompareCell({ value, highlight }) {
  const iconMap = {
    yes: <Check size={18} strokeWidth={2.5} />,
    no: <X size={18} strokeWidth={2.5} />,
    neutral: <Minus size={18} strokeWidth={2.5} />,
  }
  return (
    <td className={`services-compare-cell services-compare-value services-compare-value-${value.kind}${highlight ? ' services-compare-cell-highlight' : ''}`}>
      <span className="services-compare-icon">{iconMap[value.kind]}</span>
      <span className="services-compare-text">{value.text}</span>
    </td>
  )
}

export default function ServicesPage() {
  return (
    <main className="services-page services-page-redesign">
      <Helmet>
        <title>Hire GoHighLevel Experts Hourly, Project or Full-Time | GHL Prime</title>
        <meta name="description" content="Trained GoHighLevel specialists for CRM setup, automation workflows, AI agents, vibe coding, and 24/7 white-label client support. Hire the way your agency needs." />
        <meta name="keywords" content="GoHighLevel services, GoHighLevel setup, GHL automation, AI agents, white-label GoHighLevel support, SaaS mode setup, GoHighLevel integrations, GHL Prime" />
        <link rel="canonical" href="https://ghlprime.com/services" />
        <meta property="og:title" content="Hire GoHighLevel Experts Hourly, Project or Full-Time | GHL Prime" />
        <meta property="og:description" content="Trained GoHighLevel specialists for CRM setup, automation workflows, AI agents, vibe coding, and 24/7 white-label client support. Hire the way your agency needs." />
        <meta property="og:url" content="https://ghlprime.com/services" />
        <meta property="og:image" content="https://ghlprime.com/og-services.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:image" content="https://ghlprime.com/og-services.png" />
        <meta name="twitter:title" content="Hire GoHighLevel Experts Hourly, Project or Full-Time | GHL Prime" />
        <meta name="twitter:description" content="Trained GoHighLevel specialists for CRM setup, automation workflows, AI agents, vibe coding, and 24/7 white-label client support. Hire the way your agency needs." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com' },
            { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://ghlprime.com/services' },
          ],
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How to Hire a Dedicated GoHighLevel Expert Team',
          description: 'Four steps to get started with GHL Prime your dedicated GoHighLevel expert team for automation, AI agents, and white-label support.',
          url: 'https://ghlprime.com/services',
          step: [
            { '@type': 'HowToStep', position: 1, name: 'Tell us what you need', text: 'Book a free call. We listen, map your setup, and figure out the right hire model full-time, part-time, or task-based. Same-day reply, no commitment. Takes around 30 minutes.' },
            { '@type': 'HowToStep', position: 2, name: 'We match you an expert', text: 'You are paired with a GHL-certified specialist from our team. No generalists, no guessing and you interview them before saying yes. Average 4+ years GHL experience. Takes around 24 hours.' },
            { '@type': 'HowToStep', position: 3, name: 'They get to work', text: 'Your expert plugs in immediately building automations, handling support, training your team all under your brand. Invisible to your clients. Daily status updates. Takes around 48 hours.' },
            { '@type': 'HowToStep', position: 4, name: 'You focus on growth', text: 'The tech is handled. You close clients, pitch new business, and scale without ever touching the back-end again. Most agencies see results from day 7 onwards.' },
          ],
        })}</script>
              <meta name="last-modified" content="2026-05-24" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://ghlprime.com/services#webpage',
          url: 'https://ghlprime.com/services',
          name: 'Hire GoHighLevel Experts Hourly, Project or Full-Time | GHL Prime',
          description: 'Trained GoHighLevel specialists for CRM setup, automation workflows, AI agents, vibe coding, and 24/7 white-label client support. Hire the way your agency needs.',
          inLanguage: 'en-US',
          isPartOf: { '@id': 'https://ghlprime.com/#website' },
          about: { '@id': 'https://ghlprime.com/#organization' },
          datePublished: '2024-08-01',
          dateModified: '2026-05-24',
          speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.services-hero p', '.faq-question', '.faq-answer'] },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'GoHighLevel Expert Services GHL Prime',
          description: 'Specialist GoHighLevel services for marketing agencies and SaaS founders.',
          url: 'https://ghlprime.com/services',
          numberOfItems: 8,
          itemListElement: [
            { '@type': 'ListItem', position: 1, item: { '@type': 'Service', name: 'GoHighLevel Setup & SaaS Configuration', description: 'Full GHL sub-account setup including pipelines, automations, calendars, funnels, Stripe integration, Twilio config, A2P compliance, and complete SaaS Mode white-labeling.', provider: { '@type': 'Organization', name: 'GHL Prime', url: 'https://ghlprime.com' }, areaServed: ['US', 'CA', 'GB', 'AU'], url: 'https://ghlprime.com/services#ghl-setup' } },
            { '@type': 'ListItem', position: 2, item: { '@type': 'Service', name: 'Workflow Automation', description: 'End-to-end GHL workflow builds lead routing, nurture sequences, appointment reminders, missed call text-back, review requests, reactivation campaigns, and onboarding automations.', provider: { '@type': 'Organization', name: 'GHL Prime', url: 'https://ghlprime.com' }, url: 'https://ghlprime.com/services#automation' } },
            { '@type': 'ListItem', position: 3, item: { '@type': 'Service', name: 'AI Agents & Call Center Setup', description: 'Design and deployment of GoHighLevel Conversation AI bots, Voice AI receptionists, SimpleTalk AI agents, and VAPI voice agents for lead qualification, appointment booking, and 24/7 call handling.', provider: { '@type': 'Organization', name: 'GHL Prime', url: 'https://ghlprime.com' }, url: 'https://ghlprime.com/services#ai-agents' } },
            { '@type': 'ListItem', position: 4, item: { '@type': 'Service', name: 'White-Labeled Client Support', description: '24/7 GoHighLevel expert support delivered under your agency brand name. Covers US, UK, Canada, and Australia time zones. Clients never see the GHL Prime name.', provider: { '@type': 'Organization', name: 'GHL Prime', url: 'https://ghlprime.com' }, url: 'https://ghlprime.com/services#whitelabel' } },
            { '@type': 'ListItem', position: 5, item: { '@type': 'Service', name: 'API Integrations & Custom Connections', description: 'Connect GoHighLevel with Zapier, Slack, Stripe, Twilio, Google Workspace, custom CRMs, and any platform with an API. Custom webhook handlers and data sync scripts where native integrations do not exist.', provider: { '@type': 'Organization', name: 'GHL Prime', url: 'https://ghlprime.com' }, url: 'https://ghlprime.com/services#integrations' } },
            { '@type': 'ListItem', position: 6, item: { '@type': 'Service', name: 'Vibe Coding & Custom Development', description: 'AI-assisted custom development for features GoHighLevel cannot do natively. Custom dashboards, client portals, bespoke automation logic, and lightweight software tools built production-ready.', provider: { '@type': 'Organization', name: 'GHL Prime', url: 'https://ghlprime.com' }, url: 'https://ghlprime.com/services#vibe-coding' } },
            { '@type': 'ListItem', position: 7, item: { '@type': 'Service', name: 'Sub-Account & SaaS Fulfillment', description: 'Behind-the-scenes support for your client sub-accounts configuration, troubleshooting, onboarding, and ongoing management so your SaaS or agency offer stays consistent and scalable.', provider: { '@type': 'Organization', name: 'GHL Prime', url: 'https://ghlprime.com' }, url: 'https://ghlprime.com/services#saas-fulfillment' } },
            { '@type': 'ListItem', position: 8, item: { '@type': 'Service', name: 'Training & SOP Support', description: 'System walkthrough and handoff sessions after every build. Technical deep-dive training on GHL, automations, and AI agents. SOP documentation so your team can run the system confidently.', provider: { '@type': 'Organization', name: 'GHL Prime', url: 'https://ghlprime.com' }, url: 'https://ghlprime.com/services#training' } },
          ],
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': 'https://ghlprime.com/services#faq',
          mainEntity: SERVICES_FAQS.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        })}</script>
      </Helmet>

      <section className="section section-white services-redesign-hero">
        <div className="container services-redesign-hero-grid">
          <div className="services-redesign-hero-copy">
            <span className="eyebrow-label">Hire Experts</span>
            <h1>Hire the expert team your agency actually needs.</h1>
            <p>GHL Prime gives you access to trained GoHighLevel specialists you can hire hourly, per project, or full-time without hiring in-house, onboarding freelancers, or managing the tech yourself.</p>
            <div className="services-redesign-hero-pills">
              <span className="negative">No expensive hires</span>
              <span className="negative">No random freelancers</span>
              <span className="negative">No wasted time</span>
              <span className="positive">Trained GHL experts</span>
              <span className="positive">White-labeled support</span>
              <span className="positive">Flexible hiring models</span>
            </div>
            <div className="services-redesign-hero-actions">
              <a href="https://www.upwork.com/agencies/ghlprime/" target="_blank" rel="noopener noreferrer" className="primary-pill large">Hire Our Expert Team</a>
              <Link to="/case-studies" className="secondary-pill">See Case Studies</Link>
            </div>
          </div>
          <div className="services-redesign-hero-visual">
            <div className="services-hero-glass-card main">
              <Users size={24} />
              <strong>Your On-Demand GHL Team</strong>
              <span>Builds, support, training, AI, and execution.</span>
            </div>
            <div className="services-hero-glass-card floating one"><Clock3 size={18} /><span>Hourly / Project / Full-Time</span></div>
            <div className="services-hero-glass-card floating two"><BriefcaseBusiness size={18} /><span>Fully white-labeled</span></div>
          </div>
        </div>
      </section>

      <section className="section section-white services-hire-models-section">
        <div className="container">
          <div className="section-title centered services-section-heading">
            <span className="eyebrow-label">Hire Models</span>
            <h2>How You Can Hire Us</h2>
            <p>Choose the engagement style that fits your agency stage, client load, and current backend needs.</p>
          </div>
          <div className="services-hire-model-grid">
            {hireModels.map((model, index) => (
              <motion.article key={model.title} className={`services-hire-card ${model.featured ? 'featured' : ''}`} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -10, scale: 1.01 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.05 }}>
                {model.featured ? <span className="services-hire-badge">Most Popular</span> : null}
                <h3>{model.title}</h3>
                <p>{model.subtitle}</p>
                <ul>
                  {model.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <a href="https://www.upwork.com/agencies/ghlprime/" target="_blank" rel="noopener noreferrer" className={model.featured ? 'primary-pill' : 'secondary-pill'}>Hire via Upwork</a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white services-expert-handles-section">
        <div className="container">
          <div className="section-title centered services-section-heading">
            <span className="eyebrow-label">Expert Support</span>
            <h2>What Our Experts Handle</h2>
            <p>From technical setup to automation and client support, our team covers the backend execution modern agencies need most.</p>
          </div>
          <div className="services-expert-grid">
            {expertHandles.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.article key={item.title} className="services-expert-card" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -8, scale: 1.01 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.04 }}>
                  <div className="services-expert-icon"><Icon size={18} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section-white services-how-it-works-section">
        <div className="container">
          <div className="how-it-works-card">
            <div className="how-it-works-head">
              <span className="eyebrow-label">How it works</span>
              <h2>Four moves <span className="how-it-works-accent">from hello to handled.</span></h2>
              <p>The whole process what we do, when we do it, what you do instead.</p>
            </div>
            <div className="how-it-works-list">
              {steps.map((step) => (
                <div key={step.number} className="how-step-row">
                  <span className="how-step-number">{step.number}</span>
                  <div className="how-step-body">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                    {step.pills ? (
                      <div className="how-step-pills">
                        {step.pills.map((pill) => (
                          <span key={pill} className="how-step-pill">
                            <Check size={14} strokeWidth={3} /> {pill}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {step.metric ? (
                      <div className="how-step-pills">
                        <span className="how-step-pill how-step-pill-metric">
                          <TrendingUp size={14} strokeWidth={2.5} /> {step.metric}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <span className="how-step-time">{step.time}</span>
                </div>
              ))}
            </div>
            <div className="how-it-works-footer">
              <p>Most agencies move through all four steps in <strong>under a week.</strong></p>
              <Link to="/booking" className="primary-pill how-it-works-cta">
                Book your call <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-white services-skills-section">
        <div className="container">
          <div className="section-title centered services-section-heading">
            <span className="eyebrow-label">Expert Skills</span>
            <h2>Our team knows the full stack.</h2>
            <p>Every expert on the GHL Prime team is trained across the tools and systems that modern agencies run on.</p>
          </div>
          <div className="services-skills-pills">
            {skills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </div>
      </section>

      <section className="section section-white services-why-section">
        <div className="container">
          <div className="services-why-head">
            <span className="eyebrow-label">Why GHL Prime</span>
            <h2>You could hire a freelancer. You could DIY it. Or you could <span className="services-why-accent">look at the math.</span></h2>
            <p>Here&rsquo;s how the three options compare across the things that actually move agency revenue.</p>
          </div>

          <div className="services-compare-card">
            <table className="services-compare-table">
              <thead>
                <tr className="services-compare-row services-compare-head-row">
                  <td className="services-compare-cell services-compare-rowlabel" aria-hidden="true" />
                  <th scope="col" className="services-compare-cell services-compare-colhead">
                    <span className="services-compare-colicon"><User size={18} /></span>
                    <strong>Freelancer</strong>
                    <span className="services-compare-colsub">Contract help</span>
                  </th>
                  <th scope="col" className="services-compare-cell services-compare-colhead">
                    <span className="services-compare-colicon"><Wrench size={18} /></span>
                    <strong>DIY</strong>
                    <span className="services-compare-colsub">You handle it</span>
                  </th>
                  <th scope="col" className="services-compare-cell services-compare-colhead services-compare-col-highlight">
                    <span className="services-compare-badge">Recommended</span>
                    <span className="services-compare-colicon"><Users size={18} /></span>
                    <strong>GHL Prime</strong>
                    <span className="services-compare-colsub">Your expert team</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([label, freelancer, diy, prime]) => (
                  <tr key={label} className="services-compare-row">
                    <th scope="row" className="services-compare-cell services-compare-rowlabel">{label}</th>
                    <CompareCell value={freelancer} />
                    <CompareCell value={diy} />
                    <CompareCell value={prime} highlight />
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="services-compare-footer">
              <span className="services-compare-note">
                <span className="services-compare-info" aria-hidden="true">i</span>
                No contract, no setup fee. Most agencies test us for 7 days before committing.
              </span>
              <Link to="/booking" className="primary-pill services-compare-cta">
                Skip the comparison <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section services-redesign-final-cta-section">
        <div className="container">
          <div className="services-redesign-final-cta">
            <h2>Ready to hire your expert team?</h2>
            <p>Tell us what you need hourly, project, or full-time. We’ll match you with the right expert and get started fast.</p>
            <div className="final-cta-actions">
              <a href="https://www.upwork.com/agencies/ghlprime/" target="_blank" rel="noopener noreferrer" className="primary-pill large">Hire via Upwork</a>
              <Link to="/case-studies" className="secondary-pill">View Case Studies</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-white services-day-to-day" aria-labelledby="day-to-day-heading">
        <div className="container">
          <div className="section-title">
            <span className="eyebrow-label">Inside The Team</span>
            <h2 id="day-to-day-heading">What GoHighLevel Experts Actually Do Day to Day</h2>
            <p>A GoHighLevel expert is not just someone who can click around the platform. A trained GHL specialist understands the logic of how automations connect how a trigger fires, how a condition routes a contact, how a workflow interacts with a pipeline stage, and how to diagnose the exact point where a lead fell through the cracks. At GHL Prime, our specialists spend their days doing things like:</p>
          </div>
          <div className="services-day-to-day-grid">
            <article id="ghl-setup" className="services-day-card">
              <h3>GHL Setup Sub-Account Infrastructure</h3>
              <p>Building sub-account infrastructure from scratch configuring calendars, pipelines, custom fields, tags, triggers, and user permissions for a new agency client. Setting up Twilio for SMS, configuring A2P compliance, wiring in Stripe for payment flows.</p>
            </article>
            <article id="automation" className="services-day-card">
              <h3>Automation Auditing &amp; Fixing Broken Workflows</h3>
              <p>Auditing broken automations following the logic of a workflow that is silently failing, identifying the condition that is never evaluating to true, fixing it, and documenting what changed so it never breaks the same way again.</p>
            </article>
            <article id="ai-agents" className="services-day-card">
              <h3>AI Agents Prompting, Testing, Deploying</h3>
              <p>Prompting, testing, and refining conversational AI flows inside GoHighLevel&apos;s AI Employee module, or connecting external AI APIs to GHL via webhook and custom code to build more sophisticated agents than the native module supports.</p>
            </article>
            <article id="training" className="services-day-card">
              <h3>Training &amp; SOPs Snapshots and Documentation</h3>
              <p>Packaging a complete sub-account configuration (workflows, pipelines, funnels, settings, forms) into a deployable snapshot so an agency can onboard a new client in twenty minutes instead of twenty hours. Documenting SOPs so your team can run the system confidently.</p>
            </article>
            <article id="whitelabel" className="services-day-card">
              <h3>Whitelabel 24/7 Client Support</h3>
              <p>Responding to GoHighLevel support tickets submitted by your clients, under your brand name, within your SLA, using your communication tone. Your clients never know we are involved.</p>
            </article>
            <article id="vibe-coding" className="services-day-card">
              <h3>Vibe Coding Writing Custom Code</h3>
              <p>When GoHighLevel cannot do something natively, writing lightweight JavaScript, TypeScript, or Python to build around the limitation. Custom webhook handlers, data transformation logic, third-party sync scripts, and mini-applications.</p>
            </article>
          </div>
          <p className="services-day-to-day-closer">This is what an expert GHL team looks like operating at full capacity. It is what your agency gets when you hire GHL Prime.</p>
        </div>
      </section>
            <FaqSection faqs={SERVICES_FAQS} intro="What we build, what we fix, and how we work inside GoHighLevel." />
      <SiteFooter />
    </main>
  )
}
