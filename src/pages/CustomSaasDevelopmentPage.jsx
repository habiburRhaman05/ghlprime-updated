import ServiceDetailTemplate from '../components/ServiceDetailTemplate'

const config = {
  slug: '/services/custom-saas-development',
  category: 'Vibe Coding & AI Dev',
  breadcrumbName: 'Custom SaaS Development',
  seo: {
    title: 'Custom SaaS Development Agency — Claude Code | GHL Prime',
    description: `Hire GHL Prime to build custom SaaS tools, client portals, and dashboards with Claude Code, Supabase, Next.js and Vercel. Production-ready. Book a call.`,
  },
  serviceSchema: {
    name: 'Custom SaaS Development',
    description: `Custom client portals, internal dashboards, and multi-tenant SaaS applications built with Claude Code, Supabase, Next.js 15, and Vercel.`,
    serviceType: 'Custom SaaS application development',
  },
  hero: {
    mockup: 'clientPortal',
    eyebrow: 'Custom SaaS Development',
    h1: 'Custom SaaS Development Using Claude Code and Modern AI-First Tools',
    subhead: `GHL Prime builds custom client portals, internal dashboards, and SaaS tools using Claude Code, Supabase, Next.js, and Vercel — shipped faster than a traditional dev agency, with the security and quality production systems require.`,
    ctaPrimary: { label: 'Scope Your Build', to: '/booking' },
    ctaSecondary: { label: 'See Case Studies', to: '/case-studies' },
    badges: ['Claude Code', 'Next.js 15', 'Supabase', 'Vercel', 'RLS Security'],
  },
  stats: [
    { num: '1–4 wks', label: 'Typical full build time' },
    { num: 'Phase-by-phase', label: 'Delivery model' },
    { num: 'RLS', label: 'Database security standard' },
    { num: '0', label: 'Surprise scope changes' },
  ],
  whatIs: {
    eyebrow: 'Overview',
    h2: 'What Is AI-First SaaS Development?',
    paragraphs: [
      `AI-first development means building software with AI coding tools — primarily Claude Code — as the main development environment, not just as autocomplete. As a custom SaaS development agency, GHL Prime uses this approach to move 3–5x faster than traditional methods while keeping production-quality code.`,
      `Our developers are fluent in Claude Code workflows, Supabase for database and auth, Next.js 15 for full-stack applications, and Vercel for deployment. We build real, secure, production-ready systems — not prototypes that break in production.`,
      `Most SaaS builds also lean on our [vibe coding workflow](/services/vibe-coding) and connect to [AI agents](/services/ai-agent-builder) or a [Figma to code](/services/figma-to-code) front end. Ready to start? [Book a scoping call](/booking) and we will map the architecture and a phased timeline.`,
    ],
    cta: { label: 'Scope Your Build', to: '/booking' },
    visual: {
      kind: 'code',
      filename: 'schema.sql',
      code: `-- GHL Prime · Supabase schema
CREATE TABLE organisations (
  id   uuid PRIMARY KEY,
  name text NOT NULL
);

ALTER TABLE organisations
  ENABLE ROW LEVEL SECURITY;

-- ✓ Schema live · RLS active · secure`,
    },
  },
  deliver: {
    h2: 'Custom SaaS: What We Deliver',
    cards: [
      { icon: 'Users', title: 'Client-Facing Portals', text: 'Secure, branded portals where your clients log in to view their data, reports, and metrics — with role-based access and full data isolation per client.' },
      { icon: 'LayoutDashboard', title: 'Internal Admin Dashboards', text: 'Full-visibility internal tools for your team — campaign management, client oversight, commission tracking, sync status, and operational data in one place.' },
      { icon: 'Boxes', title: 'Multi-Tenant SaaS Applications', text: 'Complete SaaS architectures with organisation-level data isolation, user management, and subscription logic built on Supabase with proper RLS policies.' },
      { icon: 'BarChart3', title: 'Commission & Margin Engines', text: 'Server-side commission logic that stores raw data internally and serves marked-up or transformed data to clients — with full CRUD admin controls.' },
      { icon: 'Plug', title: 'Third-Party API & MCP Integrations', text: 'Connect to Meta Ads, Google, Stripe, GoHighLevel, and any platform with an API or MCP server — clean sync services with cron scheduling and error handling.' },
      { icon: 'Gauge', title: 'Reporting & Data Visualization', text: 'Interactive charts, pacing visualizations, trend graphs, and drill-down analytics built with Recharts or similar — connected to live data sources.' },
      { icon: 'Lock', title: 'Authentication & Access Control', text: 'Login, role-based permissions, multi-user client accounts, and secure session management — built on Supabase Auth with proper security design.' },
      { icon: 'Rocket', title: 'Deployment, Docs & Handoff', text: 'Every build ships with Vercel deployment, environment documentation, setup instructions, and a handoff walkthrough so your team can own and maintain it.' },
    ],
  },
  callout: {
    icon: 'ShieldCheck',
    title: 'Security by design',
    text: 'Raw data is never exposed in client-facing APIs. Row Level Security is enforced at the database level — not just in application code. Multi-tenant isolation is built into the schema from the first commit.',
  },
  phases: {
    h2: 'The 7 Delivery Phases',
    items: [
      { name: 'Database schema', text: 'Tables, relationships, and data model designed before any feature code is written.', group: 'blue' },
      { name: 'Backend services', text: 'Sync services, business logic, and API routes that power the application.', group: 'blue' },
      { name: 'Auth & RLS policies', text: 'Supabase Auth plus Row Level Security policies that enforce isolation at the database.', group: 'blue' },
      { name: 'Frontend build', text: 'The application UI, wired to live data with role-based views.', group: 'teal' },
      { name: 'Data visualization', text: 'Charts, dashboards, and drill-down analytics on top of real data.', group: 'teal' },
      { name: 'Deployment', text: 'Production deployment to Vercel with environment configuration.', group: 'green' },
      { name: 'Docs & handoff', text: 'Documentation and a walkthrough so your team owns and maintains the system.', group: 'green' },
    ],
  },
  how: {
    h2: 'How It Works',
    steps: [
      { title: 'Scoping Call', text: 'You explain what you need to build. We map the requirements, identify the right architecture, and give you a phased delivery plan with honest timelines per phase.', meta: 'Honest per-phase timelines' },
      { title: 'Schema & Architecture First', text: 'Before writing a line of feature code, we design the database schema, RLS policies, and data architecture. Getting this right upfront prevents expensive rebuilds later.', meta: 'No expensive rebuilds' },
      { title: 'Phase-by-Phase Build', text: 'We build in logical phases: database, backend services, auth, frontend, deployment. You see working software at each phase, not just at the end.', meta: 'Working software every phase' },
      { title: 'Deploy, Document & Hand Over', text: 'Final deployment to Vercel, full environment documentation, and a walkthrough session so your team understands and can maintain the system.', meta: 'You own the code' },
    ],
  },
  who: {
    h2: 'Who Hires Us for Custom SaaS Development?',
    cards: [
      { icon: 'Briefcase', title: 'Marketing Agencies Building Client Portals', text: 'You want to show clients their campaign data in a branded portal — without exposing your margin or using a generic third-party tool.' },
      { icon: 'Rocket', title: 'SaaS Founders Validating an Idea', text: 'You have a concept and need a working MVP fast. We build it in weeks using AI-first workflows that match founder speed.' },
      { icon: 'Settings', title: 'Agencies Needing Internal Tooling', text: 'Your team uses spreadsheets and disconnected tools. We build a single internal dashboard that centralizes your operational data.' },
      { icon: 'Boxes', title: 'Businesses That Have Outgrown No-Code', text: 'You started on no-code tools but now need real custom logic, proper multi-tenant security, and production-grade infrastructure.' },
    ],
  },
  why: {
    h2: 'Why Hire GHL Prime for Custom SaaS Development?',
    intro: `We build with Claude Code as the primary development environment — not as a helper bolted onto an old process. That speed, paired with real Supabase security expertise, is what separates a production SaaS from a tutorial-grade build.`,
    points: [
      'Claude Code is the primary dev environment — not just a helper',
      'Real RLS policies and proper multi-tenant design, not tutorial setup',
      'We understand the GoHighLevel ecosystem your SaaS connects to',
      'Phase-based delivery — you see progress weekly, not after months',
      'Security-first — client data isolation, no raw data in client APIs',
      'Full handoff — you own the code, the infrastructure, the docs',
    ],
  },
  faqIntro: 'The stack we use, how we secure multi-tenant data, timelines, rescues, and MCP servers.',
  faqs: [
    { q: 'What is the tech stack GHL Prime uses for custom SaaS builds?', a: 'Our standard stack is Next.js 15 for the application layer, Supabase for the database and authentication, and Vercel for deployment. For data visualization we use Recharts. For AI features we integrate with Claude, OpenAI, or other APIs as needed. We connect to third-party platforms via their official APIs or MCP servers where available.' },
    { q: 'How do you handle data security and client isolation in multi-tenant systems?', a: 'We implement Row Level Security policies in Supabase that enforce data isolation at the database level — not just in application code. Each client or organisation can only access their own data, even if there is a bug in the application layer. Sensitive data like raw spend figures or commission margins is stored server-side and never returned in client-facing API responses.' },
    { q: 'How long does a custom SaaS build take?', a: 'Most projects are delivered in phases. A Supabase schema and basic backend typically takes 3–5 days. A complete client portal with auth, dashboards, and API integrations usually takes 2–4 weeks total. We break every project into phases so you can review working software before the next phase begins rather than waiting until the end.' },
    { q: 'Can you take over a build someone else started?', a: 'Yes. We regularly inherit existing codebases, incomplete builds, or systems built by previous developers. We start with a code review, assess what is salvageable, and give you an honest recommendation on whether to continue from the existing base or rebuild cleanly. Many mid-build rescues are faster to complete than starting over.' },
    { q: 'Do you use MCP servers in your builds?', a: 'Yes. Where a platform provides an official MCP server — such as Meta Ads — we integrate using the MCP rather than a raw REST API where it provides advantages. Our developers work in Claude Code with MCP servers connected as part of their standard workflow, so this is native to how we build, not an add-on.' },
  ],
  cta: {
    headline: 'Scope Your Build Today. Ship It This Month.',
    subtext: 'We move at founder speed. No slow agency cycles, no vague timelines.',
    primaryLabel: 'Scope Your Build',
  },
}

export default function CustomSaasDevelopmentPage() {
  return <ServiceDetailTemplate config={config} />
}
