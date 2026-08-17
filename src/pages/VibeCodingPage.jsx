import ServiceDetailTemplate from '../components/ServiceDetailTemplate'

export const config = {
  slug: '/services/vibe-coding',
  category: 'Vibe Coding & AI Dev',
  breadcrumbName: 'Vibe Coding & Custom Development',
  seo: {
    title: 'Hire a Vibe Coder AI-First Custom Dev | GHL Prime',
    description: `Hire GHL Prime's vibe coding team to build custom dashboards, tools, and integrations GoHighLevel can't do natively Claude Code & Supabase. Book a free call.`,
  },
  serviceSchema: {
    name: 'Vibe Coding & AI-Assisted Custom Development',
    description: `AI-assisted custom development using Claude Code, Cursor, and modern AI-first workflows to ship production-ready tools, dashboards, and integrations.`,
    serviceType: 'AI-assisted custom software development',
  },
  hero: {
    eyebrow: 'Vibe Coding & Custom Dev',
    h1: 'Hire a Vibe Coding Team That Actually Ships',
    subhead: `Most dev teams slow you down. GHL Prime's vibe coding specialists build custom tools, dashboards, integrations, and AI-powered apps using Claude Code, Cursor, and modern AI-first workflows and ship production-ready builds in days, not weeks.`,
    ctaPrimary: { label: 'Book a Free Call', to: '/booking' },
    ctaSecondary: { label: 'See Our Work', to: '/case-studies' },
    badges: ['Claude Code', 'Cursor', 'Lovable', 'Supabase', 'Vercel', 'Next.js'],
  },
  stats: [
    { num: '3–5x', label: 'Faster than traditional dev' },
    { num: '48hr', label: 'From discovery call to build start' },
    { num: '4+', label: 'Years GHL & dev experience' },
    { num: '0', label: 'Setup fees or contracts' },
  ],
  whatIs: {
    eyebrow: 'How it works',
    h2: 'What Is Vibe Coding?',
    paragraphs: [
      `Vibe coding is AI-assisted development a skilled developer using tools like Claude Code, Cursor, and Lovable to build production software dramatically faster than traditional cycles. When you hire a vibe coder from GHL Prime, you are not betting on someone who prompts an AI and hopes the output works.`,
      `It is not just prompting and hoping. Real vibe coding requires technical judgment knowing when the AI output is wrong and being able to fix it. Our specialists average 4+ years of hands-on GoHighLevel and development experience, pairing genuine front-end and back-end fluency with AI-first workflows to ship custom features in days rather than weeks.`,
      `That means we build things most agencies cannot: live dashboards, [AI agents for GoHighLevel](/services/ai-agent-builder), and full [custom SaaS development](/services/custom-saas-development) projects wired into your existing stack. Have a build in mind? [Book a free consultation](/booking) and we will scope it, price it, and give you a realistic timeline on the call.`,
    ],
    cta: { label: 'Book a Free Call', to: '/booking' },
    visual: {
      kind: 'code',
      filename: 'workflow.ts',
      code: `// vibe coding with Claude Code
const result = await claude.build({
  prompt: "client portal with auth",
  stack: ["next.js", "supabase", "vercel"],
  deploy: true,
});

// ✓ Shipped in 3 days · live on Vercel`,
    },
  },
  deliver: {
    h2: 'Vibe Coding: What We Deliver',
    cards: [
      { icon: 'LayoutDashboard', title: 'Custom Dashboards', text: 'Internal reporting dashboards, client-facing portals, and live data visualizations connected to your real data sources. Built to match how your team actually works.' },
      { icon: 'Plug', title: 'API Integrations', text: 'Connect GoHighLevel with third-party platforms, internal tools, payment systems, and custom CRMs. Clean, maintainable integration code that does not break in production.' },
      { icon: 'Users', title: 'Client Portal Builds', text: 'Secure, branded client portals with role-based access, data isolation, and commission logic. Built on Supabase and deployed on Vercel for speed and reliability.' },
      { icon: 'Bot', title: 'AI-Powered Mini Apps', text: 'Lightweight AI tools, lead qualification apps, and custom GPT-powered interfaces. Built with Claude Code and modern AI APIs and wired into your workflow.' },
      { icon: 'Webhook', title: 'Webhook & Trigger Systems', text: 'Custom webhook handlers, data transformation logic, and event-driven automation that connects your entire stack. Reliable plumbing for everything downstream.' },
      { icon: 'Workflow', title: 'Automation Wrappers', text: 'When GoHighLevel workflows hit their limits, we build custom code layers that extend them with logic the native platform cannot handle on its own.' },
      { icon: 'MonitorSmartphone', title: 'Landing Pages & Funnels', text: 'High-converting, design-forward landing pages built from Figma or a brief. Responsive, fast, and CRO-optimized so they earn their traffic.' },
      { icon: 'Rocket', title: 'Rapid Prototypes', text: 'Need to validate an idea fast? We build functional prototypes in 24–72 hours using AI-first tools so you can test before you invest real money.' },
    ],
  },
  how: {
    h2: 'How It Works',
    steps: [
      { title: 'Discovery Call (Same Day)', text: 'You tell us what you need to build. We map the scope, pick the right stack, and give you a realistic timeline.', meta: 'Same-day reply · ~30 min · No commitment' },
      { title: 'Expert Matched in 24 Hours', text: 'We pair you with the right vibe coder from our team based on your stack and project type. You meet them before the build starts.', meta: 'Matched in 24 hours' },
      { title: 'Build Begins Within 48 Hours', text: 'Your expert gets to work using Claude Code and AI-first workflows. You get daily updates via Slack or your preferred channel.', meta: 'Daily updates' },
      { title: 'Ship, Test, Hand Off', text: 'Production-ready build delivered with documentation, deployment notes, and a walkthrough so you fully own what we built.', meta: 'Docs + walkthrough included' },
    ],
  },
  who: {
    h2: 'Who Hires Us for Vibe Coding?',
    cards: [
      { icon: 'Briefcase', title: 'Marketing Agencies', text: 'You need custom tools GoHighLevel cannot do natively dashboards, portals, integrations. Built fast, under your brand.' },
      { icon: 'Rocket', title: 'SaaS Founders', text: 'You have a product idea and need it validated or built fast. We move at founder speed, not slow agency speed.' },
      { icon: 'Users', title: 'In-House Teams Without Dev Resources', text: 'Your team knows what it wants but has no developer. We plug in as your on-demand technical partner.' },
      { icon: 'Network', title: 'Businesses Scaling Their Tech Stack', text: 'You are connecting GoHighLevel, Supabase, Stripe, Twilio, and five other tools and need someone to make them talk properly.' },
    ],
  },
  why: {
    h2: 'Why Hire GHL Prime for Vibe Coding?',
    intro: `Freelancers give you one person and one skill set. In-house hiring takes weeks and a salary. GHL Prime gives you a vetted vibe coder available the same day and because the work is white-labeled, your clients only ever see your brand on the output.`,
    points: [
      'Available the same day not weeks of hiring and interviews',
      'AI-first workflow ships 3–5x faster than traditional development',
      'White-labeled your brand on every deliverable',
      'GHL-native context we understand the platform your stack runs on',
      'Daily updates with no project-management overhead for you',
      'No contract, no setup fee hire by the hour or by the project',
    ],
  },
  faqIntro: 'What vibe coding is, the tools we use, how fast we ship, and how it is priced.',
  faqs: [
    { q: 'What is vibe coding and how is it different from normal development?', a: 'Vibe coding uses AI coding tools like Claude Code and Cursor to dramatically accelerate software development. A skilled developer directs the AI, reviews its output, fixes mistakes, and ships working code far faster than traditional methods. It is not just prompting it requires real technical judgment. GHL Prime has shipped production builds this way across dozens of client projects.' },
    { q: `What tools does GHL Prime's vibe coding team use?`, a: 'Our team primarily builds with Claude Code, Cursor, and Lovable for AI-assisted development. For infrastructure we use Supabase for databases and auth, Vercel for deployment, and Next.js 15 for full-stack applications. We also build integrations with GoHighLevel, Stripe, Twilio, n8n, Zapier, and most major third-party APIs your business runs on.' },
    { q: 'How fast can GHL Prime build a custom tool or integration?', a: 'Most simple integrations and custom automations are delivered in 2–5 days. Full-stack applications like client portals or internal dashboards typically take 1–3 weeks depending on scope. Rapid prototypes can be turned around in 24–72 hours. We give you a clear timeline on your discovery call before any work begins.' },
    { q: 'Can you build something if I only have a rough idea and no technical spec?', a: 'Yes. Many clients come to us with a problem, not a spec. We run a scoping call, translate your business requirement into a technical plan, and confirm the approach before building. You do not need to know the stack that is our job.' },
    { q: 'How much does vibe coding work cost?', a: 'GHL Prime offers hourly, project-based, and retainer models with no setup fees and no contracts. Hourly rates vary by project complexity. Most project-based builds are scoped and priced on your discovery call. You can also hire via our Upwork agency profile at upwork.com/agencies/ghlprime.' },
  ],
  cta: {
    headline: `If GHL Can't Do It, We'll Build It.`,
    subtext: `Tell us what you need. We'll scope it, price it, and ship it fast.`,
    primaryLabel: 'Book a Free Call',
  },
}

export default function VibeCodingPage() {
  return <ServiceDetailTemplate config={config} />
}
