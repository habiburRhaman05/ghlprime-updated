'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Handshake,
  Network,
  Orbit,
  Puzzle,
} from 'lucide-react'
import SiteFooter from '../components/SiteFooter'
import FaqSection from '../components/FaqSection'
import { ABOUT_FAQS } from '../data/faqs'
import { fetchTeamPageExperts } from '../lib/teamApi'
import ScrollProgress from '../components/motion3d/ScrollProgress'
import { DepthCard } from '../components/motion3d/Depth'
import '../components/pages-v2/pages-v2.css'
import '../components/pages-v2/immersive.css'
import '../components/pages-v2/about-v2.css'

// Hand-drawn marks for the separation-reason cards, each with a living
// detail: a crosshair whose reticle spins while the lock dot pulses, a gem
// swaying under sparkles, and a gauge whose needle keeps hunting for more
// speed. Loops are pure CSS (see immersive.css).
function AvSvg({ size = 22, children }) {
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

const IconFocusLock = ({ size }) => (
  <AvSvg size={size}>
    <g className="av-spin">
      <circle cx="12" cy="12" r="7.6" strokeDasharray="3.1 2.5" />
    </g>
    <path d="M12 2.4v2.6M12 19v2.6M2.4 12H5M19 12h2.6" />
    <circle className="av-pulse" cx="12" cy="12" r="1.9" fill="currentColor" stroke="none" />
  </AvSvg>
)

const IconPremiumGem = ({ size }) => (
  <AvSvg size={size}>
    <g className="av-sway">
      <path d="M7.2 4h9.6l3.6 5L12 20 3.6 9z" />
      <path d="M3.6 9h16.8M7.2 4l2.4 5L12 20m2.4-11L16.8 4" opacity=".62" />
    </g>
    <path className="av-spark" d="M20.6 2.6l.44 1.2 1.2.44-1.2.44-.44 1.2-.44-1.2-1.2-.44 1.2-.44z" fill="currentColor" stroke="none" />
    <circle className="av-spark s2" cx="2.9" cy="15.6" r=".85" fill="currentColor" stroke="none" />
  </AvSvg>
)

const IconSpeedGauge = ({ size }) => (
  <AvSvg size={size}>
    <path d="M4 17a8 8 0 0 1 16 0" />
    <g className="av-gauge">
      <path d="M12 17V9.4" />
      <circle cx="12" cy="9.4" r=".95" fill="currentColor" stroke="none" />
    </g>
    <circle className="av-pulse" cx="12" cy="17" r="1.55" fill="currentColor" stroke="none" />
  </AvSvg>
)

// Principle-row marks for the ledger: a lead riding the delivery route,
// server slats blinking activity, focus brackets hunting their subject, a
// compute chip with a pulsing core, and a trust shield redrawing its check.
const IconPathRider = ({ size }) => (
  <AvSvg size={size}>
    <path d="M4.6 18.8C13 18.8 11 5.2 19.4 5.2" opacity=".9" />
    <circle cx="4.6" cy="18.8" r="1.7" />
    <rect x="17.6" y="3.4" width="3.6" height="3.6" rx=".95" />
    <circle className="av-pathdot" r="1.4" fill="currentColor" stroke="none">
      <animateMotion dur="2.4s" repeatCount="indefinite" path="M4.6 18.8C13 18.8 11 5.2 19.4 5.2" />
    </circle>
  </AvSvg>
)

const IconServerLeds = ({ size }) => (
  <AvSvg size={size}>
    <rect x="3.6" y="4" width="16.8" height="4.6" rx="1.4" />
    <rect x="3.6" y="9.9" width="16.8" height="4.6" rx="1.4" />
    <rect x="3.6" y="15.8" width="16.8" height="4.6" rx="1.4" />
    <path d="M6.6 6.3h4M6.6 12.2h4M6.6 18.1h4" opacity=".55" />
    <circle className="av-led l1" cx="17" cy="6.3" r="1" fill="currentColor" stroke="none" />
    <circle className="av-led l2" cx="17" cy="12.2" r="1" fill="currentColor" stroke="none" />
    <circle className="av-led l3" cx="17" cy="18.1" r="1" fill="currentColor" stroke="none" />
  </AvSvg>
)

const IconFocusFrame = ({ size }) => (
  <AvSvg size={size}>
    <g className="av-bracket b1"><path d="M3.4 8V4.9a1.5 1.5 0 0 1 1.5-1.5H8" /></g>
    <g className="av-bracket b2"><path d="M16 3.4h3.1a1.5 1.5 0 0 1 1.5 1.5V8" /></g>
    <g className="av-bracket b3"><path d="M20.6 16v3.1a1.5 1.5 0 0 1-1.5 1.5H16" /></g>
    <g className="av-bracket b4"><path d="M8 20.6H4.9a1.5 1.5 0 0 1-1.5-1.5V16" /></g>
    <circle className="av-pulse" cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </AvSvg>
)

const IconAiChip = ({ size }) => (
  <AvSvg size={size}>
    <rect x="6.9" y="6.9" width="10.2" height="10.2" rx="2.1" />
    <path d="M9.6 6.9V4.3M14.4 6.9V4.3M9.6 19.7v-2.6M14.4 19.7v-2.6M6.9 9.6H4.3M6.9 14.4H4.3M19.7 9.6h-2.6M19.7 14.4h-2.6" opacity=".75" />
    <circle className="av-pulse" cx="12" cy="12" r="1.85" fill="currentColor" stroke="none" />
  </AvSvg>
)

const IconShieldCheck = ({ size }) => (
  <AvSvg size={size}>
    <path d="M12 2.9l7 2.5v5.3c0 4.6-3 7.9-7 9.4-4-1.5-7-4.8-7-9.4V5.4z" />
    <path className="av-checkdraw" pathLength="100" d="M8.7 11.9l2.3 2.3 4.3-4.5" strokeWidth="2" />
  </AvSvg>
)

const separationReasons = [
  {
    icon: IconFocusLock,
    tone: 'ic-sky',
    title: 'Hyper-Focused Positioning',
    text: 'We wanted GHL Prime to feel specific, sharp, and fully centered around GoHighLevel systems, AI agents, and automation workflows.',
  },
  {
    icon: IconPremiumGem,
    tone: 'ic-violet',
    title: 'A Premium Service Experience',
    text: 'The brand exists to present backend systems work with more clarity, stronger design, and a cleaner premium offer structure.',
  },
  {
    icon: IconSpeedGauge,
    tone: 'ic-amber',
    title: 'Built For Faster Innovation',
    text: 'Separating the brand created room to move faster with niche services, AI workflows, and highly specialized automation offers.',
  },
]

const octopiChecklist = [
  { icon: Handshake, tone: 'ic-sky', text: 'Operational support behind delivery' },
  { icon: Puzzle, tone: 'ic-violet', text: 'Cross-functional implementation capability' },
  { icon: Network, tone: 'ic-amber', text: 'Marketing + automation + technical alignment' },
  { icon: Orbit, tone: 'ic-emerald', text: 'A stronger execution ecosystem behind the niche brand' },
]

const beliefs = [
  {
    icon: IconPathRider,
    tone: 'ic-sky',
    title: 'Systems Should Support Growth',
    text: 'The right CRM and automation setup should reduce friction, improve speed, and help the business scale without chaos.',
  },
  {
    icon: IconServerLeds,
    tone: 'ic-indigo',
    title: 'Backend Matters As Much As Frontend',
    text: 'A clean backend improves team performance, customer experience, and the overall perceived quality of the brand.',
  },
  {
    icon: IconFocusFrame,
    tone: 'ic-violet',
    title: 'Clarity Beats Complexity',
    text: 'We prefer systems that are easier to understand, easier to manage, and easier to improve over time.',
  },
  {
    icon: IconAiChip,
    tone: 'ic-teal',
    title: 'AI Should Be Useful',
    text: 'We apply AI where it genuinely improves responsiveness, qualification, and automation performance.',
  },
  {
    icon: IconShieldCheck,
    tone: 'ic-emerald',
    title: 'Execution Quality Builds Trust',
    text: 'Good work is not only about what gets delivered, but how clearly, consistently, and reliably it performs afterwards.',
  },
]

const trustParagraphs = [
  'GHL Prime is built on a simple premise: agencies should not have to choose between technical depth and business growth. Most agency owners are strong at sales, client relationships, and strategy but the backend of a GoHighLevel operation is a full-time job on its own. CRM configuration, automation logic, AI agent deployment, client support, and custom development all require specialized expertise that is expensive to hire in-house and unreliable to source from freelancers.',
  'GHL Prime was founded to solve exactly that. We are a GHL-only team we do not generalize across platforms or dilute our expertise across fifty different tools. Every specialist on our team works exclusively in the GoHighLevel ecosystem, which means we build faster, troubleshoot better, and deliver results that a generalist freelancer simply cannot match.',
  'Our Certified Admin badge is the highest-level GoHighLevel certification available. Combined with our 10 specialty certifications including HIPAA Compliance, A2P, AI Employee, and SaaS Mode we carry the formal credentials to back every claim we make about our capabilities.',
  'We operate fully white-labeled, which means your clients never know we exist. Your agency is the front door. We are the engine room. That is how it is supposed to work.',
]

const SPRING = { type: 'spring', stiffness: 86, damping: 18, mass: 0.85 }

// Hero copy arrives out of depth line by line. staggerChildren needs variants
// on both ends, so the column carries the timing and each line the movement.
const heroStack = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } } }
const heroLine = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
}
const heroLineProps = { variants: heroLine }

