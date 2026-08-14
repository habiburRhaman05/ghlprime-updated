import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRouter from './routes/auth.js'
import registerBlogPostRoutes from './routes/blogPosts.js'
import registerCaseStudyRoutes from './routes/caseStudies.js'
import registerGalleryRoutes from './routes/gallery.js'
import registerPartnerLogoRoutes from './routes/partnerLogos.js'
import registerMeetingGalleryRoutes from './routes/meetingGallery.js'
import registerShowcaseRoutes from './routes/showcase.js'
import registerTeamRoutes from './routes/team.js'
import registerTechnologyLogoRoutes from './routes/technologyLogos.js'
import registerContactLeadRoutes from './routes/contactLeads.js'
import registerUploadRoutes from './routes/uploads.js'
import registerBlogAiRoutes from './routes/blogAi.js'
import { UPLOAD_DIR } from './utils/uploads.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5013

const DEFAULT_ORIGINS = ['http://localhost:5173', 'https://dev.ghlprime.com', 'https://ghlprime.com']
const configuredOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
const allowedOrigins = configuredOrigins.length ? configuredOrigins : DEFAULT_ORIGINS

app.use(cors({
  origin(origin, callback) {
    // Allow non-browser requests (no Origin header, e.g. curl / server-to-server).
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error(`Origin ${origin} is not allowed by CORS`))
  },
}))
app.use(express.json())

// Serves uploaded admin images back out at the same relative path they were
// returned under (POST /api/admin/uploads responds with { url: '/uploads/<file>' }).
app.use('/uploads', express.static(UPLOAD_DIR))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRouter)

registerBlogPostRoutes(app)
registerCaseStudyRoutes(app)
registerGalleryRoutes(app)
registerPartnerLogoRoutes(app)
registerMeetingGalleryRoutes(app)
registerShowcaseRoutes(app)
registerTeamRoutes(app)
registerTechnologyLogoRoutes(app)
registerContactLeadRoutes(app)
registerUploadRoutes(app)
registerBlogAiRoutes(app)

app.use((req, res) => {
  res.status(404).json({ error: { message: `No route for ${req.method} ${req.originalUrl}` } })
})

// Central error handler — every route uses asyncHandler() so rejected
// promises land here instead of hanging the request.
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error)
  if (error?.message?.startsWith('Origin ') && error.message.endsWith('is not allowed by CORS')) {
    return res.status(403).json({ error: { message: 'Origin not allowed' } })
  }
  res.status(500).json({ error: { message: 'Internal server error' } })
})

app.listen(port, () => {
  console.log(`GHL Prime API listening on http://localhost:${port}`)
})
