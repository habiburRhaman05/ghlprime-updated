import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { blogPosts } from '../src/data/blogPosts.js'

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
// (id, created_at, updated_at) is left to DB defaults.
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

const rows = blogPosts.map((post) => {
  const row = {}
  for (const key of COLUMNS) {
    if (post[key] !== undefined) row[key] = post[key]
  }
  // If a post is published but lacks published_at, fall back to created_at or now.
  if (row.published && !row.published_at) {
    row.published_at = post.created_at ?? new Date().toISOString()
  }
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

const { data, error } = await supabase
  .from('blog_posts')
  .upsert(rows, { onConflict: 'slug' })
  .select('id,slug,category,published')

if (error) {
  console.error(error.message)
  process.exit(1)
}

console.log(`Upserted ${data.length} blog posts:`)
for (const row of data) {
  console.log(
    `- slug=${row.slug} | category=${row.category} | published=${row.published} | id=${row.id}`
  )
}
