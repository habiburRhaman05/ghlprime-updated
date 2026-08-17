import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Bot, CheckCircle2, LayoutGrid, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import SiteFooter from '../components/SiteFooter'
import FaqSection from '../components/FaqSection'
import { ABOUT_FAQS } from '../data/faqs'
import { fetchTeamPageExperts } from '../lib/teamApi'

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

export default function AboutPage() {
  const [experts, setExperts] = useState([])

  useEffect(() => {
    fetchTeamPageExperts().then(setExperts)
  }, [])

  return (
    <main className="about-page about-redesign-page">
      <Helmet>
        <title>About GHL Prime Your GoHighLevel Backend Team</title>
        <meta name="description" content="GHL Prime is a dedicated GoHighLevel agency built to serve other agencies. Strategy-led delivery, GHL-certified specialists, and fully white-labeled execution." />
        <meta name="keywords" content="about GHL Prime, GoHighLevel expert team, GoHighLevel certified agency, GoHighLevel specialists, white-label CRM team" />
        <link rel="canonical" href="https://ghlprime.com/about" />
        <meta property="og:title" content="About GHL Prime Your GoHighLevel Backend Team" />
        <meta property="og:description" content="GHL Prime is a dedicated GoHighLevel agency built to serve other agencies. Strategy-led delivery, GHL-certified specialists, and fully white-labeled execution." />
        <meta property="og:url" content="https://ghlprime.com/about" />
        <meta property="og:image" content="https://ghlprime.com/og-about.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:image" content="https://ghlprime.com/og-about.png" />
        <meta name="twitter:title" content="About GHL Prime Your GoHighLevel Backend Team" />
        <meta name="twitter:description" content="GHL Prime is a dedicated GoHighLevel agency built to serve other agencies. Strategy-led delivery, GHL-certified specialists, and fully white-labeled execution." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com' },
            { '@type': 'ListItem', position: 2, name: 'About', item: 'https://ghlprime.com/about' },
          ],
        })}</script>
        <script type="application/ld+json">{JSON.stringify([
          { '@context': 'https://schema.org', '@type': 'Person', name: 'Jewel Rana', image: 'https://assets.cdn.filesafe.space/j53xn6YJHwIdPImV00rn/media/69a7daecb701feb9ee7f20f7.png', jobTitle: 'CEO & Co-Founder', worksFor: { '@type': 'Organization', name: 'GHL Prime', url: 'https://ghlprime.com' }, sameAs: ['https://www.linkedin.com/in/thejewelrana/','https://www.facebook.com/thenewjewel','https://www.bokaboss.com/'] },
          { '@context': 'https://schema.org', '@type': 'Person', name: 'Niyamul Islam Sajal', image: 'https://assets.cdn.filesafe.space/j53xn6YJHwIdPImV00rn/media/69a7daec618c8d0100ae531c.png', jobTitle: 'COO & Co-Founder', worksFor: { '@type': 'Organization', name: 'GHL Prime', url: 'https://ghlprime.com' }, sameAs: ['https://www.linkedin.com/in/niyamulislam/','https://www.facebook.com/niaymul.islam.2025/'] },
        ])}</script>
              <meta name="last-modified" content="2026-05-24" />
        <script type="application/ld+json">{JSON.stringify({
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
          speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.about-redesign-hero-copy p', '.faq-question', '.faq-answer'] },
        })}</script>
      </Helmet>
      <section className="about-redesign-hero">
        <div className="container about-redesign-hero-inner">
          <motion.div
            className="about-redesign-hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="eyebrow-label light-eyebrow">About Us</span>
            <h1>Built For One Thing: GoHighLevel Growth Systems</h1>
            <p>
              GHL Prime exists to help businesses build better CRM structure, smarter automation, stronger follow-up,
              and a more premium backend growth system powered by GoHighLevel.
            </p>
            <div className="about-redesign-hero-actions">
              <Link to="/services" className="primary-pill large">Explore Services</Link>
              <Link to="/booking" className="secondary-pill about-secondary-pill">Get a free consultation</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-title centered">
            <span className="eyebrow-label">Why We Created A Separate Brand</span>
            <h2>Focused. Clear. Built for a specific kind of client need.</h2>
            <p>GHL Prime was created as a distinct brand so the service offering could feel sharper, more intentional, and more specialized.</p>
          </div>
          <div className="about-redesign-card-grid three-col">
            {separationReasons.map(({ icon: Icon, title, text }, index) => (
              <motion.article
                key={title}
                className="about-redesign-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <div className="about-redesign-icon"><Icon size={18} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-octopi-section">
        <div className="container about-octopi-grid">
          <motion.div
            className="about-octopi-copy"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
          >
            <span className="eyebrow-label">Powered By A Stronger Ecosystem</span>
            <h2>Backed by Octopi Digital a broader digital growth and technology company.</h2>
            <p>
              While GHL Prime focuses specifically on GoHighLevel, AI, and automation, it is supported by the broader execution strength of Octopi Digital.
              That means more operational support, more implementation depth, and a stronger environment for delivering real systems work.
            </p>
            <div className="about-octopi-checklist">
              {octopiChecklist.map((item) => (
                <div key={item} className="about-octopi-check-item">
                  <CheckCircle2 size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="about-octopi-visual"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: 0.06 }}
          >
            <div className="about-octopi-visual-card">
              <img src="https://octopi-digital.com/_next/image?url=%2Foctopi-logo.png&w=256&q=75" alt="Octopi Digital" className="about-octopi-logo" />
              <strong>Octopi Digital</strong>
              <p>Growth systems, execution support, and a stronger operational foundation behind GHL Prime.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-title centered">
            <span className="eyebrow-label">What We Believe</span>
            <h2>The principles behind how we build.</h2>
            <p>These ideas shape the way GHL Prime approaches systems, automation, design quality, and client delivery.</p>
          </div>
          <div className="about-redesign-card-grid five-col">
            {beliefs.map(({ icon: Icon, title, text }, index) => (
              <motion.article
                key={title}
                className="about-redesign-card compact"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
              >
                <div className="about-redesign-icon"><Icon size={18} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white experts-section about-experts-section">
        <div className="container">
          <div className="section-title centered experts-section-title">
            <span className="eyebrow-label">Our Experts</span>
            <h2>The team supporting delivery behind the scenes.</h2>
            <p>Certified GoHighLevel specialists, automation engineers, and support leads who deliver the builds behind our client work.</p>
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

      <section className="section about-final-cta-section">
        <div className="container">
          <motion.div
            className="final-cta-card premium-final-cta"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            <div>
              <span className="cta-label">Want the same kind of structure for your business?</span>
              <h2>Explore the services, systems, and backend strategy behind GHL Prime.</h2>
            </div>
            <div className="final-cta-actions">
              <Link to="/services" className="primary-pill large">Explore Services <ArrowRight size={16} /></Link>
              <Link to="/booking" className="secondary-pill">Get a free consultation</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section section-white about-trust-section" aria-labelledby="why-agencies-trust-heading">
        <div className="container">
          <div className="section-title">
            <span className="eyebrow-label">Why Us</span>
            <h2 id="why-agencies-trust-heading">Why Agencies Trust GHL Prime</h2>
          </div>
          <div className="about-trust-prose">
            <p>GHL Prime is built on a simple premise: agencies should not have to choose between technical depth and business growth. Most agency owners are strong at sales, client relationships, and strategy but the backend of a GoHighLevel operation is a full-time job on its own. CRM configuration, automation logic, AI agent deployment, client support, and custom development all require specialized expertise that is expensive to hire in-house and unreliable to source from freelancers.</p>
            <p>GHL Prime was founded to solve exactly that. We are a GHL-only team we do not generalize across platforms or dilute our expertise across fifty different tools. Every specialist on our team works exclusively in the GoHighLevel ecosystem, which means we build faster, troubleshoot better, and deliver results that a generalist freelancer simply cannot match.</p>
            <p>Our Certified Admin badge is the highest-level GoHighLevel certification available. Combined with our 10 specialty certifications including HIPAA Compliance, A2P, AI Employee, and SaaS Mode we carry the formal credentials to back every claim we make about our capabilities.</p>
            <p>We operate fully white-labeled, which means your clients never know we exist. Your agency is the front door. We are the engine room. That is how it is supposed to work.</p>
          </div>
        </div>
      </section>
            <FaqSection faqs={ABOUT_FAQS} intro="A quick read on who we are and how we operate." />
      <SiteFooter />
    </main>
  )
}
