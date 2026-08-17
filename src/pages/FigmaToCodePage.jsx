import ServiceDetailTemplate from '../components/ServiceDetailTemplate'

export const config = {
  slug: '/services/figma-to-code',
  category: 'Design & Build',
  breadcrumbName: 'Figma to Code',
  seo: {
    title: 'Figma to Code Agency Design to Production | GHL Prime',
    description: `Hire GHL Prime to turn Figma designs into production-ready code with Claude Code and AI-first development. Responsive, pixel-perfect. Book a free call.`,
  },
  serviceSchema: {
    name: 'Figma to Code Development',
    description: `Convert Figma designs into responsive, production-ready code HTML/CSS, Next.js, or Webflow using Claude Code and AI-first development workflows.`,
    serviceType: 'Design to code development',
  },
  hero: {
    mockup: 'figmaCode',
    eyebrow: 'Design to Code',
    h1: 'Figma to Code From Design to Production-Ready Build',
    subhead: `Most Figma handoffs end in frustration. GHL Prime bridges the gap we take your designs from static file to production-quality, responsive code using AI-first development tools. Pixel-perfect. Shipped fast. Ready to deploy.`,
    ctaPrimary: { label: 'Book a Free Call', to: '/booking' },
    ctaSecondary: { label: 'See Our Builds', to: '/case-studies' },
    badges: ['Figma Native', 'HTML/CSS', 'Next.js', 'Webflow', 'Pixel Perfect', 'Responsive'],
  },
  stats: [
    { num: '1–3 days', label: 'Landing page turnaround' },
    { num: '3', label: 'Breakpoints (mobile/tablet/desktop)' },
    { num: '1 round', label: 'Revisions included as standard' },
    { num: '100%', label: 'Figma-matched output' },
  ],
  whatIs: {
    eyebrow: 'Overview',
    h2: 'What Does Figma to Code Actually Mean?',
    paragraphs: [
      `A Figma design is a visual blueprint it shows what something should look like, but it is not a working website or application. As a Figma to code agency, GHL Prime translates designs into responsive, production-ready builds that match the design intent, not just the pixels.`,
      `Doing it right requires a developer who understands responsive behavior, animation, interactive states, accessibility, and performance not just someone who copies colors and margins. Our team uses Claude Code and Cursor to accelerate the build while applying real front-end judgment at every step.`,
      `Many builds pair with our [vibe coding](/services/vibe-coding) work or feed straight into [custom SaaS development](/services/custom-saas-development). If the page connects to a funnel, we handle that too. [Book a free call](/booking) and share your file to get started.`,
    ],
    cta: { label: 'Book a Free Call', to: '/booking' },
    visual: { kind: 'figma' },
  },
  deliver: {
    h2: 'Figma to Code: What We Deliver',
    tabs: ['HTML / CSS', 'Next.js', 'Webflow', 'Design + Build'],
    cards: [
      { icon: 'MonitorSmartphone', tab: 'HTML / CSS', title: 'Landing Page Builds', text: 'Take a Figma landing page to a fast-loading, conversion-optimized, responsive HTML/CSS/JS or Next.js build ready to deploy the same week.' },
      { icon: 'Wand2', tab: 'HTML / CSS', title: 'Animation & Interaction Layer', text: 'Add scroll-triggered animations, hover states, transitions, and micro-interactions on top of the base build using GSAP, Framer Motion, or CSS animations.' },
      { icon: 'Layers', tab: 'Next.js', title: 'Full Site Builds', text: 'Multi-page website builds from a complete Figma design file consistent components, responsive at all breakpoints, and clean semantic code.' },
      { icon: 'Boxes', tab: 'Next.js', title: 'Component Library Builds', text: 'Convert a Figma design system into a working React or HTML/CSS component library your team can maintain and extend over time.' },
      { icon: 'Network', tab: 'Webflow', title: 'Webflow & CMS Integration', text: 'Build from Figma into Webflow, with CMS structure, dynamic content, and reusable components fully editable by your team without touching code.' },
      { icon: 'PenTool', tab: 'Design + Build', title: 'Design + Build (Full Service)', text: 'No Figma file yet? We design it and build it clean, modern, high-converting web interfaces created in Figma and shipped as production code.' },
    ],
  },
  how: {
    h2: 'How It Works',
    steps: [
      { title: 'Share Your Figma File', text: 'Share your design file with us. If you do not have one yet, we design it first. We review the structure, breakpoints, and component logic before starting.', meta: 'View or dev access' },
      { title: 'Build Kickoff', text: 'We confirm the delivery format (HTML/CSS, Next.js, Webflow), set up the project, and begin the build. Most landing pages are in progress within 24 hours.', meta: 'In progress within 24h' },
      { title: 'Responsive & Interactive Build', text: 'We implement the design at all breakpoints, add interaction states, and apply animations. Daily updates so you can see progress as it happens.', meta: 'Daily updates' },
      { title: 'Review, Refine & Hand Off', text: 'We deliver the working build for your review, action your feedback, and hand over clean, documented code you can deploy or extend.', meta: '1 revision round included' },
    ],
  },
  who: {
    h2: 'Who Hires Us for Figma to Code?',
    cards: [
      { icon: 'PenTool', title: 'Web Design Agencies', text: 'You design. We build. Your clients get pixel-perfect production code without you needing a developer on staff.' },
      { icon: 'Rocket', title: 'Founders Launching Products', text: 'You have a design in Figma and need it live fast. We ship landing pages and product pages in days, not weeks.' },
      { icon: 'BarChart3', title: 'Marketing Teams', text: 'You have campaign landing pages that need to be built fast and look exactly as designed. No creative compromise in the dev handoff.' },
      { icon: 'Layers', title: 'Agencies Scaling Delivery', text: 'You have more design work than your current dev team can handle. We take the overflow builds and deliver them under your brand.' },
    ],
  },
  why: {
    h2: 'Why Hire GHL Prime for Figma to Code?',
    intro: `Anyone can paste a design into an AI tool and get something that looks close. The difference is the front-end judgment to catch what the AI gets wrong and clean, semantic code you do not have to rebuild later.`,
    points: [
      'Claude Code and Cursor build speed 3–5x faster than traditional dev',
      'Real front-end judgment we catch when AI output is wrong and fix it',
      'Design-aware typography, spacing, and hierarchy, not just code structure',
      'Fully white-labeled delivered under your brand, invisible to clients',
      'Clean, semantic, maintainable code not AI slop to clean up after',
      'GoHighLevel integration available if the page connects to a GHL funnel',
    ],
  },
  faqIntro: 'File formats, code output, responsiveness, animation, and whether we design as well as build.',
  faqs: [
    { q: 'What file format do you need to start a Figma to code build?', a: 'We work directly from Figma. Share the file URL with view or dev access and we handle the rest. If your designs are in other tools like Adobe XD or Sketch, we can work from exported assets and a clear brief. For projects where you need the design created first, we offer a full design-and-build service that starts in Figma before moving to code.' },
    { q: 'What code output do you deliver HTML, React, or something else?', a: 'We deliver in whatever format your project requires. Most landing pages are built in clean HTML/CSS/JavaScript. For multi-page sites and component-heavy builds we use Next.js with React. For clients who need a CMS or editable site, we build in Webflow. We confirm the delivery format before starting so there are no surprises at handoff.' },
    { q: 'How do you handle responsiveness mobile, tablet, and desktop?', a: 'Every build is fully responsive by default. We build mobile-first and test across standard breakpoints mobile (375px), tablet (768px), and desktop (1280px+). If your Figma file includes mobile designs, we match them exactly. If it only has desktop, we apply responsive best practices and share the mobile interpretation for your review before finalizing.' },
    { q: 'Can you add animations and scroll effects to the build?', a: 'Yes. We add animation layers using CSS transitions, GSAP, or Framer Motion depending on the project stack. Common additions include scroll-triggered fade-ins, hero entrance animations, parallax effects, hover micro-interactions, and loading transitions. If the animations are specified in the Figma file, we implement them. If not, we can propose and add them as part of the build.' },
    { q: 'Do you only build from existing designs, or can you design and build?', a: 'Both. If you have a complete Figma file, we take it straight to code. If you need the design created first, we offer a full design-to-build service we design the interface in Figma (landing page, site, or component) and then build it to production quality. This is ideal for clients who want a single team to own the entire front-end workflow.' },
  ],
  cta: {
    headline: 'Your Figma File. Production-Ready in Days.',
    subtext: `Share your design file and we'll have it live faster than you expect.`,
    primaryLabel: 'Book a Free Call',
  },
}

export default function FigmaToCodePage() {
  return <ServiceDetailTemplate config={config} />
}
