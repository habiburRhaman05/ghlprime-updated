import ServiceDetailTemplate from '../components/ServiceDetailTemplate'

export const config = {
  slug: '/services/ghl-setup',
  category: 'GoHighLevel',
  breadcrumbName: 'GHL Setup & Configuration',
  seo: {
    title: 'GoHighLevel setup and configuration experts | GHL Prime',
    description: `Get GoHighLevel setup and configuration done right sub-accounts, pipelines, calendars, A2P/Twilio, snapshots, and clean migrations. Book a free call.`,
  },
  serviceSchema: {
    name: 'GoHighLevel Setup & Configuration',
    description: `Done-for-you GoHighLevel setup and configuration: sub-account architecture, pipelines, calendars, A2P 10DLC and Twilio compliance, reusable snapshots, and clean CRM migrations.`,
    serviceType: 'GoHighLevel setup and configuration',
  },
  hero: {
    mockup: 'setup',
    eyebrow: 'GHL Setup & Configuration',
    h1: 'Your GoHighLevel Setup and Configuration, Done Right the First Time',
    subhead: `A messy GoHighLevel account costs you leads, deliverability, and hours every week. GHL Prime's GoHighLevel Certified Admins set up your sub-accounts, pipelines, calendars, A2P/Twilio compliance, and snapshots correctly the first time so you can stop fighting the platform and start using it.`,
    ctaPrimary: { label: 'Book a Free Call', to: '/booking' },
    ctaSecondary: { label: 'See Our Work', to: '/case-studies' },
    badges: ['GoHighLevel', 'Sub-Accounts', 'Pipelines', 'Calendars', 'A2P / Twilio', 'Snapshots'],
  },
  showcase3D: {
    images: [
      '/dashboard1.png',
      '/dashboard2.png',
      '/db3.png',
      '/dashboard5.png'
    ]
  },
  stats: [
    { num: '1–2 wks', label: 'Typical full setup turnaround' },
    { num: '4+', label: 'Years avg GHL experience per specialist' },
    { num: '100+', label: 'GHL accounts built and configured' },
    { num: '0', label: 'Setup fees or contracts' },
  ],
  whatIs: {
    eyebrow: 'How it works',
    h2: 'What Does GoHighLevel Setup and Configuration Actually Involve?',
    paragraphs: [
      `GoHighLevel setup and configuration is the work of turning a blank or broken GHL account into a system your business can actually run on. That means sub-account architecture, pipelines and opportunity stages, calendars, A2P 10DLC registration, Twilio and email/domain authentication, reusable snapshots, and clean data migration. Done wrong, it leaks leads and tanks deliverability; done right, every lead lands in the right pipeline and every message gets delivered.`,
      `Most people who try to set up GoHighLevel alone get stuck on the parts that matter most A2P 10DLC compliance, domain authentication, and pipeline logic that mirrors how they actually sell. We handle the full build, then connect it to the rest of your stack with [GoHighLevel automation](/services/automation) so the system runs itself, and we can layer on [AI agents and conversational bots](/services/ai-agent-builder) once the foundation is solid.`,
      `Whether you are launching a brand-new account or untangling one another vendor left broken, we configure it to standard and document everything. If you also need a productized platform for your own clients, our [SaaS CRM build-out](/services/saas-crm) extends the same foundation. Want a clean account without the trial and error? [Book a free consultation](/booking) and we will audit your setup, scope the work, and give you a realistic timeline on the call.`,
    ],
    cta: { label: 'Book a Free Call', to: '/booking' },
    visual: { kind: 'dashboard-photo', photoSrc: '/db6.png', photoAlt: 'A GoHighLevel dashboard managed by GHL Prime' },
  },
  deliver: {
    h2: 'GoHighLevel Setup: What We Deliver',
    cards: [
      { icon: 'Building2', title: 'Account & Sub-Account Setup', text: 'We structure your agency account and sub-accounts the right way naming, permissions, branding, and team access. So clients are isolated, billing is clean, and nothing collides as you scale past your first ten accounts.' },
      { icon: 'GitBranch', title: 'Pipelines & Opportunity Stages', text: 'We build pipelines that mirror how you actually sell, with stages, automations, and clear win/loss logic. Every lead has a home and a next step, so nothing sits untouched in the inbox for days.' },
      { icon: 'CalendarCheck', title: 'Calendars & Booking', text: 'Round-robin, team, and service calendars configured with buffers, availability, and confirmation flows. Connected to your real availability and wired to reminders that cut no-shows by a third or more.' },
      { icon: 'ShieldCheck', title: 'A2P 10DLC & Twilio Compliance', text: 'We register your brand and campaigns for A2P 10DLC, connect Twilio, and get you sending compliant SMS. This is the step most setups botch and the reason their texts silently fail to deliver.' },
      { icon: 'Mail', title: 'Email & Domain Authentication', text: 'SPF, DKIM, and DMARC configured and verified so your emails land in the inbox, not spam. We connect your sending domain and dedicated domain correctly the first time, no guesswork.' },
      { icon: 'Boxes', title: 'Reusable Snapshots & Templates', text: 'We package your build into clean, reusable snapshots so you can launch a new client account in minutes instead of days. One source of truth you can version and roll out across every sub-account.' },
      { icon: 'LayoutDashboard', title: 'Forms, Funnels & Websites', text: 'Lead-capture forms, funnels, and full sites built natively in GoHighLevel and wired straight into your pipelines and automations. Fast, on-brand, and tracking conversions from the first click.' },
      { icon: 'Plug', title: 'Integrations & CRM Migration', text: 'We connect GoHighLevel to your payment, calendar, and third-party tools, and migrate contacts, history, and tags from your old CRM with zero data loss. You move over once, cleanly, and never look back.' },
    ],
  },
  how: {
    h2: 'How GoHighLevel Setup Works',
    steps: [
      { title: 'Audit & Discovery Call', text: 'We review your current account or requirements, map your sales process, and identify exactly what needs to be built, fixed, or migrated. You leave the call knowing the full scope.', meta: 'Same-day reply · ~30 min · No commitment' },
      { title: 'Build Plan & Snapshot Design', text: 'We design your sub-account structure, pipelines, calendars, and compliance setup, then plan a reusable snapshot so future accounts launch fast. You approve the blueprint before any building starts.', meta: 'Blueprint approved up front' },
      { title: 'Configuration & Compliance', text: 'Your GoHighLevel Certified Admin builds the account, registers A2P 10DLC, authenticates your domains, and migrates your data. You get progress updates and nothing goes live until it passes our checks.', meta: 'Daily updates · 1–2 week turnaround' },
      { title: 'Test, Hand Off & Document', text: 'We test every pipeline, calendar, and message flow end to end, then hand off with documentation and a walkthrough. You fully own and understand the system we built for you.', meta: 'Docs + walkthrough included' },
    ],
  },
  who: {
    h2: 'Who Hires Us for GoHighLevel Setup?',
    cards: [
      { icon: 'Briefcase', title: 'Agencies Onboarding Clients', text: 'You sign clients faster than you can set them up, and inconsistent builds are slowing you down. We give you a repeatable snapshot so every new sub-account launches the same way in minutes.' },
      { icon: 'Rocket', title: 'New GoHighLevel Account Owners', text: 'You just bought GoHighLevel and the blank screen is overwhelming. We configure the whole account to standard and hand you a system that works on day one, not month three.' },
      { icon: 'Wand2', title: 'Owners of a Messy Account', text: 'A past vendor or DIY attempt left your account broken failing texts, tangled pipelines, missed leads. We audit it, fix the foundation, and get deliverability back into the green.' },
      { icon: 'Network', title: 'Businesses Migrating From Another CRM', text: 'You are moving off HubSpot, Keap, or a legacy CRM and cannot afford to lose data or momentum. We migrate contacts, history, and tags cleanly and rebuild your workflows in GoHighLevel.' },
    ],
  },
  why: {
    h2: 'Why Hire GHL Prime for GoHighLevel Setup?',
    intro: `Anyone can toggle settings in GoHighLevel. Getting A2P 10DLC approved, deliverability green, and pipelines that match how you actually sell takes real platform expertise. GHL Prime gives you a GoHighLevel Certified Admin the highest GHL certification and because every build is white-labeled, your clients only ever see your brand.`,
    points: [
      'GoHighLevel Certified Admins the highest certification GHL offers',
      'A2P 10DLC and deliverability handled correctly, not skipped',
      'Reusable snapshots so future accounts launch in minutes, not days',
      'White-labeled your brand on every account and deliverable',
      'Clean CRM migrations with zero data loss and no downtime',
      'No contract, no setup fee hire by the project or by the hour',
    ],
  },
  faqIntro: 'How long setup takes, what A2P 10DLC involves, whether we fix broken accounts, and how migrations and pricing work.',
  faqs: [
    { q: 'How long does a full GoHighLevel setup and configuration take?', a: 'Most full setups take 1 to 2 weeks, depending on scope. A single sub-account with pipelines, calendars, and compliance is often live in under a week. The longest variable is A2P 10DLC approval, which is carrier-controlled and can take a few business days. We give you a firm timeline on your discovery call.' },
    { q: 'What is A2P 10DLC and do I really need it for GoHighLevel?', a: 'A2P 10DLC is the carrier registration required to send business SMS in the US. Without it, your texts are throttled or silently fail to deliver. It is the single most common reason a GoHighLevel account underperforms. We register your brand and campaigns, connect Twilio, and confirm your messages are landing before handoff.' },
    { q: 'Can you fix a messy GoHighLevel account instead of starting over?', a: 'Yes. We start with an audit of your existing account, identify what is broken failing SMS, tangled pipelines, bad deliverability and rebuild the foundation without losing your data. Across 100+ accounts, most messes come from skipped compliance and pipeline logic that never matched the real sales process.' },
    { q: 'Will I lose data migrating from another CRM to GoHighLevel?', a: 'No. We migrate contacts, conversation history, tags, and pipeline data from HubSpot, Keap, or any legacy CRM with zero data loss. We map your old fields to GoHighLevel, run a test import, verify it, then complete the full migration so you move over once, cleanly, with no downtime.' },
    { q: 'Do you build reusable snapshots so I can launch new accounts faster?', a: 'Yes. We package your configuration into clean, versioned snapshots so launching a new sub-account takes minutes instead of days. This is essential for agencies onboarding clients at volume. One approved build becomes your repeatable standard across every future GoHighLevel account.' },
    { q: 'How much does GoHighLevel setup and configuration cost?', a: 'GHL Prime works on project-based and hourly models with no setup fees and no contracts. A single-account build is priced differently from a multi-account agency rollout with a custom snapshot. Most setups are scoped and quoted on your free discovery call, so you know the cost before any work begins.' },
  ],
  cta: {
    headline: `Let's Get Your GoHighLevel Account Built Right.`,
    subtext: `Tell us where your account stands. We'll audit it, scope the work, and configure it to standard fast.`,
    primaryLabel: 'Book a Free Call',
  },
}

export default function GhlSetupPage() {
  return <ServiceDetailTemplate config={config} />
}
