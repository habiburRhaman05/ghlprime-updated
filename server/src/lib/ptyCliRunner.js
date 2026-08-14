import pty from 'node-pty'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

// node-pty process mechanics for the two "connect from this browser" login
// flows (`claude setup-token`, `codex login --device-auth`). Deliberately
// split out from aiCliRunner.js: everything in that file uses plain
// child_process pipes because every other CLI invocation there runs in
// non-interactive print mode (`-p` / `exec`). These two commands are full
// interactive TUIs (raw ANSI cursor-control + a spinner) that genuinely
// need a real pseudo-terminal to behave correctly — plain stdio pipes are
// not sufficient here. Verified live on the target VPS via
// `script -qec 'claude setup-token' capture.log`.
//
// Same bin-path override convention as aiCliRunner.js — cron/PM2
// invocations get a minimal PATH that may not include npm global-install
// bin dirs.
const CLAUDE_BIN = process.env.CLAUDE_CLI_PATH || '/usr/bin/claude'
const CODEX_BIN = process.env.CODEX_CLI_PATH || '/usr/bin/codex'

async function makeScratchDir(prefix) {
  const dir = path.join(os.tmpdir(), `${prefix}-${randomUUID()}`)
  await fs.mkdir(dir, { recursive: true })
  return dir
}

// Spawns `command` under a pty with cwd set to a fresh empty scratch
// directory (matching the sandboxing spirit of the rest of this feature —
// though neither of these commands actually reads/writes files in cwd,
// since they're just the CLI's own login flow, not an agentic `-p`
// session). Returns both the pty handle and the scratch dir path so the
// caller can clean the dir up once the process exits.
async function spawnInScratchDir(command, args, { prefix }) {
  const cwd = await makeScratchDir(prefix)
  // cols is deliberately huge: `claude setup-token` prints a ~300-350
  // char OAuth URL on one line, and a normal terminal width (verified
  // live at cols:120) wraps it mid-query-string, silently truncating
  // before redirect_uri/code_challenge/state -- breaking the URL
  // extraction below. A wide pty avoids the wrap at the source instead
  // of trying to rejoin wrapped lines after the fact.
  const ptyProcess = pty.spawn(command, args, {
    name: 'xterm-color',
    cols: 2000,
    rows: 30,
    cwd,
    env: process.env,
  })
  return { ptyProcess, cwd }
}

export async function spawnClaudeSetupToken() {
  return spawnInScratchDir(CLAUDE_BIN, ['setup-token'], { prefix: 'blog-ai-claude-connect' })
}

export async function spawnCodexDeviceAuth() {
  return spawnInScratchDir(CODEX_BIN, ['login', '--device-auth'], { prefix: 'blog-ai-codex-connect' })
}

export async function cleanupScratchDir(dir) {
  if (!dir) return
  await fs.rm(dir, { recursive: true, force: true }).catch(() => {})
}

// -- Ambient-credential backup/restore --------------------------------------
//
// CONFIRMED LIVE (the hard way): starting `codex login --device-auth`
// deletes the existing ~/.codex/auth.json almost immediately, even if the
// attempt is then cancelled or fails before a human ever gets to approve
// it in their browser -- a cancelled/failed connect attempt was found to
// have permanently logged out a previously-working ambient Codex session.
// To make connect attempts safe to cancel, back up the relevant credential
// file before spawning either login command, and restore it if the
// process doesn't exit 0 (covers both a genuine failure and a kill() from
// the admin cancelling mid-flow, since killing a pty triggers the same
// onExit handler with a non-zero code). Not confirmed necessary for
// Claude's ~/.claude/.credentials.json the same way (its login flow prints
// a token rather than obviously relying on ambient state), but applied
// symmetrically anyway since the cost of backing up a small JSON file is
// negligible next to the cost of silently repeating this mistake.

export const CLAUDE_CREDENTIALS_PATH = path.join(os.homedir(), '.claude', '.credentials.json')
export const CODEX_AUTH_PATH = path.join(os.homedir(), '.codex', 'auth.json')

// Copies `filePath` to a sibling temp file and returns that backup path, or
// null if there was nothing to back up (e.g. no prior ambient login existed
// at all -- not an error case).
export async function backupCredentialFile(filePath) {
  const backupPath = `${filePath}.autoblog-connect-backup-${randomUUID()}`
  try {
    await fs.copyFile(filePath, backupPath)
    return backupPath
  } catch {
    return null
  }
}

// Restores a previously-taken backup over `filePath` and removes the backup
// file. No-op if `backupPath` is null (nothing was backed up).
export async function restoreCredentialFile(filePath, backupPath) {
  if (!backupPath) return
  await fs.copyFile(backupPath, filePath).catch(() => {})
  await fs.rm(backupPath, { force: true }).catch(() => {})
}

// Discards a backup without restoring it (the connect attempt succeeded, so
// the new credential file is the intended state).
export async function discardCredentialBackup(backupPath) {
  if (!backupPath) return
  await fs.rm(backupPath, { force: true }).catch(() => {})
}
