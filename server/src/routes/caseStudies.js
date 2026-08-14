import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, sendError } from '../utils/asyncHandler.js'
import { deleteUploadIfOwned } from '../utils/uploads.js'

// Reproduces Supabase's nested select:
//   .select(`*, assigned_team_members:case_study_team_members(team_member:team_members(*))`)
const SELECT_WITH_TEAM = `
  cs.*,
  coalesce(
    (
      select json_agg(json_build_object('team_member', row_to_json(tm)) order by tm.name)
      from case_study_team_members cstm
      join team_members tm on tm.id = cstm.team_member_id
      where cstm.case_study_id = cs.id
    ),
    '[]'::json
  ) as assigned_team_members
`

async function fetchCaseStudyById(id) {
  const { rows } = await pool.query(
    `select ${SELECT_WITH_TEAM} from case_studies cs where cs.id = $1`,
    [id],
  )
  return rows[0] || null
}

async function syncAssignments(client, caseStudyId, teamMemberIds = []) {
  await client.query('delete from case_study_team_members where case_study_id = $1', [caseStudyId])
  if (!teamMemberIds.length) return

  const values = teamMemberIds.map((_, index) => `($1, $${index + 2})`).join(', ')
  await client.query(
    `insert into case_study_team_members (case_study_id, team_member_id) values ${values}`,
    [caseStudyId, ...teamMemberIds],
  )
}

export default function registerCaseStudyRoutes(app) {
  const publicRouter = express.Router()
  const adminRouter = express.Router()

  // -- Public reads ----------------------------------------------------------

  publicRouter.get('/', asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `select ${SELECT_WITH_TEAM} from case_studies cs where cs.published = true order by cs.created_at desc`,
    )
    res.json(rows)
  }))

  publicRouter.get('/:slug', asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `select ${SELECT_WITH_TEAM} from case_studies cs where cs.slug = $1 and cs.published = true limit 1`,
      [req.params.slug],
    )
    if (!rows[0]) return sendError(res, 404, 'Case study not found')
    res.json(rows[0])
  }))

  // -- Admin (auth required) --------------------------------------------------

  adminRouter.get('/', requireAuth, asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `select ${SELECT_WITH_TEAM} from case_studies cs order by cs.created_at desc`,
    )
    res.json(rows)
  }))

  adminRouter.post('/', requireAuth, asyncHandler(async (req, res) => {
    const { teamMemberIds = [], ...p } = req.body || {}
    const client = await pool.connect()
    try {
      await client.query('begin')
      const inserted = await client.query(
        `insert into case_studies
          (slug, title, category, subtitle, challenge, solution, outcome, excerpt, image, accent, body, featured, published)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         returning id`,
        [
          p.slug, p.title, p.category, p.subtitle, p.challenge, p.solution, p.outcome,
          p.excerpt, p.image, p.accent || 'emerald', JSON.stringify(p.body || []),
          Boolean(p.featured), p.published !== false,
        ],
      )
      const id = inserted.rows[0].id
      await syncAssignments(client, id, teamMemberIds)
      await client.query('commit')

      const result = await fetchCaseStudyById(id)
      res.status(201).json(result)
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  }))

  adminRouter.put('/:id', requireAuth, asyncHandler(async (req, res) => {
    const { teamMemberIds = [], ...p } = req.body || {}
    const client = await pool.connect()
    try {
      await client.query('begin')

      const existing = await client.query('select image from case_studies where id = $1', [req.params.id])
      if (!existing.rows[0]) {
        await client.query('rollback')
        return sendError(res, 404, 'Case study not found')
      }
      const previousImage = existing.rows[0].image

      const updated = await client.query(
        `update case_studies set
           slug = coalesce($1, slug),
           title = coalesce($2, title),
           category = coalesce($3, category),
           subtitle = coalesce($4, subtitle),
           challenge = coalesce($5, challenge),
           solution = coalesce($6, solution),
           outcome = coalesce($7, outcome),
           excerpt = coalesce($8, excerpt),
           image = coalesce($9, image),
           accent = coalesce($10, accent),
           body = coalesce($11, body),
           featured = coalesce($12, featured),
           published = coalesce($13, published),
           updated_at = now()
         where id = $14
         returning id`,
        [
          p.slug ?? null, p.title ?? null, p.category ?? null, p.subtitle ?? null,
          p.challenge ?? null, p.solution ?? null, p.outcome ?? null, p.excerpt ?? null,
          p.image ?? null, p.accent ?? null, p.body ? JSON.stringify(p.body) : null,
          typeof p.featured === 'boolean' ? p.featured : null,
          typeof p.published === 'boolean' ? p.published : null,
          req.params.id,
        ],
      )

      if (!updated.rows[0]) {
        await client.query('rollback')
        return sendError(res, 404, 'Case study not found')
      }

      await syncAssignments(client, req.params.id, teamMemberIds)
      await client.query('commit')

      const result = await fetchCaseStudyById(req.params.id)
      if (result?.image && result.image !== previousImage) {
        await deleteUploadIfOwned(previousImage)
      }
      res.json(result)
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  }))

  adminRouter.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
    const { rows } = await pool.query('delete from case_studies where id = $1 returning image', [req.params.id])
    if (!rows.length) return sendError(res, 404, 'Case study not found')
    await deleteUploadIfOwned(rows[0].image)
    res.json({ success: true })
  }))

  app.use('/api/case-studies', publicRouter)
  app.use('/api/admin/case-studies', adminRouter)
}
