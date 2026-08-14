# GHL Prime - Future Backend Plan

## Goal

Expand the current premium homepage into a dynamic platform using MongoDB.

## Recommended content model

### projects
- title
- slug
- summary
- heroImage
- services
- industry
- metrics
- bodySections
- featured
- createdAt
- updatedAt

### services
- title
- slug
- shortDescription
- longDescription
- featureBullets
- icon
- order

### testimonials
- name
- role
- company
- quote
- avatar
- rating
- featured

### site_settings
- brandName
- supportEmail
- socialLinks
- homepageSections
- seoDefaults

### contact_submissions
- name
- email
- company
- phone
- message
- source
- createdAt

## Suggested API routes

- `GET /api/projects`
- `GET /api/projects/:slug`
- `GET /api/services`
- `GET /api/testimonials`
- `GET /api/site-settings`
- `POST /api/contact`

## Frontend expansion ideas

- Replace static homepage copy with CMS/API content
- Add dynamic featured projects section
- Add reusable section renderer from Mongo content blocks
- Introduce admin dashboard later for updates

## Suggested future folders

- `src/components/`
- `src/sections/`
- `src/pages/`
- `src/data/`
- `src/lib/`
- `server/`
- `server/models/`
- `server/routes/`
- `server/controllers/`
