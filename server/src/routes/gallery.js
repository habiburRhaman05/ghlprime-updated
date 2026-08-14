import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, sendError } from '../utils/asyncHandler.js'
import { deleteUploadIfOwned } from '../utils/uploads.js'

export default function registerGalleryRoutes(app) {
  const categoriesPublic = express.Router()
  const categoriesAdmin = express.Router()
  const imagesPublic = express.Router()
  const imagesAdmin = express.Router()

  // -- Categories: public ------------------------------------------------

  categoriesPublic.get('/', asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      'select * from gallery_categories where published = true order by sort_order asc',
    )
    res.json(rows)
  }))

  // -- Categories: admin ---------------------------------------------------

  categoriesAdmin.get('/', requireAuth, asyncHandler(async (_req, res) => {
    const { rows } = await pool.query('select * from gallery_categories order by sort_order asc')
    res.json(rows)
  }))

  categoriesAdmin.post('/', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}
    const { rows } = await pool.query(
      `insert into gallery_categories (name, slug, sort_order, published)
       values ($1,$2,$3,$4) returning *`,
      [p.name, p.slug, p.sort_order ?? 999, p.published !== false],
    )
    res.status(201).json(rows[0])
  }))

  categoriesAdmin.put('/:id', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}
    const { rows } = await pool.query(
      `update gallery_categories set
         name = coalesce($1, name),
         slug = coalesce($2, slug),
         sort_order = coalesce($3, sort_order),
         published = coalesce($4, published),
         updated_at = now()
       where id = $5 returning *`,
      [p.name ?? null, p.slug ?? null, p.sort_order ?? null,
        typeof p.published === 'boolean' ? p.published : null, req.params.id],
    )
    if (!rows[0]) return sendError(res, 404, 'Gallery category not found')
    res.json(rows[0])
  }))

  categoriesAdmin.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
    // gallery_images.category_id is ON DELETE SET NULL, matching the previous
    // Supabase FK behaviour — no manual cleanup needed here.
    const { rowCount } = await pool.query('delete from gallery_categories where id = $1', [req.params.id])
    if (!rowCount) return sendError(res, 404, 'Gallery category not found')
    res.json({ success: true })
  }))

  // -- Images: public --------------------------------------------------------

  imagesPublic.get('/', asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      'select * from gallery_images where published = true order by sort_order asc',
    )
    res.json(rows)
  }))

  // -- Images: admin -----------------------------------------------------

  imagesAdmin.get('/', requireAuth, asyncHandler(async (_req, res) => {
    const { rows } = await pool.query('select * from gallery_images order by sort_order asc')
    res.json(rows)
  }))

  imagesAdmin.post('/', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}
    const { rows } = await pool.query(
      `insert into gallery_images (title, image_url, category_id, sort_order, published)
       values ($1,$2,$3,$4,$5) returning *`,
      [p.title ?? null, p.image_url, p.category_id ?? null, p.sort_order ?? 999, p.published !== false],
    )
    res.status(201).json(rows[0])
  }))

  imagesAdmin.put('/:id', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}

    const existing = await pool.query('select image_url from gallery_images where id = $1', [req.params.id])
    if (!existing.rows[0]) return sendError(res, 404, 'Gallery image not found')
    const previousImageUrl = existing.rows[0].image_url

    const { rows } = await pool.query(
      `update gallery_images set
         title = coalesce($1, title),
         image_url = coalesce($2, image_url),
         category_id = $3,
         sort_order = coalesce($4, sort_order),
         published = coalesce($5, published),
         updated_at = now()
       where id = $6 returning *`,
      [
        p.title ?? null, p.image_url ?? null, p.category_id || null,
        p.sort_order ?? null, typeof p.published === 'boolean' ? p.published : null, req.params.id,
      ],
    )
    if (!rows[0]) return sendError(res, 404, 'Gallery image not found')

    if (rows[0].image_url !== previousImageUrl) {
      await deleteUploadIfOwned(previousImageUrl)
    }

    res.json(rows[0])
  }))

  imagesAdmin.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
    const { rows } = await pool.query('delete from gallery_images where id = $1 returning image_url', [req.params.id])
    if (!rows.length) return sendError(res, 404, 'Gallery image not found')
    await deleteUploadIfOwned(rows[0].image_url)
    res.json({ success: true })
  }))

  app.use('/api/gallery-categories', categoriesPublic)
  app.use('/api/admin/gallery-categories', categoriesAdmin)
  app.use('/api/gallery-images', imagesPublic)
  app.use('/api/admin/gallery-images', imagesAdmin)
}
