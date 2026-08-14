import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, sendError } from '../utils/asyncHandler.js'

const SELECT_ITEM_WITH_PLACEMENTS = `
  si.*,
  coalesce(
    (
      select json_agg(row_to_json(sp) order by sp.page_key)
      from showcase_placements sp
      where sp.item_id = si.id
    ),
    '[]'::json
  ) as placements
`

async function fetchShowcaseItemById(id) {
  const { rows } = await pool.query(
    `select ${SELECT_ITEM_WITH_PLACEMENTS} from showcase_items si where si.id = $1`,
    [id],
  )
  return rows[0] || null
}

async function syncPlacements(client, itemId, placements = []) {
  await client.query('delete from showcase_placements where item_id = $1', [itemId])
  if (!placements.length) return

  const values = []
  const params = [itemId]
  placements.forEach((placement, index) => {
    const base = params.length
    values.push(`($1, $${base + 1}, $${base + 2}, $${base + 3})`)
    params.push(
      placement.page_key,
      Number(placement.sort_order) || 999,
      placement.enabled !== false,
    )
  })

  await client.query(
    `insert into showcase_placements (item_id, page_key, sort_order, enabled) values ${values.join(', ')}`,
    params,
  )
}

export default function registerShowcaseRoutes(app) {
  const publicRouter = express.Router()
  const statsPublic = express.Router()
  const itemsAdmin = express.Router()
  const statsAdmin = express.Router()

  // -- Public reads ------------------------------------------------------

  // GET /api/showcase?page=home | service:<slug>
  // Filters si.published = true to reproduce the previous Supabase RLS
  // behaviour: the "public can read published showcase items" policy made
  // the embedded item come back null for unpublished items, and
  // fetchShowcaseForPage() dropped those nulls. Filtering here up front is
  // equivalent and avoids ever sending unpublished item data to the client.
  publicRouter.get('/', asyncHandler(async (req, res) => {
    const pageKey = String(req.query.page || '')
    if (!pageKey) return res.json([])

    const { rows } = await pool.query(
      `select si.*
       from showcase_placements sp
       join showcase_items si on si.id = sp.item_id
       where sp.page_key = $1 and sp.enabled = true and si.published = true
       order by sp.sort_order asc`,
      [pageKey],
    )
    res.json(rows)
  }))

  statsPublic.get('/', asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      'select * from showcase_stats where published = true order by sort_order asc',
    )
    res.json(rows)
  }))

  // -- Admin: items + placements -------------------------------------------

  itemsAdmin.get('/', requireAuth, asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `select ${SELECT_ITEM_WITH_PLACEMENTS} from showcase_items si order by si.sort_order asc`,
    )
    res.json(rows)
  }))

  itemsAdmin.post('/', requireAuth, asyncHandler(async (req, res) => {
    const { placements = [], ...p } = req.body || {}
    const client = await pool.connect()
    try {
      await client.query('begin')
      const inserted = await client.query(
        `insert into showcase_items
          (origin_name, origin_url, origin_icon, origin_description, origin_tagline,
           adaptation_badge, adaptation_name, adaptation_description, adaptation_tags, sort_order, published)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         returning id`,
        [
          p.origin_name, p.origin_url ?? null, p.origin_icon ?? null, p.origin_description ?? null,
          p.origin_tagline ?? null, p.adaptation_badge || 'Enterprise Adaptation', p.adaptation_name,
          p.adaptation_description ?? null, JSON.stringify(p.adaptation_tags || []),
          p.sort_order ?? 999, p.published !== false,
        ],
      )
      const id = inserted.rows[0].id
      await syncPlacements(client, id, placements)
      await client.query('commit')

      res.status(201).json(await fetchShowcaseItemById(id))
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  }))

  itemsAdmin.put('/:id', requireAuth, asyncHandler(async (req, res) => {
    const { placements = [], ...p } = req.body || {}
    const client = await pool.connect()
    try {
      await client.query('begin')
      const updated = await client.query(
        `update showcase_items set
           origin_name = coalesce($1, origin_name),
           origin_url = coalesce($2, origin_url),
           origin_icon = coalesce($3, origin_icon),
           origin_description = coalesce($4, origin_description),
           origin_tagline = coalesce($5, origin_tagline),
           adaptation_badge = coalesce($6, adaptation_badge),
           adaptation_name = coalesce($7, adaptation_name),
           adaptation_description = coalesce($8, adaptation_description),
           adaptation_tags = coalesce($9, adaptation_tags),
           sort_order = coalesce($10, sort_order),
           published = coalesce($11, published),
           updated_at = now()
         where id = $12 returning id`,
        [
          p.origin_name ?? null, p.origin_url ?? null, p.origin_icon ?? null,
          p.origin_description ?? null, p.origin_tagline ?? null, p.adaptation_badge ?? null,
          p.adaptation_name ?? null, p.adaptation_description ?? null,
          p.adaptation_tags ? JSON.stringify(p.adaptation_tags) : null,
          p.sort_order ?? null, typeof p.published === 'boolean' ? p.published : null,
          req.params.id,
        ],
      )

      if (!updated.rows[0]) {
        await client.query('rollback')
        return sendError(res, 404, 'Showcase item not found')
      }

      await syncPlacements(client, req.params.id, placements)
      await client.query('commit')

      res.json(await fetchShowcaseItemById(req.params.id))
    } catch (error) {
      await client.query('rollback')
      throw error
    } finally {
      client.release()
    }
  }))

  itemsAdmin.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
    // showcase_placements cascades via ON DELETE CASCADE.
    const { rowCount } = await pool.query('delete from showcase_items where id = $1', [req.params.id])
    if (!rowCount) return sendError(res, 404, 'Showcase item not found')
    res.json({ success: true })
  }))

  // -- Admin: stats --------------------------------------------------------

  statsAdmin.get('/', requireAuth, asyncHandler(async (_req, res) => {
    const { rows } = await pool.query('select * from showcase_stats order by sort_order asc')
    res.json(rows)
  }))

  statsAdmin.post('/', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}
    const { rows } = await pool.query(
      `insert into showcase_stats (value, label, sort_order, published)
       values ($1,$2,$3,$4) returning *`,
      [p.value, p.label, p.sort_order ?? 999, p.published !== false],
    )
    res.status(201).json(rows[0])
  }))

  statsAdmin.put('/:id', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}
    const { rows } = await pool.query(
      `update showcase_stats set
         value = coalesce($1, value),
         label = coalesce($2, label),
         sort_order = coalesce($3, sort_order),
         published = coalesce($4, published),
         updated_at = now()
       where id = $5 returning *`,
      [p.value ?? null, p.label ?? null, p.sort_order ?? null,
        typeof p.published === 'boolean' ? p.published : null, req.params.id],
    )
    if (!rows[0]) return sendError(res, 404, 'Showcase stat not found')
    res.json(rows[0])
  }))

  statsAdmin.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
    const { rowCount } = await pool.query('delete from showcase_stats where id = $1', [req.params.id])
    if (!rowCount) return sendError(res, 404, 'Showcase stat not found')
    res.json({ success: true })
  }))

  app.use('/api/showcase', publicRouter)
  app.use('/api/showcase-stats', statsPublic)
  app.use('/api/admin/showcase-items', itemsAdmin)
  app.use('/api/admin/showcase-stats', statsAdmin)
}
