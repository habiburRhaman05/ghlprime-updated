// Single source of truth for the Services mega-menu and breadcrumb categories.
// Categories render in the navbar dropdown (desktop + mobile) and the footer.
// Pages that are not built yet still appear in the menu per the agreed
// information architecture; `built: false` marks the ones without a page.
//
// `description` on both the category and each item is new -- one-line copy
// for the mega-menu's two-panel layout. Every line is trimmed from that
// service's own page (`src/pages/<X>Page.jsx`, the `description:` meta
// field), not invented, so the menu never says something the linked page
// doesn't already back up.

export const SERVICE_MENU = [
  {
    category: 'GoHighLevel',
    description: 'Setup, automation, and white-label CRM support',
    items: [
      { label: 'GHL Setup & Configuration', description: 'Sub-accounts, pipelines, calendars, and A2P/Twilio done right', to: '/services/ghl-setup', built: true },
      { label: 'Workflow Automation', description: 'Follow-up, booking, and pipeline automation that runs 24/7', to: '/services/automation', built: true },
      { label: 'SaaS CRM Launch', description: 'Stripe rebilling, plans, and white-label branding to launch', to: '/services/saas-crm', built: true },
      { label: 'White-Label Support', description: '24/7 expert support under your brand, invisible to clients', to: '/services/white-label-support', built: true },
    ],
  },
  {
    category: 'Vibe Coding & AI Dev',
    description: 'AI agents and custom development builds',
    items: [
      { label: 'Vibe Coding & Custom Dev', description: "Custom tools and dashboards GoHighLevel can't build natively", to: '/services/vibe-coding', built: true },
      { label: 'AI Agent Builder', description: 'Lead-qualifying bots, voice receptionists, and AI call centers', to: '/services/ai-agent-builder', built: true },
      { label: 'Custom SaaS Development', description: 'Client portals and dashboards built with Claude Code & Supabase', to: '/services/custom-saas-development', built: true },
    ],
  },
  {
    category: 'Design & Build',
    description: 'Designs turned into production-ready code',
    items: [
      { label: 'Figma to Code', description: 'Pixel-perfect designs shipped as production-ready code', to: '/services/figma-to-code', built: true },
      { label: 'Web & Mobile App Development', description: 'iOS, Android, and web apps from MVP to production', to: '/services/app-development', built: true },
    ],
  },
  {
    category: 'Support',
    description: 'White-labeled customer support, 24/7',
    items: [
      { label: 'SaaS Customer Support', description: 'White-labeled ticket handling and onboarding, 24/7 coverage', to: '/services/saas-customer-support', built: true },
    ],
  },
]
