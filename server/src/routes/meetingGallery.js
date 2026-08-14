import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, sendError } from '../utils/asyncHandler.js'
import { deleteUploadIfOwned } from '../utils/uploads.js'

export default function registerMeetingGalleryRoutes(app) {
  const publicRouter = express.Router()
  const adminRouter = express.Router()

  publicRouter.get('/', asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      'select * from meeting_gallery where published = true order by sort_order asc, created_at asc',
    )
    res.json(rows)
  }))

  adminRouter.get('/', requireAuth, asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      'select * from meeting_gallery order by sort_order asc, created_at asc',
    )
    res.json(rows)
  }))

  adminRouter.post('/', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}
    const { rows } = await pool.query(
      `insert into meeting_gallery (title, image_url, sort_order, published)
       values ($1,$2,$3,$4) returning *`,
      [p.title ?? null, p.image_url, p.sort_order ?? 999, p.published !== false],
    )
    res.status(201).json(rows[0])
  }))

  adminRouter.put('/:id', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}

    const existing = await pool.query('select image_url from meeting_gallery where id = $1', [req.params.id])
    if (!existing.rows[0]) return sendError(res, 404, 'Meeting gallery item not found')
    const previousImageUrl = existing.rows[0].image_url

    const { rows } = await pool.query(
      `update meeting_gallery set
         title = coalesce($1, title),
         image_url = coalesce($2, image_url),
         sort_order = coalesce($3, sort_order),
         published = coalesce($4, published),
         updated_at = now()
       where id = $5 returning *`,
      [p.title ?? null, p.image_url ?? null, p.sort_order ?? null,
        typeof p.published === 'boolean' ? p.published : null, req.params.id],
    )
    if (!rows[0]) return sendError(res, 404, 'Meeting gallery item not found')

    if (rows[0].image_url !== previousImageUrl) {
      await deleteUploadIfOwned(previousImageUrl)
    }

    res.json(rows[0])
  }))

  adminRouter.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
    const { rows } = await pool.query('delete from meeting_gallery where id = $1 returning image_url', [req.params.id])
    if (!rows.length) return sendError(res, 404, 'Meeting gallery item not found')
    await deleteUploadIfOwned(rows[0].image_url)
    res.json({ success: true })
  }))

  app.use('/api/meeting-gallery', publicRouter)
  app.use('/api/admin/meeting-gallery', adminRouter)
}
