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

const NEW_STUDIES = [
  {
    slug: 'dental-recall-no-show-automation-ghl',
    title: 'Dental Recall & No-Show Reduction with GoHighLevel',
    category: 'Automation',
    subtitle: 'How a multi-location dental group cut no-shows by 38% and refilled its recall schedule with automated reminders and reactivation.',
    challenge: 'A growing dental group was losing thousands every month to no-shows and an aging recall list. Front-desk staff manually called patients to confirm appointments and chase overdue cleanings, but the volume was impossible to keep up with, so schedule gaps went unfilled and lapsed patients were never followed up.',
    solution: 'We built a GoHighLevel recall and confirmation engine: staged SMS and email reminders before every visit, a smart waitlist that auto-fills cancellations, and a reactivation campaign that pulls patients overdue for a cleaning back into the chair.',
    outcome: 'Reduced no-shows by 38% and reactivated 220+ lapsed patients in the first quarter.',
    excerpt: 'See how a multi-location dental group used GoHighLevel automation to slash no-shows, auto-fill last-minute cancellations, and bring hundreds of overdue patients back on the schedule.',
    image: 'https://ghlprime.com/ghl-prime-logo.png',
    accent: 'teal',
    featured: false,
    published: true,
    body: [
      'This dental group was growing fast across three locations, but two leaks were quietly draining revenue: a steady stream of no-shows and a recall list that kept getting longer because no one had time to work it.',
      'We rebuilt the patient communication layer inside GoHighLevel with staged SMS and email confirmations before every visit, a smart waitlist that automatically offers freed-up slots to the next patient when someone cancels, and a recall campaign that re-engages patients overdue for a cleaning or checkup.',
      'Every reminder, confirmation, and reactivation now runs without front-desk intervention, and the team can see at a glance which patients are confirmed, waitlisted, or overdue.',
      'Within the first quarter, no-shows dropped by 38%, more than 220 lapsed patients were reactivated, and the front desk got hours back every week to focus on the in-office patient experience instead of chasing the phone.',
    ],
  },
  {
    slug: 'fitness-membership-retention-winback-automation',
    title: 'Membership Retention & Win-Back for a Fitness Studio',
    category: 'Automation',
    subtitle: 'How a boutique fitness studio cut churn and recovered cancelled members with behavior-triggered GoHighLevel journeys.',
    challenge: 'A boutique fitness studio had no shortage of new sign-ups, but members kept slipping away, and the team only noticed once a cancellation came through, far too late to do anything about it.',
    solution: 'We mapped the member lifecycle in GoHighLevel and built behavior-triggered journeys: onboarding sequences for new members, check-ins triggered by a drop in class attendance, milestone celebrations, and an automated win-back campaign for anyone who cancelled.',
    outcome: 'Cut monthly churn by 26% and won back roughly 1 in 5 cancelled members.',
    excerpt: 'How a boutique fitness studio turned retention from a guessing game into a predictable system with behavior-triggered GoHighLevel automation and win-back campaigns.',
    image: 'https://ghlprime.com/ghl-prime-logo.png',
    accent: 'purple',
    featured: false,
    published: true,
    body: [
      'A boutique fitness studio had no shortage of new sign-ups, but members were quietly slipping away, and the team usually only found out once the cancellation had already gone through.',
      'We mapped the full member lifecycle in GoHighLevel and built behavior-triggered journeys: onboarding sequences for new members, automatic check-ins when class attendance dropped, milestone celebrations, and a win-back campaign for anyone who cancelled.',
      'Instead of reacting to churn, the studio now gets ahead of it. At-risk members are flagged and re-engaged automatically before they ever reach the cancel button.',
      'The result was a 26% reduction in monthly churn and a win-back rate of roughly one in five cancelled members, turning retention into a predictable, hands-off system.',
    ],
  },
  {
    slug: 'ecommerce-abandoned-cart-recovery-ghl-sms',
    title: 'Abandoned Cart Recovery with GoHighLevel & SMS',
    category: 'Automation',
    subtitle: 'How a DTC brand recovered lost revenue with a multi-channel cart-recovery sequence wired into GoHighLevel.',
    challenge: 'A direct-to-consumer brand was driving solid traffic and adding plenty of carts, but a large share of shoppers left before completing checkout, and the generic email-only follow-up was not bringing them back.',
    solution: 'We connected the store cart events into GoHighLevel and built a multi-channel recovery sequence combining timely SMS and email, dynamic product reminders, and a tiered incentive that only escalates when a shopper needs the extra nudge.',
    outcome: 'Recovered 19% of abandoned carts and added an estimated $40K in monthly revenue.',
    excerpt: 'How a DTC brand recovered nearly a fifth of its abandoned carts and added $40K in monthly revenue with a multi-channel GoHighLevel and SMS recovery sequence.',
    image: 'https://ghlprime.com/ghl-prime-logo.png',
    accent: 'emerald',
    featured: false,
    published: true,
    body: [
      'A direct-to-consumer brand was driving solid traffic and adding plenty of carts, but a large share of shoppers were leaving before they ever completed checkout, and the generic email-only follow-up was not bringing them back.',
      'We connected the store cart events into GoHighLevel and built a multi-channel recovery sequence that combines timely SMS and email, dynamic product reminders, and a tiered incentive that only escalates when a shopper needs the extra nudge.',
      'Each abandoned cart now triggers a personalized recovery journey within minutes, and the brand can see recovered revenue attributed directly to the sequence.',
      'The recovery flow now pulls back roughly 19% of abandoned carts and adds an estimated $40K in recovered revenue every month, all from traffic the brand was already paying for.',
    ],
  },
  {
    slug: 'law-firm-intake-ai-qualification-ghl',
    title: 'Law Firm Intake Automation with AI Qualification',
    category: 'AI Agents',
    subtitle: 'How a personal-injury firm automated intake, qualified cases instantly with an AI agent, and stopped missing after-hours leads.',
    challenge: 'A personal-injury firm was generating strong lead volume from ads and referrals, but cases were slipping through the cracks. After-hours inquiries went unanswered until morning, and by then prospects had often already signed with a competitor.',
    solution: 'We deployed an AI intake agent connected to GoHighLevel that responds to every new lead instantly, qualifies the case against the firm criteria, captures the key details, routes high-value matters straight to an attorney, and books consultations automatically.',
    outcome: 'Captured 100% of after-hours leads and cut intake time from hours to minutes.',
    excerpt: 'How a personal-injury firm used an AI intake agent on GoHighLevel to qualify cases instantly, capture every after-hours lead, and cut intake time from hours to minutes.',
    image: 'https://ghlprime.com/ghl-prime-logo.png',
    accent: 'teal',
    featured: false,
    published: true,
    body: [
      'A personal-injury firm was generating strong lead volume from ads and referrals, but cases were slipping through the cracks. After-hours inquiries went unanswered until morning, and by then prospects had often already signed with a competitor.',
      'We deployed an AI intake agent connected to GoHighLevel that responds to every new lead instantly, qualifying the case against the firm criteria, capturing the key details, and routing high-value matters straight to an attorney while booking consultations automatically.',
      'Unqualified or out-of-scope inquiries are handled gracefully and logged, so the legal team only spends time on cases worth pursuing.',
      'The firm now captures every after-hours lead, cut average intake time from hours down to minutes, and stopped losing high-value cases to whoever happened to answer the phone first.',
    ],
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
  .from('case_studies')
  .upsert(NEW_STUDIES, { onConflict: 'slug' })
  .select('id,slug,category,published')

if (error) {
  console.error(error.message)
  process.exit(1)
}

console.log(`Upserted ${data.length} case studies:`)
for (const row of data) {
  console.log(`- slug=${row.slug} | category=${row.category} | id=${row.id}`)
}
