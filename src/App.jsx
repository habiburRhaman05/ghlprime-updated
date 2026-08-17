'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronDown, ChevronRight, Mail, Menu, X } from 'lucide-react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import BackToTop from './components/BackToTop'
import './App.css'
import './styles/service-detail.css'
import { SERVICE_MENU } from './data/serviceCatalog'

// Icon per mega-menu category, keyed off the same strings SERVICE_MENU
// already uses -- so a category rename in the data file just stops matching
// here instead of silently mislabelling.
//
// These are real, full-colour marks rather than generic line glyphs:
//   GoHighLevel        -> the GoHighLevel logo
//   Vibe Coding & AI   -> purpose-drawn spark mark in the brand purple (not
//                         Claude's logo -- that's a specific tool credit,
//                         not a category identity, and reads oddly as a
//                         nav icon at this size)
//   Design & Build     -> Figma (the category leads with "Figma to Code")
//   Support            -> no third-party product involved, so a purpose-drawn
//                         headset mark in the brand teal instead of a logo.
const CATEGORY_ICON = {
  'GoHighLevel': '/gohighlevel.png',
  'Vibe Coding & AI Dev': '/nav-icons/ai-dev.svg',
  'Design & Build': '/nav-icons/figma.svg',
  'Support': '/nav-icons/support.svg',
}

const SITE_URL = 'https://ghlprime.com'
const SITE_LOGO = 'https://ghlprime.com/ghl-prime-logo.png'
const PRIMARY_DESCRIPTION = 'Dedicated GoHighLevel expert team building CRM systems, automation workflows, AI agents, and 24/7 white-label support for agencies and SaaS founders.'

const SOCIAL_PROFILES = [
  'https://www.linkedin.com/company/ghl-prime-llc',
  'https://www.facebook.com/profile.php?id=61573474861100',
  'https://www.upwork.com/agencies/ghlprime/',
]

const POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: '4801 Lang Ave NE, Suite 110',
  addressLocality: 'Albuquerque',
  addressRegion: 'NM',
  postalCode: '87109',
  addressCountry: 'US',
}

const CONTACT_POINT = {
  '@type': 'ContactPoint',
  telephone: '+1-505-207-5189',
  email: 'info@ghlprime.com',
  contactType: 'customer support',
  availableLanguage: ['English'],
  areaServed: ['US', 'CA', 'GB', 'AU'],
}

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': SITE_URL + '/#organization',
  name: 'GHL Prime',
  legalName: 'GHL Prime LLC',
  alternateName: ['GHL Prime LLC', 'GoHighLevel Prime'],
  url: SITE_URL,
  telephone: '+1-505-207-5189',
  email: 'info@ghlprime.com',
  logo: {
    '@type': 'ImageObject',
    url: SITE_LOGO,
    width: 512,
    height: 512,
  },
  image: SITE_LOGO,
  description: PRIMARY_DESCRIPTION,
  foundingDate: '2024',
  address: POSTAL_ADDRESS,
  areaServed: [
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'Canada' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Australia' },
  ],
  contactPoint: CONTACT_POINT,
  knowsAbout: [
    'GoHighLevel CRM',
    'GoHighLevel automation',
    'GoHighLevel SaaS setup',
    'White-label CRM support',
    'AI voice receptionists',
    'AI sales agents',
    'Marketing automation',
    'Workflow automation',
  ],
  sameAs: SOCIAL_PROFILES,
  parentOrganization: {
    '@type': 'Organization',
    name: 'Octopi Digital',
    url: 'https://octopi-digital.com',
  },
  founder: [
    {
      '@type': 'Person',
      name: 'Jewel Rana',
      jobTitle: 'CEO & Co-Founder',
      url: 'https://www.linkedin.com/in/thejewelrana/',
      sameAs: [
        'https://www.linkedin.com/in/thejewelrana/',
        'https://www.upwork.com/freelancers/~013caf34b8df0444cf/',
        'https://www.facebook.com/thenewjewel',
      ],
    },
    {
      '@type': 'Person',
      name: 'Niyamul Islam Sajal',
      jobTitle: 'COO & Co-Founder',
      url: 'https://www.linkedin.com/in/niyamulislam/',
      sameAs: [
        'https://www.linkedin.com/in/niyamulislam/',
        'https://www.upwork.com/freelancers/~010f634a8b80365e7b',
        'https://www.facebook.com/niaymul.islam.2025/',
      ],
    },
  ],
}

