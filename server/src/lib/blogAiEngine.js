import { pool } from '../db.js'
import { createBlogPost, slugify } from './blogPostRepo.js'
import { invokeClaude, invokeCodex } from './aiCliRunner.js'
import { decryptToken } from '../utils/tokenCrypto.js'

// Core Auto Blog generation logic. Called by both the "Run Now" admin route
// (routes/blogAi.js) and the hourly cron entrypoint (scripts/runBlogAi.js).

const RUN_STALE_MINUTES = 15 // a "running" row older than this is treated as crashed, not a real lock
const COOLDOWN_MINUTES = 20 // how long a Claude account sits out after a failure

// Kept in sync with BLOG_CATEGORIES in src/pages/AdminBlogPage.jsx by hand —
// that file is frontend-only and not exported/shared, so this backend copy
// has to be duplicated rather than imported. Update both together.
export const BLOG_CATEGORIES = [
  'GoHighLevel',
  'Automation',
  'AI Agents',
  'Case Studies',
  'Voice AI',
  'CRM',
  'Vibe Coding',
]

const DEFAULT_SETTINGS = {
  instructions: '',
  keywords: '',
  advanced_instructions: '',
  auto_publish: false,
  schedule_hour: 6,
  posts_per_day: 1,
  codex_enabled: false,
  codex_model: '', // empty = let the account use its own default model
  claude_model: '', // empty = let the plan choose (no -m flag passed)
  claude_cli_command: null, // null = use CLAUDE_CLI_PATH env / hardcoded default
  codex_cli_command: null, // null = use CODEX_CLI_PATH env / hardcoded default
}

// -- Settings -----------------------------------------------------------------

export async function getSettings() {
  const { rows } = await pool.query('select * from blog_ai_settings where id = true limit 1')
  return rows[0] ? { ...DEFAULT_SETTINGS, ...rows[0] } : { ...DEFAULT_SETTINGS }
}

// Merges `fields` onto the EXISTING settings row (falling back to
// DEFAULT_SETTINGS only for a brand-new install with no row yet) -- not onto
// DEFAULT_SETTINGS directly. A caller sending only a subset of fields (e.g.
// a single toggle) must not silently reset every other setting back to its
// hardcoded default.
export async function saveSettings(fields) {
  const current = await getSettings()
  const s = { ...current, ...fields }
  const { rows } = await pool.query(
    `insert into blog_ai_settings
      (id, instructions, keywords, advanced_instructions, auto_publish, schedule_hour, posts_per_day, codex_enabled, codex_model, claude_model, claude_cli_command, codex_cli_command, updated_at)
     values (true, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now())
     on conflict (id) do update set
       instructions = excluded.instructions,
       keywords = excluded.keywords,
       advanced_instructions = excluded.advanced_instructions,
       auto_publish = excluded.auto_publish,
       schedule_hour = excluded.schedule_hour,
       posts_per_day = excluded.posts_per_day,
       codex_enabled = excluded.codex_enabled,
       codex_model = excluded.codex_model,
       claude_model = excluded.claude_model,
       claude_cli_command = excluded.claude_cli_command,
       codex_cli_command = excluded.codex_cli_command,
       updated_at = now()
     returning *`,
    [
      s.instructions || null,
      s.keywords || null,
      s.advanced_instructions || null,
      Boolean(s.auto_publish),
      Number.isFinite(Number(s.schedule_hour)) ? Math.min(23, Math.max(0, Number(s.schedule_hour))) : 6,
      Number.isFinite(Number(s.posts_per_day)) ? Math.min(10, Math.max(1, Number(s.posts_per_day))) : 1,
      Boolean(s.codex_enabled),
      s.codex_model || '',
      s.claude_model || '',
      s.claude_cli_command || null,
      s.codex_cli_command || null,
    ],
  )
  return rows[0]
}

// -- Helpers --------------------------------------------------------------

function computeReadingTime(html) {
  const text = String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = text ? text.split(' ').length : 0
  return Math.max(1, Math.round(wordCount / 200))
}

function buildBlogPostSchema() {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['title', 'slug', 'category', 'tags', 'excerpt', 'content', 'seo_title', 'seo_description', 'seo_keywords'],
    properties: {
      title: { type: 'string' },
      slug: { type: 'string' },
      category: { type: 'string', enum: BLOG_CATEGORIES },
      tags: { type: 'array', items: { type: 'string' } },
      excerpt: { type: 'string' },
      content: { type: 'string' },
      seo_title: { type: 'string' },
      seo_description: { type: 'string' },
      seo_keywords: { type: 'string' },
    },
  }
}

function buildPrompt({ settings, recentPosts }) {
  const recentList = recentPosts.length
    ? recentPosts.map((post) => `- "${post.title}" (${post.category})`).join('\n')
    : '(none published yet)'

  return [
    'You are an expert SEO content writer for GHL Prime, a GoHighLevel consulting and automation agency.',
    'Write ONE new, original, SEO-optimized blog post and respond with ONLY a single JSON object matching the required schema — no surrounding prose, no markdown code fences.',
    '',
    `The "category" field MUST be exactly one of: ${BLOG_CATEGORIES.join(', ')}.`,
    '',
    'Admin instructions:',
    settings.instructions?.trim() || '(none provided)',
    '',
    'Target keywords / SEO focus:',
    settings.keywords?.trim() || '(none provided)',
    '',
    'Additional / advanced instructions:',
    settings.advanced_instructions?.trim() || '(none provided)',
    '',
    'Avoid repeating the topic of these recently published posts:',
    recentList,
    '',
    'Field requirements:',
    '- "title": compelling, specific, under 70 characters.',
    '- "slug": lowercase, hyphenated URL slug derived from the title.',
    '- "content": valid HTML (headings, paragraphs, lists as appropriate) ready to render directly on the site — no markdown, no code fences, no <html>/<body> wrapper.',
    '- "excerpt": a 1-2 sentence summary, under 160 characters.',
    '- "tags": an array of 3-6 short lowercase strings.',
    '- "seo_title": under 60 characters.',
    '- "seo_description": under 160 characters.',
    '- "seo_keywords": a comma-separated string.',
  ].join('\n')
}

