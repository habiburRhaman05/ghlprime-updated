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

// Only these keys are real columns on the blog_posts table. published and
// published_at are intentionally NOT whitelisted here because we override them
// below (these A2P posts are being PUBLISHED).
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
]

// Distinct published_at per slug.
const PUBLISHED_AT = {
  'a2p-10dlc-registration-leadconnector-complete-guide':
    '2026-05-18T10:00:00.000Z',
  'twilio-sms-not-delivering-leadconnector-errors-fixes':
    '2026-05-26T15:30:00.000Z',
}

// Load every .mjs post module from the batch-4 staging directory.
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
  // PUBLISH these posts.
  row.published = true
  const at = PUBLISHED_AT[post.slug]
  if (!at) {
    console.error(`No published_at mapping for slug: ${post.slug}`)
    process.exit(1)
  }
  row.published_at = at
  return row
})

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const { error: authError } = await supabase.auth.signInWithPassword({
  email: SEED_EMAIL,
  password: SEED_PASSWORD,
})

if (authError) {
  console.error('Authentication failed:', authError.message)
  process.exit(1)
}

// published=true rows ARE selectable under the public SELECT policy, so we can
// safely chain .select() here.
const { data, error } = await supabase
  .from('blog_posts')
  .upsert(rows, { onConflict: 'slug' })
  .select('id,slug,published,published_at')

if (error) {
  console.error(error.message)
  process.exit(1)
}

console.log(`Published ${data.length} A2P blog posts:`)
for (const row of data) {
  console.log(
    `- slug=${row.slug} | published=${row.published} | published_at=${row.published_at} | id=${row.id}`
  )
}
console.log(`Total: ${data.length}`)
