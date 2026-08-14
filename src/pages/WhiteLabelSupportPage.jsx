import ServiceDetailTemplate from '../components/ServiceDetailTemplate'

const config = {
  slug: '/services/white-label-support',
  category: 'GoHighLevel',
  breadcrumbName: 'White-Label Support',
  seo: {
    title: 'White-Label GoHighLevel Support for Agencies | GHL Prime',
    description: `Get 24/7 white-label GoHighLevel support for your agency. Expert chat, email, and call help under your brand — your clients never see us. Book a free call.`,
  },
  serviceSchema: {
    name: 'White-Label GoHighLevel Support',
    description: `24/7/365 white-label GoHighLevel support for marketing agencies — live chat, email, and call coverage delivered under your brand by GHL Certified Admins.`,
    serviceType: 'White-label client support and helpdesk',
  },
  hero: {
    eyebrow: 'White-Label Support',
    h1: '24/7 White-Label GoHighLevel Support for Your Agency',
    subhead: `Your clients expect fast, expert answers — but staffing a round-the-clock helpdesk is brutal. GHL Prime becomes your support team: GHL Certified specialists handling chat, email, and calls under your brand, 24/7/365, so your clients never wait and never know we exist.`,
    ctaPrimary: { label: 'Book a Free Call', to: '/booking' },
    ctaSecondary: { label: 'See Our Work', to: '/case-studies' },
    badges: ['24/7/365', 'GHL Certified', 'Your Brand Only', 'Live Chat', 'US/CA/UK/AU'],
  },
  stats: [
    { num: '24/7/365', label: 'Coverage across 4 time zones' },
    { num: '<2hr', label: 'Average first response time' },
    { num: '4+', label: 'Years avg GHL experience per agent' },
    { num: '$0', label: 'Cost to your clients to reach support' },
  ],
  whatIs: {
    eyebrow: 'How it works',
    h2: 'What Is White-Label GoHighLevel Support?',
    paragraphs: [
      `White-label GoHighLevel support means GHL Prime answers your clients' questions as if we were your in-house team. Every chat, email, and call goes out under your brand, your logo, and your support address — your clients only ever see your agency. You get a full helpdesk of GoHighLevel Certified Admins without hiring, training, or scheduling a single person.`,
      `It is not a generic call center reading scripts. Our specialists average 4+ years of hands-on GoHighLevel experience, so they actually fix funnels, workflows, calendars, and integrations instead of escalating everything back to you. If your clients run their own software, our [SaaS customer support for product end users](/services/saas-customer-support) covers that lane, while this service handles broad agency client support across every channel.`,
      `We plug into your [GoHighLevel setup and account](/services/ghl-setup), deflect repetitive tickets with an [AI agent that answers common questions first](/services/ai-agent-builder), and escalate the rest with full documentation. Want to see how it fits your agency? [Book a free consultation](/booking) and we will map your coverage, response targets, and brand voice on the call.`,
    ],
    cta: { label: 'Book a Free Call', to: '/booking' },
    visual: { kind: 'support' },
  },
  deliver: {
    h2: 'White-Label Support: What We Deliver',
    cards: [
      { icon: 'MessageSquare', title: 'Live Chat & Email Coverage', text: 'We staff your live chat and inbox under your brand, answering client questions in real time across every time zone. Fast, accurate replies that keep your CSAT high without you touching the keyboard.' },
      { icon: 'UserCheck', title: 'New-Client Onboarding', text: 'We walk your new clients through their GoHighLevel account, snapshots, and first workflows so they start strong. A smooth onboarding cuts early churn and reduces the support load that follows.' },
      { icon: 'Settings', title: 'Technical GHL Troubleshooting', text: 'Broken funnels, failed automations, calendar conflicts, domain and email deliverability issues — our certified team diagnoses and fixes the actual GoHighLevel problem instead of just logging it.' },
      { icon: 'Inbox', title: 'Ticket Handling & Resolution', text: 'Every request is triaged, tracked, and resolved inside your helpdesk with clear status updates. Nothing falls through the cracks, and your clients always know where their ticket stands.' },
      { icon: 'Phone', title: 'Call & Zoom Support', text: 'For issues that are faster to talk through, we hop on a branded call or Zoom screen-share. Real human help on your line, scheduled or on-demand, so complex problems get solved in one session.' },
      { icon: 'Gauge', title: 'Account Health Monitoring', text: 'We proactively watch client accounts for failed automations, paused campaigns, and integration breaks. Catching issues before clients notice turns support into a retention engine for your agency.' },
      { icon: 'GitBranch', title: 'Escalation With Documentation', text: 'When something needs your sign-off or a dev fix, we hand it up with a full write-up — steps taken, root cause, and a recommended next move. You get context, not a vague help request.' },
      { icon: 'BarChart3', title: 'Weekly Reporting', text: 'You get a weekly snapshot of ticket volume, response and resolution times, common issues, and CSAT trends. Clear data so you can see exactly what your support layer is handling.' },
    ],
  },
  how: {
    h2: 'How It Works',
    steps: [
      { title: 'Discovery & Scope (Same Day)', text: 'We learn your client base, common issues, tools, and brand voice, then map the coverage hours and response targets you need.', meta: 'Same-day reply · ~30 min · No commitment' },
      { title: 'White-Label Onboarding', text: 'We set up your branded helpdesk, chat widget, and support email, then build a knowledge base from your snapshots and SOPs so answers stay consistent.', meta: 'Live in days, not weeks' },
      { title: 'Go Live Under Your Brand', text: 'Your support channels go live 24/7/365. Clients chat, email, and call your brand — our GHL Certified team handles every conversation behind it.', meta: '24/7/365 coverage' },
      { title: 'Monitor, Report, Improve', text: 'We track metrics, send weekly reports, and tune the knowledge base as patterns emerge so resolution times keep dropping over time.', meta: 'Weekly reporting included' },
    ],
  },
  who: {
    h2: 'Who Hires Us for White-Label Support?',
    cards: [
      { icon: 'Briefcase', title: 'Growing Marketing Agencies', text: 'You signed more clients than your team can support and answers are slipping. We add a full helpdesk overnight so service quality scales with your client count.' },
      { icon: 'Clock', title: 'Agencies Needing After-Hours Cover', text: 'Your clients message at night and on weekends, but your team works business hours. We cover the gaps so nobody waits until Monday for help.' },
      { icon: 'Building2', title: 'GoHighLevel SaaS Resellers', text: 'You resell GoHighLevel under your own brand and need expert support your clients can trust. We become the certified team behind your reseller offer.' },
      { icon: 'Users', title: 'Solo Operators & Small Teams', text: 'You are wearing every hat and support is eating your day. We take the tickets off your plate so you can focus on sales and delivery, not the inbox.' },
    ],
  },
  why: {
    h2: 'Why Hire GHL Prime for White-Label Support?',
    intro: `Hiring and training your own 24/7 support team is expensive and slow — and most help desks have no real GoHighLevel expertise. GHL Prime gives you GHL Certified Admins answering under your brand from day one, with no contracts and no setup fees.`,
    points: [
      'Fully white-labeled — your clients never know GHL Prime exists',
      '24/7/365 coverage across US, Canada, UK, and Australia',
      'GHL Certified Admins with 4+ years average experience',
      'Under 2-hour average first response across chat and email',
      'AI ticket deflection so simple questions get answered instantly',
      'No contract, no setup fee — scale coverage up or down anytime',
    ],
  },
  faqIntro: 'How white-label support works, what your clients see, the channels we cover, and how it is priced.',
  faqs: [
    { q: 'What does white-label GoHighLevel support actually mean?', a: 'It means GHL Prime answers your clients as your in-house team. Every chat, email, and call uses your brand, logo, and support address, so clients only ever see your agency. We work invisibly behind your helpdesk, fixing GoHighLevel issues under your name. Your clients never learn GHL Prime is involved.' },
    { q: 'Will my clients know they are talking to GHL Prime?', a: 'No. The service is 100% white-labeled. We use your brand voice, your support email, and your chat widget, so every interaction looks like it came from your team. We never reveal GHL Prime to your clients. You stay the trusted brand while we handle the work behind the scenes.' },
    { q: 'What channels and hours do you cover?', a: 'We cover live chat, email, phone, and Zoom screen-shares, all under your brand. Coverage runs 24/7/365 across the US, Canada, UK, and Australia, so your clients get expert help at 2 PM or 2 AM. Our average first response time is under 2 hours, and we tailor exact hours to your plan.' },
    { q: 'Can you actually fix GoHighLevel problems, not just log tickets?', a: 'Yes. Our team are GoHighLevel Certified Admins averaging 4+ years of hands-on experience, so we resolve funnels, workflows, calendars, integrations, and deliverability issues directly. We only escalate to you when sign-off or custom dev work is required, and even then we hand it up with full documentation.' },
    { q: 'How is this different from your SaaS customer support service?', a: 'White-label support is broad client support for a marketing agency, covering everything your GoHighLevel clients need across chat, email, and calls. Our SaaS customer support service is purpose-built for the end users of a SaaS product. If you run a software product, that lane fits better, and we can advise on the call.' },
    { q: 'How much does white-label support cost and is there a contract?', a: 'Pricing is based on coverage hours and ticket volume, with no setup fees and no long-term contracts. You can scale support up or down as your client base changes. Most plans are scoped and priced on your free discovery call, and you can also hire through our Upwork agency profile.' },
  ],
  cta: {
    headline: `Give Your Clients Support That Never Sleeps.`,
    subtext: `We become your 24/7 helpdesk under your brand. You keep the credit — we do the work.`,
    primaryLabel: 'Book a Free Call',
  },
}

export default function WhiteLabelSupportPage() {
  return <ServiceDetailTemplate config={config} />
}
