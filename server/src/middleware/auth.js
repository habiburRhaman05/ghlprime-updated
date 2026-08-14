import jwt from 'jsonwebtoken'
import { sendError } from '../utils/asyncHandler.js'

// Protects admin write routes. Expects `Authorization: Bearer <token>`.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null

  if (!token) {
    return sendError(res, 401, 'Missing authorization token')
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured')
    return sendError(res, 500, 'Server auth is not configured')
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.sub, email: payload.email }
    return next()
  } catch {
    return sendError(res, 401, 'Invalid or expired token')
  }
}
