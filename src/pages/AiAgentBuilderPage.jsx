import ServiceDetailTemplate from '../components/ServiceDetailTemplate'

const config = {
  slug: '/services/ai-agent-builder',
  category: 'Vibe Coding & AI Dev',
  breadcrumbName: 'AI Agent Builder',
  seo: {
    title: 'Hire an AI Agent Builder GoHighLevel | GHL Prime',
    description: `Hire GHL Prime to build AI agents that qualify leads, answer calls, and run your business 24/7 WhatsApp, voice & GHL AI Employee builds. Book a call.`,
  },
  serviceSchema: {
    name: 'AI Agent Development for GoHighLevel',
    description: `Design, build, and deploy AI agents lead qualification bots, voice receptionists, WhatsApp agents, and AI call centers inside GoHighLevel or custom-coded.`,
    serviceType: 'AI agent development',
  },
  hero: {
    mockup: 'phone',
    eyebrow: 'AI Agent Development',
    h1: 'Hire an AI Agent Builder for Your Business',
    subhead: `GHL Prime designs, builds, and deploys AI agents tailored to your business lead qualification bots, voice receptionists, WhatsApp agents, and full AI call centers. Built inside GoHighLevel or custom-coded. Handed to you production-ready.`,
    ctaPrimary: { label: 'Book a Free Call', to: '/booking' },
    ctaSecondary: { label: 'See AI Agent Case Studies', to: '/case-studies' },
    badges: ['WhatsApp AI', 'Voice Agent', 'GHL AI Employee', 'Retell AI', 'Twilio'],
  },
  stats: [
    { num: '24/7', label: 'Agent availability' },
    { num: '< 30s', label: 'Average response time' },
    { num: '5–7 days', label: 'From call to live agent' },
    { num: '0', label: 'Leads missed while you sleep' },
  ],
  whatIs: {
    eyebrow: 'Overview',
    h2: 'What Is an AI Agent and What Can It Do for Your Business?',
    paragraphs: [
      `An AI agent is an automated system that uses artificial intelligence to handle real business conversations and tasks without human involvement. When you hire an AI agent builder like GHL Prime, you get a system that understands context, qualifies leads, books appointments, routes conversations, and integrates with your CRM in real time.`,
      `Unlike a basic chatbot, a properly built AI agent makes decisions. GHL Prime builds agents inside GoHighLevel using the AI Employee module, and also builds more advanced custom agents using external AI APIs connected via webhook when the native platform is not enough.`,
      `Many builds combine an AI agent with your [GoHighLevel workflows](/services/vibe-coding), [custom SaaS development](/services/custom-saas-development), and [white-label support](/services/saas-customer-support) so the whole stack works together. Want one for your business? [Book a free consultation](/booking) and we will map the highest-value agent on the call.`,
    ],
    cta: { label: 'Book a Free Call', to: '/booking' },
    visual: {
      kind: 'code',
      filename: 'agent-config.ts',
      code: `// AI lead qualification agent
const agent = createAgent({
  channel: "whatsapp",
  qualify:  true,
  book:     true,
  crm:      "gohighlevel",
});

// ✓ Agent live · 0 leads missed · 24/7`,
    },
  },
  deliver: {
    h2: 'AI Agents: What We Deliver',
    cards: [
      { icon: 'Workflow', title: 'Lead Qualification AI', text: 'An AI agent that engages every inbound lead, asks the right qualifying questions, scores them, and routes hot leads straight to your sales team inside GoHighLevel.' },
      { icon: 'MessageSquare', title: 'WhatsApp AI Agent', text: 'A conversational AI agent on WhatsApp Business that handles inquiries, qualifies prospects, and books calls 24/7, in your brand voice.' },
      { icon: 'Phone', title: 'AI Voice Receptionist', text: 'A voice agent that answers inbound calls, handles FAQs, collects caller information, and routes or books appointments using Twilio and Retell AI or GHL native tools.' },
      { icon: 'Mail', title: 'AI Email Follow-Up System', text: 'An AI-driven email sequence that personalizes follow-ups based on contact behavior, stage, and responses built inside GoHighLevel workflows.' },
      { icon: 'Bot', title: 'GoHighLevel AI Employee Setup', text: 'Full setup and configuration of GHL native AI Employee module trained on your business, connected to your pipelines, and deployed across your channels.' },
      { icon: 'Headphones', title: 'AI Call Center Build', text: 'A multi-agent AI call center that handles inbound volume, qualifies callers, captures data, and escalates to humans only when it is genuinely needed.' },
      { icon: 'Code2', title: 'Custom AI Agent (External APIs)', text: 'When GHL native AI is not enough, we build custom agents using Claude, GPT-4o, or other AI APIs connected to your GHL via webhooks and Supabase.' },
      { icon: 'UserCheck', title: 'AI Onboarding System', text: 'An automated AI agent that guides new clients through onboarding, collects information, and triggers the right GHL workflows at every step.' },
    ],
  },
  flowAfterDeliver: {
    eyebrow: 'The agent journey',
    h2: 'How The Agent Works',
    numbered: false,
    steps: [
      { icon: 'Inbox', title: 'Lead comes in', text: 'A new lead messages your WhatsApp, SMS, or web chat any hour, any day of the week.' },
      { icon: 'Bot', title: 'AI Agent qualifies', text: 'The agent asks your qualifying questions, scores the lead, and answers in your brand voice.' },
      { icon: 'CalendarCheck', title: 'CRM updated + Call booked', text: 'Hot leads are written to GoHighLevel and a call is booked automatically with zero manual work.' },
    ],
  },
  how: {
    h2: 'How It Works',
    steps: [
      { title: 'Strategy Call', text: 'We map your business workflow, identify the highest-value automation opportunities, and recommend the right agent type for your goals.', meta: 'Same-day reply' },
      { title: 'Build & Prompt Engineering', text: 'We design the agent logic, write and refine the prompts, connect it to your GHL pipelines and CRM, and test every decision path.', meta: 'Full prompt engineering included' },
      { title: 'Testing & Refinement', text: 'We run the agent through real scenarios, fix edge cases, tune the responses, and make sure it handles your actual inbound conversations correctly.', meta: 'Real-scenario testing' },
      { title: 'Deploy & Hand Over', text: 'We deploy the agent to your live environment, connect your channels, and walk you through the system so you can manage it confidently.', meta: 'Docs + training included' },
    ],
  },
  who: {
    h2: 'Who Hires Us to Build AI Agents?',
    cards: [
      { icon: 'Briefcase', title: 'Marketing Agencies', text: 'Offer AI agent setup as a productized service to your clients. We build it white-labeled under your brand.' },
      { icon: 'Home', title: 'Real Estate Businesses', text: 'Qualify and follow up with every inbound lead automatically, 24/7, without adding any headcount.' },
      { icon: 'Users', title: 'Coaching & Service Businesses', text: 'Handle inquiries, book discovery calls, and onboard new clients without ever touching your phone.' },
      { icon: 'Server', title: 'SaaS Companies', text: 'Build AI agents that handle onboarding questions, support tickets, and feature inquiries so your team focuses on growth.' },
    ],
  },
  why: {
    h2: 'Why Hire GHL Prime to Build Your AI Agent?',
    intro: `Most "AI agent" offers are thin template configurations. GHL Prime is GoHighLevel AI Employee certified and builds custom agents when the native platform is not enough with full prompt engineering, not just a settings toggle.`,
    points: [
      'GHL AI Employee certified we know the platform AI inside out',
      'We build custom agents when native GHL is not enough',
      'Full prompt engineering included not just template configuration',
      'WhatsApp, voice, email, and chat true multi-channel builds',
      'Handed over with documentation and team training',
      'No contract hire by project or retain ongoing',
    ],
  },
  faqIntro: 'How we build agents, where they deploy, timelines, training data, fixes, and what happens after launch.',
  faqs: [
    { q: 'Can GHL Prime build AI agents inside GoHighLevel without custom code?', a: 'Yes. GHL Prime holds the official GoHighLevel AI Employee certification and builds AI agents natively inside the platform configuring conversational flows, connecting them to pipelines, and training them on your business content. For more advanced use cases that exceed GHL native capabilities, we also build custom agents using external AI APIs connected via webhook.' },
    { q: 'What channels can the AI agent be deployed on?', a: 'We deploy AI agents across WhatsApp, SMS, live chat, email, and voice. For voice agents we use GoHighLevel native calling tools or integrate Retell AI and Twilio for more advanced telephony. Each channel is configured separately and connected to your central GoHighLevel CRM so all conversations are tracked in one place.' },
    { q: 'How long does it take to build and deploy an AI agent?', a: 'A GoHighLevel AI Employee setup typically takes 3–7 days. A custom WhatsApp or voice agent build ranges from 1–2 weeks depending on complexity. AI call center systems with multiple agent flows generally require 2–3 weeks. We give you a specific timeline on your discovery call based on your exact requirements.' },
    { q: 'Do I need to provide training data or a script for the AI agent?', a: 'No we handle the prompt engineering and training process. We interview you about your business, review your existing sales and support materials, and write the agent logic and responses ourselves. You review and approve before deployment. If you already have scripts or FAQs, we incorporate them.' },
    { q: 'Can you improve or fix an AI agent someone else already built?', a: 'Yes. We frequently audit, fix, and improve AI agents that were set up incorrectly or are underperforming. Common issues include poor prompt engineering, missing edge case handling, and incomplete CRM integration. Send us your current setup and we will assess it on your discovery call.' },
    { q: 'What happens after the agent is deployed?', a: 'We walk you through the full system, provide documentation, and offer ongoing support and optimization. Many clients retain GHL Prime monthly to monitor agent performance, refine responses as their business evolves, and build additional agent flows over time.' },
  ],
  cta: {
    headline: 'Build an AI Agent That Works While You Sleep.',
    subtext: 'Strategy call today. Agent live within the week.',
    primaryLabel: 'Book a Free Call',
  },
}

export default function AiAgentBuilderPage() {
  return <ServiceDetailTemplate config={config} />
}
