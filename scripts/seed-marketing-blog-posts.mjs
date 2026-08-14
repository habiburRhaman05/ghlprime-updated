import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))

function parseEnv(path) {
  const env = {}
  const raw = readFileSync(path, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

const env = parseEnv(resolve(__dirname, '..', '.env'))
const SUPABASE_URL = env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const SEED_EMAIL = process.env.SEED_EMAIL
const SEED_PASSWORD = process.env.SEED_PASSWORD

if (!SEED_EMAIL || !SEED_PASSWORD) {
  console.error('Missing SEED_EMAIL or SEED_PASSWORD environment variables')
  process.exit(1)
}

const CTA_LINK = 'https://ghlprime.com/booking'

const ctaBox = (heading, body) =>
  `<div class="cta-box" style="background:#162a40;border:1px solid rgba(14,165,233,0.3);border-radius:12px;padding:2rem;margin:2rem 0;text-align:center;"><h3 style="color:#ffffff;margin:0 0 0.5rem;">${heading}</h3><p style="color:#94a3b8;margin:0 0 1.5rem;">${body}</p><a href="${CTA_LINK}" style="background:#0ea5e9;color:#ffffff;padding:0.75rem 2rem;border-radius:8px;text-decoration:none;font-weight:600;">Book a Free Call</a></div>`

// ---------------------------------------------------------------------------
// POST 1 — SaaS Mode setup guide (featured)
// ---------------------------------------------------------------------------
const post1Content = `<p class="lead">Turning GoHighLevel into your own white-label SaaS product is one of the highest-leverage moves an agency can make — but the setup trips up most first-timers. At GHL Prime we have configured over 40 SaaS Mode accounts, and the same handful of decisions separate a smooth launch from a billing nightmare. This guide walks you through the complete 2026 setup, end to end, so you can resell GoHighLevel under your own brand with confidence.</p>

<h2 id="what-is-saas-mode">What Is GoHighLevel SaaS Mode?</h2>
<p>SaaS Mode is the feature inside GoHighLevel that lets you resell the platform as your own software product. Instead of being a service provider who logs in for clients, you become a software company: clients pay you a recurring subscription and log into a CRM that carries your logo, your colours, and your domain.</p>
<p>SaaS Mode requires the <strong>$497/mo Pro plan</strong>. That tier unlocks the SaaS Configurator, Stripe rebilling, and the ability to provision sub-accounts automatically when someone subscribes to one of your plans.</p>
<p>The appeal is simple: you white-label GoHighLevel and sell it as your own CRM at a markup. Your clients never see "GoHighLevel" — they see your brand — and you keep the difference between what you pay HighLevel and what you charge them every single month.</p>

<h2 id="what-you-need">What You Need Before You Start</h2>
<p>Get these in place before you touch the configurator. Missing one of them is the most common reason a launch stalls.</p>
<ul>
<li><strong>An active GHL Pro plan ($497/mo)</strong> — SaaS Mode is locked behind this tier.</li>
<li><strong>A Stripe account connected</strong> to your agency for billing and rebilling.</li>
<li><strong>Your own domain</strong> (you will point a subdomain like app.youragency.com at GHL).</li>
<li><strong>Your logo and brand colours</strong> in usable formats (PNG/SVG logo, hex codes).</li>
<li><strong>A pricing decision</strong> — what you will charge and what each tier includes.</li>
</ul>

<h2 id="step-1-enable">Step 1 — Enable SaaS Mode in Your Agency Dashboard</h2>
<p>From your agency view, go to <strong>Settings &rarr; SaaS Configurator &rarr; Enable</strong>. This switches the agency from standard mode into a software business and reveals the rebilling and plan-creation tools you will use in the next steps.</p>
<p>[Image: SaaS Mode toggle in GHL settings]</p>
<p>Once enabled, the SaaS Configurator becomes your control centre for plans, branding, and client provisioning. Nothing is live to clients yet — you are simply unlocking the build.</p>

<h2 id="step-2-stripe">Step 2 — Connect Stripe for Billing</h2>
<p>SaaS Mode bills your clients through Stripe, so connect your Stripe account from the SaaS Configurator. This is what charges clients monthly and, through rebilling, lets you mark up usage-based items like SMS, email, and AI.</p>
<p>Pay close attention to <strong>test mode versus live mode</strong>. Stripe defaults to test mode while you build, and test-mode keys will never charge a real card. Before you onboard a paying client, confirm you have switched to live keys — shipping with test keys is one of the most common (and most expensive) launch mistakes.</p>

<h2 id="step-3-pricing">Step 3 — Set Up Your Pricing Plans</h2>
<p>Most agencies run three tiers. Here is a proven structure:</p>
<ul>
<li><strong>Starter — $97/mo:</strong> core CRM, contacts, pipelines, calendar, and basic email/SMS. Ideal for solo operators getting started.</li>
<li><strong>Growth — $197/mo:</strong> everything in Starter plus workflow automation, funnels, and review management. This is where most clients land.</li>
<li><strong>Pro — $297/mo:</strong> everything in Growth plus AI features (Conversation AI, Voice AI), advanced reporting, and higher rebilling allowances.</li>
</ul>
<p>Create each plan in the SaaS Configurator and attach the right feature set. The bigger the gap in value between tiers, the easier it is to upsell clients upward over time.</p>

<h2 id="step-4-branding">Step 4 — Configure Your White-Label Branding</h2>
<p>This is where GoHighLevel disappears and your brand takes over. In the SaaS settings, upload your logo, set your brand colours, and configure your custom domain so clients log in at <strong>app.youragency.com</strong> instead of a HighLevel URL.</p>
<p>To point your domain at GHL:</p>
<ol>
<li>In your DNS provider, create a <strong>CNAME record</strong> for the subdomain (e.g. <strong>app</strong>).</li>
<li>Point that CNAME at the target GoHighLevel gives you in the white-label settings.</li>
<li>Save the record and allow DNS to propagate (usually minutes, occasionally up to a few hours).</li>
<li>Back in GHL, verify the domain — once it resolves, your branded login is live.</li>
</ol>
<p>From this point on, clients experience a CRM that looks entirely like your own software.</p>

<h2 id="step-5-snapshot">Step 5 — Build Your Snapshot</h2>
<p>A snapshot is a pre-built template of everything a new sub-account should start with: <strong>pipelines, workflows, calendars, and funnels</strong>. When you provision a client, the snapshot loads instantly so they get a working system on day one instead of an empty CRM.</p>
<p>A strong snapshot is the difference between clients who stick and clients who churn — it is the product they are actually paying for. <a href="https://ghlprime.com/services">GHL Prime builds custom snapshots</a> tailored to your niche, so every client you onboard launches with a proven, ready-to-run system.</p>

<h2 id="step-6-invite">Step 6 — Invite Your First Client</h2>
<p>With plans, branding, and a snapshot in place, you are ready to onboard. Create the sub-account, assign the appropriate pricing plan, load your snapshot, and send the client their branded login details. From their first session they will see your logo, your domain, and a fully configured CRM — and Stripe will handle the recurring billing automatically.</p>

<h2 id="mistakes">Common SaaS Mode Mistakes to Avoid</h2>
<ul>
<li><strong>Onboarding with no snapshot</strong> — handing clients an empty CRM guarantees confusion and churn.</li>
<li><strong>Running test-mode Stripe in production</strong> — you will never collect a payment until you switch to live keys.</li>
<li><strong>Skipping the custom domain</strong> — a HighLevel URL breaks the white-label illusion instantly.</li>
<li><strong>Pricing too low</strong> — undercharging leaves no margin to support clients and grow.</li>
<li><strong>No onboarding automation</strong> — without a welcome sequence, new clients stall before they see value.</li>
</ul>

<h2 id="how-long">How Long Does SaaS Mode Setup Take?</h2>
<p>An experienced operator who has done it before can stand up a clean SaaS Mode account in <strong>3–5 days</strong>. A first-timer learning the configurator, DNS, Stripe rebilling, and snapshot building usually needs <strong>2–4 weeks</strong> — most of that lost to trial and error. GHL Prime delivers complete, tested SaaS Mode accounts in <strong>1–2 weeks</strong>, snapshot included.</p>

<p>SaaS Mode is the cleanest path from "agency that does the work" to "software company with recurring revenue." Get the foundation right — Pro plan, live Stripe, custom domain, and a real snapshot — and you have a product you can sell at scale. Rush it, and you spend your first month firefighting billing and onboarding instead of closing clients.</p>

${ctaBox(
  'Want your SaaS Mode built by experts?',
  'GHL Prime sets up complete white-label SaaS Mode accounts in 1–2 weeks. Snapshot included.',
)}`

// ---------------------------------------------------------------------------
// POST 2 — 5 automation workflows
// ---------------------------------------------------------------------------
const post2Content = `<p class="lead">Most agencies use roughly 10% of what GoHighLevel automation can do — they build a CRM, add a few contacts, and never touch the workflow engine that makes the platform powerful. These five workflows are the ones GHL Prime deploys on every account we touch, and together they save the average agency 15–20 hours a week while recovering revenue that would otherwise slip through the cracks.</p>

<h2 id="workflow-1">Workflow 1 — Instant Lead Follow-Up (The 5-Minute Rule)</h2>
<p>Leads contacted within five minutes are <strong>21x more likely to convert</strong> than those contacted after 30 minutes. Speed wins, and automation is the only way to guarantee it at scale.</p>
<p>The structure: the trigger fires the moment a new lead enters (form submission, ad lead, or inbound message). Immediately send an <strong>SMS</strong> acknowledging the enquiry, followed by an <strong>email</strong> with more detail. Add a <strong>wait step</strong> of an hour or two, then a <strong>follow-up message</strong> if the lead has not replied. This single workflow ensures no lead ever sits cold while a human is busy.</p>

<h2 id="workflow-2">Workflow 2 — Missed Call Text Back</h2>
<p>A missed call is a missed sale unless you respond instantly. This workflow triggers on a <strong>missed inbound call</strong> and fires an automatic <strong>SMS within 30 seconds</strong>: "Sorry we missed you! How can we help?"</p>
<p>It is the single highest-ROI automation in GoHighLevel, recovering <strong>20–30% of missed opportunities</strong> that would otherwise call a competitor. For any business that lives on inbound calls — home services especially — this one workflow pays for the platform on its own.</p>

<h2 id="workflow-3">Workflow 3 — Automated Review Request</h2>
<p>Reviews drive local SEO and trust, but nobody remembers to ask. Automate it. Trigger the workflow when a job is marked complete or a pipeline opportunity moves to <strong>Won</strong>, then wait about <strong>2 hours</strong> before sending an SMS and email asking for a Google review with a direct link.</p>
<p>Agencies running this consistently see <strong>3–5x more reviews within 60 days</strong>, which compounds into better map rankings and more inbound leads — all on autopilot.</p>

<h2 id="workflow-4">Workflow 4 — New Client Onboarding Sequence</h2>
<p>The first 30 days decide whether a client stays. This sequence keeps them engaged automatically:</p>
<ul>
<li><strong>Day 0:</strong> welcome message with login details and next steps.</li>
<li><strong>Day 2:</strong> a check-in to confirm they got started and answer questions.</li>
<li><strong>Day 7:</strong> a reminder to book their onboarding/strategy call.</li>
<li><strong>Day 14:</strong> a results check-in to surface early wins.</li>
</ul>
<p>Consistent early touchpoints dramatically <strong>reduce first-30-day churn</strong> — the period when most cancellations happen.</p>

<h2 id="workflow-5">Workflow 5 — Dead Lead Re-Engagement (The 90-Day Reactivation)</h2>
<p>Your database is full of money. This workflow targets contacts whose <strong>last activity was more than 90 days ago</strong> and runs a three-message reactivation: an <strong>SMS</strong> to reopen the conversation, an <strong>email</strong> with a fresh offer, then a final <strong>SMS</strong> nudge a few days later.</p>
<p>It costs nothing to run against leads you already paid to acquire, and GHL Prime regularly <strong>recovers 8–15% of dead leads</strong> with this sequence alone.</p>

<h2 id="how-to-build">How to Build These in GoHighLevel</h2>
<p>Each of these lives in the same place. Go to the <strong>Automation tab &rarr; New Workflow &rarr; Add Trigger</strong>, then <strong>Add Actions</strong> (SMS, email, wait steps, conditions) to match the structures above. A focused operator can build all five in an afternoon — or skip the build entirely and load them instantly from a GHL Prime snapshot.</p>

${ctaBox(
  'Want these 5 workflows installed today?',
  'Want these 5 workflows installed in your GHL account today? GHL Prime deploys pre-built automation systems for agencies — ready in 48 hours.',
)}`

// ---------------------------------------------------------------------------
// POST 3 — AI Voice Receptionist
// ---------------------------------------------------------------------------
const post3Content = `<p class="lead">Missed calls are the number one revenue leak for service businesses — every unanswered ring is a customer dialing your competitor. A GoHighLevel AI voice receptionist closes that gap: it answers calls 24/7, qualifies the caller, and books appointments straight into your calendar without a human picking up. GHL Prime has deployed more than 20 voice AI agents across home services, real estate, and healthcare, and this guide shows you exactly how to build one.</p>

<h2 id="what-is-voice-ai">What Is a GoHighLevel Voice AI Agent?</h2>
<p>Voice AI is now native to GoHighLevel on the Pro plan — no third-party glue required. The agent answers an inbound call, talks to the caller in natural language, and takes action based on a script you define.</p>
<p>It <strong>can</strong>: answer calls around the clock, qualify the caller, capture their details, book directly into your GHL calendar, and send a follow-up SMS. It <strong>cannot</strong>: handle complex objections or replace a skilled closer. Treat it as a brilliant first responder, not a salesperson.</p>

<h2 id="when-to-use">When to Use a GHL Voice AI Receptionist</h2>
<ul>
<li><strong>After-hours coverage</strong> — capture calls that would otherwise go to voicemail and die.</li>
<li><strong>High call volume</strong> — HVAC, plumbing, roofing, and real estate teams that can't answer every ring.</li>
<li><strong>Qualifying inbound</strong> — filter and qualify callers before a human ever gets involved.</li>
<li><strong>Appointment booking</strong> — let the agent fill your calendar automatically.</li>
</ul>

<h2 id="what-you-need">What You Need Before Building</h2>
<ul>
<li>An active <strong>GHL Pro plan</strong> (Voice AI is gated behind it).</li>
<li>A phone number — either a <strong>Twilio number connected</strong> to GHL or a GHL built-in number.</li>
<li>A configured <strong>GHL calendar</strong> for the agent to book into.</li>
<li>A <strong>clear script</strong> — the single biggest factor in whether the agent performs.</li>
</ul>

<h2 id="step-1-enable">Step 1 — Enable Voice AI in GHL Settings</h2>
<p>Go to <strong>Settings &rarr; Voice AI &rarr; Enable</strong>. This activates the agent builder and the built-in <strong>test call</strong> feature, which you will use later to dial the agent yourself and hear exactly what a caller hears.</p>

<h2 id="step-2-script">Step 2 — Write Your Agent's Call Script</h2>
<p>This is the most important step. The script controls the greeting, the qualification flow, and what happens when the agent hits its limits. Keep it tight: a warm greeting, a <strong>maximum of three qualification questions</strong> (service needed, location, timeline), a clear offer to book, and a fallback to a human.</p>
<blockquote style="background:#0f1f33;border-left:4px solid #0ea5e9;border-radius:8px;padding:1.25rem 1.5rem;margin:1.5rem 0;color:#cbd5e1;">
<p style="margin:0 0 0.75rem;"><strong>Sample script — home services business</strong></p>
<p style="margin:0 0 0.5rem;">"Thanks for calling [Company Name], this is the virtual assistant. I can help you get booked in right away. First, what service do you need today — heating, cooling, or something else?"</p>
<p style="margin:0 0 0.5rem;">"Great. And what's the postcode or area you're located in?"</p>
<p style="margin:0 0 0.5rem;">"Perfect. Is this something you need urgently, or are you planning ahead?"</p>
<p style="margin:0;">"I can get you booked with one of our technicians. Let me find the next available slot... I'll also text you a confirmation. If you'd rather speak to someone directly, just say 'speak to a person' and I'll transfer you."</p>
</blockquote>

<h2 id="step-3-calendar">Step 3 — Connect to Your GHL Calendar</h2>
<p>Link the agent to the calendar it should book into. Define the available <strong>slots</strong>, set a <strong>buffer</strong> between appointments so technicians have travel time, and turn on an automatic <strong>confirmation SMS</strong> so the caller leaves the call with a booking in hand.</p>

<h2 id="step-4-routing">Step 4 — Set Up Call Routing</h2>
<p>The agent should know when to hand off. Configure a transfer to a human when the <strong>caller asks for a person</strong>, when a <strong>booking fails twice</strong>, or when the request is clearly <strong>out of scope</strong>. Smart routing keeps the AI on the work it does well and protects the caller experience.</p>

<h2 id="step-5-test">Step 5 — Test Your Agent</h2>
<p>Before going live, call the number and check five things:</p>
<ol>
<li><strong>Greeting clarity</strong> — does it sound natural and on-brand?</li>
<li><strong>Question flow</strong> — does it ask the right questions in order without rambling?</li>
<li><strong>Booking success</strong> — can it actually place an appointment on the calendar?</li>
<li><strong>SMS confirmation</strong> — does the caller receive the confirmation text?</li>
<li><strong>Contact created</strong> — does a new contact appear in GHL with the captured details?</li>
</ol>

<h2 id="real-results">Real Results — What to Expect</h2>
<p>A well-built agent handles <strong>60–80% of after-hours calls without a human</strong> and typically books <strong>3–5 new appointments per week</strong> that would otherwise have been lost. One HVAC client of ours recovered roughly <strong>$12,000 in its first month</strong> simply by capturing the calls that used to hit voicemail.</p>

<h2 id="limitations">Voice AI Limitations to Know</h2>
<p>Be honest about the boundaries. Voice AI is excellent at simple qualification and booking, but it struggles with complex, emotional, or highly nuanced conversations. The right framing is "first responder, not closer" — let the AI capture and qualify every call, then route the high-intent or complicated ones to a human who can close.</p>

${ctaBox(
  'Need a voice AI agent built for your client?',
  'Need a voice AI agent built and deployed for your client? GHL Prime builds and configures GHL Voice AI agents in under a week — script, testing, and calendar integration included.',
)}`

// ---------------------------------------------------------------------------
// POST 4 — GHL for property developers
// ---------------------------------------------------------------------------
const post4Content = `<p class="lead">Property sales are slow, multi-touch, and easy to drop. A buyer enquires about a development, goes quiet for three months, then resurfaces ready to view — and by then most teams have lost the thread. Using GoHighLevel for property developers solves this: it handles long sales cycles, multi-channel follow-up, and lead qualification in one platform, so you never need Salesforce, a separate email tool, and a VA stitched together to keep up.</p>

<h2 id="why-property-developers">Why Property Developers Use GoHighLevel</h2>
<p>The reason GoHighLevel works for property developers is that it consolidates a fragmented sales process into a single system:</p>
<ul>
<li><strong>Multi-channel follow-up</strong> — SMS, email, WhatsApp, and calls in one shared inbox.</li>
<li><strong>Long nurture sequences</strong> — keep cold buyers warm for the months it takes them to decide.</li>
<li><strong>Pipeline visibility</strong> — see every enquiry across every development at a glance.</li>
<li><strong>AI lead qualification</strong> — automatically sort serious buyers from tyre-kickers.</li>
<li><strong>Automated document delivery</strong> — send brochures, floor plans, and pricing the instant a buyer asks.</li>
</ul>

<h2 id="pipeline-structure">How to Structure Your GHL Pipeline for Property Sales</h2>
<p>A property pipeline should mirror the real buyer journey. Set up these stages in order:</p>
<ol>
<li><strong>New Enquiry</strong></li>
<li><strong>Brochure Sent</strong></li>
<li><strong>Viewing Booked</strong></li>
<li><strong>Viewing Completed</strong></li>
<li><strong>Offer Made</strong></li>
<li><strong>Exchanged</strong></li>
<li><strong>Completed</strong></li>
<li><strong>Not Interested</strong></li>
</ol>
<p>Create the pipeline in GHL, then attach <strong>automated stage transitions</strong>: when a brochure is sent, the contact moves to "Brochure Sent" and a follow-up sequence kicks off; when a viewing is booked through your calendar, the contact advances automatically. The pipeline becomes self-updating instead of a manual to-do list.</p>

<h2 id="lead-capture">Lead Capture — Where Property Buyers Come From</h2>
<p>Buyers arrive from several sources, and GoHighLevel can ingest all of them:</p>
<ul>
<li><strong>Facebook Lead Ads</strong> — native integration pulls leads straight into GHL.</li>
<li><strong>Website forms</strong> — embed GHL forms directly or push submissions via webhook.</li>
<li><strong>Property portals (Rightmove, Zoopla)</strong> — route enquiries in via Zapier or a webhook.</li>
<li><strong>Manual import</strong> — bulk-load existing lists and walk-in enquiries.</li>
</ul>

<h2 id="automating-follow-up">Automating Buyer Follow-Up</h2>
<p>Once a lead lands, automation does the chasing. Fire an <strong>instant response SMS</strong> so the buyer hears back within seconds, then run a <strong>three-email nurture over seven days</strong> covering the development, the location, and the financials. Add a <strong>monthly reactivation</strong> message for leads inactive 90+ days, and an <strong>automated brochure delivery</strong> with tracking so you know exactly who opened what.</p>

<h2 id="ai-qualification">AI Qualification for High-Volume Enquiries</h2>
<p>When a development generates <strong>100+ enquiries a month</strong>, your sales team shouldn't manually qualify every one. GoHighLevel's <strong>Conversation AI</strong> pre-qualifies on autopilot — establishing <strong>budget, timeline, buyer type</strong> (investor, owner-occupier, or first-time buyer), and <strong>location</strong>. Only the qualified, high-intent leads get passed to a human, so your team spends time on buyers who can actually transact.</p>

<h2 id="ghl-vs-others">GHL vs Other Real Estate CRMs</h2>
<ul>
<li><strong>vs Salesforce:</strong> roughly 10x cheaper and purpose-built around marketing automation rather than enterprise complexity.</li>
<li><strong>vs HubSpot:</strong> native SMS, Voice AI, and a built-in funnel builder — no bolt-ons or add-on fees.</li>
<li><strong>vs spreadsheets:</strong> automates everything a spreadsheet can only track manually, and never lets a lead go cold.</li>
</ul>

<h2 id="ghl-prime-setup">What a GHL Prime Property Developer Setup Includes</h2>
<p>When we build GoHighLevel for property developers, the package includes a <strong>custom pipeline</strong>, <strong>lead capture forms</strong> wired to your ad and portal sources, a <strong>30-day nurture sequence</strong> across email and SMS, <strong>brochure and floor-plan delivery</strong> automations, an <strong>AI qualification bot</strong>, and a <strong>monthly reactivation</strong> campaign for dormant leads. Typical timeline: about <strong>2 weeks</strong> to a fully live system.</p>

${ctaBox(
  'Using GoHighLevel for a property development?',
  'Using GoHighLevel for a property development? GHL Prime builds complete CRM and automation systems for property developers — pipelines, nurture sequences, AI qualification and more.',
)}`

// ---------------------------------------------------------------------------

const posts = [
  {
    slug: 'gohighlevel-saas-mode-setup-guide-2026',
    title: 'GoHighLevel SaaS Mode: The Complete Setup Guide for Agency Owners (2026)',
    category: 'GoHighLevel',
    tags: ['saas mode', 'gohighlevel setup', 'white label crm', 'ghl agency'],
    author: 'GHL Prime Team',
    excerpt:
      'A step-by-step 2026 guide to setting up GoHighLevel SaaS Mode — Stripe billing, white-label branding, pricing plans and snapshots — from agency that has built 40+.',
    cover_image: 'https://ghlprime.com/blog/covers/saas-mode-guide.jpg',
    reading_time: 9,
    content: post1Content,
    seo_title: 'GoHighLevel SaaS Mode Setup Guide 2026 — Step by Step',
    seo_description:
      'Complete step-by-step guide to setting up GoHighLevel SaaS Mode for your agency in 2026. Includes Stripe integration, sub-account config, white-label branding and pricing plans.',
    seo_keywords:
      'gohighlevel saas mode, ghl saas mode setup, white label gohighlevel, ghl agency setup',
    featured: true,
    published: true,
    published_at: '2026-06-01T00:00:00.000Z',
  },
  {
    slug: 'gohighlevel-automation-workflows-agencies-2026',
    title: '5 GoHighLevel Automation Workflows Every Marketing Agency Needs in 2026',
    category: 'Automation',
    tags: ['ghl automation', 'gohighlevel workflows', 'marketing automation', 'ghl agency'],
    author: 'GHL Prime Team',
    excerpt:
      'The 5 must-have GoHighLevel automation workflows for agencies in 2026 — lead follow-up, missed call text back, review requests, onboarding and re-engagement.',
    cover_image: 'https://ghlprime.com/blog/covers/automation-workflows.jpg',
    reading_time: 7,
    content: post2Content,
    seo_title: '5 GoHighLevel Automation Workflows Every Agency Needs (2026)',
    seo_description:
      'The 5 must-have GoHighLevel automation workflows for marketing agencies in 2026 — lead follow-up, missed call text back, review requests, onboarding, and re-engagement. Copy-paste ready.',
    seo_keywords:
      'gohighlevel automation, ghl workflows, ghl automation setup, marketing agency automation',
    featured: false,
    published: true,
    published_at: '2026-06-01T00:00:00.000Z',
  },
  {
    slug: 'gohighlevel-ai-voice-receptionist-setup-guide',
    title: 'How to Build a GoHighLevel AI Voice Receptionist for Your Agency Clients',
    category: 'AI Agents',
    tags: ['ghl voice ai', 'ai receptionist', 'gohighlevel ai', 'voice agent ghl'],
    author: 'GHL Prime Team',
    excerpt:
      'Build a GoHighLevel AI voice receptionist that answers calls 24/7, qualifies leads and books appointments automatically — built and tested by GHL Prime.',
    cover_image: 'https://ghlprime.com/blog/covers/voice-ai-receptionist.jpg',
    reading_time: 8,
    content: post3Content,
    seo_title: 'GoHighLevel AI Voice Receptionist Setup Guide — GHL Prime',
    seo_description:
      'Step-by-step guide to building a GoHighLevel AI voice receptionist that answers calls 24/7, qualifies leads, and books appointments automatically. Built and tested by GHL Prime.',
    seo_keywords:
      'gohighlevel voice ai, ghl ai receptionist, ghl voice agent, ai calling gohighlevel',
    featured: false,
    published: true,
    published_at: '2026-06-01T00:00:00.000Z',
  },
  {
    slug: 'gohighlevel-for-property-developers',
    title: 'GoHighLevel for Property Developers: CRM Setup, Lead Automation and AI Follow-Up',
    category: 'GoHighLevel',
    tags: ['gohighlevel real estate', 'property developer crm', 'ghl real estate', 'real estate automation'],
    author: 'GHL Prime Team',
    excerpt:
      'How property developers use GoHighLevel to manage leads, automate follow-up and qualify buyers with AI — without switching platforms. A GHL Prime setup guide.',
    cover_image: 'https://ghlprime.com/blog/covers/ghl-property-developers.jpg',
    reading_time: 6,
    content: post4Content,
    seo_title: 'GoHighLevel for Property Developers — CRM, Automation & AI Follow-Up',
    seo_description:
      'How property developers use GoHighLevel to manage leads, automate follow-up, and qualify buyers with AI — without switching platforms. GHL Prime setup guide.',
    seo_keywords:
      'gohighlevel for property developers, ghl real estate crm, gohighlevel property, real estate automation ghl',
    featured: false,
    published: true,
    published_at: '2026-06-01T00:00:00.000Z',
  },
]

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const { error: authError } = await supabase.auth.signInWithPassword({
  email: SEED_EMAIL,
  password: SEED_PASSWORD,
})

if (authError) {
  console.error('Authentication failed:', authError.message)
  process.exit(1)
}

const { data, error } = await supabase
  .from('blog_posts')
  .upsert(posts, { onConflict: 'slug' })
  .select('id,slug,category,featured,published')

if (error) {
  console.error(error.message)
  process.exit(1)
}

console.log(`Upserted ${data.length} blog posts:`)
for (const row of data) {
  console.log(
    `- slug=${row.slug} | category=${row.category} | featured=${row.featured} | published=${row.published} | id=${row.id}`,
  )
}

// Ensure only one featured post: unset featured on the existing sample post.
const { data: unsetData, error: unsetError } = await supabase
  .from('blog_posts')
  .update({ featured: false })
  .eq('slug', 'how-to-set-up-gohighlevel-saas-mode')
  .select('slug,featured')

if (unsetError) {
  console.error('Failed to unset featured on sample post:', unsetError.message)
  process.exit(1)
}

if (unsetData && unsetData.length) {
  for (const row of unsetData) {
    console.log(`Unset featured: slug=${row.slug} | featured=${row.featured}`)
  }
} else {
  console.log("No existing post with slug 'how-to-set-up-gohighlevel-saas-mode' found to unset.")
}

// Verification: latest 10 posts by created_at desc.
const { data: verify, error: verifyError } = await supabase
  .from('blog_posts')
  .select('title,slug,published,featured,created_at')
  .order('created_at', { ascending: false })
  .limit(10)

if (verifyError) {
  console.error('Verification query failed:', verifyError.message)
  process.exit(1)
}

console.log('\nLatest 10 blog posts (created_at desc):')
for (const row of verify) {
  console.log(
    `- ${row.title} | slug=${row.slug} | published=${row.published} | featured=${row.featured}`,
  )
}
