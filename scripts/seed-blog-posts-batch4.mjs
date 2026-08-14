import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve, join } from 'node:path'
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

// Only these keys are real columns on the blog_posts table. Everything else
// (id, created_at, updated_at) is left to DB defaults. These batch-4 posts are
// DRAFTS: published stays false and published_at stays null as authored.
const COLUMNS = [
  'slug',
  'title',
  'category',
  'tags',
  'author',
  'excerpt',
  'cover_image',
  'reading_time',
  'content',
  'seo_title',
  'seo_description',
  'seo_keywords',
  'featured',
  'published',
  'published_at',
]

// Load every .mjs post module from the staging directory.
const dataDir = resolve(__dirname, '_batch4_data')
const files = readdirSync(dataDir).filter((f) => f.endsWith('.mjs'))

const posts = []
for (const file of files) {
  const fullPath = join(dataDir, file)
  const mod = await import(pathToFileURL(fullPath).href)
  posts.push(mod.default)
}

const rows = posts.map((post) => {
  const row = {}
  for (const key of COLUMNS) {
    if (post[key] !== undefined) row[key] = post[key]
  }
  // Drafts: do NOT coerce published to true and do NOT backfill published_at.
  return row
})

// Automated content guard: the brief required ZERO GoHighLevel mentions.
// Scan title + content + excerpt + seo fields for the literal forbidden strings.
// "GHL Prime" (brand) and "LeadConnector" are allowed; only flag "gohighlevel"
// and "go high level" (case-insensitive).
const FORBIDDEN = [/gohighlevel/i, /go\s+high\s+level/i]
const flagged = []
for (const post of posts) {
  const haystack = [
    post.title,
    post.content,
    post.excerpt,
    post.seo_title,
    post.seo_description,
    post.seo_keywords,
  ]
    .filter(Boolean)
    .join('\n')
  const hits = FORBIDDEN.filter((re) => re.test(haystack)).map((re) => re.source)
  if (hits.length) flagged.push({ slug: post.slug, hits })
}

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
  .upsert(rows, { onConflict: 'slug' })
  .select('id,slug,category,published')

if (error) {
  console.error(error.message)
  process.exit(1)
}

console.log(`Upserted ${data.length} blog posts (drafts):`)
for (const row of data) {
  console.log(
    `- slug=${row.slug} | category=${row.category} | published=${row.published} | id=${row.id}`
  )
}
console.log(`Total: ${data.length}`)

// Report the content-guard result prominently (non-fatal).
console.log('\n=== GoHighLevel mention guard ===')
if (flagged.length === 0) {
  console.log('PASS: No "gohighlevel" / "go high level" mentions found in any post.')
} else {
  console.log('WARNING: Forbidden GoHighLevel mention(s) detected (brief required ZERO):')
  for (const f of flagged) {
    console.log(`  - ${f.slug} matched: ${f.hits.join(', ')}`)
  }
}
