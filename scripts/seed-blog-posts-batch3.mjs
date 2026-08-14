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
// (id, created_at, updated_at) is left to DB defaults. These batch-3 posts are
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
const dataDir = resolve(__dirname, '_batch3_data')
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

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const { error: authError } = await supabase.auth.signInWithPassword({
  email: SEED_EMAIL,
  password: SEED_PASSWORD,
})

if (authError) {
  console.error('Authentication failed:', authError.message)
  process.exit(1)
}

// These rows are DRAFTS (published=false). The live RLS SELECT policy only
// exposes published=true rows, which has two consequences:
//   1. We must NOT chain .select() (it would trip a misleading 42501 on the
//      hidden draft row).
//   2. A true UPSERT (INSERT ... ON CONFLICT) ALSO fails with 42501, because
//      PostgREST's conflict-resolution path needs to read the existing row,
//      which the SELECT policy hides. (Verified against the live table.)
// The operation that DOES work for drafts is a plain INSERT (return=minimal,
// 201). For idempotency we fall back to a PATCH (UPDATE by slug) when the slug
// already exists (23505 unique violation). Both INSERT and UPDATE pass the
// WITH CHECK = true policy.
let inserted = 0
let updated = 0
for (const row of rows) {
  // Try INSERT first (return=minimal — no row returned, by design).
  const ins = await supabase.from('blog_posts').insert(row)
  if (!ins.error) {
    inserted++
    console.log(`- INSERT slug=${row.slug} | category=${row.category} | published=${row.published}`)
    continue
  }
  // 23505 = unique_violation: slug already present -> UPDATE it instead.
  if (ins.error.code === '23505') {
    const { slug, ...rest } = row
    const upd = await supabase.from('blog_posts').update(rest).eq('slug', slug)
    if (upd.error) {
      console.error(`UPDATE failed for slug=${slug}: ${upd.error.message}`)
      process.exit(1)
    }
    updated++
    console.log(`- UPDATE slug=${row.slug} | category=${row.category} | published=${row.published}`)
    continue
  }
  console.error(`INSERT failed for slug=${row.slug}: ${ins.error.message} (code ${ins.error.code})`)
  process.exit(1)
}

console.log(
  `\nDone. Persisted ${rows.length} draft blog posts (published=false): ${inserted} inserted, ${updated} updated. No 42501.`
)
