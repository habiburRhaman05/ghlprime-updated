// Single source of truth for every page the "Shipped Evidence" showcase can
// be placed on. `key` is what gets stored in showcase_placements.page_key;
// `label` is the human-readable name shown in the admin placement checklist.
//
// Service keys are `service:<slug>` where <slug> matches each service page's
// config.slug (e.g. /services/vibe-coding -> service:vibe-coding). Keep this in
// sync if service pages are added or their slugs change.
export const SHOWCASE_PAGES = [
  { key: 'home', label: 'Homepage' },
  { key: 'service:vibe-coding', label: 'Vibe Coding' },
  { key: 'service:ai-agent-builder', label: 'AI Agent Builder' },
  { key: 'service:custom-saas-development', label: 'Custom SaaS Development' },
  { key: 'service:figma-to-code', label: 'Figma to Code' },
  { key: 'service:saas-customer-support', label: 'SaaS Customer Support' },
  { key: 'service:ghl-setup', label: 'GHL Setup' },
  { key: 'service:automation', label: 'Automation' },
  { key: 'service:saas-crm', label: 'SaaS CRM Launch' },
  { key: 'service:white-label-support', label: 'White-Label Support' },
  { key: 'service:app-development', label: 'App Development' },
]

// Derive the placement page_key for a service page from its config.slug.
// '/services/vibe-coding' -> 'service:vibe-coding'
export function pageKeyForServiceSlug(slug) {
  const clean = String(slug || '').replace(/^\/services\//, '').replace(/^\/+|\/+$/g, '')
  return clean ? `service:${clean}` : ''
}

export function labelForPageKey(key) {
  const match = SHOWCASE_PAGES.find((page) => page.key === key)
  return match ? match.label : key
}