const LOCAL_BUSINESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': SITE_URL + '/#localbusiness',
  name: 'GHL Prime',
  legalName: 'GHL Prime LLC',
  url: SITE_URL,
  logo: SITE_LOGO,
  image: SITE_LOGO,
  description: PRIMARY_DESCRIPTION,
  priceRange: '$$',
  telephone: '+1-505-207-5189',
  email: 'info@ghlprime.com',
  address: POSTAL_ADDRESS,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 35.1107,
    longitude: -106.6100,
  },
  areaServed: [
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'Canada' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Australia' },
  ],
  serviceType: [
    'GoHighLevel CRM setup',
    'GoHighLevel sub-account configuration',
    'Automation workflow builds',
    'AI agent deployment',
    'AI voice receptionists',
    '24/7 white-label client support',
    'Vibe coding and custom development',
    'API integrations',
  ],
  sameAs: SOCIAL_PROFILES,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  parentOrganization: { '@id': SITE_URL + '/#organization' },
}

const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': SITE_URL + '/#website',
  url: SITE_URL,
  name: 'GHL Prime',
  publisher: { '@id': SITE_URL + '/#organization' },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://ghlprime.com/blog?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

// Route-level code splitting is now handled by the Next.js App Router (each
// app/**/page.tsx imports its own page component), so the React.lazy() list
// that used to live here is gone. Page components themselves are unchanged.

const secondaryNav = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/team' },
]

