import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, ChevronDown, Code2, Headphones, LayoutGrid, Mail, Menu, Workflow, X } from 'lucide-react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import HomePage from './pages/HomePage'
import BackToTop from './components/BackToTop'
import './App.css'
import './styles/service-detail.css'
import { SERVICE_MENU } from './data/serviceCatalog'

// Icon per mega-menu category, keyed off the same strings SERVICE_MENU
// already uses -- so a category rename in the data file just stops
// matching here instead of silently mislabelling. Kept local to App.jsx
// rather than added to serviceCatalog.js, which is also read by the footer
// and has no other icon-bearing consumer.
const CATEGORY_ICON = {
  'GoHighLevel': Workflow,
  'Vibe Coding & AI Dev': Code2,
  'Design & Build': LayoutGrid,
  'Support': Headphones,
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

const ClientStudiesPage = lazy(() => import('./pages/ClientStudiesPage'))
const ClientStudyDetailPage = lazy(() => import('./pages/ClientStudyDetailPage'))
const AdminCaseStudiesPage = lazy(() => import('./pages/AdminCaseStudiesPage'))
const AdminTeamPage = lazy(() => import('./pages/AdminTeamPage'))
const AdminLeadersPage = lazy(() => import('./pages/AdminLeadersPage'))
const AdminExpertsPage = lazy(() => import('./pages/AdminExpertsPage'))
const AdminMeetingGalleryPage = lazy(() => import('./pages/AdminMeetingGalleryPage'))
const AdminTechnologyLogosPage = lazy(() => import('./pages/AdminTechnologyLogosPage'))
const AdminTrustedLogosPage = lazy(() => import('./pages/AdminTrustedLogosPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const TeamPage = lazy(() => import('./pages/TeamPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const ContactThankYouPage = lazy(() => import('./pages/ContactThankYouPage'))
const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const VibeCodingPage = lazy(() => import('./pages/VibeCodingPage'))
const AiAgentBuilderPage = lazy(() => import('./pages/AiAgentBuilderPage'))
const CustomSaasDevelopmentPage = lazy(() => import('./pages/CustomSaasDevelopmentPage'))
const FigmaToCodePage = lazy(() => import('./pages/FigmaToCodePage'))
const SaasCustomerSupportPage = lazy(() => import('./pages/SaasCustomerSupportPage'))
const GhlSetupPage = lazy(() => import('./pages/GhlSetupPage'))
const AutomationPage = lazy(() => import('./pages/AutomationPage'))
const SaasCrmLaunchPage = lazy(() => import('./pages/SaasCrmLaunchPage'))
const WhiteLabelSupportPage = lazy(() => import('./pages/WhiteLabelSupportPage'))
const AppDevelopmentPage = lazy(() => import('./pages/AppDevelopmentPage'))
const AdminBlogPage = lazy(() => import('./pages/AdminBlogPage'))
const AdminBlogAiPage = lazy(() => import('./pages/AdminBlogAiPage'))
const AdminAiConnectionsPage = lazy(() => import('./pages/AdminAiConnectionsPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const AdminShowcasePage = lazy(() => import('./pages/AdminShowcasePage'))
const AdminGalleryPage = lazy(() => import('./pages/AdminGalleryPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const secondaryNav = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/team' },
]

function SiteHeader() {
  const location = useLocation()
  const isAuthLayout = location.pathname === '/login' || location.pathname.startsWith('/admin')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const servicesCloseTimer = useRef(null)
  const openServices = () => {
    if (servicesCloseTimer.current) { clearTimeout(servicesCloseTimer.current); servicesCloseTimer.current = null }
    setServicesOpen(true)
  }
  const closeServicesSoon = () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current)
    servicesCloseTimer.current = setTimeout(() => setServicesOpen(false), 200)
  }

  const [prevPathname, setPrevPathname] = useState(location.pathname)
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname)
    setMobileMenuOpen(false)
    setServicesOpen(false)
    setMobileServicesOpen(false)
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

  const servicesActive = location.pathname.startsWith('/services')
    || SERVICE_MENU.some((col) => col.items.some((it) => it.to === location.pathname))

  if (isAuthLayout) return null

  return (
    <header className={`navbar container${scrolled ? ' is-scrolled' : ''}`}>
      <div className="brand">
        <Link to="/">
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
            onClick={() => setServicesOpen((v) => !v)}
          >
            Services <ChevronDown size={15} />
          </button>
          <div className="megamenu-panel" role="menu">
            <div className="megamenu-cols">
              {SERVICE_MENU.map((col) => {
                const CategoryIcon = CATEGORY_ICON[col.category]
                return (
                  <div key={col.category}>
                    <div className="megamenu-col-title">
                      {CategoryIcon ? <CategoryIcon size={13} className="megamenu-col-icon" aria-hidden="true" /> : null}
                      {col.category}
                    </div>
                    {col.items.map((it) => (
                      <Link
                        key={it.to}
                        to={it.to}
                        role="menuitem"
                        className={`megamenu-link${location.pathname === it.to ? ' is-active' : ''}`}
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                )
              })}
            </div>
            <Link to="/services" role="menuitem" className="megamenu-all">
              View all services
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        {secondaryNav.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={location.pathname === item.href ? 'is-active' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="nav-actions desktop-nav-actions">
        <Link to="/contact" className="login-link nav-ghost">
          <Mail size={15} aria-hidden="true" />
          Contact
        </Link>
        <Link to="/booking" className="primary-pill nav-cta">
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
                <Link to="/services" className="mobile-svc-all" onClick={() => setMobileMenuOpen(false)}>All Services</Link>
                {SERVICE_MENU.map((col) => {
                  const CategoryIcon = CATEGORY_ICON[col.category]
                  return (
                    <div key={col.category} className="mobile-svc-group">
                      <div className="mobile-svc-cat">
                        {CategoryIcon ? <CategoryIcon size={13} aria-hidden="true" /> : null}
                        {col.category}
                      </div>
                      {col.items.map((it) => (
                        <Link key={it.to} to={it.to} className="mobile-svc-link" onClick={() => setMobileMenuOpen(false)}>{it.label}</Link>
                      ))}
                    </div>
                  )
                })}
              </div>
            ) : null}
            {secondaryNav.map((item) => (
              <Link key={item.label} to={item.href} onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>
            ))}
          </nav>
          <div className="mobile-menu-actions">
            <Link to="/contact" className="login-link nav-ghost" onClick={() => setMobileMenuOpen(false)}>
              <Mail size={16} aria-hidden="true" />
              Contact
            </Link>
            <Link to="/booking" className="primary-pill nav-cta" onClick={() => setMobileMenuOpen(false)}>
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
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

function RouteFallback() {
  return <main className="section"><div className="container">Loading...</div></main>
}

export default function App() {
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
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(ORGANIZATION_JSON_LD)}</script>
        <script type="application/ld+json">{JSON.stringify(LOCAL_BUSINESS_JSON_LD)}</script>
        <script type="application/ld+json">{JSON.stringify(WEBSITE_JSON_LD)}</script>
      </Helmet>
      <div className="page-grid" />
      <div className="hero-glow top-left" />
      <div className="hero-glow bottom-right" />
      <SiteHeader />
      <ScrollToTop />
      <BackToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/vibe-coding" element={<VibeCodingPage />} />
          <Route path="/services/ai-agent-builder" element={<AiAgentBuilderPage />} />
          <Route path="/services/custom-saas-development" element={<CustomSaasDevelopmentPage />} />
          <Route path="/services/figma-to-code" element={<FigmaToCodePage />} />
          <Route path="/services/saas-customer-support" element={<SaasCustomerSupportPage />} />
          <Route path="/services/ghl-setup" element={<GhlSetupPage />} />
          <Route path="/services/automation" element={<AutomationPage />} />
          <Route path="/services/saas-crm" element={<SaasCrmLaunchPage />} />
          <Route path="/services/white-label-support" element={<WhiteLabelSupportPage />} />
          <Route path="/services/app-development" element={<AppDevelopmentPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact/thank-you" element={<ContactThankYouPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/case-studies" element={<ClientStudiesPage />} />
          <Route path="/case-studies/:slug" element={<ClientStudyDetailPage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/gallery" element={<GalleryPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/case-studies" element={<AdminCaseStudiesPage />} />
          <Route path="/admin/case-studies/manage" element={<AdminCaseStudiesPage />} />
          <Route path="/admin/meeting-gallery" element={<AdminMeetingGalleryPage />} />
          <Route path="/admin/technology-logos" element={<AdminTechnologyLogosPage />} />
          <Route path="/admin/trusted-logos" element={<AdminTrustedLogosPage />} />
          <Route path="/admin/team" element={<AdminTeamPage defaultTab="leaders" />} />
          <Route path="/admin/leaders" element={<AdminLeadersPage />} />
          <Route path="/admin/experts" element={<AdminExpertsPage />} />
          <Route path="/admin/blog" element={<AdminBlogPage />} />
          <Route path="/admin/blog-ai" element={<AdminBlogAiPage />} />
          <Route path="/admin/ai-connections" element={<AdminAiConnectionsPage />} />
          <Route path="/admin/showcase" element={<AdminShowcasePage />} />
          <Route path="/admin/gallery" element={<AdminGalleryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <SpeedInsights />
    </div>
  )
}
