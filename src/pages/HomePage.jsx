import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
import { fetchGalleryImages } from '../lib/galleryApi'
import { fetchCaseStudies } from '../lib/caseStudiesApi'
import ShippedEvidenceSection from '../components/ShippedEvidenceSection'
import { ArrowRight, Bot, BrainCircuit, CalendarCheck2, ChevronLeft, ChevronRight, Clock3, Code2, Contact, GraduationCap, Headphones, LayoutGrid, Rocket, Share2, ShieldCheck, TrendingUp, UserPlus, Users, Workflow, Wrench, X } from 'lucide-react'
import LifeAtGHL from '../components/home-page/LifeAtGHL'
import TeamTestimonials from '../components/home-page/TeamTestimonials'
import TrainingOnboarding from '../components/home-page/TrainingOnboarding'
import VibeCoding from '../components/home-page/VibeCoding'
import HeroAutomationCore from '../components/hero/HeroAutomationCore'
import HeroStatsBar from '../components/hero/HeroStatsBar'
import { div } from 'framer-motion/client'

const SITE_URL = 'https://ghlprime.com'
const HOMEPAGE_LAST_MODIFIED = '2026-05-24'

const HOMEPAGE_SERVICES = [
  {
    name: 'GoHighLevel Setup & Sub-Account Configuration',
    description: 'Complete CRM setup from scratch  sub-accounts, pipelines, calendars, forms, and integrations configured for agency and SaaS use.',
    url: SITE_URL + '/services#setup',
  },
  {
    name: 'Automation Workflow Builds',
    description: 'End-to-end build, audit, and repair of GoHighLevel automation workflows so every lead is captured, nurtured, and followed up automatically.',
    url: SITE_URL + '/services#automation',
  },
  {
    name: 'AI Agents & Voice Receptionists',
    description: 'AI agents that qualify leads, answer inquiries, run AI call centers, and book meetings 24/7  deployed directly inside GoHighLevel.',
    url: SITE_URL + '/services#ai-agents',
  },
  {
    name: '24/7 White-Label Client Support',
    description: 'Round-the-clock GoHighLevel expert support delivered under your agency brand  your clients never know we exist.',
    url: SITE_URL + '/services#white-label-support',
  },
  {
    name: 'White-Label SaaS CRM Launch',
    description: 'Fully white-labeled GoHighLevel SaaS setups  branded sub-accounts, Stripe + Twilio configuration, and client-ready onboarding flows.',
    url: SITE_URL + '/services#saas-launch',
  },
  {
    name: 'API Integrations',
    description: 'Connect GoHighLevel to Zapier, Slack, Google Workspace, custom CRMs, databases, and any platform with an API  including custom integrations when no native option exists.',
    url: SITE_URL + '/services#integrations',
  },
  {
    name: 'Vibe Coding & Custom Development',
    description: 'AI-assisted custom development for anything GoHighLevel cannot do natively  custom dashboards, bespoke integrations, and unique automation logic.',
    url: SITE_URL + '/services#custom-development',
  },
  {
    name: 'Team Training & SOP Support',
    description: 'System walkthroughs, technical deep-dive sessions, and SOP documentation so your team can confidently run the platform after handoff.',
    url: SITE_URL + '/services#training',
  },
]

const HOMEPAGE_HOWTO_STEPS = [
  { name: 'System Walkthrough & Handoff', text: 'We walk you through everything we have built  how it works, why it is set up that way, and how to use it confidently with your clients.' },
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
      description: 'Hire a dedicated GoHighLevel AI automation team to set up your CRM, automations, and AI agents built for agencies and Local Businesses. GHL-certified, US-based, 24/7 support.',
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
        <motion.div className="section-title centered trust-band-title" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
          <span className="eyebrow-label">Trusted environment</span>
          <h2>Trusted by agencies and <span className="hl">growth-focused businesses</span></h2>
          <p>Built for companies that want their CRM, automation, and client journey to feel more premium and more intentional.</p>
        </motion.div>
        <div className="logo-marquee-shell">
          {imageOnlyLogos.length ? <LogoMarqueeRow items={imageOnlyLogos} /> : null}
        </div>
      </div>
    </section>
  )
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

