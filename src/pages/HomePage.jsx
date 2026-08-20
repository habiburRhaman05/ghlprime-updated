'use client'

import { useEffect, useState } from 'react'
import SiteFooter from '../components/SiteFooter'
import FaqSection from '../components/FaqSection'
import { HOMEPAGE_FAQS } from '../data/faqs'
import HomeSeoShell from '../components/HomeSeoShell'

// Home v2. The homepage is composed entirely from these sections now. The
// previous per-section components under components/home-page/ remain in the
// tree -- several are still used by other routes -- they are simply no longer
// part of this page. The navbar and the footer are untouched.
import HeroV2 from '../components/home-v2/HeroV2'
import TrustBandV2 from '../components/home-v2/TrustBandV2'
import WhoWeAreV2 from '../components/home-v2/WhoWeAreV2'
import BentoV2 from '../components/home-v2/BentoV2'
import CapabilitiesV2 from '../components/home-v2/CapabilitiesV2'
import AgentV2 from '../components/home-v2/AgentV2'
import VibeCodingV2 from '../components/home-v2/VibeCodingV2'
import ProcessV2 from '../components/home-v2/ProcessV2'
import StackV2 from '../components/home-v2/StackV2'
import TeamV2 from '../components/home-v2/TeamV2'
import LifeAtGhlV2 from '../components/home-v2/LifeAtGhlV2'
import ProofV2 from '../components/home-v2/ProofV2'
import FinalCtaV2 from '../components/home-v2/FinalCtaV2'

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomepageSchemas()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
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
        }) }} />

      <HomeSeoShell />


      <HeroV2 activePill={activePill} rotatingPills={rotatingPills} />
      <TrustBandV2 />
      <WhoWeAreV2 />
      <BentoV2 />
      <CapabilitiesV2 />
      <AgentV2 />
      <VibeCodingV2 />
      <ProcessV2 />
      <StackV2 />
      <TeamV2 />
      <LifeAtGhlV2 />
      <ProofV2 />
      <FinalCtaV2 />
      <FaqSection faqs={HOMEPAGE_FAQS} intro="Common questions from agencies and founders before they engage GHL Prime." />
      <SiteFooter />
    </>
  )
}
