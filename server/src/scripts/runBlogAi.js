// Cron entrypoint for the Auto Blog generation run.
//
// Usage (crontab — fire every 15 MINUTES, not hourly. This script itself
// decides whether to actually generate, by checking blog_ai_settings
// against the current UTC time and today's run history. Every-15-minutes
// is required (not just "nicer") for two features to actually work: (1)
// posts_per_day > 1 needs multiple ticks spread across the day after the
// scheduled start hour to incrementally reach the daily target — one call
// here only ever generates one post; (2) the 30-minute failure-retry
// backoff (see shouldRunNow() below) is meaningless on an hourly cadence,
// since a failure would otherwise wait until the same hour the NEXT day to
// be retried at all, given the schedule-hour gate. This is what makes the
// admin's schedule-hour/posts-per-day pickers in the UI actually live,
// without needing SSH access to edit a fixed crontab entry every time they
// change one):
//   */15 * * * * cd /path/to/server && node src/scripts/runBlogAi.js >> /var/log/blog-ai.log 2>&1
//
// Resolves .env via an absolute path derived from this file's own location
// (not process.cwd()), since cron invocations have a minimal/unpredictable
// working directory and environment. db.js (imported below) constructs its
// Postgres Pool from process.env.DATABASE_URL as soon as it's imported, so
// dotenv.config() must run — with the correct absolute path — BEFORE db.js
// is loaded. A dynamic import() after dotenv.config() guarantees that
// ordering (a static top-of-file import would run before this file's own
// code, defeating the point).
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Deliberately NOT part of runBlogAiEngine() itself — that function is also
// called directly by the admin's manual "Run Now" button, which must work
// on demand regardless of the configured schedule hour, posts_per_day, or
// how many times it's already been used today. This gate only applies to
// the unattended cron path. (The "a run is already in progress" guard lives
// inside runBlogAiEngine() itself via isAlreadyRunning() — no need to
// duplicate that check here; run() below already treats a
// `{ started: false, reason }` result from runBlogAiEngine() the same way
// it treats a `{ run: false }` result from this function.)
const FAILURE_RETRY_MINUTES = 30

async function shouldRunNow(pool, getSettings) {
  const settings = await getSettings()
  const scheduleHour = Number.isFinite(Number(settings.schedule_hour)) ? Number(settings.schedule_hour) : 6
  const postsPerDay = Number.isFinite(Number(settings.posts_per_day)) ? Number(settings.posts_per_day) : 1
  const currentUtcHour = new Date().getUTCHours()

  const { rows: successRows } = await pool.query(
    `select count(*)::int as count from blog_ai_runs
     where status = 'success'
       and (started_at at time zone 'utc')::date = (now() at time zone 'utc')::date`,
  )
  const doneToday = successRows[0]?.count || 0
  if (doneToday >= postsPerDay) {
    return { run: false, reason: `today's target of ${postsPerDay} post(s) already met (${doneToday} done)` }
  }

  if (currentUtcHour < scheduleHour) {
    return { run: false, reason: `not yet the scheduled start hour (current UTC hour ${currentUtcHour} < schedule_hour ${scheduleHour})` }
  }

  const { rows: failedRows } = await pool.query(
    `select id from blog_ai_runs
     where status = 'failed'
       and (started_at at time zone 'utc')::date = (now() at time zone 'utc')::date
       and finished_at > now() - make_interval(mins => $1)
     order by finished_at desc
     limit 1`,
    [FAILURE_RETRY_MINUTES],
  )
  if (failedRows.length) {
    return { run: false, reason: `retry backoff — waiting ${FAILURE_RETRY_MINUTES} minutes after last failure` }
  }

  return { run: true }
}

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set — aborting.')
    process.exit(1)
  }

  const { pool } = await import('../db.js')
  const { runBlogAiEngine, getSettings } = await import('../lib/blogAiEngine.js')

  let result
  try {
    const gate = await shouldRunNow(pool, getSettings)
    if (!gate.run) {
      console.log(`Blog AI: not due — ${gate.reason}`)
      await pool.end()
      process.exit(0)
      return
    }

    result = await runBlogAiEngine()
  } catch (error) {
    console.error('Blog AI run crashed:', error)
    await pool.end()
    process.exit(1)
    return
  }

  if (result.started === false) {
    console.log(`Blog AI: skipped — ${result.reason}`)
  } else if (result.success) {
    console.log(`Blog AI: success — created post "${result.post?.title}" (run ${result.runId})`)
  } else {
    console.error(`Blog AI: failed — ${result.error} (run ${result.runId})`)
  }

  await pool.end()
  process.exit(result.started === false || result.success ? 0 : 1)
}

run()
