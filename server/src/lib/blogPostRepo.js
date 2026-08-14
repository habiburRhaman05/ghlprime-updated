import { pool } from '../db.js'

// Standalone backend slugify — intentionally NOT imported from
// src/pages/AdminGalleryPage.jsx (that helper is frontend-only and not
// exported/shared). Keep this in sync if the frontend rule ever changes:
// lowercase, trim, collapse non-alphanumeric runs to "-", strip leading/
// trailing "-".
export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Inserts a new blog_posts row. Shared by the manual admin "New Post" route
// and the Auto Blog AI engine, so both get the same behavior:
//   - if `slug` collides with an existing row, appends "-2", "-3", ... until
//     it finds a free one (no existing slug-collision handling existed
//     anywhere in the codebase before this).
//   - if `published` is true and no explicit `published_at` was supplied,
//     stamps `published_at = now()` here (the admin UI's blogApi.js used to
//     do this client-side only; the AI engine calls this function directly
//     server-side, bypassing blogApi.js, so it needs to happen here too or
//     AI-published posts would silently get a null published_at).
export async function createBlogPost(fields) {
  const p = fields || {}
  const baseSlug = slugify(p.slug || p.title)
  const published = Boolean(p.published)
  const publishedAt = p.published_at || (published ? new Date().toISOString() : null)

  let slug = baseSlug
  let attempt = 1

  // Bounded retry loop — a real, permanent slug collision that survives 50
  // suffixed attempts would indicate something else is wrong, so this
  // deliberately doesn't loop forever.
  while (attempt <= 50) {
    try {
      const { rows } = await pool.query(
        `insert into blog_posts
          (slug, title, category, tags, author, excerpt, cover_image, reading_time, content,
           seo_title, seo_description, seo_keywords, featured, published, published_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         returning *`,
        [
          slug, p.title, p.category, p.tags || [], p.author || 'GHL Prime Team', p.excerpt,
          p.cover_image || null, p.reading_time ?? null, p.content, p.seo_title, p.seo_description,
          p.seo_keywords, Boolean(p.featured), published, publishedAt,
        ],
      )
      return rows[0]
    } catch (error) {
      const isSlugConflict = error?.code === '23505' && error?.constraint === 'blog_posts_slug_key'
      if (!isSlugConflict) throw error

      attempt += 1
      slug = `${baseSlug}-${attempt}`
    }
  }

  throw new Error(`Could not find a free slug for "${baseSlug}" after 50 attempts`)
}
