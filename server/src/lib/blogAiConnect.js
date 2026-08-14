import { stripAnsi } from './ansiStrip.js'
import { createConnectSession, getConnectSession, updateConnectSession } from './connectSessions.js'
import {
  spawnClaudeSetupToken, spawnCodexDeviceAuth, cleanupScratchDir,
  backupCredentialFile, restoreCredentialFile, discardCredentialBackup,
  CLAUDE_CREDENTIALS_PATH, CODEX_AUTH_PATH,
} from './ptyCliRunner.js'
import { saveClaudeAccount } from './blogAiAccountRepo.js'

// Orchestrates the two "connect from this browser" pty login flows on top
// of connectSessions.js (generic session store) and ptyCliRunner.js (raw
// pty process mechanics). This is the piece that knows what `claude
// setup-token` and `codex login --device-auth` actually print and how to
// react to it.

const DEBUG_TAIL_CHARS = 4000

// -- Claude `setup-token` ----------------------------------------------------
//
// Verified live sequence (via `script -qec 'claude setup-token' capture.log`
// on the target VPS): prints a welcome banner, tries (and fails, expected)
// to open a local browser, shows a spinner, then prints the OAuth authorize
// URL wrapped in an OSC-8 hyperlink, redrawing it periodically alongside the
// spinner. Then it prompts "Paste code here if prompted >" and waits for
// input. What happens AFTER a valid code is submitted was NOT verified live
// (that requires a real human completing a real OAuth login) — the token
// extraction below is a best-effort, defensive guess based on the command's
// documented purpose and the shape of tokens already handled by the
// existing manual-paste flow. If this regex turns out to be wrong, `status`
// will resolve to 'failed' with `debugTail` containing the ANSI-stripped
// tail of the real output, which is exactly what's needed to fix the regex
// in one follow-up pass — see saveClaudeAccount() below, this never
// silently swallows an unparseable result.

const CLAUDE_AUTH_URL_PATTERN = /https:\/\/claude\.com\/cai\/oauth\/authorize\?[^\s]+/
const CLAUDE_TOKEN_PATTERN = /sk-ant-oat[a-zA-Z0-9_-]{20,}/
// Fallback if the above doesn't match: the last long contiguous
// token-looking (alnum/-/_, no whitespace) run of 40+ chars in the output —
// on the assumption a freshly-printed token is likely the last such thing
// printed before the process exits.
const GENERIC_TOKEN_PATTERN = /[A-Za-z0-9_-]{40,}/g

function extractClaudeAuthUrl(strippedText) {
  const match = strippedText.match(CLAUDE_AUTH_URL_PATTERN)
  return match ? match[0] : null
}

function extractClaudeToken(strippedText) {
  const direct = strippedText.match(CLAUDE_TOKEN_PATTERN)
  if (direct) return direct[0]

  const candidates = strippedText.match(GENERIC_TOKEN_PATTERN)
  if (candidates && candidates.length) return candidates[candidates.length - 1]

  return null
}

