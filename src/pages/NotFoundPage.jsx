import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'

// Rendered for any route the router does not match. Carries noindex so search
// engines drop these URLs instead of indexing them as thin duplicates of the
// homepage, which is what happened while every unmatched path returned the
// default homepage meta.
export default function NotFoundPage() {
  return (
    <main className="section section-white">
      <Helmet>
        <title>Page Not Found (404) | GHL Prime</title>
        <meta name="description" content="This page does not exist. Browse GoHighLevel services, case studies, and guides from the GHL Prime team instead." />
        <meta name="robots" content="noindex,follow" />
        <meta name="googlebot" content="noindex,follow" />
      </Helmet>

      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '46rem' }}>
        <span className="eyebrow-label">404</span>
        <h1>We could not find that page</h1>
        <p>
          The page you are looking for does not exist, has been moved, or the link that brought
          you here is out of date. Nothing is broken on your end.
        </p>
        <p>Here are the places people usually want:</p>
        <ul>
          <li><Link to="/services">GoHighLevel services</Link> &mdash; setup, automation, AI agents, and white-label support</li>
          <li><Link to="/case-studies">Case studies</Link> &mdash; real builds and what they changed</li>
          <li><Link to="/blog">Blog</Link> &mdash; guides on GoHighLevel, automation, and AI</li>
          <li><Link to="/faq">FAQ</Link> &mdash; common questions before working with us</li>
          <li><Link to="/contact">Contact</Link> &mdash; talk to the team</li>
        </ul>
        <div className="team-edit-actions" style={{ marginTop: '1.5rem' }}>
          <Link to="/" className="primary-pill large">Back to homepage</Link>
          <Link to="/booking" className="secondary-pill">Get a free consultation</Link>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
