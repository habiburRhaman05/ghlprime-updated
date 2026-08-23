// Service-page survey forms. Keyed by route slug.
// Local only: ServiceSurveyForm logs submissions to console.log().
// 4 steps each: contact -> about you -> needs (free-text) -> budget/scope.

// Sample value per custom business label, so the hint matches what is asked.
const BUSINESS_HINTS = {
  'Business / product name': 'Acme Analytics',
  'Your SaaS / agency name': 'Acme CRM',
  'Business / app name': 'Acme Fitness',
}

// Step 1 is identical on every form, so the placeholders live here once.
// businessLabel is the only part that varies per service (agency name, app
// name, and so on), and its placeholder follows whatever label it is given.
const CONTACT = (businessLabel) => [
  { name: 'name', label: 'Your name', type: 'text', required: true, placeholder: 'Jane Doe' },
  { name: 'email', label: 'Email address', type: 'email', required: true, placeholder: 'jane@youragency.com' },
  { name: 'phone', label: 'Phone number', type: 'phone', required: true },
  {
    name: 'business',
    label: businessLabel || 'Business name',
    type: 'text',
    required: true,
    placeholder: businessLabel ? `e.g. ${BUSINESS_HINTS[businessLabel] || 'Acme Co.'}` : 'Acme Marketing',
  },
]

