import SiteFooter from '../components/SiteFooter'

export default function TermsPage() {
  return (
    <main className="section section-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com/' },
            { '@type': 'ListItem', position: 2, name: 'Terms & Conditions', item: 'https://ghlprime.com/terms' },
          ],
        }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          url: 'https://ghlprime.com/terms',
          name: 'Terms & Conditions | GHL Prime',
          inLanguage: 'en-US',
          isPartOf: { '@id': 'https://ghlprime.com/#website' },
          datePublished: '2024-08-01',
          dateModified: '2026-06-02',
        }) }} />
      <div className="container" style={{ maxWidth: '860px' }}>
        <span className="eyebrow-label">Terms &amp; Conditions</span>
        <h1>Terms &amp; Conditions</h1>
        <p><strong>Last updated: June 2, 2026</strong></p>

        <h2>Introduction / Acceptance of Terms</h2>
        <p>
          These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the website operated by
          GHL Prime LLC (&ldquo;GHL Prime,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), located at
          ghlprime.com, and your engagement of our services. By accessing the website or engaging us for services, you
          (&ldquo;you,&rdquo; &ldquo;Client&rdquo;) agree to be bound by these Terms. If you do not agree, please do not
          use the website or our services.
        </p>
        <p>
          These Terms apply to general use of the website and services. Specific project scopes, deliverables,
          timelines, and pricing are confirmed separately through written proposals, statements of work, or service
          agreements. In the event of a conflict between these Terms and a signed agreement, the signed agreement
          controls for that engagement.
        </p>

        <h2>Description of Services</h2>
        <p>
          GHL Prime provides GoHighLevel and CRM automation services for agencies, SaaS founders, and businesses.
          Our services may include GoHighLevel account setup and configuration, workflow and marketing automation, AI
          chat agents, voice AI, &ldquo;vibe coding&rdquo; and custom development, white-label support, and
          integrations between GoHighLevel and other platforms and tools. The exact services to be provided are defined
          in the applicable proposal or agreement.
        </p>

        <h2>Eligibility</h2>
        <p>
          You must be at least 18 years old and have the legal authority to enter into a binding agreement, whether on
          your own behalf or on behalf of the business you represent. By engaging us, you represent and warrant that
          you meet these requirements.
        </p>

        <h2>Engagements, Quotes &amp; Project Scope</h2>
        <p>
          Each engagement begins with a quote, proposal, or statement of work describing the scope of services,
          deliverables, and estimated timelines. Work outside the agreed scope (&ldquo;scope changes&rdquo;) may
          require a revised quote and may affect timelines and fees. Estimated timelines are good-faith estimates and
          may be affected by factors outside our control, including the timeliness of Client responses, access, and
          third-party platforms.
        </p>

        <h2>Fees, Billing &amp; Payment</h2>
        <p>
          Our services may be offered on an hourly, fixed project, or monthly retainer basis, as specified in the
          applicable agreement. Unless otherwise agreed in writing, invoices are due upon receipt or by the date stated
          on the invoice. Late or unpaid balances may result in suspension of work. Fees do not include third-party
          platform subscriptions, usage charges, or messaging costs, which are the Client&apos;s responsibility.
        </p>
        <p>
          Except where otherwise agreed in writing, fees for completed work are non-refundable, as our services involve
          time, labor, and resources that cannot be recovered once performed.
        </p>

        <h2>Client Responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>Provide timely access to the accounts, platforms, credentials, and materials needed to perform the services;</li>
          <li>Provide accurate, complete, and lawful information and content;</li>
          <li>Maintain your own accounts and subscriptions on third-party platforms such as GoHighLevel, Twilio, and others, and comply with their terms, including A2P 10DLC registration and messaging compliance requirements;</li>
          <li>Use our services and any deliverables only for lawful purposes and in compliance with applicable laws, including those governing marketing, privacy, and electronic communications; and</li>
          <li>Obtain all necessary consents from your own contacts and end users.</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>
          Subject to full payment, deliverables we create specifically for you under an engagement are licensed or
          transferred to you as set out in the applicable agreement. We retain ownership of our pre-existing
          intellectual property, including our methodologies, frameworks, templates, snapshots, code libraries, tools,
          and know-how, and we may grant you a non-exclusive license to use such pre-existing materials to the extent
          incorporated into your deliverables. You retain ownership of the content, data, and materials you provide to
          us.
        </p>

        <h2>Third-Party Platforms &amp; Services</h2>
        <p>
          Our services often involve third-party platforms such as GoHighLevel, Twilio, and others. We are not
          affiliated with, endorsed by, or responsible for these third parties, their availability, performance,
          pricing, or changes to their services. Your use of any third-party platform is subject to that
          provider&apos;s own terms of service and policies, and you are responsible for complying with them. We are
          not liable for any loss arising from a third-party platform&apos;s acts, omissions, outages, or changes.
        </p>

        <h2>Confidentiality</h2>
        <p>
          Each party may receive confidential information from the other in the course of an engagement. Both parties
          agree to use such confidential information only for purposes of the engagement and to protect it with
          reasonable care. This obligation does not apply to information that is publicly available, independently
          developed, or required to be disclosed by law.
        </p>

        <h2>Warranties &amp; Disclaimers</h2>
        <p>
          We perform our services in a professional and workmanlike manner. However, except as expressly stated in a
          signed agreement, our website and services are provided <strong>&ldquo;as is&rdquo;</strong> and
          <strong> &ldquo;as available&rdquo;</strong> without warranties of any kind, whether express or implied,
          including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do
          not guarantee any specific results, revenue, lead volume, conversion rates, or business outcomes from our
          services.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, GHL Prime shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or for any loss of profits, revenue, data, or business, arising out of or
          related to your use of the website or our services. To the fullest extent permitted by law, our total
          aggregate liability arising out of or related to an engagement shall not exceed the fees actually paid by you
          to us for the services giving rise to the claim.
        </p>

        <h2>Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless GHL Prime and its members, officers, employees, and
          contractors from and against any claims, liabilities, damages, losses, and expenses, including reasonable
          attorneys&apos; fees, arising out of or related to your content, your use of the services or deliverables,
          your violation of these Terms, your violation of any third-party platform&apos;s terms, or your violation of
          any applicable law or the rights of a third party.
        </p>

        <h2>Term &amp; Termination</h2>
        <p>
          These Terms remain in effect while you use the website or our services. Either party may terminate an
          engagement in accordance with the applicable agreement. We may suspend or terminate your access to the
          website or services at any time for conduct that violates these Terms or applicable law. Upon termination,
          fees for work performed up to the termination date remain payable, and any provisions intended to survive
          (including intellectual property, confidentiality, disclaimers, limitation of liability, and indemnification)
          will continue to apply.
        </p>

        <h2>Governing Law &amp; Dispute Resolution</h2>
        <p>
          These Terms and any dispute arising out of or relating to them or our services are governed by the laws of
          the State of New Mexico, USA, without regard to its conflict-of-laws principles. The parties agree to first
          attempt to resolve any dispute informally by contacting one another. Any dispute that cannot be resolved
          informally shall be subject to the exclusive jurisdiction of the state and federal courts located in
          Bernalillo County, New Mexico.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. When we make material changes, we will revise the &ldquo;Last
          updated&rdquo; date at the top of this page. Your continued use of the website or services after changes take
          effect constitutes acceptance of the revised Terms.
        </p>

        <h2>Contact Us</h2>
        <p>If you have questions about these Terms, please contact us:</p>
        <ul>
          <li>GHL Prime LLC</li>
          <li>4801 Lang Ave NE, Suite 110, Albuquerque, NM 87109, USA</li>
          <li>Email: info@ghlprime.com</li>
        </ul>
      </div>
      <SiteFooter />
    </main>
  )
}