export default function AboutPage() {
  const [experts, setExperts] = useState([])

  useEffect(() => {
    fetchTeamPageExperts().then(setExperts)
  }, [])

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.16], [0, -60])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.13], [1, 0])

  return (
    <main className="about-page pv2 av">
      <ScrollProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com' },
            { '@type': 'ListItem', position: 2, name: 'About', item: 'https://ghlprime.com/about' },
          ],
        }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { '@context': 'https://schema.org', '@type': 'Person', name: 'Jewel Rana', image: 'https://assets.cdn.filesafe.space/j53xn6YJHwIdPImV00rn/media/69a7daecb701feb9ee7f20f7.png', jobTitle: 'CEO & Co-Founder', worksFor: { '@type': 'Organization', name: 'GHL Prime', url: 'https://ghlprime.com' }, sameAs: ['https://www.linkedin.com/in/thejewelrana/','https://www.facebook.com/thenewjewel','https://www.bokaboss.com/'] },
          { '@context': 'https://schema.org', '@type': 'Person', name: 'Niyamul Islam Sajal', image: 'https://assets.cdn.filesafe.space/j53xn6YJHwIdPImV00rn/media/69a7daec618c8d0100ae531c.png', jobTitle: 'COO & Co-Founder', worksFor: { '@type': 'Organization', name: 'GHL Prime', url: 'https://ghlprime.com' }, sameAs: ['https://www.linkedin.com/in/niyamulislam/','https://www.facebook.com/niaymul.islam.2025/'] },
        ]) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          '@id': 'https://ghlprime.com/about#webpage',
          url: 'https://ghlprime.com/about',
          name: 'About GHL Prime Your GoHighLevel Backend Team',
          description: 'GHL Prime is a dedicated GoHighLevel agency built to serve other agencies. Strategy-led delivery, GHL-certified specialists, and fully white-labeled execution.',
          inLanguage: 'en-US',
          isPartOf: { '@id': 'https://ghlprime.com/#website' },
          about: { '@id': 'https://ghlprime.com/#organization' },
          datePublished: '2024-08-01',
          dateModified: '2026-05-24',
          speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.pv2-lede', '.faq2-q-text', '.faq2-a'] },
        }) }} />

      {/* ---------------------------------------------------------------- hero */}
      <section className="pv2-section is-tint pv2-hero av-hero">
        <span className="pv2-bloom one" aria-hidden="true" />
        <span className="pv2-bloom two" aria-hidden="true" />

        <motion.div className="pv2-inner" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div variants={heroStack} initial="hidden" animate="show">
            <motion.span className="pv2-eyebrow" {...heroLineProps}>About Us</motion.span>
            <motion.h1 {...heroLineProps}>Built For One Thing: GoHighLevel Growth Systems</motion.h1>
            <motion.p className="pv2-lede" {...heroLineProps}>
              GHL Prime exists to help businesses build better CRM structure, smarter automation, stronger follow-up,
              and a more premium backend growth system powered by GoHighLevel.
            </motion.p>
            <motion.div className="pv2-actions" {...heroLineProps}>
              <Link href="/services" className="primary-pill large">Explore Services</Link>
              <Link href="/booking" className="secondary-pill large">Get a free consultation</Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ------------------------------------------- why a separate brand */}
      <section className="pv2-section is-white">
        <div className="pv2-inner">
          <motion.div
            className="pv2-head centered"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={SPRING}
          >
            <span className="pv2-eyebrow">Why We Created A Separate Brand</span>
            <h2>Focused. Clear. Built for a <span className="pv2-hl">specific kind of client need.</span></h2>
            <p>GHL Prime was created as a distinct brand so the service offering could feel sharper, more intentional, and more specialized.</p>
          </motion.div>

          {/* A staircase rather than a row: each card sits a step lower than
              the one before it, so the three read in order. */}
          <div className="av-shelf">
            {separationReasons.map(({ icon: Icon, tone, title, text }, i) => (
              <DepthCard className={`av-card ${tone}`} key={title} index={i} columns={3}>
                <span className="av-card-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="ic ic-lg m3d-l3"><Icon size={22} /></span>
                <h3 className="m3d-l2">{title}</h3>
                <p className="m3d-l1">{text}</p>
              </DepthCard>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- octopi */}
      <section className="pv2-section is-paper">
        <div className="pv2-inner">
          <motion.div
            className="pv2-head centered"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={SPRING}
          >
            <span className="pv2-eyebrow">Powered By A Stronger Ecosystem</span>
            <h2>Backed by Octopi Digital a broader <span className="pv2-hl">digital growth and technology company.</span></h2>
            <p>
              While GHL Prime focuses specifically on GoHighLevel, AI, and automation, it is supported by the broader execution strength of Octopi Digital.
              That means more operational support, more implementation depth, and a stronger environment for delivering real systems work.
            </p>
          </motion.div>

          <motion.div
            className="av-plaque"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={SPRING}
          >
            <span className="av-plaque-mark">
              <img src="/ODL%20logo.webp" alt="Octopi Digital" />
            </span>
            <div>
              <strong>Octopi Digital</strong>
              <p>Growth systems, execution support, and a stronger operational foundation behind GHL Prime.</p>
            </div>
          </motion.div>

          <div className="av-eco-list">
            {octopiChecklist.map(({ icon: Icon, tone, text }, i) => (
              <DepthCard className={`av-eco-item ${tone}`} key={text} index={i} columns={4} lift={34}>
                <span className="ic ic-sm m3d-l2"><Icon size={17} /></span>
                <span className="m3d-l1">{text}</span>
              </DepthCard>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- beliefs */}
      <section className="pv2-section is-white">
        <div className="pv2-inner">
          <motion.div
            className="pv2-head centered"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={SPRING}
          >
            <span className="pv2-eyebrow">What We Believe</span>
            <h2>The principles behind <span className="pv2-hl">how we build.</span></h2>
            <p>These ideas shape the way GHL Prime approaches systems, automation, design quality, and client delivery.</p>
          </motion.div>

          {/* A ledger rather than a timeline: five rows on one rule, each one
              arriving out of depth as it scrolls into view. */}
          <div className="av-ledger">
            {beliefs.map(({ icon: Icon, tone, title, text }, i) => (
              <motion.div
                className={`av-row ic-hover ${tone}`}
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ ...SPRING, delay: (i % 3) * 0.06 }}
              >
                <span className="av-row-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="ic"><Icon size={19} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- experts */}
      <section className="pv2-section is-paper">
        <div className="pv2-inner">
          <motion.div
            className="pv2-head centered"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={SPRING}
          >
            <span className="pv2-eyebrow">Our Experts</span>
            <h2>The team supporting <span className="pv2-hl">delivery behind the scenes.</span></h2>
            <p>Certified GoHighLevel specialists, automation engineers, and support leads who deliver the builds behind our client work.</p>
          </motion.div>

          <div className="pv2-experts">
            {experts.map((member, index) => (
              <motion.div
                className="pv2-expert iv-expert-static"
                key={member.id || member.name}
                initial={{ opacity: 0, rotateX: -34, y: 22 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                style={{ transformOrigin: 'top center', transformPerspective: 1000 }}
                transition={{ ...SPRING, delay: (index % 5) * 0.07 }}
              >
                <span className="iv-expert-photo">
                  <img src={member.image_url} alt={member.name} loading="lazy" decoding="async" />
                </span>
                <span className="pv2-expert-name">{member.name}</span>
                <span className="pv2-expert-role">{member.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="pv2-section is-tint">
        <div className="pv2-inner">
          <motion.div
            className="av-cta"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={SPRING}
          >
            <div className="av-cta-inner">
              <span className="pv2-eyebrow">Want the same kind of structure for your business?</span>
              <h2>Explore the services, systems, and backend strategy behind GHL Prime.</h2>
              <div className="av-cta-actions">
                <Link href="/services" className="primary-pill large">Explore Services <ArrowRight size={16} /></Link>
                <Link href="/booking" className="secondary-pill large">Get a free consultation</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------------------------------- trust */}
      <section className="pv2-section is-white" aria-labelledby="why-agencies-trust-heading">
        <div className="pv2-inner av-trust">
          <motion.div
            className="av-trust-rail"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={SPRING}
          >
            <span className="pv2-eyebrow">Why Us</span>
            <h2 id="why-agencies-trust-heading">Why Agencies <span className="pv2-hl">Trust GHL Prime</span></h2>
            <span className="av-trust-rule" aria-hidden="true" />
          </motion.div>

          <div className="av-prose">
            {trustParagraphs.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.65, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      <FaqSection faqs={ABOUT_FAQS} intro="A quick read on who we are and how we operate." />
      <SiteFooter />
    </main>
  )
}