export const SERVICE_FORMS = {
  // ---------------------------------------------------------------- GHL Setup
  '/services/ghl-setup': {
    titlePill: 'Free GHL Audit Included',
    titleSub: "Tell us about your setup, we'll map exactly what needs fixing.",
    heroSubhead:
      'A messy GoHighLevel account costs you leads and hours every week. Tell us where you stand and our Certified Admins will map the fix.',
    stepLabels: ['Your Info', 'About You', 'Your Needs', 'Scope'],
    submitLabel: 'Book My Free Call',
    steps: [
      { eyebrow: 'STEP 1 · WHO ARE YOU?', fields: CONTACT() },
      { eyebrow: 'STEP 2 · ABOUT YOU', questions: [
        { name: 'role', label: 'What best describes you?', options: ['Agency owner', 'SaaS founder', 'Business owner', 'Freelancer / consultant'] },
      ] },
      { eyebrow: 'STEP 3 · WHAT DO YOU NEED?', textarea: { name: 'needsDetail', label: 'Tell us what you need help with', placeholder: "Describe your setup, what's broken, any migration, and what you want fixed..." } },
      { eyebrow: 'STEP 4 · SCOPE', questions: [
        { name: 'subaccounts', label: 'How many sub-accounts are you managing?', options: ['Just me / pre-launch', '1–5 clients', '6–20 clients', '20+ clients'] },
      ] },
    ],
    success: {
      title: "Great, we'll be in touch within 2 hours.",
      subtitle: 'One of our GHL Certified Admins will review your situation and reach out to map your setup on a free call.',
      ctaLabel: 'Book a Call Now', ctaTo: '/booking',
    },
  },

  // ---------------------------------------------------------------- Automation
  '/services/automation': {
    titlePill: 'Free Automation Audit',
    titleSub: "Answer a few quick questions, we'll tell you exactly what to automate first.",
    heroSubhead:
      "Stop losing leads to slow follow-up and manual busywork. Tell us your setup and we'll show you what to automate first.",
    stepLabels: ['Your Info', 'About You', 'Your Needs', 'Budget'],
    submitLabel: 'Get My Automation Plan',
    steps: [
      { eyebrow: 'STEP 1 · WHO ARE YOU?', fields: CONTACT() },
      { eyebrow: 'STEP 2 · ABOUT YOU', questions: [
        { name: 'bizType', label: 'What type of business are you?', options: ['Marketing agency', 'Real estate', 'Coaching / consulting', 'SaaS company', 'Other'] },
      ] },
      { eyebrow: 'STEP 3 · WHAT DO YOU NEED?', textarea: { name: 'needsDetail', label: 'Describe your current workflow situation', placeholder: "E.g. 'I have a form but nothing fires after submission, and leads never get followed up...'" } },
      { eyebrow: 'STEP 4 · BUDGET', questions: [
        { name: 'budget', label: 'What is your monthly budget for this?', options: ['$100 – $500', '$500 – $1,500', '$1,500 – $3,000', '$3,000+'] },
      ] },
    ],
    success: {
      title: "We'll map your automation plan on a free call.",
      subtitle: 'A GHL automation specialist will reach out within 2 hours to walk through your highest-impact workflows.',
      ctaLabel: 'Book a Call Now', ctaTo: '/booking',
    },
  },

  // ---------------------------------------------------------------- AI Agent Builder
  '/services/ai-agent-builder': {
    titlePill: 'Free AI Agent Strategy Call',
    titleSub: "Tell us where you're losing leads, we'll show you exactly what to build.",
    heroSubhead:
      "AI agents that qualify leads, answer messages, and book calls 24/7. Tell us where you're losing leads and we'll design the build.",
    stepLabels: ['Your Info', 'About You', 'Your Needs', 'Scope'],
    submitLabel: 'Build My AI Agent',
    steps: [
      { eyebrow: 'STEP 1 · WHO ARE YOU?', fields: CONTACT() },
      { eyebrow: 'STEP 2 · ABOUT YOU', questions: [
        { name: 'bizType', label: 'What type of business are you?', options: ['Marketing agency', 'Real estate', 'Coaching / consulting', 'E-commerce / retail', 'SaaS or tech product'] },
      ] },
      { eyebrow: 'STEP 3 · WHAT DO YOU NEED?', textarea: { name: 'needsDetail', label: 'What do you want the AI agent to do?', placeholder: "E.g. 'Qualify inbound WhatsApp leads in English and Spanish and book calls...'" } },
      { eyebrow: 'STEP 4 · SCOPE & BUDGET', questions: [
        { name: 'leadVolume', label: 'How many inbound leads per month should it handle?', options: ['Under 100', '100–500', '500–2,000', '2,000+'] },
        { name: 'budget', label: 'What is your monthly budget for this?', options: ['$500 – $1,500', '$1,500 – $3,000', '$3,000 – $5,000', '$5,000+'] },
      ] },
    ],
    success: {
      title: 'Your AI agent strategy call is next.',
      subtitle: "Our AI agent specialist will reach out within 2 hours to design your agent's qualification flow and deployment plan.",
      ctaLabel: 'Book a Call Now', ctaTo: '/booking',
    },
  },

  // ---------------------------------------------------------------- Vibe Coding
  '/services/vibe-coding': {
    titlePill: 'Free Project Scoping Call',
    titleSub: "Tell us what you want to build, we'll scope it and price it same day.",
    heroSubhead:
      "Custom dashboards, portals, integrations, and AI mini-apps. Tell us what you want to build and we'll scope it same day.",
    stepLabels: ['Your Info', 'About You', 'The Build', 'Budget'],
    submitLabel: 'Scope My Build',
    steps: [
      { eyebrow: 'STEP 1 · WHO ARE YOU?', fields: CONTACT() },
      { eyebrow: 'STEP 2 · ABOUT YOU', questions: [
        { name: 'role', label: 'What best describes you?', options: ['Agency owner', 'SaaS founder', 'Startup / product team', 'Business needing internal tools'] },
      ] },
      { eyebrow: 'STEP 3 · THE BUILD', textarea: { name: 'needsDetail', label: 'Describe what you want to build', placeholder: "E.g. 'A client portal showing Meta Ads data with hidden markup, connected to GHL...'" } },
      { eyebrow: 'STEP 4 · BUDGET', questions: [
        { name: 'budget', label: 'What is your budget for this project?', options: ['Under $1,000', '$1,000 – $3,000', '$3,000 – $8,000', '$8,000+'] },
      ] },
    ],
    success: {
      title: "We'll scope your build on a free call.",
      subtitle: 'A vibe coding specialist will reach out within 2 hours with a clear scope, stack recommendation, and honest timeline.',
      ctaLabel: 'Book a Call Now', ctaTo: '/booking',
    },
  },

  // ---------------------------------------------------------------- Custom SaaS
  '/services/custom-saas-development': {
    titlePill: 'Free Architecture Review',
    titleSub: "Tell us what you're building, we'll design the right stack before writing code.",
    heroSubhead:
      "Multi-tenant platforms, client portals, and white-label products. Tell us what you're building and we'll design the right stack.",
    stepLabels: ['Your Info', 'Stage', 'Your Needs', 'Budget'],
    submitLabel: 'Start Architecture Review',
    steps: [
      { eyebrow: 'STEP 1 · WHO ARE YOU?', fields: CONTACT('Business / product name') },
      { eyebrow: 'STEP 2 · YOUR STAGE', questions: [
        { name: 'stage', label: 'What stage are you at?', options: ['Idea, nothing built yet', 'MVP in progress', 'Existing product that needs rebuilding', 'Scaling a working product'] },
      ] },
      { eyebrow: 'STEP 3 · YOUR PRODUCT', textarea: { name: 'needsDetail', label: 'Describe your product or the problem it solves', placeholder: "E.g. 'A portal where agency clients see their Meta Ads spend with multi-tenant isolation...'" } },
      { eyebrow: 'STEP 4 · BUDGET', questions: [
        { name: 'budget', label: 'What is your budget for this build?', options: ['$2,000 – $5,000', '$5,000 – $15,000', '$15,000 – $30,000', '$30,000+'] },
      ] },
    ],
    success: {
      title: "We'll design your architecture on a free call.",
      subtitle: 'A senior developer will reach out within 2 hours to review your product requirements and map the right stack.',
      ctaLabel: 'Book a Call Now', ctaTo: '/booking',
    },
  },

  // ---------------------------------------------------------------- Figma to Code
  '/services/figma-to-code': {
    titlePill: 'Free Build Estimate',
    titleSub: "Share your Figma file details, we'll quote same day.",
    heroSubhead:
      "Pixel-perfect, production-ready code from your Figma files. Share the design and we'll send a same-day quote.",
    stepLabels: ['Your Info', 'About You', 'The Design', 'Budget'],
    submitLabel: 'Get My Build Quote',
    steps: [
      { eyebrow: 'STEP 1 · WHO ARE YOU?', fields: CONTACT() },
      { eyebrow: 'STEP 2 · ABOUT YOU', questions: [
        { name: 'role', label: 'What best describes you?', options: ['Web design agency', 'Freelance designer', 'Startup / founder', 'Marketing team'] },
      ] },
      { eyebrow: 'STEP 3 · THE DESIGN', textarea: { name: 'needsDetail', label: 'Share your Figma link or describe the project', placeholder: "E.g. 'figma.com/file/..., a 5-page SaaS site, desktop + mobile, built in Next.js'" } },
      { eyebrow: 'STEP 4 · BUDGET', questions: [
        { name: 'budget', label: 'What is your budget for this build?', options: ['Under $500', '$500 – $1,500', '$1,500 – $4,000', '$4,000+'] },
      ] },
    ],
    success: {
      title: 'Your build quote is on the way.',
      subtitle: "We'll review your Figma file details and send a same-day quote with a clear timeline and delivery format.",
      ctaLabel: 'Book a Call Now', ctaTo: '/booking',
    },
  },

  // ---------------------------------------------------------------- White-Label Support
  '/services/saas-customer-support': {
    titlePill: 'Free Support Audit',
    titleSub: 'Tell us your support situation, we can be live under your brand in 5 days.',
    heroSubhead:
      "24/7 white-label support under your brand, live in 5 days. Tell us your support situation and we'll design your coverage.",
    stepLabels: ['Your Info', 'About You', 'Your Needs', 'Coverage'],
    submitLabel: 'Set Up My Support Team',
    steps: [
      { eyebrow: 'STEP 1 · WHO ARE YOU?', fields: CONTACT('Your SaaS / agency name') },
      { eyebrow: 'STEP 2 · ABOUT YOU', questions: [
        { name: 'role', label: 'What best describes you?', options: ['GoHighLevel SaaS founder', 'Marketing agency with retainer clients', 'Software product company', 'Agency scaling fast'] },
      ] },
      { eyebrow: 'STEP 3 · THE PROBLEM', textarea: { name: 'needsDetail', label: 'Describe your support situation', placeholder: "E.g. 'Too many tickets to keep up, clients mostly need help with automations and Twilio...'" } },
      { eyebrow: 'STEP 4 · COVERAGE & BUDGET', questions: [
        { name: 'coverage', label: 'What support coverage do you need?', options: ['Business hours only (9am–6pm)', 'Extended hours (8am–10pm)', '24/7, full round-the-clock coverage', 'Not sure yet'] },
        { name: 'budget', label: 'What is your monthly budget for support?', options: ['$300 – $800', '$800 – $2,000', '$2,000 – $5,000', '$5,000+'] },
      ] },
    ],
    success: {
      title: 'We can be live under your brand in 5 days.',
      subtitle: 'A support specialist will reach out within 2 hours to review your client base and design your coverage plan.',
      ctaLabel: 'Book a Call Now', ctaTo: '/booking',
    },
  },

  // ---------------------------------------------------------------- App Development
  '/services/app-development': {
    titlePill: 'Free App Scoping Call',
    titleSub: "Tell us what you want to build, we'll scope it and give you a realistic timeline.",
    heroSubhead:
      "Web and mobile apps built right. Tell us what you want to build and we'll map a realistic stack and timeline.",
    stepLabels: ['Your Info', 'The App', 'Your Needs', 'Budget'],
    submitLabel: 'Scope My App',
    steps: [
      { eyebrow: 'STEP 1 · WHO ARE YOU?', fields: CONTACT('Business / app name') },
      { eyebrow: 'STEP 2 · THE APP', questions: [
        { name: 'appType', label: 'What type of app are you building?', options: ['Consumer mobile app (iOS + Android)', 'Business / B2B mobile app', 'Web application / SaaS product', 'Internal business tool', 'App connected to GoHighLevel'] },
      ] },
      { eyebrow: 'STEP 3 · YOUR APP IDEA', textarea: { name: 'needsDetail', label: 'Describe your app idea', placeholder: "E.g. 'A finance tracking app for iOS + Android connected to our GHL CRM, with push notifications...'" } },
      { eyebrow: 'STEP 4 · BUDGET', questions: [
        { name: 'budget', label: 'What is your budget for this project?', options: ['$3,000 – $8,000 (MVP)', '$8,000 – $20,000', '$20,000 – $50,000', '$50,000+'] },
      ] },
    ],
    success: {
      title: 'Your app scoping call is next.',
      subtitle: 'A developer will reach out within 2 hours to review your requirements and map the right stack and timeline.',
      ctaLabel: 'Book a Call Now', ctaTo: '/booking',
    },
  },
}