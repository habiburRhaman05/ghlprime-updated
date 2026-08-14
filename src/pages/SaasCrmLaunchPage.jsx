import ServiceDetailTemplate from '../components/ServiceDetailTemplate'

const config = {
  slug: '/services/saas-crm',
  category: 'GoHighLevel',
  breadcrumbName: 'SaaS CRM Launch',
  seo: {
    title: 'GoHighLevel SaaS Mode Setup & CRM Launch | GHL Prime',
    description: `GoHighLevel SaaS mode setup done right — Stripe rebilling, plans, snapshots, and white-label branding to launch a profitable CRM product. Book a free call.`,
  },
  serviceSchema: {
    name: 'GoHighLevel SaaS Mode Setup & White-Label CRM Launch',
    description: `End-to-end GoHighLevel SaaS mode configuration: Stripe rebilling, plan and pricing tiers, productized snapshots, client provisioning, and white-label branding so agencies launch a profitable CRM product.`,
    serviceType: 'GoHighLevel SaaS mode setup and white-label CRM launch',
  },
  hero: {
    eyebrow: 'SaaS CRM Launch',
    h1: 'GoHighLevel SaaS Mode Setup to Launch Your Own CRM',
    subhead: `GoHighLevel SaaS mode lets you resell the platform as your own software — but the rebilling, plans, and provisioning have to be configured correctly to actually turn a profit. GHL Prime handles the full launch: Stripe, markup, snapshots, branding, and onboarding, so you sell software instead of fighting settings.`,
    ctaPrimary: { label: 'Book a Free Call', to: '/booking' },
    ctaSecondary: { label: 'See Our Work', to: '/case-studies' },
    badges: ['SaaS Mode', 'Rebilling', 'Stripe', 'Plans & Pricing', 'Snapshots', 'White-Label'],
  },
  stats: [
    { num: '3–4', label: 'Weeks to a live SaaS launch' },
    { num: '24/7', label: 'Support across US/CA/UK/AU' },
    { num: '4+', label: 'Years avg GHL experience' },
    { num: '0', label: 'Setup fees or contracts' },
  ],
  whatIs: {
    eyebrow: 'How it works',
    h2: 'What Is GoHighLevel SaaS Mode Setup?',
    paragraphs: [
      `GoHighLevel SaaS mode setup is the process of turning your GoHighLevel agency account into a true software business — where clients sign up, get billed automatically, and receive their own white-labeled CRM sub-account without you touching anything manually. SaaS mode is the feature that connects Stripe, sets your rebilling markup on phone, email, and AI usage, and provisions accounts from a snapshot the moment a payment clears.`,
      `The platform gives you the engine, but the configuration is where most agencies stall. Rebilling has to be margined correctly, plans need clean pricing tiers, and snapshots must be productized so every new customer lands in a working CRM, not an empty shell. We pair this launch with [ongoing white-label client support](/services/white-label-support) and a [dedicated SaaS customer support](/services/saas-customer-support) team so your users get help under your brand from day one.`,
      `If your roadmap goes past what native SaaS mode can do — a custom signup flow, usage dashboard, or a feature GoHighLevel does not ship — our [custom SaaS development](/services/custom-saas-development) team builds the missing layer. Want a real number on margin and timeline? [Book a free call](/booking) and we will map your plans, pricing, and provisioning live.`,
    ],
    cta: { label: 'Book a Free Call', to: '/booking' },
    visual: {
      kind: 'code',
      filename: 'saas-plans.ts',
      code: `// GoHighLevel SaaS plan config
const plans = [
  { name: "Starter", price: 97, rebill: 1.4 },
  { name: "Growth",  price: 297, rebill: 1.4 },
  { name: "Agency",  price: 497, rebill: 1.4 },
];
const snapshot = "crm-starter-v3";
const provision = "auto-on-payment";
// ✓ Stripe connected · margin locked · ok`,
    },
  },
  deliver: {
    h2: 'SaaS CRM Launch: What We Deliver',
    cards: [
      { icon: 'Settings', title: 'SaaS Mode Configuration', text: 'We enable and configure GoHighLevel SaaS mode end to end — wallet, usage rebilling, twilio and mailgun rebilling, and account-level controls. Set up once, correctly, so billing runs without surprises.' },
      { icon: 'Database', title: 'Stripe + Rebilling Setup', text: 'We connect Stripe, set your markup on phone, email, and AI usage, and verify the rebilling math so every minute and message earns margin. No more reselling platform costs at break-even.' },
      { icon: 'BarChart3', title: 'Plans & Pricing Tiers', text: 'We design clean plan tiers — typically 2 to 4 — with monthly and annual pricing, trials, and feature gating that map to real buyer segments. Pricing that converts and protects your margin.' },
      { icon: 'ShieldCheck', title: 'White-Label Branding & Domain', text: 'Your logo, colors, login page, and a custom domain across the whole app so clients never see GoHighLevel or GHL Prime. The product looks and feels entirely like yours.' },
      { icon: 'Boxes', title: 'Productized Snapshots', text: 'We build the snapshot every new customer loads — pipelines, automations, calendars, and templates pre-wired. Clients land in a working CRM on day one instead of a blank account.' },
      { icon: 'CalendarCheck', title: 'Client Onboarding Flows', text: 'Signup-to-active onboarding sequences, welcome automations, and in-app guidance that get customers using the product fast. Faster activation means lower churn and higher lifetime value.' },
      { icon: 'Workflow', title: 'Automated Provisioning', text: 'New sub-accounts spin up automatically the moment a payment clears — no manual setup per customer. The system scales from 5 clients to 500 without adding work for your team.' },
      { icon: 'FileCode2', title: 'Support & Documentation Setup', text: 'We stand up your help docs, ticket routing, and internal runbooks so support stays consistent as you grow. Pair it with our team and your users get answers under your brand.' },
    ],
  },
  how: {
    h2: 'How We Launch Your SaaS CRM',
    steps: [
      { title: 'Strategy & Pricing Call', text: 'We map your target customer, plan tiers, and rebilling margin so the numbers work before we configure anything. You leave the call with a clear pricing model.', meta: 'Same-day reply · ~45 min · No commitment' },
      { title: 'Build the Productized Snapshot', text: 'We assemble the snapshot every customer inherits — pipelines, automations, calendars, and templates — so new accounts are useful instantly, not empty.', meta: 'Snapshot built in week 1' },
      { title: 'Configure SaaS Mode & Stripe', text: 'We connect Stripe, set markup and rebilling, wire your plans, and apply white-label branding and your custom domain across the entire app.', meta: 'Billing + branding live' },
      { title: 'Test, Launch & Hand Off', text: 'We run real signups end to end, confirm provisioning and billing fire correctly, then hand off with docs and a walkthrough so you fully own the product.', meta: 'Docs + walkthrough included' },
    ],
  },
  who: {
    h2: 'Who Launches a SaaS CRM With Us?',
    cards: [
      { icon: 'Briefcase', title: 'Marketing Agencies', text: 'You already serve clients and want recurring software revenue on top of services. SaaS mode turns your GoHighLevel account into a product you sell monthly.' },
      { icon: 'Rocket', title: 'SaaS Founders & Resellers', text: 'You want to ship a CRM product without building from scratch. We get you to market in weeks using GoHighLevel as the engine under your brand.' },
      { icon: 'Network', title: 'Niche Software Sellers', text: 'You serve a specific vertical — dentists, gyms, contractors — and want a tailored CRM for it. We productize a snapshot built for that exact audience.' },
      { icon: 'Building2', title: 'Established Brands Adding Recurring Revenue', text: 'You have an audience or list and want a software line that bills monthly. We package GoHighLevel as your own SaaS so revenue compounds.' },
    ],
  },
  why: {
    h2: 'Why Launch With GHL Prime?',
    intro: `Plenty of people can flip the SaaS mode toggle. Far fewer can set rebilling margin, productize a snapshot, and wire provisioning so the business is actually profitable on day one. GHL Prime is a GoHighLevel Certified Admin team — and because the work is white-labeled, your clients only ever see your brand.`,
    points: [
      'GoHighLevel Certified Admin — the highest GHL certification',
      'Rebilling configured for real margin, not break-even reselling',
      'Most launches go live in 3 to 4 weeks, not months',
      'White-labeled end to end — your brand, your domain, your product',
      '24/7/365 support coverage across US, CA, UK, and AU',
      'No contract, no setup fee — scope and price it on the call',
    ],
  },
  faqIntro: 'What SaaS mode is, how rebilling and pricing work, how fast you can launch, and how it is priced.',
  faqs: [
    { q: 'What is GoHighLevel SaaS mode and what do I actually sell?', a: 'SaaS mode lets you resell GoHighLevel as your own white-labeled software. Customers sign up, get billed through Stripe, and receive their own branded CRM sub-account automatically. You sell a monthly software subscription instead of services. With rebilling, you also mark up usage like calls, texts, and AI on top of your plan price.' },
    { q: 'How does rebilling work and how do I make a profit?', a: 'Rebilling lets you charge customers more than your platform cost for phone, email, and AI usage — typically a 1.4x to 4x markup. We set your wallet, margin, and plan pricing so every subscription and every unit of usage earns. Done right, agency clients commonly report a 30% revenue lift within 90 days of launching.' },
    { q: 'How long does it take to launch a SaaS CRM?', a: 'Most launches go live in 3 to 4 weeks. Week one is strategy, pricing, and building your productized snapshot. The rest covers Stripe and SaaS mode configuration, white-label branding, your custom domain, and full end-to-end testing of signups, provisioning, and billing before you go public.' },
    { q: 'Will my customers know GoHighLevel or GHL Prime is behind it?', a: 'No. We apply your logo, colors, login page, and a custom domain across the entire app, so the product looks completely like yours. Our work is fully white-labeled. If you add our support team, your users get help under your brand and never learn GoHighLevel or GHL Prime is involved.' },
    { q: 'What if I need features beyond what native SaaS mode offers?', a: 'SaaS mode covers billing, plans, and provisioning, but some roadmaps need more — a custom signup flow, a usage dashboard, or a feature GoHighLevel does not ship. Our custom SaaS development team builds that layer on top of your account so you are never blocked by the platform ceiling.' },
    { q: 'How much does a SaaS CRM launch cost?', a: 'GHL Prime works on project-based and retainer models with no setup fees and no contracts. Most launches are scoped and priced on your strategy call once we know your plan tiers and snapshot scope. You can also hire our team through our Upwork agency profile if you prefer billing that way.' },
  ],
  cta: {
    headline: `Turn Your GHL Account Into a SaaS Product.`,
    subtext: `Tell us your audience. We'll scope the plans, set the margin, and launch it.`,
    primaryLabel: 'Book a Free Call',
  },
}

export default function SaasCrmLaunchPage() {
  return <ServiceDetailTemplate config={config} />
}
