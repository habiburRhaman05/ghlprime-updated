// Seeds (or resets) the two admin accounts against DATABASE_URL.
//
// Usage:
//   node src/scripts/seedAdmins.js
//
// By default this generates a fresh, cryptographically random password for
// each account and prints them ONCE — save them immediately, they are never
// stored anywhere in plaintext (only the bcrypt hash goes to the database).
//
// To set specific passwords instead (e.g. to match ones already relayed to
// the client), pass them via env vars so nothing is hardcoded in the repo:
//   SEED_PASSWORD_NIYA='...' SEED_PASSWORD_INFO='...' node src/scripts/seedAdmins.js
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { pool } from '../db.js'

dotenv.config()

const ACCOUNTS = [
  { email: 'niya@ghlprime.com', envVar: 'SEED_PASSWORD_NIYA' },
  { email: 'info@ghlprime.com', envVar: 'SEED_PASSWORD_INFO' },
]

function generatePassword() {
  // 24 random bytes -> 32-char base64url string. High entropy, URL/shell safe.
  return crypto.randomBytes(24).toString('base64url')
}

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set — aborting.')
    process.exit(1)
  }

  const results = []

  for (const account of ACCOUNTS) {
    const password = process.env[account.envVar] || generatePassword()
    const passwordHash = await bcrypt.hash(password, 12)

    await pool.query(
      `insert into admin_users (email, password_hash)
       values ($1, $2)
       on conflict (email) do update set password_hash = excluded.password_hash`,
      [account.email, passwordHash],
    )

    results.push({ email: account.email, password })
  }

  console.log('\nAdmin accounts seeded successfully. SAVE THESE NOW — they will not be shown again:\n')
  for (const { email, password } of results) {
    console.log(`  ${email}  ->  ${password}`)
  }
  console.log('')

  await pool.end()
}

run().catch((error) => {
  console.error('Seeding admins failed:', error)
  process.exit(1)
})
