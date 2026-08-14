import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import SiteFooter from '../components/SiteFooter'
import FaqSection from '../components/FaqSection'
import { HOMEPAGE_FAQS } from '../data/faqs'
import CertificationsSection from '../components/CertificationsSection'
import LeaderCardGrid from '../components/LeaderCardGrid'
import HomeSeoShell from '../components/HomeSeoShell'
import { fetchTeamMembers, fetchTeamPageExperts } from '../lib/teamApi'
import { fetchPartnerLogos } from '../lib/logosApi'
import { fetchCaseStudies } from '../lib/caseStudiesApi'
import ShippedEvidenceSection from '../components/ShippedEvidenceSection'
import { ArrowRight, Bot, BrainCircuit, CalendarCheck2, ClipboardCheck, Clock3, Code2, Contact, GraduationCap, LayoutDashboard, LayoutGrid, MessageSquareText, RefreshCw, Share2, ShieldCheck, Sparkles, TrendingUp, Users, Video, Webhook, Workflow, Wrench, X, Zap } from 'lucide-react'
import LifeAtGHL from '../components/home-page/LifeAtGHL'
import TeamTestimonials from '../components/home-page/TeamTestimonials'

const SITE_URL = 'https://ghlprime.com'
const HOMEPAGE_LAST_MODIFIED = '2026-05-24'

const HOMEPAGE_SERVICES = [
  {
    name: 'GoHighLevel Setup & Sub-Account Configuration',
    description: 'Complete CRM setup from scratch — sub-accounts, pipelines, calendars, forms, and integrations configured for agency and SaaS use.',
    url: SITE_URL + '/services#setup',
  },
  {
    name: 'Automation Workflow Builds',
    description: 'End-to-end build, audit, and repair of GoHighLevel automation workflows so every lead is captured, nurtured, and followed up automatically.',
    url: SITE_URL + '/services#automation',
  },
  {
    name: 'AI Agents & Voice Receptionists',
    description: 'AI agents that qualify leads, answer inquiries, run AI call centers, and book meetings 24/7 — deployed directly inside GoHighLevel.',
    url: SITE_URL + '/services#ai-agents',
  },
  {
    name: '24/7 White-Label Client Support',
    description: 'Round-the-clock GoHighLevel expert support delivered under your agency brand — your clients never know we exist.',
    url: SITE_URL + '/services#white-label-support',
  },
  {
    name: 'White-Label SaaS CRM Launch',
    description: 'Fully white-labeled GoHighLevel SaaS setups — branded sub-accounts, Stripe + Twilio configuration, and client-ready onboarding flows.',
    url: SITE_URL + '/services#saas-launch',
  },
  {
    name: 'API Integrations',
    description: 'Connect GoHighLevel to Zapier, Slack, Google Workspace, custom CRMs, databases, and any platform with an API — including custom integrations when no native option exists.',
    url: SITE_URL + '/services#integrations',
  },
  {
    name: 'Vibe Coding & Custom Development',
    description: 'AI-assisted custom development for anything GoHighLevel cannot do natively — custom dashboards, bespoke integrations, and unique automation logic.',
    url: SITE_URL + '/services#custom-development',
  },
  {
    name: 'Team Training & SOP Support',
    description: 'System walkthroughs, technical deep-dive sessions, and SOP documentation so your team can confidently run the platform after handoff.',
    url: SITE_URL + '/services#training',
  },
]

const HOMEPAGE_HOWTO_STEPS = [
  { name: 'System Walkthrough & Handoff', text: 'We walk you through everything we have built — how it works, why it is set up that way, and how to use it confidently with your clients.' },
  { name: 'Technical Deep Dive Sessions', text: 'Live sessions on GoHighLevel, automations, AI agents, and whatever part of the system you want to master. We go deep, not surface-level.' },
  { name: 'Ongoing Support & Upskilling', text: 'As the platform evolves and your agency grows, we keep you updated with new features, better workflows, and smarter approaches.' },
]

