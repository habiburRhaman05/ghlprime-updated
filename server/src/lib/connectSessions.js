import { randomUUID } from 'node:crypto'

// In-memory store for short-lived "connect from this browser" pty sessions
// (the Claude `setup-token` login flow and the Codex `login --device-auth`
// flow — see blogAiConnect.js). Deliberately NOT persisted to Postgres:
// these are single-process, single-admin-tab, minutes-long flows, so a
// server restart mid-flow just means the admin clicks the connect button
// again — an acceptable tradeoff for not needing a table + cleanup job for
// something this transient.
//
// session shape:
//   { id, provider, label, ptyProcess, scratchDir, status, url, code,
//     message, account, debugTail, outputBuffer, createdAt, timeoutHandle }
// status: 'starting' | 'awaiting_code' | 'awaiting_approval' | 'verifying'
//         | 'success' | 'failed'
// (Claude uses starting -> awaiting_code -> verifying -> success/failed;
// Codex uses starting -> awaiting_approval -> success/failed.)

const SESSIONS = new Map()
const SESSION_TTL_MS = 10 * 60 * 1000 // 10 minutes of inactivity
const MAX_OUTPUT_BUFFER_CHARS = 200_000 // defensive cap against a runaway spinner

function killPty(session) {
  if (!session.ptyProcess) return
  try {
    session.ptyProcess.kill()
  } catch {
    // already exited — nothing to do
  }
}

// Auto-expires (kills the pty + drops the map entry) after SESSION_TTL_MS of
// inactivity. Called on create and on every get/update so any interaction
// resets the clock.
function scheduleExpiry(session) {
  if (session.timeoutHandle) clearTimeout(session.timeoutHandle)
  session.timeoutHandle = setTimeout(() => destroyConnectSession(session.id), SESSION_TTL_MS)
  // Don't let this timer keep the Node process alive on its own.
  session.timeoutHandle.unref?.()
}

export function createConnectSession({ provider, label }) {
  const session = {
    id: randomUUID(),
    provider,
    label: label || '',
    ptyProcess: null,
    scratchDir: null,
    status: 'starting',
    url: null,
    code: null,
    message: null,
    account: null,
    debugTail: null,
    outputBuffer: '',
    createdAt: new Date(),
    timeoutHandle: null,
  }
  SESSIONS.set(session.id, session)
  scheduleExpiry(session)
  return session
}

export function getConnectSession(sessionId) {
  const session = SESSIONS.get(sessionId)
  if (session) scheduleExpiry(session)
  return session || null
}

// Merges `patch` onto the session in place (so any other in-flight closure
// holding a reference to this object observes the update too) and touches
// the expiry clock. Caps outputBuffer growth defensively.
export function updateConnectSession(sessionId, patch) {
  const session = SESSIONS.get(sessionId)
  if (!session) return null

  Object.assign(session, patch)
  if (typeof session.outputBuffer === 'string' && session.outputBuffer.length > MAX_OUTPUT_BUFFER_CHARS) {
    session.outputBuffer = session.outputBuffer.slice(-MAX_OUTPUT_BUFFER_CHARS)
  }

  scheduleExpiry(session)
  return session
}

export function destroyConnectSession(sessionId) {
  const session = SESSIONS.get(sessionId)
  if (!session) return
  if (session.timeoutHandle) clearTimeout(session.timeoutHandle)
  killPty(session)
  SESSIONS.delete(sessionId)
}

// Shape safe to return from an API response — never includes ptyProcess or
// the raw outputBuffer (which may contain an unredacted token before it's
// been captured/cleared — see blogAiConnect.js's exit handlers).
export function publicConnectSession(session) {
  if (!session) return null
  return {
    status: session.status,
    url: session.url || null,
    code: session.code || null,
    message: session.message || null,
    account: session.account || null,
    debugTail: session.debugTail || null,
  }
}
