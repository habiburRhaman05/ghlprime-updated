import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, sendError } from '../utils/asyncHandler.js'

// Fixes a long-standing bug: api/contact-submit.js used to insert into a
// `contact_leads` table that never actually existed in Supabase, so every
// contact-page submission silently failed to persist (only the GHL webhook
// ever received it, if that succeeded). This is a genuine table now (see
// server/schema.sql) with a working insert route.
export default function registerContactLeadRoutes(app) {
  const router = express.Router()
  const adminRouter = express.Router()

  // Called server-to-server from api/contact-submit.js — no admin JWT
  // available at that point, so this stays unauthenticated like the previous
  // Supabase anon-key insert was. Spam/rate protection (honeypot + timing
  // check) already happens upstream in api/contact-submit.js.
  router.post('/', asyncHandler(async (req, res) => {
    const p = req.body || {}
    if (!p.email && !p.full_name) {
      return sendError(res, 400, 'full_name or email is required')
    }

    const { rows } = await pool.query(
      `insert into contact_leads (full_name, email, phone, company, message, source, submitted_at)
       values ($1,$2,$3,$4,$5,$6,coalesce($7, now()))
       returning *`,
      [
        p.full_name ?? null, p.email ?? null, p.phone ?? null, p.company ?? null,
        p.message ?? null, p.source ?? null, p.submitted_at ?? null,
      ],
    )
    res.status(201).json(rows[0])
  }))

  // Bonus admin-only listing route — no admin page consumes this yet, but it
  // lets the leads actually be reviewed now that they persist.
  adminRouter.get('/', requireAuth, asyncHandler(async (_req, res) => {
    const { rows } = await pool.query('select * from contact_leads order by submitted_at desc')
    res.json(rows)
  }))

  app.use('/api/contact-leads', router)
  app.use('/api/admin/contact-leads', adminRouter)
}
