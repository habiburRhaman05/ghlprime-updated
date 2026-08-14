// Publish the July 2026 blog batch to Supabase.
//
// Usage (bash):
//   SEED_EMAIL='you@example.com' SEED_PASSWORD='secret' node ./scripts/publish-july-blogs.mjs
//
// Auth is required because blog_posts RLS only allows writes for the
// `authenticated` role. Upsert is keyed on slug, so re-running is idempotent
// (it updates existing rows rather than creating duplicates).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { julyBlogPosts } from '../src/data/julyBlogPosts.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

function parseEnv(path) {
  const env = {}
  const raw = readFileSync(path, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const k = t.slice(0, i).trim()
    let v = t.slice(i + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    env[k] = v
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
  console.error('Missing SEED_EMAIL or SEED_PASSWORD environment variables (your /admin/blog login).')
  process.exit(1)
}

// Real, writable columns only. id/created_at/updated_at are DB-managed.
const COLUMNS = [
  'slug', 'title', 'category', 'tags', 'author', 'excerpt', 'cover_image',
  'reading_time', 'content', 'seo_title', 'seo_description', 'seo_keywords',
  'featured', 'published', 'published_at',
]

const rows = julyBlogPosts.map((post) => {
  const row = {}
  for (const k of COLUMNS) if (post[k] !== undefined) row[k] = post[k]
  return row
})

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const { error: authError } = await supabase.auth.signInWithPassword({ email: SEED_EMAIL, password: SEED_PASSWORD })
if (authError) {
  console.error('Authentication failed:', authError.message)
  process.exit(1)
}

const { data, error } = await supabase
  .from('blog_posts')
  .upsert(rows, { onConflict: 'slug' })
  .select('id,slug,published,published_at')

if (error) {
  console.error('Upsert failed:', error.message)
  process.exit(1)
}

console.log(`Published ${data.length} July blog posts:`)
for (const r of data.sort((a, b) => new Date(a.published_at) - new Date(b.published_at))) {
  console.log(`- ${r.published_at.slice(0, 10)} | published=${r.published} | ${r.slug}`)
}
console.log(`Total: ${data.length}`)