function SiteHeader() {
  const pathname = usePathname()
  const isAuthLayout = pathname === '/login' || pathname.startsWith('/admin')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  // Which left-column category the right panel is showing. Reset (below) on
  // every close rather than left to whatever was last hovered, so each fresh
  // open always lands back on the first category, per spec.
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const servicesCloseTimer = useRef(null)
  const openServices = () => {
    if (servicesCloseTimer.current) { clearTimeout(servicesCloseTimer.current); servicesCloseTimer.current = null }
    setServicesOpen(true)
  }
  const closeServicesSoon = () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current)
    servicesCloseTimer.current = setTimeout(() => {
      setServicesOpen(false)
      setActiveCategoryIndex(0)
    }, 200)
  }

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMobileMenuOpen(false)
    setServicesOpen(false)
    setMobileServicesOpen(false)
    setActiveCategoryIndex(0)
  }

  // Compacts the bar once the page has moved. Threshold is well past the
  // .85rem top margin so the transition can't oscillate at rest.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const servicesActive = pathname.startsWith('/services')
    || SERVICE_MENU.some((col) => col.items.some((it) => it.to === pathname))

  if (isAuthLayout) return null

  return (
    <header className={`navbar container${scrolled ? ' is-scrolled' : ''}`}>
      <div className="brand">
        <Link href="/">
          <img className="brand-logo" src="/ghl-prime-logo.png" alt="GHL Prime" />
        </Link>
      </div>

      <nav className="nav-links desktop-nav-links">
        <div
          className="has-megamenu"
          data-open={servicesOpen}
          onMouseEnter={openServices}
          onMouseLeave={closeServicesSoon}
        >
          <button
            type="button"
            className={`megamenu-trigger${servicesActive ? ' is-active' : ''}`}
            aria-haspopup="true"
            aria-expanded={servicesOpen}
            onClick={() => setServicesOpen((v) => {
              if (v) setActiveCategoryIndex(0)
              return !v
            })}
          >
            Services <ChevronDown size={15} />
          </button>
          <div className="megamenu-panel" role="menu">
            <div className="megamenu-body">
              {/* Left: primary categories. Hover, click, or keyboard-focus
                  any of them swaps the right panel to that category's
                  sub-services -- these are plain buttons, not links, since
                  a category itself has no page of its own to go to. */}
              <div className="megamenu-categories">
                {/* The "Services" trigger above is a toggle button, not a
                    link -- this is the only way into /services itself, so it
                    stays even though the reference mockup doesn't have an
                    equivalent row. */}
                <Link href="/services" role="menuitem" className="megamenu-all-link">
                  All Services
                  <ArrowRight size={13} />
                </Link>
                {SERVICE_MENU.map((col, index) => {
                  const iconSrc = CATEGORY_ICON[col.category]
                  const isActive = index === activeCategoryIndex
                  return (
                    <button
                      key={col.category}
                      type="button"
                      role="menuitem"
                      className={`megamenu-category${isActive ? ' is-active' : ''}`}
                      onMouseEnter={() => setActiveCategoryIndex(index)}
                      onFocus={() => setActiveCategoryIndex(index)}
                      onClick={() => setActiveCategoryIndex(index)}
                      aria-expanded={isActive}
                    >
                      {/* Text block (icon + title line, description below)
                          and the arrow chip are siblings in one row, so the
                          chip centers against the full two-line height
                          instead of pinning to just the title line. */}
                      <span className="megamenu-category-main">
                        <span className="megamenu-category-row">
                          {iconSrc ? (
                            <img src={iconSrc} alt="" aria-hidden="true" className="megamenu-category-icon" loading="lazy" decoding="async" />
                          ) : null}
                          <span className="megamenu-category-label">{col.category}</span>
                        </span>
                        <span className="megamenu-category-desc">{col.description}</span>
                      </span>
                      <span className="megamenu-arrow-chip" aria-hidden="true">
                        <ChevronRight size={14} />
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Right: sub-services for whichever category is active.
                  Crossfades as a group on category change -- absolutely
                  positioned during the transition (see CSS) so the
                  exiting/entering sets never stack and bump the fixed row
                  height from the divider fix above. */}
              <div className="megamenu-services">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeCategoryIndex}
                    className="megamenu-services-group"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {SERVICE_MENU[activeCategoryIndex].items.map((it) => (
                      <Link
                        key={it.to}
                        href={it.to}
                        role="menuitem"
                        className={`megamenu-service${pathname === it.to ? ' is-active' : ''}`}
                      >
                        <span className="megamenu-service-main">
                          <span className="megamenu-service-label">{it.label}</span>
                          <span className="megamenu-service-desc">{it.description}</span>
                        </span>
                        <span className="megamenu-arrow-chip" aria-hidden="true">
                          <ArrowRight size={14} />
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom row: brand mark left, primary CTA right. */}
            <div className="megamenu-footer">
              <img src="/ghl-prime-logo.png" alt="GHL Prime" className="megamenu-footer-logo" />
              <Link href="/booking" role="menuitem" className="primary-pill megamenu-footer-cta">
                Get a free consultation
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
        {secondaryNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={pathname === item.href ? 'is-active' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="nav-actions desktop-nav-actions">
        <Link href="/contact" className="login-link nav-ghost">
          <Mail size={15} aria-hidden="true" />
          Contact
        </Link>
        <Link href="/booking" className="primary-pill nav-cta">
          Get a free consultation
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <button type="button" className="mobile-menu-toggle" onClick={() => setMobileMenuOpen((current) => !current)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}>
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mobileMenuOpen ? (
        <div className="mobile-menu-panel">
          <nav className="mobile-menu-links">
            <button type="button" className="mobile-svc-toggle" data-open={mobileServicesOpen} aria-expanded={mobileServicesOpen} onClick={() => setMobileServicesOpen((v) => !v)}>
              Services <ChevronDown size={18} />
            </button>
            {mobileServicesOpen ? (
              <div className="mobile-svc-catalog">
                <Link href="/services" className="mobile-svc-all" onClick={() => setMobileMenuOpen(false)}>All Services</Link>
                {SERVICE_MENU.map((col) => {
                  const iconSrc = CATEGORY_ICON[col.category]
                  return (
                    <div key={col.category} className="mobile-svc-group">
                      <div className="mobile-svc-cat">
                        {iconSrc ? <img src={iconSrc} alt="" aria-hidden="true" className="mobile-svc-cat-icon" loading="lazy" decoding="async" /> : null}
                        {col.category}
                      </div>
                      {col.items.map((it) => (
                        <Link key={it.to} href={it.to} className="mobile-svc-link" onClick={() => setMobileMenuOpen(false)}>{it.label}</Link>
                      ))}
                    </div>
                  )
                })}
              </div>
            ) : null}
            {secondaryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={pathname === item.href ? 'is-active' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mobile-menu-actions">
            <Link href="/contact" className="login-link nav-ghost" onClick={() => setMobileMenuOpen(false)}>
              <Mail size={16} aria-hidden="true" />
              Contact
            </Link>
            <Link href="/booking" className="primary-pill nav-cta" onClick={() => setMobileMenuOpen(false)}>
              Get a free consultation
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            
          </div>
        </div>
      ) : null}
    </header>
  )
}

function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // react-router exposed the hash via useLocation(); next/navigation has no
    // hash accessor, so it is read straight off the URL. Same guard, same
    // behaviour: an in-page anchor navigation must not be yanked to the top.
    if (typeof window !== 'undefined' && window.location.hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export default function App({ children }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (/HeadlessChrome|Puppeteer|prerender/i.test(navigator.userAgent)) return
    if (document.getElementById('ghl-chat-widget-loader')) return
    const s = document.createElement('script')
    s.id = 'ghl-chat-widget-loader'
    s.src = 'https://widgets.leadconnectorhq.com/loader.js'
    s.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js')
    s.setAttribute('data-widget-id', '69cad06dae18f7331e86d6ad')
    s.async = true
    document.body.appendChild(s)
  }, [])

  return (
    <div className="site-shell">
      {/* These three schemas were declared through <Helmet>, but the built
          output shows react-helmet-async emitting them into <body> rather than
          <head>. Rendering them inline here reproduces the production HTML in
          the same document position, with byte-identical JSON. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
      />
      <div className="page-grid" />
      <div className="hero-glow top-left" />
      <div className="hero-glow bottom-right" />
      <SiteHeader />
      <ScrollToTop />
      <BackToTop />
      {children}
      <SpeedInsights />
    </div>
  )
}
