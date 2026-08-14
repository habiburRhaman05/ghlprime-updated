import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, sendError } from '../utils/asyncHandler.js'
import { deleteUploadIfOwned } from '../utils/uploads.js'

// team_members and team_page_members have no `published` column / gate in the
// frontend (fetchTeamMembers / fetchTeamPageExperts never filter on it), so
// both public reads return every row, matching current behaviour exactly.
export default function registerTeamRoutes(app) {
  const membersPublic = express.Router()
  const membersAdmin = express.Router()
  const pageMembersPublic = express.Router()
  const pageMembersAdmin = express.Router()

  // -- team_members ------------------------------------------------------

  membersPublic.get('/', asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      'select * from team_members order by sort_order asc, created_at asc',
    )
    res.json(rows)
  }))

  membersAdmin.post('/', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}
    const { rows } = await pool.query(
      `insert into team_members
        (name, role, description, image_url, sort_order, linkedin_url, facebook_url, instagram_url, twitter_url, upwork_url, website_url)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       returning *`,
      [
        p.name, p.role, p.description ?? null, p.image_url ?? null, p.sort_order ?? 999,
        p.linkedin_url ?? null, p.facebook_url ?? null, p.instagram_url ?? null,
        p.twitter_url ?? null, p.upwork_url ?? null, p.website_url ?? null,
      ],
    )
    res.status(201).json(rows[0])
  }))

  membersAdmin.put('/:id', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}

    const existing = await pool.query('select image_url from team_members where id = $1', [req.params.id])
    if (!existing.rows[0]) return sendError(res, 404, 'Team member not found')
    const previousImageUrl = existing.rows[0].image_url

    const { rows } = await pool.query(
      `update team_members set
         name = coalesce($1, name),
         role = coalesce($2, role),
         description = coalesce($3, description),
         image_url = coalesce($4, image_url),
         sort_order = coalesce($5, sort_order),
         linkedin_url = coalesce($6, linkedin_url),
         facebook_url = coalesce($7, facebook_url),
         instagram_url = coalesce($8, instagram_url),
         twitter_url = coalesce($9, twitter_url),
         upwork_url = coalesce($10, upwork_url),
         website_url = coalesce($11, website_url),
         updated_at = now()
       where id = $12 returning *`,
      [
        p.name ?? null, p.role ?? null, p.description ?? null, p.image_url ?? null,
        p.sort_order ?? null, p.linkedin_url ?? null, p.facebook_url ?? null,
        p.instagram_url ?? null, p.twitter_url ?? null, p.upwork_url ?? null,
        p.website_url ?? null, req.params.id,
      ],
    )
    if (!rows[0]) return sendError(res, 404, 'Team member not found')

    if (rows[0].image_url !== previousImageUrl) {
      await deleteUploadIfOwned(previousImageUrl)
    }

    res.json(rows[0])
  }))

  membersAdmin.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
    const { rows } = await pool.query('delete from team_members where id = $1 returning image_url', [req.params.id])
    if (!rows.length) return sendError(res, 404, 'Team member not found')
    await deleteUploadIfOwned(rows[0].image_url)
    res.json({ success: true })
  }))

  // -- team_page_members ("Meet the Experts") -----------------------------

  pageMembersPublic.get('/', asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      'select * from team_page_members order by sort_order asc, created_at asc',
    )
    res.json(rows)
  }))

  pageMembersAdmin.post('/', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}
    const { rows } = await pool.query(
      `insert into team_page_members (name, title, image_url, sort_order)
       values ($1,$2,$3,$4) returning *`,
      [p.name, p.title, p.image_url ?? null, p.sort_order ?? 999],
    )
    res.status(201).json(rows[0])
  }))

  pageMembersAdmin.put('/:id', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}

    const existing = await pool.query('select image_url from team_page_members where id = $1', [req.params.id])
    if (!existing.rows[0]) return sendError(res, 404, 'Team page member not found')
    const previousImageUrl = existing.rows[0].image_url

    const { rows } = await pool.query(
      `update team_page_members set
         name = coalesce($1, name),
         title = coalesce($2, title),
         image_url = coalesce($3, image_url),
         sort_order = coalesce($4, sort_order),
         updated_at = now()
       where id = $5 returning *`,
      [p.name ?? null, p.title ?? null, p.image_url ?? null, p.sort_order ?? null, req.params.id],
    )
    if (!rows[0]) return sendError(res, 404, 'Team page member not found')

    if (rows[0].image_url !== previousImageUrl) {
      await deleteUploadIfOwned(previousImageUrl)
    }

    res.json(rows[0])
  }))

  pageMembersAdmin.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
    const { rows } = await pool.query('delete from team_page_members where id = $1 returning image_url', [req.params.id])
    if (!rows.length) return sendError(res, 404, 'Team page member not found')
    await deleteUploadIfOwned(rows[0].image_url)
    res.json({ success: true })
  }))

  app.use('/api/team-members', membersPublic)
  app.use('/api/admin/team-members', membersAdmin)
  app.use('/api/team-page-members', pageMembersPublic)
  app.use('/api/admin/team-page-members', pageMembersAdmin)
}