const buildHomepageSchemas = () => {
  const orgRef = { '@id': SITE_URL + '/#organization' }
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': SITE_URL + '/#webpage',
      url: SITE_URL + '/',
      name: 'GoHighLevel Experts for Agencies | GHL Prime',
      description: 'Hire a dedicated GoHighLevel AI automation team to set up your CRM, automations, and AI agents — built for agencies and Local Businesses. GHL-certified, US-based, 24/7 support.',
      inLanguage: 'en-US',
      isPartOf: { '@id': SITE_URL + '/#website' },
      about: orgRef,
      primaryImageOfPage: { '@type': 'ImageObject', url: SITE_URL + '/ghl-prime-logo.png' },
      datePublished: '2024-08-01',
      dateModified: HOMEPAGE_LAST_MODIFIED,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '.hero p', '.faq-question', '.faq-answer'],
      },
      breadcrumb: { '@id': SITE_URL + '/#breadcrumb' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': SITE_URL + '/#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': SITE_URL + '/#services',
      name: 'GHL Prime Services',
      numberOfItems: HOMEPAGE_SERVICES.length,
      itemListElement: HOMEPAGE_SERVICES.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          name: s.name,
          description: s.description,
          url: s.url,
          provider: orgRef,
          areaServed: [
            { '@type': 'Country', name: 'United States' },
            { '@type': 'Country', name: 'Canada' },
            { '@type': 'Country', name: 'United Kingdom' },
            { '@type': 'Country', name: 'Australia' },
          ],
          serviceType: s.name,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      '@id': SITE_URL + '/#training',
      name: 'How GHL Prime trains and hands off your GoHighLevel platform',
      description: 'GHL Prime trains your team so you can run your own GoHighLevel platform with confidence after handoff.',
      step: HOMEPAGE_HOWTO_STEPS.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        text: s.text,
        url: SITE_URL + '/#training-step-' + (i + 1),
      })),
    },
    { '@context': 'https://schema.org', '@type': 'Person', name: 'Jewel Rana', jobTitle: 'CEO & Co-Founder', worksFor: orgRef, url: 'https://www.linkedin.com/in/thejewelrana/', image: 'https://ghlprime.com/jewel-rana.png', description: 'Business coach and agency leader. CEO and Co-Founder of GHL Prime, a dedicated GoHighLevel expert team. Helps agencies build profitable, scalable service businesses.', sameAs: ['https://www.linkedin.com/in/thejewelrana/', 'https://www.upwork.com/freelancers/~013caf34b8df0444cf/', 'https://www.facebook.com/thenewjewel', 'https://www.bokaboss.com/'], knowsAbout: ['GoHighLevel', 'Marketing Automation', 'CRM Systems', 'Agency Growth Strategy', 'White-Label SaaS', 'Business Coaching'] },
    { '@context': 'https://schema.org', '@type': 'Person', name: 'Niyamul Islam Sajal', jobTitle: 'COO & Co-Founder', worksFor: orgRef, url: 'https://www.linkedin.com/in/niyamulislam/', image: 'https://ghlprime.com/niyamul-islam-sajal.png', description: 'Senior automation engineer and COO of GHL Prime. Specializes in GoHighLevel automation systems, AI-powered workflows, CRM architecture, and custom API integrations.', sameAs: ['https://www.linkedin.com/in/niyamulislam/', 'https://www.upwork.com/freelancers/~010f634a8b80365e7b', 'https://www.facebook.com/niaymul.islam.2025/'], knowsAbout: ['GoHighLevel Automation', 'AI Agents', 'Voice AI', 'CRM Architecture', 'API Integrations', 'n8n', 'Vibe Coding', 'Workflow Automation'] },
  ]
}

const rotatingPills = [
  'GoHighLevel Experts',
  'Automation Specialists',
  'Vibe Coding Team',
  'AI Agent Builders',
  'AI Call Center Setup',
  'API Integrations',
  'Whitelabel Solutions',
  '24/7 Expert Support',
]

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
}

function SectionTitle({ title, text, centered = true, light = false, eyebrow }) {
  return (
    <motion.div className={`section-title ${centered ? 'centered' : ''} ${light ? 'light' : ''}`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
      {eyebrow ? <span className="eyebrow-label">{eyebrow}</span> : null}
      <h2>{title}</h2>
      <p>{text}</p>
    </motion.div>
  )
}

function LogoMarqueeRow({ items, reverse = false }) {
  const filteredItems = items.filter((logo) => logo?.image_url)
  const trackItems = [...filteredItems, ...filteredItems]

  if (!filteredItems.length) return null

  return (
    <div className={`logo-marquee-row ${reverse ? 'reverse' : ''}`}>
      <div className="logo-marquee-track">
        {trackItems.map((logo, index) => {
          const content = (
            <div className="logo-marquee-card logo-marquee-card-image-only">
              <img src={logo.image_url} alt={logo.name} className="logo-chip-image logo-marquee-image-only" loading="lazy" decoding="async" />
            </div>
          )

          if (logo.website_url) {
            return <a key={`${logo.id || logo.name}-${index}`} href={logo.website_url} target="_blank" rel="noopener noreferrer" className="logo-marquee-link">{content}</a>
          }

          return <div key={`${logo.id || logo.name}-${index}`} className="logo-marquee-link">{content}</div>
        })}
      </div>
    </div>
  )
}

function TrustedLogosSection() {
  const [logos, setLogos] = useState([])

  useEffect(() => {
    fetchPartnerLogos().then(setLogos)
  }, [])

  const imageOnlyLogos = logos.filter((logo) => logo?.image_url)

  return (
    <section className="trust-band premium-trust-band">
      <div className="container trust-inner">
        <SectionTitle eyebrow="Trusted environment" title="Trusted by agencies and growth-focused businesses" text="Built for companies that want their CRM, automation, and client journey to feel more premium and more intentional." />
        <div className="logo-marquee-shell">
          {imageOnlyLogos.length ? <LogoMarqueeRow items={imageOnlyLogos} /> : null}
        </div>
      </div>
    </section>
  )
}

function SolutionVisual({ variant }) {
  const iconMap = {
    crm: LayoutGrid,
    support: Workflow,
    ai: BrainCircuit,
    team: Wrench,
    backend: Zap,
  }

  const Icon = iconMap[variant] || Workflow

  return (
    <div className={`abstract-visual-card ${variant}`}>
      <div className="abstract-orb orb-one" />
      <div className="abstract-orb orb-two" />
      <div className="abstract-grid-line line-one" />
      <div className="abstract-grid-line line-two" />
      <div className="abstract-icon-shell"><Icon size={28} /></div>
      <div className="abstract-chip-row"><span className="abstract-chip" /><span className="abstract-chip wide" /><span className="abstract-chip" /></div>
    </div>
  )
}

function WhatWeAreSection() {
  return (
    <section className="section what-we-are-section">
      <div className="container what-we-are-layout">
        <div className="what-we-are-copy">
          <motion.span
            className="eyebrow-label"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.45 }}
          >
            What We Actually Are
          </motion.span>

          <motion.h2
            className="what-we-are-heading"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            We&rsquo;re not software. We&rsquo;re your <span className="accent">expert team.</span>
          </motion.h2>

          <motion.p
            className="what-we-are-lede"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            Agencies and SaaS founders hire GHL Prime as their dedicated back-office &mdash; handling all the technical work, supporting their clients 24/7, and training them to grow.
          </motion.p>
        </div>

        <motion.div
          className="what-we-are-image-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src="/who-we-are.jpg" alt="The GHL Prime team" className="what-we-are-image" />
        </motion.div>
      </div>
    </section>
  )
}


