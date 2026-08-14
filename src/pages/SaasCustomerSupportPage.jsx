import ServiceDetailTemplate from '../components/ServiceDetailTemplate'

const config = {
  slug: '/services/saas-customer-support',
  category: 'Support',
  breadcrumbName: 'SaaS Customer Support',
  seo: {
    title: 'White-Label SaaS Customer Support Team | GHL Prime',
    description: `Hire GHL Prime to handle your SaaS support tickets under your brand. 24/7 coverage, GHL-certified agents, fast response times. No hiring. Book a call.`,
  },
  serviceSchema: {
    name: 'White-Label SaaS Customer Support',
    description: `Outsourced, fully white-labeled SaaS customer support delivered by GoHighLevel-certified agents — 24/7 ticket handling, onboarding, and escalation under your brand.`,
    serviceType: 'White-label customer support',
  },
  hero: {
    eyebrow: 'White-Label SaaS Support',
    h1: 'White-Label SaaS Customer Support — Your Brand, Our Experts',
    subhead: `Your SaaS is growing. Your support queue is growing faster. GHL Prime provides trained, white-labeled support agents who handle your tickets, onboard your users, and represent your brand 24/7 — without you hiring, training, or managing a support team.`,
    ctaPrimary: { label: 'Book a Free Call', to: '/booking' },
    ctaSecondary: { label: 'See How It Works', to: '/case-studies' },
    badges: ['24/7 Coverage', 'GHL Certified', 'Your Brand Only', '< 2hr Response'],
  },
  stats: [
    { num: '< 2hr', label: 'Average first response' },
    { num: '24/7', label: 'Coverage across all time zones' },
    { num: '98%', label: 'Typical client CSAT score' },
    { num: '5–7 days', label: 'Onboarding to go-live' },
  ],
  flowAfterStats: {
    eyebrow: 'How white-label works',
    h2: 'White-Label, Start to Finish',
    numbered: true,
    steps: [
      { title: 'Your client emails support@yourbrand.com', text: 'A request lands in your branded inbox — email, chat, or your helpdesk platform.' },
      { title: 'GHL Prime agent handles it', text: 'A GHL-certified agent answers as "YourBrand Support" — in your tone, with expert GoHighLevel knowledge.' },
      { title: 'Client gets an expert GHL answer', text: 'The issue is resolved fast. Your client sees only your brand, from first reply to resolution.' },
    ],
    note: `**Your clients never see "GHL Prime" anywhere.** We sign NDAs and follow your brand guidelines before handling a single ticket.`,
  },
  whatIs: {
    eyebrow: 'Overview',
    h2: 'What Is White-Label SaaS Customer Support?',
    paragraphs: [
      `White-label SaaS customer support means your clients get expert help from a trained team — but they see your brand, your email address, and your tone. GHL Prime stays invisible. This is not a generic outsourced call center.`,
      `GHL Prime's support agents are trained specifically on GoHighLevel and the SaaS products built on top of it — sub-account configuration, automation troubleshooting, onboarding flows, and the technical issues a general support agent simply cannot handle. Your clients get expert answers, fast. You get your time back.`,
      `Support pairs well with [AI agents for automated support](/services/ai-agent-builder) to deflect common questions, and with [custom SaaS development](/services/custom-saas-development) when your product needs new features. [Book a free consultation](/booking) and we will scope coverage to your ticket volume.`,
    ],
    visual: {
      kind: 'helpdesk',
      title: 'support-dashboard',
      tickets: [
        { id: '#1024', subject: 'How do I set up automation?', state: 'done', label: 'Resolved', time: '2m ago' },
        { id: '#1025', subject: 'Twilio SMS not sending', state: 'done', label: 'Resolved', time: '8m ago' },
        { id: '#1026', subject: 'Sub-account login issue', state: 'prog', label: 'In progress', time: 'now' },
      ],
      footer: 'Avg response: 47 min · Resolved today: 23 · CSAT: 98%',
    },
  },
  deliver: {
    h2: 'SaaS Support: What We Deliver',
    cards: [
      { icon: 'Inbox', title: 'Ticket Handling & Resolution', text: 'We receive, triage, and resolve support tickets from your SaaS clients — technical questions, how-to requests, and platform issues handled by GHL-trained agents.' },
      { icon: 'Clock', title: '24/7 Coverage', text: 'Support around the clock across US, Canada, UK, and Australia time zones. Your clients get fast responses regardless of when they reach out.' },
      { icon: 'ShieldCheck', title: 'Fully White-Labeled', text: 'We use your brand name, support email, helpdesk platform, and tone. Your clients interact with "your team" — never GHL Prime.' },
      { icon: 'UserCheck', title: 'Onboarding Support', text: 'We walk new clients through your SaaS product, help them configure their setup, and get them their first win fast — reducing churn in the critical first 30 days.' },
      { icon: 'LifeBuoy', title: 'SaaS Platform Expertise', text: 'Our agents are trained on GoHighLevel at admin and user level — sub-account issues, workflow questions, integration troubleshooting, and GHL-specific support generic agents cannot do.' },
      { icon: 'BarChart3', title: 'Escalation & Reporting', text: 'We escalate edge cases and bugs to your internal team with clear documentation, plus regular reporting on volume, response time, resolution rate, and common issues.' },
    ],
  },
  how: {
    h2: 'How It Works',
    steps: [
      { title: 'Onboarding Session', text: 'We learn your SaaS product, your client base, your common issues, and your brand voice. We document everything into an internal knowledge base your support agents follow.', meta: 'Knowledge base built for you' },
      { title: 'Team Setup', text: 'We configure your support channels — email, Intercom, Zendesk, Slack, or your platform — with GHL Prime agents operating under your brand identity.', meta: 'Your channels, your brand' },
      { title: 'Go Live', text: 'Your support queue is covered. Tickets are answered within your SLA. Your clients experience fast, knowledgeable support without you touching the queue.', meta: 'Within your SLA' },
      { title: 'Ongoing Optimization', text: 'We track ticket patterns, identify recurring issues, and feed that data back to you — so you can improve your product and reduce future support volume.', meta: 'Weekly performance reports' },
    ],
  },
  who: {
    h2: 'Who Hires Us for SaaS Customer Support?',
    cards: [
      { icon: 'Server', title: 'GoHighLevel SaaS Founders', text: 'You launched a white-label SaaS on GoHighLevel. Your clients need technical support and you cannot personally handle every ticket. We do it under your brand.' },
      { icon: 'Briefcase', title: 'Marketing Agencies With Retainer Clients', text: 'Your clients expect fast answers. You do not have the bandwidth to be on support 24/7. We handle it so you can focus on growth.' },
      { icon: 'BarChart3', title: 'Growing SaaS Products Hitting Ticket Volume', text: 'You are getting 15–30+ tickets per day. Hiring and training a full-time support person takes months. We are available this week.' },
      { icon: 'Sparkles', title: 'Agencies Wanting Premium Support Tiers', text: 'You want to offer a "premium" support tier at a higher price point. We staff it for you without you building a team.' },
    ],
  },
  why: {
    h2: 'Why Hire GHL Prime for SaaS Support?',
    intro: `The difference between GHL Prime and a generic helpdesk is expertise. Our agents hold GoHighLevel Certified Admin credentials — the highest certification on the platform — so they answer your clients instead of Googling your product.`,
    points: [
      'GHL-certified agents — not general staff Googling your platform',
      'Available 24/7, not business hours only',
      'Fully invisible to your clients — white-labeled every interaction',
      'No hiring, no training, no HR overhead',
      'Daily ticket updates and weekly performance reports',
      'Flexible volume — scale up for launches, down for quiet periods',
    ],
    pricing: [
      { name: 'Hourly', desc: 'Pay only for the coverage you actually use.' },
      { name: 'Per Ticket', desc: 'Great for lower-volume SaaS products.' },
      { name: 'Monthly Retainer', desc: 'Predictable, always-on coverage.', popular: true },
    ],
  },
  faqIntro: 'Whether clients know, what we handle, response times, helpdesk platforms, setup time, and pricing.',
  faqs: [
    { q: 'Will my clients know that GHL Prime is handling their support?', a: 'No. We operate completely under your brand — your company name, support email address, helpdesk platform, and communication tone. Your clients interact with what appears to be your internal support team. GHL Prime remains invisible in every interaction. We sign NDAs and follow your brand guidelines before handling a single ticket.' },
    { q: 'What GoHighLevel support issues can your agents handle?', a: 'Our agents are trained at the GoHighLevel Certified Admin level — the highest certification on the platform. We handle sub-account setup questions, workflow and automation troubleshooting, calendar and pipeline configuration, Twilio and A2P compliance issues, funnel and form questions, and general platform navigation. We escalate genuine bugs or outages to GoHighLevel support on your clients behalf.' },
    { q: 'What is your typical ticket response time?', a: 'We target first response within 1–4 hours for standard tickets and under 1 hour for urgent or critical issues, depending on the SLA agreed at onboarding. We cover all major time zones — US, Canada, UK, and Australia — so your clients get fast responses regardless of when they reach out.' },
    { q: 'What helpdesk platforms do you work with?', a: 'We work within your existing helpdesk setup — Intercom, Zendesk, Freshdesk, HelpScout, or your GoHighLevel-based support workflow. If you do not have a helpdesk platform set up, we can recommend and configure one as part of the onboarding process at no additional charge.' },
    { q: 'How quickly can the support team be set up and operational?', a: 'Most clients are live within 5–7 business days. The onboarding period covers knowledge base creation, brand configuration, channel setup, and a test run before going live. For urgent situations — such as a product launch or viral growth spike — we can fast-track onboarding in 2–3 days.' },
    { q: 'How is this priced — per ticket, per agent, or monthly retainer?', a: 'GHL Prime offers flexible pricing: hourly support coverage, per-ticket models for lower volume, and monthly retainer packages for predictable coverage. We discuss your ticket volume, coverage hours, and SLA requirements on the discovery call and give you a clear price before you commit. No setup fees and no long-term contracts.' },
  ],
  cta: {
    headline: 'Your Clients Deserve Fast Answers. We Deliver Them.',
    subtext: '24/7 expert support, fully under your brand. No hiring required.',
    primaryLabel: 'Book a Free Call',
  },
}

export default function SaasCustomerSupportPage() {
  return <ServiceDetailTemplate config={config} />
}
