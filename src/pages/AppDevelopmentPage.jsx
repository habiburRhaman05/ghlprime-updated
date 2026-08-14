import ServiceDetailTemplate from '../components/ServiceDetailTemplate'

const config = {
  slug: '/services/app-development',
  category: 'Design & Build',
  breadcrumbName: 'Web & Mobile App Development',
  seo: {
    title: 'Web & Mobile App Development Agency | GHL Prime',
    description: `Hire GHL Prime to build custom iOS, Android & web apps with React Native, Flutter, Next.js & Supabase. MVP to production, App Store included. Book a free call.`,
    ogImage: 'https://ghlprime.com/og-app-development.png',
  },
  serviceSchema: {
    name: 'Web and Mobile App Development',
    description: `GHL Prime builds custom iOS, Android, and web applications using React Native, Flutter, Next.js, and Supabase — from MVP to production-ready SaaS products.`,
    serviceType: 'Mobile and Web Application Development',
  },
  hero: {
    mockup: 'appTabs',
    eyebrow: 'Web & Mobile App Development',
    h1: 'Web and Mobile App Development Agency',
    subhead: `GHL Prime builds custom iOS apps, Android apps, and web applications from MVP to production — using React Native, Flutter, Next.js, and Supabase. Delivered fast with AI-first workflows, full App Store submission, and GoHighLevel integration built in.`,
    ctaPrimary: { label: 'Book a Free Call', to: '/booking' },
    ctaSecondary: { label: 'See Our Work', to: '/case-studies' },
    badges: ['React Native', 'Flutter', 'Next.js', 'iOS', 'Android', 'Supabase', 'Vercel', 'Claude Code'],
  },
  stats: [
    { num: '2–4 wks', label: 'MVP delivery' },
    { num: 'iOS + Android', label: 'Single codebase' },
    { num: 'App Store', label: 'Full submission included' },
    { num: '0', label: 'Setup fees or contracts' },
  ],
  whatIs: {
    eyebrow: 'How it works',
    h2: 'What Is Web and Mobile App Development?',
    paragraphs: [
      `Web and mobile app development is the process of designing, building, and deploying digital applications — a native iOS or Android app users download from the App Store, a web application they open in a browser, or a cross-platform app that runs everywhere from a single codebase. GHL Prime is a web and mobile app development agency that builds all three, using React Native and Flutter for mobile and Next.js with Supabase for web.`,
      `The global mobile app market reached $197.2 billion in 2025, with over 6.8 billion smartphone users and 81% of businesses now requiring mobile applications. Most agencies still move slowly and hand you a codebase you do not understand. We build differently — using [vibe coding workflows](/services/vibe-coding) with Claude Code and Cursor to ship production-ready apps 3–5x faster, without cutting corners on quality, security, or performance.`,
      `Whether you need an iOS app for your coaching business, an Android companion for your SaaS, or a web dashboard for your clients, we scope the build, pick the right stack, and deliver it phase by phase. Because we are also a GoHighLevel specialist team, we connect your app to your [GoHighLevel CRM](/services/ghl-setup) and can add [AI agents for your app](/services/ai-agent-builder) — or [book a free consultation](/booking) to map it out.`,
    ],
    cta: { label: 'Book a Free Call', to: '/booking' },
    visual: {
      kind: 'code',
      filename: 'app.tsx',
      code: `// Cross-platform mobile app
import { View, Text, TouchableOpacity } from 'react-native';

const DashboardScreen = () => (
  <View style={styles.container}>
    <Text style={styles.balance}>$124,580</Text>
    <Text style={styles.change}>+12.4% this month</Text>
    <TouchableOpacity style={styles.btn}>
      <Text>View Portfolio</Text>
    </TouchableOpacity>
  </View>
);

// iOS · Android · single codebase`,
    },
  },
  deliver: {
    h2: 'What GHL Prime Builds',
    cards: [
      { icon: 'Phone', title: 'iOS App Development', text: 'Native-quality iOS apps using React Native or Flutter — App Store ready, with biometric auth, push notifications, and offline support built in.' },
      { icon: 'Cpu', title: 'Android App Development', text: 'Native-quality Android apps using React Native or Flutter — Google Play compliant and optimized for the full range of Android device sizes and OS versions.' },
      { icon: 'Layers', title: 'Cross-Platform Mobile Apps', text: 'One codebase, two platforms. React Native and Flutter let us build for iOS and Android at once — cutting time and cost without sacrificing the native feel.' },
      { icon: 'LayoutDashboard', title: 'Web Application Development', text: 'Custom web apps, SaaS products, and internal tools built with Next.js 15 and Supabase — deployed on Vercel, with real auth, role-based access, and solid database design.' },
      { icon: 'MonitorSmartphone', title: 'Tablet App Development', text: 'iPad and Android tablet apps with optimized split-pane layouts, stylus support, and offline-first architecture — built on the same codebase as your mobile app.' },
      { icon: 'Rocket', title: 'MVP Builds', text: 'Validate your idea fast. We build functional MVPs in 2–4 weeks — enough to test with real users, gather feedback, and secure early customers before a full build.' },
      { icon: 'Send', title: 'App Store & Google Play Submission', text: 'We handle the full submission process — app signing, screenshots, metadata, compliance checks, and review responses. Both stores, from first submission to live.' },
      { icon: 'Plug', title: 'GoHighLevel App Integration', text: 'Connect your mobile or web app to your GoHighLevel CRM — sync contacts, trigger workflows, pull pipeline data, and push in-app events to GHL using the official API.' },
    ],
  },
  how: {
    h2: 'How We Build Your App',
    steps: [
      { title: 'Discovery & Scoping', text: 'You tell us what to build — platform, features, integrations, and goals. We map the right stack, break it into phases, and give you an honest timeline and cost estimate. No vague proposals.', meta: 'Free · ~45 min · No commitment' },
      { title: 'Design & Architecture', text: 'Before writing feature code, we design the architecture — database schema, API structure, auth flow, and UI wireframes. Getting this right upfront prevents costly rebuilds later.', meta: 'Figma wireframes · Schema · Stack confirmed' },
      { title: 'Phase-by-Phase Build', text: 'We build in logical phases: foundation, core features, integrations, polish. You see working software at the end of each phase, not just at the end. Daily updates throughout.', meta: 'Weekly demos · Daily updates · You own the code' },
      { title: 'Launch, Submit & Hand Off', text: 'App deployed to production, submitted to the App Store and Google Play, every environment variable documented, and a full handoff walkthrough so your team can maintain it.', meta: 'App Store + Play · Deployment docs · Walkthrough' },
    ],
  },
  who: {
    h2: 'Who Hires GHL Prime for App Development?',
    cards: [
      { icon: 'Briefcase', title: 'Marketing Agencies', text: 'Offer mobile app development as a productized service. We build it white-labeled under your brand — your clients see your agency name on every deliverable.' },
      { icon: 'Rocket', title: 'SaaS Founders', text: 'You have a product that needs a mobile companion app or a rebuild in a production-ready stack. We move at founder speed — MVP in weeks, not months.' },
      { icon: 'Users', title: 'Coaches & Service Businesses', text: 'You want a branded app in the App Store that delivers your content, books sessions, and keeps clients engaged — without enterprise app-agency rates.' },
      { icon: 'Network', title: 'Businesses With a GoHighLevel CRM', text: 'You run GoHighLevel and want an app or portal that connects to your CRM — syncing leads, showing client dashboards, or triggering automations from in-app events.' },
    ],
  },
  techStack: {
    eyebrow: 'Technology',
    h2: 'Our App Development Tech Stack',
    items: [
      { name: 'React Native', abbr: 'RN', color: '#149eca' },
      { name: 'Flutter', abbr: 'FL', color: '#0468d7' },
      { name: 'Swift (iOS)', abbr: 'SW', color: '#f05138' },
      { name: 'Kotlin (Android)', abbr: 'KT', color: '#e44857' },
      { name: 'Next.js 15', abbr: 'NX', color: '#0f172a' },
      { name: 'Supabase', abbr: 'SB', color: '#3ecf8e' },
      { name: 'Vercel', abbr: 'VC', color: '#0f172a' },
      { name: 'Firebase', abbr: 'FB', color: '#f57c00' },
    ],
    note: `We also build with Claude Code and Cursor — [AI-first development](/services/vibe-coding) tools that let our team ship production applications 3–5x faster than traditional methods. This is not vibe coding without judgment; it is AI-assisted development led by engineers who review every line, catch every security issue, and own the quality of the final output.`,
  },
  why: {
    h2: 'Why Hire GHL Prime to Build Your App?',
    intro: `Compare the typical options. A traditional agency is slow and expensive; a freelancer is unpredictable. GHL Prime ships fast, includes store submission, and connects your app to GoHighLevel natively.`,
    comparison: {
      columns: ['Traditional Agency', 'Freelancer', 'GHL Prime'],
      rows: [
        { feature: 'Timeline', vals: ['3–6 months', 'Unpredictable', '2–8 weeks'] },
        { feature: 'App Store submission', vals: ['Extra cost', 'Rarely included', 'Always included'] },
        { feature: 'GoHighLevel integration', vals: ['Needs separate team', 'Not available', 'Native expertise'] },
        { feature: 'AI-first workflow', vals: ['No', 'Sometimes', 'Always'] },
        { feature: 'White-labeled delivery', vals: ['No', 'No', 'Yes'] },
        { feature: 'Daily updates', vals: ['No', 'Varies', 'Always'] },
        { feature: 'Contracts required', vals: ['Yes', 'Sometimes', 'Never'] },
      ],
    },
    callouts: [
      { icon: 'Network', title: 'GHL-Native Context', text: 'We do not just build your app — we know how it connects to GoHighLevel. Most app agencies have never touched GHL. We build GHL integrations every day.' },
      { icon: 'Zap', title: 'AI-First Speed', text: 'We use Claude Code as our primary development environment, shipping production-quality builds 3–5x faster than agencies that still code the traditional way.' },
      { icon: 'CheckCircle2', title: 'No Disappearing Act', text: 'We do not hand you a repo and vanish. Every build includes deployment, documentation, and a walkthrough session. You own the code and know how to use it.' },
    ],
  },
  faqIntro: 'Types of apps, timelines, iOS + Android, store submission, cost, web vs mobile, and GoHighLevel integration.',
  faqs: [
    { q: 'What types of apps does GHL Prime build?', a: 'GHL Prime builds iOS apps, Android apps, cross-platform mobile apps, web applications, SaaS products, and client portals. We use React Native and Flutter for mobile, and Next.js with Supabase for web applications. Every build is production-ready and delivered with deployment documentation.' },
    { q: 'How long does it take to build a mobile app?', a: 'An MVP mobile app typically takes 2–4 weeks depending on complexity. A full-featured app with auth, payments, push notifications, and API integrations usually takes 4–8 weeks. We deliver in phases so you see working software weekly, not just at the end.' },
    { q: 'Do you build for both iOS and Android?', a: 'Yes. Using React Native or Flutter, we build a single codebase that runs natively on both iOS and Android. This approach cuts development time and cost significantly compared to building two separate native apps while delivering a native-quality experience on both platforms.' },
    { q: 'Can GHL Prime submit my app to the App Store and Google Play?', a: 'Yes. We handle the full App Store and Google Play submission process — app signing, metadata, screenshots, and review submission. We also handle any rejection responses and resubmissions until your app is live on both stores.' },
    { q: 'How much does it cost to build a custom app with GHL Prime?', a: 'GHL Prime offers project-based, hourly, and retainer pricing with no setup fees and no contracts. App development costs depend on features, platforms, and integrations. We scope and price every project on a free discovery call before any work begins. You can also hire via our Upwork agency profile.' },
    { q: 'What is the difference between a web app and a mobile app?', a: 'A web app runs in a browser and is accessed via URL — no download required. A mobile app is installed from the App Store or Google Play and can access native features like camera, GPS, push notifications, and biometric authentication. GHL Prime builds both, and can also build Progressive Web Apps (PWAs) that bridge the gap.' },
    { q: 'Do you integrate apps with GoHighLevel?', a: 'Yes. Many clients need their mobile or web app to connect with their GoHighLevel CRM — syncing leads, triggering workflows, updating contacts, or pulling reporting data. We build these integrations using the GHL API and webhooks so your app and your CRM stay in sync automatically.' },
  ],
  cta: {
    headline: 'Your App Idea. Live in Weeks.',
    subtext: 'Tell us what you want to build. We scope it free, pick the right stack, and ship it fast.',
    primaryLabel: 'Book a Free Call',
  },
}

export default function AppDevelopmentPage() {
  return <ServiceDetailTemplate config={config} />
}
