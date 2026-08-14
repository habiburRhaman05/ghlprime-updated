// Single source of truth for the Services mega-menu and breadcrumb categories.
// Categories render in the navbar dropdown (desktop + mobile) and the footer.
// Pages that are not built yet still appear in the menu per the agreed
// information architecture; `built: false` marks the ones without a page.

export const SERVICE_MENU = [
  {
    category: 'GoHighLevel',
    items: [
      { label: 'GHL Setup & Configuration', to: '/services/ghl-setup', built: true },
      { label: 'Workflow Automation', to: '/services/automation', built: true },
      { label: 'SaaS CRM Launch', to: '/services/saas-crm', built: true },
      { label: 'White-Label Support', to: '/services/white-label-support', built: true },
    ],
  },
  {
    category: 'Vibe Coding & AI Dev',
    items: [
      { label: 'Vibe Coding & Custom Dev', to: '/services/vibe-coding', built: true },
      { label: 'AI Agent Builder', to: '/services/ai-agent-builder', built: true },
      { label: 'Custom SaaS Development', to: '/services/custom-saas-development', built: true },
    ],
  },
  {
    category: 'Design & Build',
    items: [
      { label: 'Figma to Code', to: '/services/figma-to-code', built: true },
      { label: 'Web & Mobile App Development', to: '/services/app-development', built: true },
    ],
  },
  {
    category: 'Support',
    items: [
      { label: 'SaaS Customer Support', to: '/services/saas-customer-support', built: true },
    ],
  },
]
