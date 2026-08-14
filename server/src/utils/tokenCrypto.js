import crypto from 'node:crypto'

// AES-256-GCM encryption for the Claude Code OAuth tokens admins paste into
// the Auto Blog settings UI. Never stored in plaintext.
//
// TOKEN_ENCRYPTION_KEY must be 32 raw bytes, hex-encoded in .env. Generate one with:
//   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // recommended IV length for GCM

function getKey() {
  const hex = process.env.TOKEN_ENCRYPTION_KEY
  if (!hex) {
    throw new Error('TOKEN_ENCRYPTION_KEY is not configured')
  }

  const key = Buffer.from(hex, 'hex')
  if (key.length !== 32) {
    throw new Error('TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes (64 hex characters)')
  }

  return key
}

// Encrypts `plain` and returns a colon-joined "iv:authTag:ciphertext" string
// (all base64), suitable for storing directly in the `token` column. A fresh
// random IV is generated on every call — never reuse an IV with GCM.
export function encryptToken(plain) {
  const key = getKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  const ciphertext = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [iv.toString('base64'), authTag.toString('base64'), ciphertext.toString('base64')].join(':')
}

// Reverses encryptToken(). Throws if `stored` is malformed or the auth tag
// doesn't verify (tampered ciphertext or wrong key).
export function decryptToken(stored) {
  const key = getKey()
  const parts = String(stored || '').split(':')
  if (parts.length !== 3) {
    throw new Error('Malformed encrypted token value')
  }

  const [ivB64, authTagB64, ciphertextB64] = parts
  const iv = Buffer.from(ivB64, 'base64')
  const authTag = Buffer.from(authTagB64, 'base64')
  const ciphertext = Buffer.from(ciphertextB64, 'base64')

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return plain.toString('utf8')
}