function WhatWeHandleSection() {
  const items = [
    {
      title: 'No GHL Expert on Your Team',
      text: 'Stop paying for a full-time hire you barely need. Tap certified GHL specialists on demand — for builds, fixes, strategy, or anything in between.',
      variant: 'crm',
      tags: ['Hire GHL Experts'],
      tone: 'blue',
    },
    {
      title: "Can't Launch Your SaaS Fast Enough",
      text: 'We set up your fully white-labeled CRM from scratch — branded, configured, and client-ready. You own the product. We do the build.',
      variant: 'support',
      tags: ['White-Label Launch'],
      tone: 'green',
    },
    {
      title: 'Broken or Half-Built Automations',
      text: 'Leaking leads, missed follow-ups, workflows that randomly break. We build, audit, and fix automations end-to-end — so every lead is handled perfectly.',
      variant: 'backend',
      tags: ['Full Automation Builds'],
      tone: 'amber',
    },
    {
      title: 'AI Agents That Actually Work for Your Agency',
      text: 'We design, build, and deploy AI agents tailored to your agency\'s workflow. Qualify leads, handle inquiries, run AI call centers, and book meetings — 24/7, without you touching a thing.',
      variant: 'ai',
      tags: ['AI Agent Deployment', 'AI Call Centers', 'Lead Qualification'],
      tone: 'violet',
    },
    {
      title: 'No Support = Clients Leave Your Platform',
      text: 'Your clients expect fast answers. We provide round-the-clock GHL expert support, fully under your brand. They think it\'s your team — we make you look like a well-staffed operation.',
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
          <h2 className="single-line-heading">You Get the Experts. We Work Behind the Scenes.</h2>
          <p>From white-label launch support to automation builds, AI deployment, and client support, we become the technical team your agency can rely on.</p>
        </div>
        <div className="replacement-solutions-grid modern-stack-grid">
          {items.map((item, index) => (
            <motion.article key={item.title} className={`replacement-solution-card modern-solution-stack-card tone-${item.tone} ${index > 2 ? 'wide' : ''}`} initial="hidden" whileInView="show" whileHover={{ y: -8 }} viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
              <div className="solution-copy align-left">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <div className="solution-card-footer">
                <div className="solution-icon-row">
                  <SolutionVisual variant={item.variant} />
                </div>
                <div className="stack-tag-row">{item.tags.map((tag) => <span key={tag} className="stack-tag">{tag}</span>)}</div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function AgencyNeedsSection() {
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
          <h2>Technical execution, client support,<br />automation, and training all in one team.</h2>
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

function TrainingSection() {
  // Copy is unchanged -- `icon` is new, purely visual metadata for the
  // redesigned step tiles / outcome cards below.
  const steps = [
    {
      number: '01',
      title: 'System Walkthrough & Handoff',
      text: 'We walk you through everything we’ve built — how it works, why it’s set up that way, and how to use it confidently with your clients.',
      icon: ClipboardCheck,
    },
    {
      number: '02',
      title: 'Technical Deep Dive Sessions',
      text: 'Live sessions on GHL, automations, AI agents, and whatever part of the system you want to master. We go deep, not surface-level.',
      icon: Video,
    },
    {
      number: '03',
      title: 'Ongoing Support & Upskilling',
      text: 'As the platform evolves and your agency grows, we keep you updated — new features, better workflows, smarter approaches. You’re never left behind.',
      icon: TrendingUp,
    },
  ]

  const outcomes = [
    {
      eyebrow: 'Confidence to manage your GHL setup',
      title: 'Full technical ownership of your platform',
      icon: ShieldCheck,
    },
    {
      eyebrow: 'Understanding of your automations',
      title: 'Ability to explain the system to clients',
      icon: MessageSquareText,
    },
    {
      eyebrow: 'Access to our expert knowledge',
      title: 'Ongoing upskilling as your agency scales',
      icon: TrendingUp,
    },
    {
      eyebrow: 'No more depending on developers',
      title: 'You run it. We support you when needed.',
      icon: Users,
    },
  ]

  return (
    <section className="section section-white training-section training-section-redesign">
      <div className="container training-grid training-grid-redesign">
        <div className="training-copy training-copy-redesign">
          <motion.span
            className="eyebrow-label"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45 }}
          >
            Expert Training & Onboarding
          </motion.span>

          <h2 className="training-heading-stack">
            <motion.span
              className="training-heading-line"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            >
              We Don’t Just Build.
            </motion.span>

            <motion.span
              className="training-heading-line training-heading-line-accent"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.58, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="training-heading-accent-text">We Train You to Win.</span>
              <motion.span
                className="training-heading-sweep"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            Our team trains you hands-on, technically — so you understand your own system, can serve clients better, and don’t depend on anyone to run your business.
          </motion.p>

          <motion.div
            className="training-step-list-redesign"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.42,
                },
              },
            }}
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                className="training-step-row"
                variants={{
                  hidden: { opacity: 0, x: -32 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <motion.div
                  className="training-step-number"
                  variants={{
                    hidden: { opacity: 0, scale: 0.82 },
                    show: {
                      opacity: 1,
                      scale: [0.82, 1.08, 1],
                      transition: { duration: 0.42, ease: [0.34, 1.56, 0.64, 1] },
                    },
                  }}
                >
                  <step.icon size={20} />
                  <span className="training-step-index">{step.number}</span>
                </motion.div>
                <div className="training-step-copy">
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="training-panel training-panel-redesign training-panel-flat"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="training-panel-card training-panel-card-redesign training-panel-card-flat">
            <span className="training-panel-label training-panel-label-flat">What You’ll Walk Away With</span>
            <motion.div
              className="training-outcome-stack training-outcome-stack-flat"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.12,
                    delayChildren: 0.16,
                  },
                },
              }}
            >
              {outcomes.map((item) => (
                <motion.article
                  key={item.title}
                  className="training-outcome-card training-outcome-card-flat"
                  variants={{
                    hidden: { opacity: 0, y: 22 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  whileHover={{ y: -2 }}
                >
                  <div className="training-outcome-icon"><item.icon size={17} /></div>
                  <div className="training-outcome-copy">
                    <span>{item.eyebrow}</span>
                    <strong>{item.title}</strong>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function VibeCodingSection() {
  // Labels are unchanged -- `icon` is new, purely visual metadata for the
  // redesigned pill row below.
  const vibeTags = [
    { label: 'Custom Integrations', icon: Webhook },
    { label: 'API Connections', icon: Share2 },
    { label: 'Custom Dashboards', icon: LayoutDashboard },
    { label: 'AI-Assisted Dev', icon: Sparkles },
    { label: 'Webhooks & Triggers', icon: Zap },
    { label: 'Third-Party Syncs', icon: RefreshCw },
  ]

  const tokenLines = useMemo(() => [
    [{ k: 'comment', t: '// Custom integration — built fast' }],
    [],
    [
      { k: 'kw', t: 'const' },
      { k: 'plain', t: ' ' },
      { k: 'var', t: 'ghlPrime' },
      { k: 'op', t: ' = ' },
      { k: 'kw', t: 'new' },
      { k: 'plain', t: ' ' },
      { k: 'class', t: 'ExpertTeam' },
      { k: 'punc', t: '({' },
    ],
    [
      { k: 'plain', t: '  ' },
      { k: 'prop', t: 'skills' },
      { k: 'punc', t: ': [' },
      { k: 'str', t: "'GHL'" },
      { k: 'punc', t: ', ' },
      { k: 'str', t: "'Automation'" },
      { k: 'punc', t: ',' },
    ],
    [
      { k: 'plain', t: '    ' },
      { k: 'str', t: "'AI Agents'" },
      { k: 'punc', t: ', ' },
      { k: 'str', t: "'Vibe Coding'" },
      { k: 'punc', t: '],' },
    ],
    [
      { k: 'plain', t: '  ' },
      { k: 'prop', t: 'availability' },
      { k: 'punc', t: ': ' },
      { k: 'str', t: "'24/7'" },
      { k: 'punc', t: ',' },
    ],
    [
      { k: 'plain', t: '  ' },
      { k: 'prop', t: 'brandedAs' },
      { k: 'punc', t: ': ' },
      { k: 'str', t: "'your agency'" },
      { k: 'punc', t: ',' },
    ],
    [
      { k: 'plain', t: '  ' },
      { k: 'prop', t: 'clientFacing' },
      { k: 'punc', t: ': ' },
      { k: 'bool', t: 'true' },
    ],
    [{ k: 'punc', t: '});' }],
    [],
    [{ k: 'comment', t: '// We handle the build.' }],
    [{ k: 'comment', t: '// You deliver the result.' }],
    [],
    [
      { k: 'var', t: 'ghlPrime' },
      { k: 'punc', t: '.' },
      { k: 'fn', t: 'buildAnything' },
      { k: 'punc', t: '();' },
    ],
    [{ k: 'comment', t: '// ✓ Done. Client-ready.' }],
  ], [])

  const lineLengths = useMemo(() => tokenLines.map(line => line.reduce((sum, tok) => sum + tok.t.length, 0)), [tokenLines])

  const [lineIdx, setLineIdx] = useState(-1)
  const [charIdx, setCharIdx] = useState(0)
  const [hasStartedTyping, setHasStartedTyping] = useState(false)
  const [showDots, setShowDots] = useState(false)
  const [rippleStyle, setRippleStyle] = useState(null)
  const [ghostSuggestion, setGhostSuggestion] = useState(null)
  const [activeTab, setActiveTab] = useState('ts')

  const readmeLines = useMemo(() => [
    [{ k: 'md-h1', t: '# GHL Prime' }],
    [],
    [{ k: 'md-quote', t: '> Your dedicated GHL & automation expert team.' }],
    [],
    [{ k: 'md-h2', t: '## What we build' }],
    [{ k: 'md-bullet', t: '- GHL setup, sub-accounts & whitelabel' }],
    [{ k: 'md-bullet', t: '- Automation, AI agents & voice receptionists' }],
    [{ k: 'md-bullet', t: '- Custom dev for anything GHL can\'t do natively' }],
    [],
    [{ k: 'md-h2', t: '## Get started' }],
    [{ k: 'md-code', t: 'npm run hire --expert-team' }],
    [],
    [{ k: 'md-link', t: '[Book a demo →](https://ghlprime.com/booking)' }],
  ], [])


  useEffect(() => {
    if (!hasStartedTyping) return undefined

    setLineIdx(-1)
    setCharIdx(0)
    setShowDots(false)
    setGhostSuggestion(null)

    let cancelled = false
    let timeoutId = null

    const wait = (ms) => new Promise((resolve) => {
      timeoutId = window.setTimeout(resolve, ms)
    })

    const ghostHints = {
      2: 'ExpertTeam',
      13: 'buildAnything',
    }

    const run = async () => {
      setShowDots(true)
      await wait(420)
      if (cancelled) return

      for (let i = 0; i < tokenLines.length; i += 1) {
        if (cancelled) return
        setLineIdx(i)
        const len = lineLengths[i]

        if (ghostHints[i]) {
          setGhostSuggestion({ line: i, text: ghostHints[i] })
          await wait(380)
          if (cancelled) return
          setGhostSuggestion(null)
        }

        for (let c = 0; c <= len; c += 1) {
          if (cancelled) return
          setCharIdx(c)
          const wobble = (c % 5) * 6
          const burst = (c > 0 && c % 9 === 0) ? 60 : 0
          await wait(14 + wobble + burst)
        }
        await wait(len === 0 ? 70 : 110)
      }

      if (!cancelled) {
        setLineIdx(tokenLines.length)
      }
    }

    run()

    return () => {
      cancelled = true
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [tokenLines, lineLengths, hasStartedTyping])

  useEffect(() => {
    const section = document.querySelector('.vibe-coding-redesign-section')
    const editor = section?.querySelector('.vibe-code-visual-reference')
    const copy = section?.querySelector('.vibe-copy-reference')
    if (!section || !editor || !copy) return undefined

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const progress = Math.max(-1, Math.min(1, (viewportHeight * 0.5 - rect.top) / viewportHeight))

      editor.style.transform = `translateY(${progress * -14}px)`
      copy.style.transform = `translateY(${progress * -6}px)`
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  function handleCtaRipple(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    setRippleStyle({ width: size, height: size, left: x, top: y })
    window.setTimeout(() => setRippleStyle(null), 550)
  }

  return (
    <section className="section section-white vibe-coding-section vibe-coding-redesign-section">
      <div className="vibe-tech-particles" aria-hidden="true">
        <span className="particle particle-one" />
        <span className="particle particle-two" />
        <span className="particle particle-three" />
        <span className="particle particle-four" />
      </div>
      <div className="container vibe-grid vibe-grid-redesign vibe-grid-reference">
        <motion.div
          className="vibe-code-visual vibe-code-visual-redesign vibe-code-visual-reference"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => setHasStartedTyping(true)}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5 }}
        >
          <div className="vibe-editor-backglow" aria-hidden="true" />
          <div className={`code-window code-window-redesign code-window-reference code-window-ide ${showDots ? 'is-ready' : ''}`}>
            <div className={`ide-titlebar ${showDots ? 'visible' : ''}`}>
              <div className="ide-titlebar-dots">
                <span /><span /><span />
              </div>
              <div className="ide-titlebar-title">ghl-prime — vibe-coding</div>
              <div className="ide-titlebar-ai" aria-hidden="true">
                <span className="ide-ai-dot" />
                Copilot
              </div>
            </div>
            <div className={`ide-tabbar ${showDots ? 'visible' : ''}`}>
              <button type="button" className={`ide-tab ${activeTab === 'ts' ? 'ide-tab-active' : 'ide-tab-inactive'}`} onClick={() => setActiveTab('ts')}>
                <span className="ide-tab-icon" aria-hidden="true">TS</span>
                ghl-prime.ts
                <span className="ide-tab-close" aria-hidden="true">×</span>
              </button>
              <button type="button" className={`ide-tab ${activeTab === 'md' ? 'ide-tab-active' : 'ide-tab-inactive'}`} onClick={() => setActiveTab('md')}>
                <span className="ide-tab-icon ide-tab-icon-md" aria-hidden="true">md</span>
                README.md
              </button>
            </div>
            <div className="ide-breadcrumbs">
              <span>{activeTab === 'ts' ? 'src' : 'root'}</span><span className="ide-crumb-sep">›</span>
              <span>{activeTab === 'ts' ? 'integrations' : 'docs'}</span><span className="ide-crumb-sep">›</span>
              <span className="ide-crumb-active">{activeTab === 'ts' ? 'ghl-prime.ts' : 'README.md'}</span>
            </div>
            <div className="ide-editor">
                {activeTab === 'ts' ? (
                  <>
                    {tokenLines.map((line, idx) => {
                      const isCurrent = idx === lineIdx
                      const isPast = idx < lineIdx || lineIdx >= tokenLines.length
                      if (!isCurrent && !isPast) return null
                      let remaining = isPast ? Infinity : charIdx
                      const showGhost = ghostSuggestion && ghostSuggestion.line === idx && isCurrent && remaining === 0
                      return (
                        <div key={idx} className={`ide-line${isCurrent ? ' ide-line-current' : ''}`}>
                          <span className="ide-gutter">{idx + 1}</span>
                          <span className="ide-line-content">
                            {line.map((tok, tIdx) => {
                              if (remaining <= 0) return null
                              if (tok.t.length <= remaining) {
                                remaining -= tok.t.length
                                return <span key={tIdx} className={`tok-${tok.k}`}>{tok.t}</span>
                              }
                              const slice = tok.t.slice(0, remaining)
                              remaining = 0
                              return <span key={tIdx} className={`tok-${tok.k}`}>{slice}</span>
                            })}
                            {showGhost ? <span className="ide-ghost">{ghostSuggestion.text}</span> : null}
                            {isCurrent ? <span className="ide-caret" aria-hidden="true" /> : null}
                          </span>
                        </div>
                      )
                    })}
                    {lineIdx >= tokenLines.length ? (
                      <div className="ide-status-pulse" aria-hidden="true">
                        <span className="ide-status-check">✓</span> Saved · Build passing
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    {readmeLines.map((line, idx) => (
                      <div key={idx} className="ide-line">
                        <span className="ide-gutter">{idx + 1}</span>
                        <span className="ide-line-content">
                          {line.map((tok, tIdx) => (
                            <span key={tIdx} className={`tok-${tok.k}`}>{tok.t}</span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className={`ide-statusbar ${showDots ? 'visible' : ''}`}>
              <span className="ide-status-section ide-status-branch">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="6" cy="3" r="2" /><circle cx="6" cy="21" r="2" /><circle cx="18" cy="12" r="2" />
                  <path d="M6 5v14" /><path d="M18 10c0-4-6-3-6-7" /><path d="M18 14c0 4-6 3-6 7" />
                </svg>
                main
              </span>
              <span className="ide-status-section">0 ⚠ 0 ✖</span>
              <span className="ide-status-spacer" />
              <span className="ide-status-section">{activeTab === 'ts' ? `Ln ${Math.min(lineIdx, tokenLines.length - 1) + 1}, Col ${charIdx + 1}` : `Ln 1, Col 1`}</span>
              <span className="ide-status-section">UTF-8</span>
              <span className="ide-status-section ide-status-lang">{activeTab === 'ts' ? 'TypeScript' : 'Markdown'}</span>
            </div>
          </div>
        </motion.div>
        <div className="vibe-copy vibe-copy-redesign vibe-copy-reference">
          <motion.span
            className="eyebrow-label"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45 }}
          >
            Vibe Coding & Custom Development
          </motion.span>

          <h2 className="vibe-heading-stack">
            <motion.span
              className="vibe-heading-line"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            >
              If GHL Can’t
            </motion.span>
            <motion.span
              className="vibe-heading-line vibe-heading-line-accent"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.58, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="vibe-heading-sweep-text">Do It, We</span>
            </motion.span>
            <motion.span
              className="vibe-heading-line vibe-heading-line-accent"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.58, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="vibe-heading-sweep-text">Build It.</span>
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            Most GHL agencies are stuck with what’s inside the platform. We’re not. Our vibe coding team builds custom features, tools, and integrations that GHL doesn’t support natively — fast, clean, and ready to deploy.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
          >
            Need a custom dashboard? A unique integration? A bespoke automation that connects 5 different systems? We build it using modern AI-assisted development and hand it back to you production-ready.
          </motion.p>
          <motion.div
            className="vibe-pill-row vibe-pill-row-redesign vibe-pill-row-reference"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.52 } } }}
          >
            {vibeTags.map((tag, index) => (
              <motion.span
                key={tag.label}
                className="vibe-floating-pill"
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 10 },
                  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                }}
                style={{ animationDelay: `${index * 0.4}s` }}
                whileHover={{ scale: 1.04 }}
              >
                <tag.icon size={14} />
                {tag.label}
              </motion.span>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/booking" className="primary-pill large vibe-cta-reference vibe-cta-premium" onClick={handleCtaRipple}>
              Talk to Our Dev Team
              {rippleStyle ? <span className="vibe-cta-ripple" style={rippleStyle} aria-hidden="true" /> : null}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function WhyChooseSection() {
  // Copy is unchanged -- `icon`/`tone` are new, purely visual metadata for
  // the redesigned cards below.
  const items = [
    {
      title: 'GHL-Only Specialists',
      text: 'We don’t do everything. We focus exclusively on GHL and automation — which means you get depth, not breadth.',
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
      text: 'We stay invisible. Your clients see your brand, your team, your expertise. We’re the engine room — you’re the front door.',
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
      text: 'When GHL can’t do it natively, we build it. Custom dev, API integrations, bespoke tools — no other GHL team offers this.',
      icon: Code2,
      tone: 'pink',
    },
  ]

  return (
    <section className="section why-choose-section why-choose-reference-section">
      <div className="why-choose-dot-grid" aria-hidden="true" />
      <div className="container">
        <motion.div
          className="section-title centered why-choose-reference-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow-label">Why do agencies hire GHL Prime instead of a freelancer?</span>

          <h2>Focused Expertise. Real Delivery. <span>Power.</span></h2>
          <p>GHL Prime is a specialized team backed by Octopi Digital. We don’t do everything — we go deep on GHL, automation, AI, and custom dev so your agency has the best possible team behind it.</p>
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

function CaseStudiesSection() {
  const [caseStudies, setCaseStudies] = useState([])

  useEffect(() => {
    fetchCaseStudies().then((items) => setCaseStudies((items || []).slice(0, 3)))
  }, [])

  const renderCard = (study, index) => {
    const studyPath = study && study.slug ? `/case-studies/${safeSlug(study.slug)}` : '/case-studies'

    return (
      <Link
        key={`study-${(study && (study.id || study.slug || study.title)) || 'study'}-${index}`}
        to={studyPath}
        className="case-study-slider-card clickable"
      >
        <div className="case-study-slider-visual">
          {study && study.image ? <img src={study.image} alt={study.title || 'Case study'} className="case-study-slider-image" loading="lazy" decoding="async" /> : null}
          <div className="case-study-slider-overlay">
            <span className="case-study-slider-tag">{(study && study.category) || 'Case Study'}</span>
          </div>
        </div>
        <div className="case-study-slider-body">
          <h3>{(study && study.title) || 'Add your next case study here'}</h3>
          <p>{(study && (study.excerpt || study.challenge)) || 'Showcase a real client win with a short summary from the backend.'}</p>
          <span className="case-study-slider-arrow" aria-hidden="true">
            <ArrowRight size={18} />
          </span>
        </div>
      </Link>
    )
  }

  return (
    <section className="section case-studies-reference-section">
      <div className="container">
        <div className="case-studies-reference-head">
          <div className="case-studies-reference-copy">
            <span className="eyebrow-label">Case Studies</span>
            <h2>Real Work.<br /><span>Real Results.</span></h2>
          </div>
          <Link to="/case-studies" className="secondary-pill case-studies-reference-cta">View All Case Studies</Link>
        </div>

        <div className="case-studies-grid">
          {caseStudies.map((study, index) => renderCard(study, index))}
        </div>
      </div>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section className="section final-cta-section">
      <div className="container">
        <motion.div className="final-cta-card premium-final-cta" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.55 }}>
          <div>
            <span className="cta-label">Ready to scale delivery without doing it all yourself?</span>
            <h2>You Close the Clients. We Handle Everything Else.</h2>
          </div>
          <div className="final-cta-actions homepage-final-cta-actions">
            <Link to="/booking" className="primary-pill large homepage-cta-btn">Get a free consultation</Link>
            <Link to="/services" className="secondary-pill homepage-cta-btn secondary-homepage-cta-btn">See What We Do</Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function LeadersSection() {
  const [leaders, setLeaders] = useState([])
  useEffect(() => { fetchTeamMembers().then(setLeaders) }, [])
  if (!leaders.length) return null
  return (
    <section className="section section-white mentor-showcase-section leader-card-section">
      <div className="container">
        <div className="section-title centered compact-team-title">
          <span className="eyebrow-label">Leaders</span>
          <h2>Meet Your Mentors</h2>
          <p>Our leaders bring years of experience building automation systems, CRM infrastructures, and AI-powered workflows for growth-focused businesses.</p>
        </div>
        <LeaderCardGrid leaders={leaders} />
      </div>
    </section>
  )
}

function ExpertsSection() {
  const [experts, setExperts] = useState([])
  useEffect(() => { fetchTeamPageExperts().then(setExperts) }, [])
  if (!experts.length) return null
  return (
    <section className="section section-white experts-section">
      <div className="container">
        <div className="section-title centered experts-section-title">
          <span className="eyebrow-label">Meet The Experts</span>
          <h2>Specialists supporting the work behind the scenes.</h2>
          <p>Focused team members supporting design, systems, delivery, and execution across GHL Prime projects.</p>
        </div>
        <div className="experts-grid">
          {experts.map((member, index) => (
            <motion.article
              key={member.id || member.name}
              className="expert-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <div className="expert-card-image-wrap">
                <img src={member.image_url} alt={member.name} className="expert-card-image" />
              </div>
              <div className="expert-card-body">
                <h3>{member.name}</h3>
                <p>{member.title}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function safeSlug(slug) {
  if (!slug) return ''
  return String(slug).replace(/^case-studies\//, '').replace(/^\/+/, '')
}

export default function HomePage() {
  const [activePill, setActivePill] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePill((current) => (current + 1) % rotatingPills.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Helmet>
        <title>GoHighLevel Experts for Agencies | GHL Prime</title>
        <meta name="description" content="Hire a dedicated GoHighLevel AI automation team to set up your CRM, automations, and AI agents — built for agencies and Local Businesses. GHL-certified, US-based, 24/7 support." />
        <meta name="keywords" content="GoHighLevel experts, hire GoHighLevel team, GoHighLevel agency, GHL automation, GoHighLevel CRM setup, white-label GoHighLevel support, AI agents, GHL Prime" />
        <link rel="canonical" href="https://ghlprime.com/" />
        <meta property="og:title" content="GoHighLevel Experts for Agencies | GHL Prime" />
        <meta property="og:description" content="Hire a dedicated GoHighLevel AI automation team to set up your CRM, automations, and AI agents — built for agencies and Local Businesses. GHL-certified, US-based, 24/7 support." />
        <meta property="og:url" content="https://ghlprime.com/" />
        <meta property="og:image" content="https://ghlprime.com/og-home.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:image" content="https://ghlprime.com/og-home.png" />
        <meta name="twitter:title" content="GoHighLevel Experts for Agencies | GHL Prime" />
        <meta name="twitter:description" content="Hire a dedicated GoHighLevel AI automation team to set up your CRM, automations, and AI agents — built for agencies and Local Businesses. GHL-certified, US-based, 24/7 support." />
        <meta name="last-modified" content="2026-05-24" />
        <script type="application/ld+json">{JSON.stringify(buildHomepageSchemas())}</script>
      </Helmet>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'GHL Prime',
          image: 'https://ghlprime.com/ghl-prime-logo.png',
          url: 'https://ghlprime.com',
          email: 'info@ghlprime.com',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Albuquerque',
            addressRegion: 'NM',
            postalCode: '87110',
            addressCountry: 'US',
          },
          areaServed: 'US',
          priceRange: '$$',
        })}</script>
      </Helmet>

      <HomeSeoShell />

      <section className="hero container homepage-hero-redesign homepage-hero-v2">
        <motion.div className="hero-copy homepage-hero-copy homepage-hero-copy-v2" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
          <motion.div className="rotating-hero-pill" variants={fadeUp} key={activePill}>{rotatingPills[activePill]}</motion.div>
          <motion.h1 variants={fadeUp}>
            Hire a Dedicated Team of{' '}
            <span className="homepage-hero-ghl-inline">
              <span className="homepage-hero-ghl-word"><span className="ghl-go">Go</span><span className="ghl-high">High</span><span className="ghl-level">Level</span></span>
            </span>
            <br />
            <span className="homepage-hero-ghl-inline">
              <span>Automation</span>
            </span>{' '}
            Experts for
            <br />
            Your Agency and Local Business.
          </motion.h1>
          <motion.p className="speakable-intro" variants={fadeUp}>GHL Prime is a specialist expert team you hire to run the technical side of your agency — GHL builds, automation workflows, AI agents, vibe coding, and 24/7 client support. All under your brand.</motion.p>
          <motion.div className="hero-cta homepage-hero-cta" variants={fadeUp}>
            <a href="https://www.upwork.com/agencies/ghlprime/" target="_blank" rel="noopener noreferrer" className="primary-pill large">Hire Your Expert Team</a>
            <Link to="/services" className="secondary-pill">See What We Do</Link>
          </motion.div>
        </motion.div>
      </section>

      <TrustedLogosSection />
      <WhatWeAreSection />
      <LifeAtGHL/>
      <TeamTestimonials />
      <WhatWeHandleSection />
      <AgencyNeedsSection />
      <TrainingSection />
      <VibeCodingSection />
      <WhyChooseSection />
      <LeadersSection />
      <CertificationsSection />
      <section className="section section-white">
        <div className="container">
          <h2>What GoHighLevel certifications does GHL Prime hold?</h2>
          <p>GHL Prime holds official GoHighLevel certifications including Certified Admin — the highest certification available on the platform — plus A2P Compliance, HIPAA Compliance, AI Employee, SaaS Mode, and 7 additional specializations.</p>
        </div>
      </section>
      <ExpertsSection />
      <CaseStudiesSection />
      <ShippedEvidenceSection pageKey="home" />
      <FinalCtaSection />
      <FaqSection faqs={HOMEPAGE_FAQS} intro="Common questions from agencies and founders before they engage GHL Prime." />
      <SiteFooter />
    </>
  )
}
