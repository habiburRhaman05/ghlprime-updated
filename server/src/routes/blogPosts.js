import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, sendError } from '../utils/asyncHandler.js'
import { deleteUploadIfOwned } from '../utils/uploads.js'
import { createBlogPost } from '../lib/blogPostRepo.js'

// Registers both the public read routes (mounted at /api/blog-posts) and the
// admin write routes (mounted at /api/admin/blog-posts) on the given app.
export default function registerBlogPostRoutes(app) {
  const publicRouter = express.Router()
  const adminRouter = express.Router()

  // -- Public reads ----------------------------------------------------------

  publicRouter.get('/', asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `select * from blog_posts where published = true order by published_at desc nulls last`,
    )
    res.json(rows)
  }))

  // Registered before "/:slug" so "related" is never swallowed by the param route.
  publicRouter.get('/related', asyncHandler(async (req, res) => {
    const category = String(req.query.category || '')
    const excludeSlug = String(req.query.excludeSlug || '')
    const limit = Number(req.query.limit || 3) || 3

    const { rows } = await pool.query(
      `select * from blog_posts
       where published = true and category = $1 and slug != $2
       order by published_at desc nulls last
       limit $3`,
      [category, excludeSlug, limit],
    )
    res.json(rows)
  }))

  publicRouter.get('/:slug', asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `select * from blog_posts where slug = $1 and published = true limit 1`,
      [req.params.slug],
    )
    if (!rows[0]) return sendError(res, 404, 'Blog post not found')
    res.json(rows[0])
  }))

  // -- Admin (auth required) --------------------------------------------------

  adminRouter.get('/', requireAuth, asyncHandler(async (_req, res) => {
    const { rows } = await pool.query('select * from blog_posts order by created_at desc')
    res.json(rows)
  }))

  adminRouter.post('/', requireAuth, asyncHandler(async (req, res) => {
    const post = await createBlogPost(req.body || {})
    res.status(201).json(post)
  }))

  adminRouter.put('/:id', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}

    const existing = await pool.query('select cover_image from blog_posts where id = $1', [req.params.id])
    if (!existing.rows[0]) return sendError(res, 404, 'Blog post not found')
    const previousCoverImage = existing.rows[0].cover_image

    const { rows } = await pool.query(
      `update blog_posts set
         slug = coalesce($1, slug),
         title = coalesce($2, title),
         category = coalesce($3, category),
         tags = coalesce($4, tags),
         author = coalesce($5, author),
         excerpt = coalesce($6, excerpt),
         cover_image = coalesce($7, cover_image),
         reading_time = coalesce($8, reading_time),
         content = coalesce($9, content),
         seo_title = coalesce($10, seo_title),
         seo_description = coalesce($11, seo_description),
         seo_keywords = coalesce($12, seo_keywords),
         featured = coalesce($13, featured),
         published = coalesce($14, published),
         published_at = coalesce($15, published_at),
         updated_at = now()
       where id = $16
       returning *`,
      [
        p.slug ?? null, p.title ?? null, p.category ?? null, p.tags ?? null, p.author ?? null,
        p.excerpt ?? null, p.cover_image ?? null, p.reading_time ?? null, p.content ?? null,
        p.seo_title ?? null, p.seo_description ?? null, p.seo_keywords ?? null,
        typeof p.featured === 'boolean' ? p.featured : null,
        typeof p.published === 'boolean' ? p.published : null,
        p.published_at ?? null,
        req.params.id,
      ],
    )
    if (!rows[0]) return sendError(res, 404, 'Blog post not found')

    if (rows[0].cover_image !== previousCoverImage) {
      await deleteUploadIfOwned(previousCoverImage)
    }

    res.json(rows[0])
  }))

  adminRouter.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
    const { rows } = await pool.query('delete from blog_posts where id = $1 returning cover_image', [req.params.id])
    if (!rows.length) return sendError(res, 404, 'Blog post not found')
    await deleteUploadIfOwned(rows[0].cover_image)
    res.json({ success: true })
  }))

  app.use('/api/blog-posts', publicRouter)
  app.use('/api/admin/blog-posts', adminRouter)
}
