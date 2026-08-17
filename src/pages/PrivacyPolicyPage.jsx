import SiteFooter from '../components/SiteFooter'

export default function PrivacyPolicyPage() {
  return (
    <main className="section section-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com/' },
            { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: 'https://ghlprime.com/privacy-policy' },
          ],
        }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          url: 'https://ghlprime.com/privacy-policy',
          name: 'Privacy Policy | GHL Prime',
          inLanguage: 'en-US',
          isPartOf: { '@id': 'https://ghlprime.com/#website' },
          datePublished: '2024-08-01',
          dateModified: '2026-06-02',
        }) }} />
      <div className="container" style={{ maxWidth: '860px' }}>
        <span className="eyebrow-label">Privacy Policy</span>
        <h1>Privacy Policy</h1>
        <p><strong>Last updated: June 2, 2026</strong></p>

        <h2>Introduction</h2>
        <p>
          GHL Prime LLC (&ldquo;GHL Prime,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a
          GoHighLevel and CRM automation services agency based in Albuquerque, New Mexico, USA. This Privacy Policy
          explains how we collect, use, disclose, and safeguard personal information when you visit our website at
          ghlprime.com, complete our contact or booking forms, communicate with us by email or text message, or
          engage us for services.
        </p>
        <p>
          By using our website or submitting information to us, you acknowledge that you have read and understood
          this Privacy Policy. If you do not agree with our practices, please do not use the website or provide us
          with personal information.
        </p>

        <h2>Information We Collect</h2>
        <h3>Information you provide to us</h3>
        <p>
          When you fill out a form, request a consultation, book a call, or otherwise contact us, we may collect
          information you choose to share, including your name, email address, telephone number, company or business
          name, website, and the contents of any message, project details, or booking information you submit.
        </p>
        <h3>Information collected automatically</h3>
        <p>
          When you visit our website, we and our service providers may automatically collect certain technical
          information through cookies and similar technologies. This may include your IP address, browser type and
          settings, device information, operating system, referring URLs, pages viewed, links clicked, and general
          usage and interaction data. This information helps us understand how visitors use our site and improve its
          performance.
        </p>
        <h3>SMS and phone consent data</h3>
        <p>
          If you opt in to receive text messages or provide a phone number for contact, we collect and retain records
          of your consent, your phone number, and the related communications so that we can deliver the messages you
          have requested and maintain compliance records.
        </p>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect for purposes that include:</p>
        <ul>
          <li>Responding to your inquiries, consultation requests, and booking submissions;</li>
          <li>Providing, performing, and managing the services you engage us for;</li>
          <li>Sending you service-related and, where you have consented, marketing communications by email or text;</li>
          <li>Operating, maintaining, securing, and improving our website and service delivery;</li>
          <li>Analyzing usage trends to improve user experience and content;</li>
          <li>Complying with legal obligations and enforcing our agreements; and</li>
          <li>Detecting, preventing, and addressing fraud, abuse, or security issues.</li>
        </ul>

        <h2>Cookies &amp; Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to operate our website, remember your preferences, and
          measure traffic and engagement. We may use third-party analytics tools (such as Google Analytics and a
          Microsoft Clarity-type behavioral analytics service) that set their own cookies to help us understand
          aggregate visitor behavior. Most browsers let you refuse or delete cookies through their settings; however,
          disabling cookies may affect the functionality of certain parts of the website.
        </p>

        <h2>Third-Party Services &amp; Sub-Processors</h2>
        <p>
          To operate our website, CRM, automations, and service workflows, we rely on trusted third-party platforms
          that may process personal information on our behalf as sub-processors. These may include, without limitation,
          GoHighLevel / LeadConnector (CRM, automation, and messaging infrastructure), Supabase (database and backend
          services), hosting and deployment providers such as Vercel, email delivery providers, and analytics
          providers. Each of these providers maintains its own privacy and security practices, and your information
          may be processed by them solely to provide services to us.
        </p>

        <h2>SMS/Text Messaging &amp; Communications Consent</h2>
        <p>
          If you provide your mobile number and opt in, we may send you text messages related to your inquiry, your
          project, appointment reminders, or, where permitted, marketing updates. Message frequency may vary. Message
          and data rates may apply depending on your mobile carrier and plan.
        </p>
        <p>
          You can opt out of text messages at any time by replying <strong>STOP</strong> to any message you receive
          from us. For assistance, reply <strong>HELP</strong> or contact us at info@ghlprime.com. After you opt out,
          you may receive a single confirmation message acknowledging your request.
        </p>
        <p>
          Mobile opt-in and consent information is <strong>not shared with third parties or affiliates for their own
          marketing purposes</strong>. Your consent to receive text messages is not a condition of any purchase.
        </p>

        <h2>How We Share Information</h2>
        <p>
          <strong>We do not sell your personal information.</strong> We may share information with the service
          providers and sub-processors described above who perform functions on our behalf, with professional advisors
          such as accountants and attorneys, and where required to comply with applicable law, legal process, or
          governmental request, or to protect our rights, property, or safety and that of others. In the event of a
          merger, acquisition, or sale of assets, information may be transferred as part of that transaction subject
          to this Privacy Policy.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain personal information for as long as necessary to fulfill the purposes described in this Policy,
          including to provide our services, maintain business and compliance records, resolve disputes, and enforce
          our agreements. When information is no longer needed, we take reasonable steps to delete or anonymize it.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement reasonable administrative, technical, and organizational measures designed to protect personal
          information against unauthorized access, loss, misuse, or alteration. However, no method of transmission over
          the internet or method of electronic storage is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2>Your Privacy Rights</h2>
        <p>
          Depending on where you live, you may have certain rights regarding your personal information.
        </p>
        <h3>EU/UK residents (GDPR/UK GDPR)</h3>
        <p>
          If you are located in the European Economic Area or the United Kingdom, you may have the right to access,
          correct, update, or request deletion of your personal data, to restrict or object to certain processing, and
          to data portability. You also have the right to lodge a complaint with your local data protection authority.
        </p>
        <h3>California residents (CCPA/CPRA)</h3>
        <p>
          If you are a California resident, you may have the right to know what personal information we collect, to
          request access to or deletion of that information, to correct inaccurate information, and to opt out of the
          &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information. As noted above, we do not sell your
          personal information. We will not discriminate against you for exercising any of these rights.
        </p>
        <p>
          To exercise any of these rights, please email us at info@ghlprime.com. We may need to verify your identity
          before responding to your request.
        </p>

        <h2>International Data Transfers</h2>
        <p>
          We are based in the United States, and the information we collect is processed and stored in the United
          States and other countries where our service providers operate. If you access our website or provide
          information from outside the United States, you understand that your information may be transferred to,
          stored, and processed in the United States, where data protection laws may differ from those in your
          jurisdiction.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          Our website and services are intended for businesses and adults and are not directed to children. We do not
          knowingly collect personal information from individuals under the age of 16 (or under 18 where applicable).
          If you believe a minor has provided us with personal information, please contact us so that we can delete it.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, or
          legal requirements. When we make material changes, we will revise the &ldquo;Last updated&rdquo; date at the
          top of this page. We encourage you to review this Policy periodically.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions or requests regarding this Privacy Policy or our data practices, please contact us:
        </p>
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
