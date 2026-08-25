// Visually-hidden, crawler-facing summary block. Rendered ONLY on the homepage
// (it used to live in index.html and therefore duplicated on every route).
// Title is a <p>, not an <h1>, so the hero remains the homepage's single h1.
import { SEEDED_CASE_STUDIES } from '../lib/caseStudiesApi'

// Featured case studies surfaced to crawlers. Titles are pulled from the
// case-study data source so this list can never drift out of sync again.
const FEATURED_CASE_STUDY_SLUGS = [
  'property-developer-ghl-simpletalk-outreach',
  'ecommerce-abandoned-cart-recovery-ghl-sms',
  'fitness-membership-retention-winback-automation',
]

export default function HomeSeoShell() {
  return (
    <div className="seo-shell" inert>
      <header>
        <p className="seo-shell-title">GHL Prime GoHighLevel Automation, AI & White-Label Experts</p>
        <p>GHL Prime is a dedicated GoHighLevel expert team. We build CRM systems, automation workflows, AI agents, and offer 24/7 white-label support for agencies and SaaS founders in the United States.</p>
      </header>
      <nav aria-label="Primary">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services Hire GHL Experts</a></li>
          <li><a href="/case-studies">Case Studies</a></li>
          <li><a href="/about">About GHL Prime</a></li>
          <li><a href="/team">Our Team</a></li>
          <li><a href="/booking">Get a free consultation</a></li>
          <li><a href="/contact">Contact</a></li>
          {FEATURED_CASE_STUDY_SLUGS
            .map((slug) => SEEDED_CASE_STUDIES.find((study) => study.slug === slug))
            .filter(Boolean)
            .map((study) => (
              <li key={study.slug}>
                <a href={`/case-studies/${study.slug}`}>{study.title}</a>
              </li>
            ))}
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/terms">Terms & Conditions</a></li>
        </ul>
      </nav>
      <section>
        <h2>What GHL Prime Delivers</h2>
        <h3>What We Do</h3>
        <p>GoHighLevel setup & sub-account configuration, automation builds, AI agents and voice receptionists, vibe coding for custom features, and 24/7 white-label client support. We operate as the dedicated backend team for marketing agencies, SaaS founders, and white-label CRM resellers.</p>
        <h3>Why Agencies Hire Us</h3>
        <p>Strategy-led delivery, GHL-certified specialists, scalable hours, daily updates, and bespoke development for anything the platform can't do natively. Our specialists hold GoHighLevel <a href="https://help.gohighlevel.com/">Certified Admin</a> credentials the highest official certification on the GoHighLevel platform.</p>
      </section>
      <section>
        <h2>GHL Prime by the Numbers</h2>
        <ul>
          <li>4+ years average GoHighLevel platform experience per certified specialist</li>
          <li>24/7/365 white-label client support coverage across US, Canada, UK and Australia time zones</li>
          <li>Typical CRM setup & automation build delivered in 1–2 weeks; full SaaS launches in 3–4 weeks</li>
          <li>Builds focused on cutting lead response time and recovering missed calls the two levers our clients report moving revenue most</li>
          <li>Daily project status updates across Slack, email, or shared project board</li>
          <li>Founded 2024 in Albuquerque, New Mexico; legal entity GHL Prime LLC; parent organisation Octopi Digital</li>
        </ul>
        <h2>Authoritative References</h2>
        <ul>
          <li><a href="https://www.gohighlevel.com/">GoHighLevel</a> the CRM and marketing automation platform we specialise in.</li>
          <li><a href="https://help.gohighlevel.com/">GoHighLevel Help Center</a> official product documentation we reference in builds and training.</li>
          <li><a href="https://www.gohighlevel.com/saas-mode">GoHighLevel SaaS Mode</a> the framework powering our white-label SaaS CRM launches.</li>
          <li><a href="https://help.gohighlevel.com/support/solutions/articles/155000003147-highlevel-certification-program">HighLevel Certification Program</a> the official certification track our specialists complete.</li>
          <li><a href="https://www.upwork.com/agencies/ghlprime/">GHL Prime on Upwork</a> verified independent agency profile with public reviews.</li>
          <li><a href="https://www.linkedin.com/company/ghl-prime-llc">GHL Prime LLC on LinkedIn</a> verified company entity.</li>
        </ul>
        <h2>Service Locations</h2>
        <address>
          GHL Prime LLC, 4801 Lang Ave NE, Suite 110, Albuquerque, NM 87109, United States. Email: <a href="mailto:info@ghlprime.com">info@ghlprime.com</a>.
        </address>
        <p>Last updated: <time dateTime="2026-05-24">May 24, 2026</time>.</p>
      </section>
    </div>
  )
}