export function startClaudeConnectSession({ label }) {
  const session = createConnectSession({ provider: 'claude', label })
  let authBackup = null

  backupCredentialFile(CLAUDE_CREDENTIALS_PATH)
    .then((backup) => {
      authBackup = backup
      return spawnClaudeSetupToken()
    })
    .then(({ ptyProcess, cwd }) => {
      if (!getConnectSession(session.id)) {
        // Session was cancelled/expired before the pty even finished starting.
        ptyProcess.kill()
        cleanupScratchDir(cwd)
        restoreCredentialFile(CLAUDE_CREDENTIALS_PATH, authBackup)
        return
      }

      updateConnectSession(session.id, { ptyProcess, scratchDir: cwd })

      ptyProcess.onData((chunk) => {
        const current = getConnectSession(session.id)
        if (!current) return

        const outputBuffer = current.outputBuffer + chunk
        const patch = { outputBuffer }

        if (current.status === 'starting' && !current.url) {
          const url = extractClaudeAuthUrl(stripAnsi(outputBuffer))
          if (url) {
            patch.url = url
            patch.status = 'awaiting_code'
          }
        }

        updateConnectSession(session.id, patch)
      })

      ptyProcess.onExit(({ exitCode }) => {
        // See ptyCliRunner.js's backupCredentialFile() doc comment: restore
        // on anything but a clean exit (covers real failure AND a kill()
        // from the admin cancelling mid-flow) so a cancelled/failed connect
        // attempt can never leave an existing ambient login worse off.
        if (exitCode === 0) {
          discardCredentialBackup(authBackup)
        } else {
          restoreCredentialFile(CLAUDE_CREDENTIALS_PATH, authBackup)
        }
        handleClaudeExit(session.id, exitCode)
        cleanupScratchDir(cwd)
      })
    })
    .catch((error) => {
      restoreCredentialFile(CLAUDE_CREDENTIALS_PATH, authBackup)
      updateConnectSession(session.id, {
        status: 'failed',
        message: `Could not start "claude setup-token": ${error?.message || error}`,
      })
    })

  return session
}

async function handleClaudeExit(sessionId, exitCode) {
  const session = getConnectSession(sessionId)
  if (!session) return

  const strippedTail = stripAnsi(session.outputBuffer).slice(-DEBUG_TAIL_CHARS)

  if (exitCode !== 0) {
    updateConnectSession(sessionId, {
      status: 'failed',
      message: `"claude setup-token" exited with code ${exitCode}`,
      debugTail: strippedTail,
      outputBuffer: '',
    })
    return
  }

  const token = extractClaudeToken(strippedTail)
  if (!token) {
    updateConnectSession(sessionId, {
      status: 'failed',
      message: '"claude setup-token" exited successfully but no token could be extracted from its output — the extraction regex likely needs adjusting against real output (see debugTail).',
      debugTail: strippedTail,
      outputBuffer: '',
    })
    return
  }

  try {
    // Browser "Connect" flow always captures a `claude setup-token` OAuth
    // token, never an API key -- explicit, not just the default, so this
    // reads correctly next to the advanced API-key add-account path.
    const account = await saveClaudeAccount({ label: session.label, rawToken: token, model: null, authType: 'oauth' })
    // Redact immediately — the raw token must not remain readable on the
    // session once it's captured into the encrypted accounts table.
    updateConnectSession(sessionId, {
      status: 'success',
      account,
      outputBuffer: '[redacted after successful token capture]',
      debugTail: null,
    })
  } catch (error) {
    updateConnectSession(sessionId, {
      status: 'failed',
      message: `Token was captured but saving the account failed: ${error.message}`,
      outputBuffer: '[redacted after token capture attempt]',
    })
  }
}

export function submitClaudeConnectCode(sessionId, code) {
  const session = getConnectSession(sessionId)
  if (!session) throw new Error('Connect session not found or expired')
  if (session.status !== 'awaiting_code') {
    throw new Error(`Cannot submit a code while session status is "${session.status}"`)
  }
  if (!session.ptyProcess) throw new Error('Connect session has no active process')

  const cleanCode = String(code || '').trim()
  if (!cleanCode) throw new Error('Code is required')

  // ptys conventionally expect \r (not \n) for Enter.
  session.ptyProcess.write(`${cleanCode}\r`)
  updateConnectSession(sessionId, { status: 'verifying' })
}

// -- Codex `login --device-auth` --------------------------------------------
//
// `codex login --device-auth` (per `codex login --help`) is the
// non-interactive-friendly device-authorization flow: it should print a URL
// and a one-time code, then poll automatically until the admin approves in
// their own browser — standard OAuth device-code grant behavior, so nothing
// needs to be typed back into our UI for this one (unlike Claude). The
// exact printed wording was NOT verified live (that also requires a real
// human completing a real OAuth login), so this looks for the standard
// device-code shapes: an https URL, and a short alphanumeric/dash code near
// it. If this proves wrong in live testing, `url`/`code` will just stay
// null and the UI shows "waiting" indefinitely until the process exits —
// no silent corruption, just needs the regex adjusted from a real capture.

