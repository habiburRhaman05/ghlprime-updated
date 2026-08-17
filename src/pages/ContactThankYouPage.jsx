import { CheckCircle2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import SiteFooter from '../components/SiteFooter'

export default function ContactThankYouPage() {
  return (
    <main className="section section-white contact-thank-you-page">
      <Helmet>
        <title>Thank You | GHL Prime</title>
        <meta name="description" content="Thank you for contacting GHL Prime." />
        <link rel="canonical" href="https://ghlprime.com/contact/thank-you" />
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <section className="section section-white contact-thank-you-section">
        <div className="container contact-thank-you-wrap">
          <div className="contact-thank-you-card">
            <div className="contact-thank-you-icon"><CheckCircle2 size={30} /></div>
            <span className="eyebrow-label contact-thank-you-eyebrow"><Sparkles size={14} /> Inquiry Sent</span>
            <h1>Thank you we received your message.</h1>
            <p>Our team will review your inquiry and get back to you soon with the next best step.</p>
            <div className="contact-thank-you-actions">
              <Link to="/" className="primary-pill large">Back to Home</Link>
              <Link to="/booking" className="secondary-pill">Book a Call</Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
