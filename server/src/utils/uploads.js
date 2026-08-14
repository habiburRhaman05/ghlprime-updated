import fs from 'node:fs'
import path from 'node:path'

// Where uploaded admin images live on disk. Deliberately resolved inside
// server/ (defaults to "<cwd>/uploads" when the API is started from the
// server/ directory) — NOT inside the frontend's dist/ folder, since dist/
// is wiped and fully replaced on every site rebuild/deploy and anything
// stored there would be destroyed on the next deploy.
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads')

fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const UPLOAD_PATHNAME_PATTERN = /^\/uploads\/([^/?#]+)$/

// Given a stored image_url value, returns the bare filename if it points at
// one of our own uploads, or null otherwise (e.g. an external CDN URL).
// Accepts both what we store going forward — a relative path like
// "/uploads/<uuid>.png" — and an absolute URL whose pathname starts with
// "/uploads/", so old rows and cross-environment values keep working.
export function extractUploadFilename(url) {
  if (!url || typeof url !== 'string') return null

  let pathname
  try {
    // Throws for anything that isn't a valid absolute URL, which is exactly
    // the case for the relative paths we store going forward.
    pathname = new URL(url).pathname
  } catch {
    pathname = url
  }

  const match = pathname.match(UPLOAD_PATHNAME_PATTERN)
  if (!match) return null

  let filename
  try {
    filename = decodeURIComponent(match[1])
  } catch {
    filename = match[1]
  }

  // Defense in depth: the pattern above already can't capture a "/", but
  // guard against ".." and stray path separators so this can never resolve
  // outside UPLOAD_DIR.
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return null
  }

  return filename
}

// Deletes the on-disk file backing `url` if (and only if) it's one of ours.
// No-op for external URLs. Safe to call with the value the file is being
// replaced by or removed for — errors other than "already gone" are logged,
// never thrown, so a failed cleanup never fails the surrounding request.
export async function deleteUploadIfOwned(url) {
  const filename = extractUploadFilename(url)
  if (!filename) return

  try {
    await fs.promises.unlink(path.join(UPLOAD_DIR, filename))
  } catch (error) {
    if (error?.code === 'ENOENT') return
    console.error(`Failed to delete upload file "${filename}":`, error)
  }
}