const CODEX_URL_PATTERN = /https:\/\/[^\s]+/
// Verified live on the target VPS (codex login --device-auth under a pty):
// real output is step 1, a URL (https://auth.openai.com/codex/device), then
// step 2, "Enter this one-time code (expires in 15 minutes)" followed by a
// code shaped like P64A-QZ5ZM on its own line -- a 4-char group, a dash, and
// a 5-char group. NOT the 4-4 or bare 6-10 shape originally guessed here
// (that guess never matched, so `code` never populated and the UI sat at
// 'starting' forever). Kept a little tolerant on the second group's length
// in case it varies.
const CODEX_CODE_PATTERN = /\b([A-Z0-9]{4}-[A-Z0-9]{4,6})\b/

function extractCodexDeviceAuth(strippedText) {
  const urlMatch = strippedText.match(CODEX_URL_PATTERN)
  const codeMatch = strippedText.match(CODEX_CODE_PATTERN)
  return {
    url: urlMatch ? urlMatch[0] : null,
    code: codeMatch ? codeMatch[1] : null,
  }
}

export function startCodexConnectSession() {
  const session = createConnectSession({ provider: 'codex', label: '' })
  let authBackup = null

  backupCredentialFile(CODEX_AUTH_PATH)
    .then((backup) => {
      authBackup = backup
      return spawnCodexDeviceAuth()
    })
    .then(({ ptyProcess, cwd }) => {
      if (!getConnectSession(session.id)) {
        ptyProcess.kill()
        cleanupScratchDir(cwd)
        restoreCredentialFile(CODEX_AUTH_PATH, authBackup)
        return
      }

      updateConnectSession(session.id, { ptyProcess, scratchDir: cwd })

      ptyProcess.onData((chunk) => {
        const current = getConnectSession(session.id)
        if (!current) return

        const outputBuffer = current.outputBuffer + chunk
        const patch = { outputBuffer }

        if (!current.url || !current.code) {
          const { url, code } = extractCodexDeviceAuth(stripAnsi(outputBuffer))
          if (url) patch.url = url
          if (code) patch.code = code
        }
        if (current.status === 'starting' && (patch.url || current.url) && (patch.code || current.code)) {
          patch.status = 'awaiting_approval'
        }

        updateConnectSession(session.id, patch)
      })

      ptyProcess.onExit(({ exitCode }) => {
        const current = getConnectSession(session.id)
        // Same reasoning as the Claude flow above -- restore on anything
        // but a clean exit, which is exactly what caused a working ambient
        // Codex login to get silently deleted the first time this was
        // tested against the real CLI (a cancelled attempt killed the pty,
        // which had already cleared ~/.codex/auth.json).
        if (exitCode === 0) {
          discardCredentialBackup(authBackup)
        } else {
          restoreCredentialFile(CODEX_AUTH_PATH, authBackup)
        }
        if (current) {
          if (exitCode === 0) {
            updateConnectSession(session.id, { status: 'success', outputBuffer: '' })
          } else {
            updateConnectSession(session.id, {
              status: 'failed',
              message: `"codex login --device-auth" exited with code ${exitCode}`,
              debugTail: stripAnsi(current.outputBuffer).slice(-DEBUG_TAIL_CHARS),
              outputBuffer: '',
            })
          }
        }
        cleanupScratchDir(cwd)
      })
    })
    .catch((error) => {
      restoreCredentialFile(CODEX_AUTH_PATH, authBackup)
      updateConnectSession(session.id, {
        status: 'failed',
        message: `Could not start "codex login --device-auth": ${error?.message || error}`,
      })
    })

  return session
}
