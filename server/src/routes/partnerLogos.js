import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, sendError } from '../utils/asyncHandler.js'
import { deleteUploadIfOwned } from '../utils/uploads.js'

// NOTE: the live `partner_logos` table stores the company name in a
// `company_name` column (confirmed from src/lib/logosApi.js, which always
// writes `company_name` on insert/update) — NOT `name` as the stale
// supabase/schema.sql in this repo would suggest. logosApi.js maps
// name <-> company_name on the client, so this route just persists/returns
// the row as-is.
export default function registerPartnerLogoRoutes(app) {
  const publicRouter = express.Router()
  const adminRouter = express.Router()

  publicRouter.get('/', asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `select * from partner_logos where published = true order by sort_order asc, created_at asc`,
    )
    res.json(rows)
  }))

  adminRouter.get('/', requireAuth, asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      'select * from partner_logos order by sort_order asc, created_at asc',
    )
    res.json(rows)
  }))

  adminRouter.post('/', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}
    const { rows } = await pool.query(
      `insert into partner_logos (company_name, image_url, website_url, sort_order, published)
       values ($1,$2,$3,$4,$5) returning *`,
      [p.company_name, p.image_url, p.website_url ?? null, p.sort_order ?? 999, p.published !== false],
    )
    res.status(201).json(rows[0])
  }))

  adminRouter.put('/:id', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}

    const existing = await pool.query('select image_url from partner_logos where id = $1', [req.params.id])
    if (!existing.rows[0]) return sendError(res, 404, 'Partner logo not found')
    const previousImageUrl = existing.rows[0].image_url

    const { rows } = await pool.query(
      `update partner_logos set
         company_name = coalesce($1, company_name),
         image_url = coalesce($2, image_url),
         website_url = coalesce($3, website_url),
         sort_order = coalesce($4, sort_order),
         published = coalesce($5, published),
         updated_at = now()
       where id = $6 returning *`,
      [
        p.company_name ?? null, p.image_url ?? null, p.website_url ?? null,
        p.sort_order ?? null, typeof p.published === 'boolean' ? p.published : null, req.params.id,
      ],
    )
    if (!rows[0]) return sendError(res, 404, 'Partner logo not found')

    if (rows[0].image_url !== previousImageUrl) {
      await deleteUploadIfOwned(previousImageUrl)
    }

    res.json(rows[0])
  }))

  adminRouter.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
    const { rows } = await pool.query('delete from partner_logos where id = $1 returning image_url', [req.params.id])
    if (!rows.length) return sendError(res, 404, 'Partner logo not found')
    await deleteUploadIfOwned(rows[0].image_url)
    res.json({ success: true })
  }))

  app.use('/api/partner-logos', publicRouter)
  app.use('/api/admin/partner-logos', adminRouter)
}
