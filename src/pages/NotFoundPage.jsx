import Link from 'next/link'
import SiteFooter from '../components/SiteFooter'

// Rendered for any route the router does not match. Carries noindex so search
// engines drop these URLs instead of indexing them as thin duplicates of the
// homepage, which is what happened while every unmatched path returned the
// default homepage meta.
export default function NotFoundPage() {
  return (
    <main className="section section-white">
      

      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '46rem' }}>
        <span className="eyebrow-label">404</span>
        <h1>We could not find that page</h1>
        <p>
          The page you are looking for does not exist, has been moved, or the link that brought
          you here is out of date. Nothing is broken on your end.
        </p>
        <p>Here are the places people usually want:</p>
        <ul>
          <li><Link href="/services">GoHighLevel services</Link> setup, automation, AI agents, and white-label support</li>
          <li><Link href="/case-studies">Case studies</Link> real builds and what they changed</li>
          <li><Link href="/blog">Blog</Link> guides on GoHighLevel, automation, and AI</li>
          <li><Link href="/faq">FAQ</Link> common questions before working with us</li>
          <li><Link href="/contact">Contact</Link> talk to the team</li>
        </ul>
        <div className="team-edit-actions" style={{ marginTop: '1.5rem' }}>
          <Link href="/" className="primary-pill large">Back to homepage</Link>
          <Link href="/booking" className="secondary-pill">Get a free consultation</Link>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
