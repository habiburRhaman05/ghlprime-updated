import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, sendError } from '../utils/asyncHandler.js'

const router = express.Router()
const TOKEN_TTL = '7d'

router.post('/login', asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '').trim()
  const password = String(req.body?.password || '')

  if (!email || !password) {
    return sendError(res, 400, 'Email and password are required')
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured')
    return sendError(res, 500, 'Server auth is not configured')
  }

  const { rows } = await pool.query(
    'select id, email, password_hash from admin_users where lower(email) = lower($1)',
    [email],
  )
  const user = rows[0]

  // Compare against a dummy hash when the user doesn't exist so login timing
  // doesn't leak which emails are registered.
  const hashToCheck = user?.password_hash || '$2a$10$CwTycUXWue0Thq9StjUM0uJ8G0tJoR3Aq1s6a2Q9Q4YFhOZQ5H4Ge'
  const passwordMatches = await bcrypt.compare(password, hashToCheck)

  if (!user || !passwordMatches) {
    return sendError(res, 401, 'Invalid email or password')
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL })

  return res.json({
    token,
    user: { id: user.id, email: user.email },
  })
}))

router.post('/logout', (_req, res) => {
  // JWTs are stateless — there is nothing to invalidate server-side. The
  // client is responsible for discarding the token.
  res.json({ ok: true })
})

router.get('/session', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

export default router
