import crypto from 'node:crypto'
import path from 'node:path'
import express from 'express'
import multer from 'multer'
import { requireAuth } from '../middleware/auth.js'
import { sendError } from '../utils/asyncHandler.js'
import { UPLOAD_DIR } from '../utils/uploads.js'

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
])

const SAFE_EXTENSION_PATTERN = /^\.[a-z0-9]{1,8}$/

// Only keep the original extension if it actually looks like one — anything
// unrecognisable (or missing) just gets no extension.
function safeExtension(originalName) {
  const ext = path.extname(String(originalName || '')).toLowerCase()
  return SAFE_EXTENSION_PATTERN.test(ext) ? ext : ''
}

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, UPLOAD_DIR)
  },
  filename(_req, file, callback) {
    callback(null, `${crypto.randomUUID()}${safeExtension(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, callback) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      callback(new Error('Unsupported file type. Allowed formats: PNG, JPEG, WEBP, GIF, SVG.'))
      return
    }
    callback(null, true)
  },
})

// Registers the single admin upload endpoint. Mounted at /api/admin/uploads.
export default function registerUploadRoutes(app) {
  const adminRouter = express.Router()

  adminRouter.post('/', requireAuth, (req, res) => {
    upload.single('file')(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return sendError(res, 400, 'File is too large. Maximum size is 10MB.')
        }
        return sendError(res, 400, error.message || 'Upload failed.')
      }
      if (error) {
        return sendError(res, 400, error.message || 'Upload failed.')
      }
      if (!req.file) {
        return sendError(res, 400, 'No file was uploaded.')
      }

      // Relative path, deliberately not an absolute URL with a hardcoded
      // domain — matches API_BASE_URL's own domain-relative philosophy in
      // src/lib/apiClient.js so this works unchanged across dev/stg/prod.
      res.status(201).json({ url: `/uploads/${req.file.filename}` })
    })
  })

  app.use('/api/admin/uploads', adminRouter)
}
