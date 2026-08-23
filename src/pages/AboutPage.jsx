'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Layers,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react'
import SiteFooter from '../components/SiteFooter'
import FaqSection from '../components/FaqSection'
import { ABOUT_FAQS } from '../data/faqs'
import { fetchTeamPageExperts } from '../lib/teamApi'
import Tilt from '../components/motion3d/Tilt'
import ScrollProgress from '../components/motion3d/ScrollProgress'
import { DepthScene, Layer } from '../components/motion3d/DepthScene'
import '../components/pages-v2/pages-v2.css'
import '../components/pages-v2/immersive.css'

const separationReasons = [
  {
    icon: Workflow,
    title: 'Hyper-Focused Positioning',
    text: 'We wanted GHL Prime to feel specific, sharp, and fully centered around GoHighLevel systems, AI agents, and automation workflows.',
  },
  {
    icon: LayoutGrid,
    title: 'A Premium Service Experience',
    text: 'The brand exists to present backend systems work with more clarity, stronger design, and a cleaner premium offer structure.',
  },
  {
    icon: Bot,
    title: 'Built For Faster Innovation',
    text: 'Separating the brand created room to move faster with niche services, AI workflows, and highly specialized automation offers.',
  },
]

const octopiChecklist = [
  'Operational support behind delivery',
  'Cross-functional implementation capability',
  'Marketing + automation + technical alignment',
  'A stronger execution ecosystem behind the niche brand',
]

const beliefs = [
  {
    icon: Workflow,
    title: 'Systems Should Support Growth',
    text: 'The right CRM and automation setup should reduce friction, improve speed, and help the business scale without chaos.',
  },
  {
    icon: Sparkles,
    title: 'Backend Matters As Much As Frontend',
    text: 'A clean backend improves team performance, customer experience, and the overall perceived quality of the brand.',
  },
  {
    icon: ShieldCheck,
    title: 'Clarity Beats Complexity',
    text: 'We prefer systems that are easier to understand, easier to manage, and easier to improve over time.',
  },
  {
    icon: Bot,
    title: 'AI Should Be Useful',
    text: 'We apply AI where it genuinely improves responsiveness, qualification, and automation performance.',
  },
  {
    icon: CheckCircle2,
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

const SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }

const heroStack = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }
const heroLine = {
  hidden: { opacity: 0, rotateX: -50, y: 22 },
  show: { opacity: 1, rotateX: 0, y: 0, transition: SPRING },
}
const heroLineProps = { variants: heroLine, style: { transformOrigin: 'top center', transformPerspective: 1000 } }

const orbitTiles = [
  { icon: Bot, pos: 'pos-0', depth: 1.4, delay: 0.15 },
  { icon: Workflow, pos: 'pos-1', depth: -0.7, delay: 0.3 },
  { icon: Sparkles, pos: 'pos-2', depth: 1.8, delay: 0.45 },
  { icon: ShieldCheck, pos: 'pos-3', depth: -1.1, delay: 0.6 },
  { icon: Zap, pos: 'pos-4', depth: 1.1, delay: 0.75 },
  { icon: Layers, pos: 'pos-5', depth: -1.5, delay: 0.9 },
]

function OrbitConstellation() {
  return (
    <DepthScene className="iv-orbit" strength={26}>
      <Layer depth={-0.5} className="iv-ring-slot">
        <span className="iv-spin r-a" />
      </Layer>
      <Layer depth={-1} className="iv-ring-slot">
        <span className="iv-spin r-b" />
      </Layer>
      <Layer depth={0.6} className="iv-core-wrap">
        <motion.div
          className="iv-core"
          initial={{ opacity: 0, scale: 0.55, rotateX: -40 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ ...SPRING, delay: 0.1 }}
        >
          GHL
        </motion.div>
      </Layer>
      {orbitTiles.map(({ icon: Icon, pos, depth, delay }) => (
        <Layer key={pos} depth={depth} className={`iv-tile ${pos}`}>
          <motion.span
            className="iv-tile-inner"
            initial={{ opacity: 0, scale: 0.4, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...SPRING, delay }}
          >
            <Icon size={19} />
          </motion.span>
        </Layer>
      ))}
    </DepthScene>
  )
}

function StackCard({ item, index, total, progress }) {
  const from = Math.min(0.25 + index * 0.35, 0.95)
  const to = Math.min(from + 0.4, 1)
  const settled = index === total - 1
  const scale = useTransform(progress, [from, to], [1, settled ? 1 : 0.93])
  const dim = useTransform(progress, [from, to], [1, settled ? 1 : 0.72])
  const filter = useMotionTemplate`brightness(${dim})`
  const { icon: Icon, title, text } = item

  return (
    <motion.article
      className="iv-stack-card"
      style={{ '--i': index, scale, filter }}
      initial={{ opacity: 0, rotateX: -26, y: 46 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ ...SPRING }}
    >
      <span className="iv-stack-num">{String(index + 1).padStart(2, '0')}</span>
      <div className="iv-stack-body">
        <span className="iv-stack-icon"><Icon size={20} /></span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </motion.article>
  )
}

function StackDeck({ items }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <div className="iv-stack" ref={ref}>
      {items.map((item, i) => (
        <StackCard key={item.title} item={item} index={i} total={items.length} progress={scrollYProgress} />
      ))}
    </div>
  )
}

