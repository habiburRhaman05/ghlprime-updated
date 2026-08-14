import { Link, useLocation } from 'react-router-dom'


// Build date is injected by Vite (see define in vite.config.js) so this
// never drifts from reality the way the old hand-edited constant did.
const SITE_LAST_UPDATED = typeof __BUILD_DATE__ === 'string' ? __BUILD_DATE__ : new Date().toISOString().slice(0, 10)
const SITE_LAST_UPDATED_LABEL = new Date(SITE_LAST_UPDATED + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
const CURRENT_YEAR = new Date().getFullYear()

const ASK_AI_PROMPT = 'Who is GHL Prime and what services do they offer?'
const ASK_AI_ASSISTANTS = [
  { name: 'ChatGPT', icon: '/ai-icons/openai.svg', buildUrl: (q) => `https://chatgpt.com/?prompt=${q}` },
  { name: 'Claude', icon: '/ai-icons/claude.svg', buildUrl: (q) => `https://claude.ai/new?q=${q}` },
  { name: 'Perplexity', icon: '/ai-icons/perplexity.svg', buildUrl: (q) => `https://www.perplexity.ai/search?q=${q}` },
  { name: 'Gemini', icon: '/ai-icons/gemini.svg', buildUrl: (q) => `https://gemini.google.com/app?q=${q}` },
]

const footerCompany = [
  { label: 'About', to: '/about' },
  { label: 'Team', to: '/team' },
  { label: 'Case Studies', to: '/case-studies' },
  { label: 'Blog', to: '/blog' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Certifications', to: '/#certifications' },
  { label: 'Contact', to: '/contact' },
]

const footerServices = [
  { label: 'GHL Setup', to: '/services/ghl-setup' },
  { label: 'Automation', to: '/services/automation' },
  { label: 'SaaS CRM', to: '/services/saas-crm' },
  { label: 'White-Label Support', to: '/services/white-label-support' },
  { label: 'Vibe Coding', to: '/services/vibe-coding' },
  { label: 'AI Agent Builder', to: '/services/ai-agent-builder' },
  { label: 'Custom SaaS Development', to: '/services/custom-saas-development' },
  { label: 'Figma to Code', to: '/services/figma-to-code' },
  { label: 'App Development', to: '/services/app-development' },
  { label: 'SaaS Customer Support', to: '/services/saas-customer-support' },
  { label: 'All Services', to: '/services' },
]

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61573474861100',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7h2.34l.35-2.73H13.5V9.53c0-.79.22-1.33 1.35-1.33h1.44V5.78c-.25-.03-1.1-.1-2.08-.1c-2.06 0-3.48 1.26-3.48 3.58v2.01H8.39V14h2.34v7h2.77Z"/></svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/ghl-prime-llc',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56a1.96 1.96 0 1 0-3.92 0a1.96 1.96 0 0 0 3.92 0ZM20.44 13.02c0-3.45-1.84-5.05-4.29-5.05c-1.98 0-2.87 1.09-3.36 1.86V8.5H9.41c.05.88 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.13-.92c.27-.68.89-1.38 1.93-1.38c1.36 0 1.9 1.04 1.9 2.57V20h3.38v-6.98Z"/></svg>
    ),
  },
]

export default function SiteFooter() {
  const location = useLocation()

  const handleFooterNavigate = () => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  return (
    <footer className="site-footer redesigned-footer">
      <div className="container footer-grid redesigned-footer-grid">
        <div className="footer-brand redesigned-footer-brand">
          <Link to="/" aria-label="Go to homepage" className="footer-brand-logo-link" onClick={handleFooterNavigate}>
            <img className="footer-logo footer-logo-external" src="/footer-logo.png" alt="GHL Prime" />
          </Link>
          <p>Your dedicated GoHighLevel & automation expert team — 24/7, fully white-labeled.</p>
          <div className="footer-social-row">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="footer-social-link">
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="footer-heading">Company</div>
          <ul>
            {footerCompany.map((item) => {
              const isHash = item.to.startsWith('/#')
              const isSamePage = location.pathname === '/' && isHash
              return (
                <li key={item.label}>
                  {isSamePage ? (
                    <a href={item.to} onClick={handleFooterNavigate}>{item.label}</a>
                  ) : (
                    <Link to={item.to} onClick={handleFooterNavigate}>{item.label}</Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <div className="footer-heading">Services</div>
          <ul>
            {footerServices.map((item) => {
              const isHash = item.to.includes('#')
              const isSamePage = location.pathname === '/services' && isHash
              return (
                <li key={item.label}>
                  {isSamePage ? (
                    <a href={item.to.slice(item.to.indexOf('#'))} onClick={handleFooterNavigate}>{item.label}</a>
                  ) : (
                    <Link to={item.to} onClick={handleFooterNavigate}>{item.label}</Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="footer-contact-column">
          <div className="footer-heading">Contact</div>
          <address className="footer-nap" style={{ fontStyle: 'normal', lineHeight: 1.6 }} itemScope itemType="https://schema.org/PostalAddress">
            <div><strong itemProp="name">GHL Prime LLC</strong></div>
            <div itemProp="streetAddress">4801 Lang Ave NE, Suite 110</div>
            <div>
              <span itemProp="addressLocality">Albuquerque</span>,{' '}
              <span itemProp="addressRegion">NM</span>{' '}
              <span itemProp="postalCode">87109</span>
            </div>
            <div itemProp="addressCountry">USA</div>
            <div><a href="tel:+15052075189" className="footer-email-link" itemProp="telephone">+1 505-207-5189</a></div>
            <div><a href="mailto:info@ghlprime.com" className="footer-email-link" itemProp="email">info@ghlprime.com</a></div>
          </address>
          <div style={{ marginTop: '14px' }}>
            <div className="footer-heading" style={{ marginBottom: '4px' }}>Office Location</div>
            <div style={{ lineHeight: 1.6 }}>Basundhara Residential Area, Dhaka, Bangladesh</div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <a href="https://wa.me/8801322939445" target="_blank" rel="noopener noreferrer" className="footer-hire-expert-link">Talk to Founder</a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom redesigned-footer-bottom">
        <div className="footer-bottom-left">
          <span>&copy; {CURRENT_YEAR} GHL Prime LLC. All rights reserved.</span>
          <span className="footer-last-updated">Last updated: <time dateTime={SITE_LAST_UPDATED}>{SITE_LAST_UPDATED_LABEL}</time></span>
        </div>
        <div className="footer-bottom-right">
          <div className="footer-legal-links">
            <Link to="/privacy-policy" onClick={handleFooterNavigate}>Privacy Policy</Link>
            <Link to="/terms" onClick={handleFooterNavigate}>Terms &amp; Conditions</Link>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer">Robots</a>
            <a href="/llms.txt" target="_blank" rel="noopener noreferrer">llms.txt</a>
          </div>
          <span className="footer-parent-brand">
            <a href="https://octopi-digital.com/" target="_blank" rel="noopener noreferrer">A specialized brand by Octopi Digital</a>
          </span>
          <div className="footer-ask-ai">
            <span className="footer-ask-ai-label">Ask AI about us</span>
            <div className="footer-ask-ai-row">
              {ASK_AI_ASSISTANTS.map((ai) => (
                <a
                  key={ai.name}
                  href={ai.buildUrl(encodeURIComponent(ASK_AI_PROMPT))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-ask-ai-btn"
                  aria-label={`Ask ${ai.name} about GHL Prime`}
                  title={`Ask ${ai.name} about GHL Prime`}
                >
                  <img src={ai.icon} alt="" width="16" height="16" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