// TODO: slides are pulled from Admin > Gallery (fetchGalleryImages). The list
// below is the fallback used until at least two gallery images exist, so the
// slider is never stuck on a single frame -- /who-we-are.jpg stays first so
// the section looks identical to before on its opening frame.
const WHAT_WE_ARE_FALLBACK_SLIDES = [

  { id: 'wwa-ph-1', image_url: '/GHL Organized FIle (1).png', title: 'The GHL Prime team' },
  { id: 'wwa-ph-2', image_url: '/GHL Organized FIle (2).png', title: 'The GHL Prime team' },
  { id: 'wwa-ph-3', image_url: '/GHL Organized FIle (3).png', title: 'The GHL Prime team' },
]

const WWA_SLIDE_MS = 4200
const WWA_MAX_SLIDES = 5

// Frame shape, derived from each photo (see `ratio` in the slider below).
// The default matches the original static image so the very first paint is
// unchanged; the clamps stop a stray portrait/panorama upload from making
// the card wildly taller or wider than the copy beside it.
const WWA_DEFAULT_RATIO = 1080 / 962
const WWA_MIN_RATIO = 0.72
const WWA_MAX_RATIO = 1.9

function WhatWeAreSlider() {
  const [slides, setSlides] = useState(WHAT_WE_ARE_FALLBACK_SLIDES)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  // The frame takes its shape from the photo rather than the other way round.
  // With a fixed ratio, a portrait image could only fit by height, leaving
  // bars down both sides -- matching the ratio is the only way to get full
  // width AND full height with nothing cropped and nothing stretched.
  const [ratio, setRatio] = useState(WWA_DEFAULT_RATIO)
  const ratioCache = useRef({})

  const rememberRatio = useCallback((src, width, height) => {
    if (!width || !height) return
    // Clamped so an unusually tall or wide upload can't blow the section's
    // proportions out next to the fixed-width copy column.
    const next = Math.min(Math.max(width / height, WWA_MIN_RATIO), WWA_MAX_RATIO)
    ratioCache.current[src] = next
    return next
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(query.matches)
    const onChange = (event) => setReducedMotion(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    let active = true
    fetchGalleryImages().then((images) => {
      if (!active) return
      const usable = (images || []).filter((img) => img?.image_url).slice(0, WWA_MAX_SLIDES)
      // Only take over from the fallback once there's actually enough to
      // slide through -- one gallery image would leave a dead carousel.
      if (usable.length >= 2) setSlides(usable)
    })
    return () => { active = false }
  }, [])

  const count = slides.length

  useEffect(() => {
    if (paused || reducedMotion || count < 2) return undefined
    // `index` is a dependency on purpose: it restarts the countdown after a
    // manual dot click so the next auto-advance isn't cut short.
    const id = setInterval(() => setIndex((i) => (i + 1) % count), WWA_SLIDE_MS)
    return () => clearInterval(id)
  }, [paused, reducedMotion, count, index])

  // Warm the next image so the crossfade doesn't start against a blank frame
  // (only one slide is mounted at a time, so the browser wouldn't otherwise
  // fetch it until the swap has already begun). Measuring it here also means
  // its aspect ratio is already cached before it becomes the active slide.
  useEffect(() => {
    if (count < 2) return
    const nextSrc = slides[(index + 1) % count].image_url
    const next = new Image()
    next.onload = () => rememberRatio(nextSrc, next.naturalWidth, next.naturalHeight)
    next.src = nextSrc
  }, [index, count, slides])

  const active = slides[index]

  // Apply a cached ratio the moment the slide changes, so a revisited image
  // resizes the frame instantly rather than waiting on another load event.
  useEffect(() => {
    const cached = ratioCache.current[active?.image_url]
    if (cached) setRatio(cached)
  }, [active])

  return (
    <div
      className="what-we-are-image-card what-we-are-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="wwa-stage" style={{ aspectRatio: ratio }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id || active.image_url}
            className="wwa-slide"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: reducedMotion ? 0 : 0.85, ease: 'easeInOut' },
          
              scale: { duration: reducedMotion ? 0 : 7, ease: 'linear' },
            }}
          >
            {/* Blurred copy of the same file fills the box edge to edge so the
                contained photo above never sits on empty letterbox bars. Same
                URL, so it costs no extra network request. */}
            <img src={active.image_url} alt="" aria-hidden="true" className="wwa-slide-bg" decoding="async" />
            <img
              src={active.image_url}
              alt={active.title || 'The GHL Prime team'}
              className="wwa-slide-img"
              decoding="async"
              onLoad={(event) => {
                const measured = rememberRatio(
                  active.image_url,
                  event.currentTarget.naturalWidth,
                  event.currentTarget.naturalHeight,
                )
                if (measured) setRatio(measured)
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            className="wwa-arrow prev"
            aria-label="Previous image"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="wwa-arrow next"
            aria-label="Next image"
            onClick={() => setIndex((i) => (i + 1) % count)}
          >
            <ChevronRight size={18} />
          </button>
          <div className="wwa-dots">
            {slides.map((slide, i) => (
              <button
                key={slide.id || slide.image_url}
                type="button"
                className={`wwa-dot ${i === index ? 'is-active' : ''}`}
                aria-label={`Show image ${i + 1} of ${count}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

const WHAT_WE_ARE_FEATURES = [
  { title: '24/7 Support', text: 'Always available when you need us', icon: Headphones, tone: 'blue' },
  { title: 'Expert Team', text: 'Specialists in GHL & automation', icon: Users, tone: 'green' },
  { title: 'Client Growth', text: 'We train, support & help you scale', icon: GraduationCap, tone: 'purple' },
]

function WhatWeAreSection() {
  return (
    <section className="section what-we-are-section">
      <div className="wwa-dot-grid" aria-hidden="true" />
      <div className="container what-we-are-layout">
        <div className="what-we-are-copy">
          <motion.div
            className="wwa-eyebrow-row"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.45 }}
          >
            <span className="eyebrow-label">What We Actually Are</span>
            {/* <span className="wwa-eyebrow-rule" aria-hidden="true" /> */}
          </motion.div>

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
            Agencies and SaaS founders hire GHL Prime as their dedicated back-office: handling all the technical work, supporting their clients <span className="wwa-lede-hl">24/7</span>, and training them to grow.
          </motion.p>

          <motion.div
            className="wwa-features"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}
          >
            {WHAT_WE_ARE_FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                className={`wwa-feature tone-${feature.tone}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <div className="wwa-feature-icon">
                  <feature.icon size={22} />
                </div>
                <strong>{feature.title}</strong>
                <p>{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <WhatWeAreSlider />
        </motion.div>
      </div>
    </section>
  )
}


function WhatWeHandleSection() {
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

function WhyChooseSection() {
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
            <h2>Real Work. <span>Real Results.</span></h2>
            <p>Real client wins from agencies, SaaS founders, and businesses that shipped with the GHL Prime team working behind the scenes.</p>
          </div>
        </div>

        <div className="case-studies-grid">
          {caseStudies.map((study, index) => renderCard(study, index))}
        </div>

        <Link to="/case-studies" className="secondary-pill case-studies-reference-cta">View All Case Studies</Link>
      </div>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section className="section final-cta-section">
      <div className="container">
        <motion.div
          className="final-cta-card premium-final-cta"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          {/* Decorative light sources -- see .premium-final-cta in App.css. */}
          <span className="cta-glow one" aria-hidden="true" />
          <span className="cta-glow two" aria-hidden="true" />

          <div className="premium-cta-inner">
            {/* Primary mark (navy lettering) -- the one that reads on the
                light panel. The /footer-logo.png variant is the light-text
                version reserved for dark surfaces. */}
            <img src="/ghl-prime-logo.png" alt="GHL Prime" className="premium-cta-logo" />

            <span className="cta-label">Ready to scale delivery without doing it all yourself?</span>
            <h2>You Close the Clients. We Handle Everything Else.</h2>

            <div className="final-cta-actions homepage-final-cta-actions">
              <Link to="/booking" className="primary-pill large homepage-cta-btn">
                Get a free consultation
                <ArrowRight size={17} />
              </Link>
              <Link to="/services" className="secondary-pill homepage-cta-btn secondary-homepage-cta-btn">See What We Do</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function LeadersSection() {
  const [leaders, setLeaders] = useState([])
  useEffect(() => { fetchTeamMembers().then(setLeaders) }, [])
  
  return (
    <section className="section section-white mentor-showcase-section leader-card-section">
      <div className="container">
        <div className="section-title centered compact-team-title">
          <span className="eyebrow-label">Leaders</span>
          <h2>Meet <span className="hl">Your Mentors</span></h2>
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

  return (
    <section className="section section-white experts-section">
      <div className="container">
        <div className="section-title centered experts-section-title">
          <span className="eyebrow-label">Meet The Experts</span>
          <h2>Specialists supporting the work <span className="hl">behind the scenes.</span></h2>
          <p>Focused team members supporting design, systems, delivery, and execution across GHL Prime projects.</p>
        </div>
    {  !experts.length ?  <div> failed to fetch teams</div> :  <div className="experts-grid">
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
        </div>}
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
        <meta name="description" content="Hire a dedicated GoHighLevel AI automation team to set up your CRM, automations, and AI agents  built for agencies and Local Businesses. GHL-certified, US-based, 24/7 support." />
        <meta name="keywords" content="GoHighLevel experts, hire GoHighLevel team, GoHighLevel agency, GHL automation, GoHighLevel CRM setup, white-label GoHighLevel support, AI agents, GHL Prime" />
        <link rel="canonical" href="https://ghlprime.com/" />
        <meta property="og:title" content="GoHighLevel Experts for Agencies | GHL Prime" />
        <meta property="og:description" content="Hire a dedicated GoHighLevel AI automation team to set up your CRM, automations, and AI agents  built for agencies and Local Businesses. GHL-certified, US-based, 24/7 support." />
        <meta property="og:url" content="https://ghlprime.com/" />
        <meta property="og:image" content="https://ghlprime.com/og-home.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:image" content="https://ghlprime.com/og-home.png" />
        <meta name="twitter:title" content="GoHighLevel Experts for Agencies | GHL Prime" />
        <meta name="twitter:description" content="Hire a dedicated GoHighLevel AI automation team to set up your CRM, automations, and AI agents  built for agencies and Local Businesses. GHL-certified, US-based, 24/7 support." />
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


      <section className="hero container homepage-hero-v3">
        {/* <div className="hh-ambient" aria-hidden="true">
          <span className="hh-aurora a" />
          <span className="hh-aurora b" />
          <span className="hh-aurora c" />
          <span className="hh-noise" />
        </div> */}

        <div className="hh-grid">
          <div className="hero-copy hh-copy">
            <div className="hh-pill-slot">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePill}
                  className="rotating-hero-pill hh-pill"
                  initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                >
                  {rotatingPills[activePill]}
                </motion.div>
              </AnimatePresence>
            </div>

            <h1>
        
              <span className="hh-line">Hire a Dedicated Team of{' '}</span>
             
              <span className="hh-line">
                <span className="homepage-hero-ghl-inline">
                  <span className="homepage-hero-ghl-word"><span className="ghl-go">Go</span><span className="ghl-high">High</span><span className="ghl-level">Level</span></span>
                  <span className="hh-accent-word">Automation<span className="hh-accent-sweep" aria-hidden="true" /></span>{' '}
                </span>
              </span>
              <span className="hh-line">
               
                Experts for Your Agency
              </span>
              <span className="hh-line"> and Local Business.</span>

            </h1>

            <p className="speakable-intro hh-lede">GHL Prime is a specialist expert team you hire to run the technical side of your agency  GHL builds, automation workflows, AI agents, vibe coding, and 24/7 client support. All under your brand.</p>

            <div className="hero-cta hh-cta">
              <a href="https://www.upwork.com/agencies/ghlprime/" target="_blank" rel="noopener noreferrer" className="primary-pill large hh-cta-primary">
                Hire Your Expert Team
                <ArrowRight size={17} />
              </a>
              <Link to="/services" className="secondary-pill hh-cta-ghost">
                See What We Do
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <HeroAutomationCore />
        </div>
      </section>

      <HeroStatsBar />
      <TrustedLogosSection />
      <WhatWeAreSection />
      <LifeAtGHL/>
      <TeamTestimonials />
      <WhatWeHandleSection />
      <AgencyNeedsSection />
      <TrainingOnboarding />
      <VibeCoding />
      <WhyChooseSection />
     
      <LeadersSection />
      <CertificationsSection />
      <section className="section section-white">
        <div className="container">
          <h2>What GoHighLevel certifications does GHL Prime hold?</h2>
          <p>GHL Prime holds official GoHighLevel certifications including Certified Admin  the highest certification available on the platform  plus A2P Compliance, HIPAA Compliance, AI Employee, SaaS Mode, and 7 additional specializations.</p>
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