function RevealProse({ paragraphs, dropCap = false }) {
  return (
    <div className={`pv2-prose${dropCap ? ' iv-dropcap' : ''}`}>
      {paragraphs.map((text, i) => (
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
  )
}

export default function AboutPage() {
  const [experts, setExperts] = useState([])

  useEffect(() => {
    fetchTeamPageExperts().then(setExperts)
  }, [])

  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.16], [0, -70])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.13], [1, 0])

  return (
    <main className="about-page pv2">
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
      <section className="pv2-section is-tint pv2-hero">
        <span className="pv2-grid-bg" aria-hidden="true" />
        <span className="pv2-bloom one" aria-hidden="true" />
        <span className="pv2-bloom two" aria-hidden="true" />
        <motion.div className="pv2-inner pv2-hero-grid" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div
            className="pv2-head"
            variants={heroStack}
            initial="hidden"
            animate="show"
            style={{ marginBottom: 0 }}
          >
            <motion.span className="pv2-eyebrow" {...heroLineProps}>About Us</motion.span>
            <motion.h1 {...heroLineProps}>Built For One Thing: GoHighLevel Growth Systems</motion.h1>
            <motion.p className="pv2-lede" variants={heroLine}>
              GHL Prime exists to help businesses build better CRM structure, smarter automation, stronger follow-up,
              and a more premium backend growth system powered by GoHighLevel.
            </motion.p>
            <motion.div className="pv2-actions" variants={heroLine}>
              <Link href="/services" className="primary-pill large">Explore Services</Link>
              <Link href="/booking" className="secondary-pill large">Get a free consultation</Link>
            </motion.div>
          </motion.div>

          <OrbitConstellation />
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

          <StackDeck items={separationReasons} />
        </div>
      </section>

      {/* ---------------------------------------------------------- octopi */}
      <section className="pv2-section is-dark is-tint-dark">
        <span className="pv2-grid-bg" aria-hidden="true" />
        <span className="pv2-bloom one" aria-hidden="true" />
        <span className="pv2-bloom two" aria-hidden="true" />
        <div className="pv2-inner pv2-split">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={SPRING}
          >
            <div className="pv2-head" style={{ marginBottom: 0 }}>
              <span className="pv2-eyebrow">Powered By A Stronger Ecosystem</span>
              <h2>Backed by Octopi Digital a broader <span className="pv2-hl">digital growth and technology company.</span></h2>
              <p>
                While GHL Prime focuses specifically on GoHighLevel, AI, and automation, it is supported by the broader execution strength of Octopi Digital.
                That means more operational support, more implementation depth, and a stronger environment for delivering real systems work.
              </p>
            </div>

            <div className="pv2-checklist">
              {octopiChecklist.map((item, i) => (
                <motion.div
                  className="pv2-check"
                  key={item}
                  initial={{ opacity: 0, rotateX: -50, y: 14 }}
                  whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  style={{ transformOrigin: 'left center', transformPerspective: 800 }}
                  transition={{ ...SPRING, delay: i * 0.07 }}
                >
                  <span className="pv2-check-icon"><CheckCircle2 size={15} /></span>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotateY: 24, x: 34 }}
            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            style={{ transformOrigin: 'right center', transformPerspective: 1300 }}
            transition={SPRING}
          >
            <div className="iv-halo">
              <div className="m3d-float">
                <Tilt className="pv2-logo-card" max={7}>
                  <img src="/ODL%20logo.webp" alt="Octopi Digital" />
                  <strong>Octopi Digital</strong>
                  <p>Growth systems, execution support, and a stronger operational foundation behind GHL Prime.</p>
                </Tilt>
              </div>
            </div>
          </motion.div>
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

          <div className="iv-timeline">
            {beliefs.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                key={title}
                className={`iv-trow ${index % 2 ? 'from-right' : 'from-left'}`}
                initial={{ opacity: 0, x: index % 2 ? 48 : -48, rotateY: index % 2 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ ...SPRING, delay: 0.04 * (index % 3) }}
              >
                <article className="iv-tcard">
                  <span className="iv-tstep">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
                <span className="iv-node"><Icon size={16} /></span>
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
                className="pv2-expert"
                key={member.id || member.name}
                initial={{ opacity: 0, rotateX: -34, y: 22 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                style={{ transformOrigin: 'top center', transformPerspective: 1000 }}
                transition={{ ...SPRING, delay: (index % 5) * 0.07 }}
              >
                <span className="pv2-flip">
                  <span className="pv2-face front">
                    <img src={member.image_url} alt={member.name} loading="lazy" decoding="async" />
                  </span>
                  <span className="pv2-face back">
                    <strong>{member.name}</strong>
                    <span>{member.title}</span>
                  </span>
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
            className="pv2-cta"
            initial={{ opacity: 0, rotateX: 24, y: 30 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ transformOrigin: 'bottom center', transformPerspective: 1200 }}
            transition={SPRING}
          >
            <span className="iv-aurora a1" aria-hidden="true" />
            <span className="iv-aurora a2" aria-hidden="true" />
            <span className="pv2-grid-bg" aria-hidden="true" />
            <span className="pv2-eyebrow" style={{ position: 'relative', zIndex: 2 }}>
              Want the same kind of structure for your business?
            </span>
            <h2>Explore the services, systems, and backend strategy behind GHL Prime.</h2>
            <div className="pv2-cta-actions">
              <Link href="/services" className="primary-pill large">Explore Services <ArrowRight size={16} /></Link>
              <Link href="/booking" className="secondary-pill large">Get a free consultation</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------------------------------- trust */}
      <section className="pv2-section is-white" aria-labelledby="why-agencies-trust-heading">
        <div className="pv2-inner">
          <motion.div
            className="pv2-head"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={SPRING}
          >
            <span className="pv2-eyebrow">Why Us</span>
            <h2 id="why-agencies-trust-heading">Why Agencies <span className="pv2-hl">Trust GHL Prime</span></h2>
          </motion.div>

          <RevealProse paragraphs={trustParagraphs} dropCap />
        </div>
      </section>

      <FaqSection faqs={ABOUT_FAQS} intro="A quick read on who we are and how we operate." />
      <SiteFooter />
    </main>
  )
}
