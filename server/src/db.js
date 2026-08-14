import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set — the API will not be able to reach Postgres.')
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
})

pool.on('error', (error) => {
  console.error('Unexpected Postgres pool error', error)
})

export function query(text, params) {
  return pool.query(text, params)
}