function parseAndValidate(rawText) {
  const cleaned = String(rawText || '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  let parsed
  try {
    parsed = JSON.parse(cleaned)
  } catch (error) {
    throw new Error(`AI response was not valid JSON (${error.message}). First 500 chars: ${cleaned.slice(0, 500)}`)
  }

  const missing = []
  if (!parsed || typeof parsed !== 'object') missing.push('response was not a JSON object')
  if (!parsed?.title || !String(parsed.title).trim()) missing.push('title')
  if (!parsed?.content || !String(parsed.content).trim()) missing.push('content')
  if (!parsed?.category || !String(parsed.category).trim()) {
    missing.push('category')
  } else if (!BLOG_CATEGORIES.includes(parsed.category)) {
    missing.push(`category (got "${parsed.category}", must be one of: ${BLOG_CATEGORIES.join(', ')})`)
  }

  const slug = parsed?.slug && String(parsed.slug).trim() ? slugify(parsed.slug) : slugify(parsed?.title)
  if (!slug) missing.push('slug (and none could be derived from the title)')

  if (missing.length) {
    throw new Error(`AI response is missing/invalid required field(s): ${missing.join('; ')}`)
  }

  return {
    title: String(parsed.title).trim(),
    slug,
    category: parsed.category,
    tags: Array.isArray(parsed.tags) ? parsed.tags.map(String).map((t) => t.trim()).filter(Boolean) : [],
    excerpt: parsed.excerpt ? String(parsed.excerpt) : '',
    content: String(parsed.content),
    seo_title: parsed.seo_title ? String(parsed.seo_title) : '',
    seo_description: parsed.seo_description ? String(parsed.seo_description) : '',
    seo_keywords: parsed.seo_keywords ? String(parsed.seo_keywords) : '',
    reading_time: Number.isFinite(Number(parsed.reading_time)) ? Number(parsed.reading_time) : null,
  }
}

async function isAlreadyRunning() {
  const { rows } = await pool.query(
    `select id from blog_ai_runs
     where status = 'running' and started_at > now() - make_interval(mins => $1)
     limit 1`,
    [RUN_STALE_MINUTES],
  )
  return rows.length > 0
}

async function pickClaudeAccount() {
  const { rows } = await pool.query(
    `select * from blog_ai_accounts
     where provider = 'claude' and enabled = true and (cooldown_until is null or cooldown_until < now())
     order by last_used_at asc nulls first
     limit 1`,
  )
  return rows[0] || null
}

// -- Main entrypoint --------------------------------------------------------

export async function runBlogAiEngine() {
  if (await isAlreadyRunning()) {
    return {
      started: false,
      reason: 'A blog AI run is already in progress (started within the last 15 minutes). Try again shortly.',
    }
  }

  const { rows: runRows } = await pool.query(
    `insert into blog_ai_runs (status) values ('running') returning id`,
  )
  const runId = runRows[0].id

  let account = null
  let provider = null

  try {
    const settings = await getSettings()
    const { rows: recentPosts } = await pool.query(
      `select title, category from blog_posts where published = true order by published_at desc nulls last limit 30`,
    )

    account = await pickClaudeAccount()
    provider = account ? 'claude' : (settings.codex_enabled ? 'codex' : null)

    if (!provider) {
      throw new Error('No available provider: no enabled/off-cooldown Claude accounts, and Codex is disabled in settings.')
    }

    const prompt = buildPrompt({ settings, recentPosts })
    const schema = buildBlogPostSchema()

    const resultText = provider === 'claude'
      ? await invokeClaude({
        prompt,
        schema,
        token: decryptToken(account.token),
        model: account.model || settings.claude_model || undefined,
        authType: account.auth_type,
        cliPath: settings.claude_cli_command || undefined,
      })
      : await invokeCodex({ prompt, schema, model: settings.codex_model, cliPath: settings.codex_cli_command || undefined })

    const generated = parseAndValidate(resultText)

    const post = await createBlogPost({
      ...generated,
      reading_time: generated.reading_time || computeReadingTime(generated.content),
      author: 'GHL Prime Team',
      featured: false,
      published: Boolean(settings.auto_publish),
    })

    await pool.query(
      `update blog_ai_runs
       set status = 'success', provider = $2, account_label = $3, blog_post_id = $4, finished_at = now()
       where id = $1`,
      [runId, provider, account ? account.label : 'codex (ambient login)', post.id],
    )

    if (account) {
      await pool.query(
        `update blog_ai_accounts set done_count = done_count + 1, last_used_at = now(), status = 'idle' where id = $1`,
        [account.id],
      )
    }

    return { started: true, success: true, runId, post }
  } catch (error) {
    const message = error?.message || String(error)
    console.error('Blog AI run failed:', error)

    await pool.query(
      `update blog_ai_runs set status = 'failed', provider = coalesce(provider, $2), error = $3, finished_at = now() where id = $1`,
      [runId, provider, message],
    )

    if (account) {
      await pool.query(
        `update blog_ai_accounts
         set failed_count = failed_count + 1,
             cooldown_until = now() + make_interval(mins => $2),
             status = 'disabled_cooldown',
             last_error = $3
         where id = $1`,
        [account.id, COOLDOWN_MINUTES, message],
      )
    }

    return { started: true, success: false, runId, error: message }
  }
}
