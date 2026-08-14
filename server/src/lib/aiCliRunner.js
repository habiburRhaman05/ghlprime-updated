import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

// Raw subprocess mechanics for shelling out to the `claude` and `codex`
// CLIs. No database access here — this is pure process I/O, shared by the
// full generation run (blogAiEngine.js) and the admin UI's "Test" buttons
// (routes/blogAi.js), which only need a trivial ping.
//
// CLI flag choices below were verified live against the actual installs on
// the target VPS (claude v2.1.207, codex v0.144.1) — see the architecture
// doc this was built from. Do not change flag names/shapes without
// re-verifying against the real CLIs.

// Resolve absolute binary paths rather than relying on bare 'claude'/'codex'
// — cron invocations get a minimal PATH (typically just /usr/bin:/bin) that
// may not include npm global-install bin dirs. Verified live on the target
// VPS: `which claude` -> /usr/bin/claude, `which codex` -> /usr/bin/codex.
// Override via env vars if the install location ever changes, or per-call
// via the `cliPath` argument threaded from the admin-settable
// blog_ai_settings.claude_cli_command / codex_cli_command (see
// blogAiEngine.js) -- that takes top priority when set.
const CLAUDE_BIN = process.env.CLAUDE_CLI_PATH || '/usr/bin/claude'
const CODEX_BIN = process.env.CODEX_CLI_PATH || '/usr/bin/codex'

function resolveClaudeBin(cliPath) {
  return cliPath || CLAUDE_BIN
}

function resolveCodexBin(cliPath) {
  return cliPath || CODEX_BIN
}

const GENERATION_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes — a full blog post generation
const TEST_TIMEOUT_MS = 30 * 1000 // 30 seconds — the "Test connection" buttons
const KILL_GRACE_MS = 5000

// Spawns `command` with `args` and enforces a hard timeout: SIGTERM first,
// then SIGKILL if the process hasn't exited `killGraceMs` later. Deliberately
// not using child_process.exec's built-in timeout — that only ever sends
// SIGTERM, which a hung/misbehaving CLI can ignore and never actually exit.
function runSubprocess(command, args, { env, timeoutMs } = {}) {
  return new Promise((resolve, reject) => {
    let proc
    try {
      // stdio[0] = 'ignore': give the child an immediately-closed stdin.
      // node's spawn() defaults to an open, never-closed pipe for stdin, and
      // `codex exec` explicitly peeks at stdin for extra appended instructions
      // even when a prompt is given as an argument (confirmed live: it prints
      // "Reading additional input from stdin..." and blocks) -- without this,
      // every invocation would hang until the hard timeout killed it.
      proc = spawn(command, args, { env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    } catch (error) {
      reject(error)
      return
    }

    let stdout = ''
    let stderr = ''
    let settled = false
    let hardKillTimer = null

    const softTimer = setTimeout(() => {
      proc.kill('SIGTERM')
      hardKillTimer = setTimeout(() => proc.kill('SIGKILL'), KILL_GRACE_MS)
    }, timeoutMs)

    proc.stdout.on('data', (chunk) => { stdout += chunk })
    proc.stderr.on('data', (chunk) => { stderr += chunk })

    proc.on('error', (error) => {
      if (settled) return
      settled = true
      clearTimeout(softTimer)
      if (hardKillTimer) clearTimeout(hardKillTimer)
      reject(error)
    })

    proc.on('close', (code) => {
      if (settled) return
      settled = true
      clearTimeout(softTimer)
      if (hardKillTimer) clearTimeout(hardKillTimer)
      resolve({ code, stdout, stderr })
    })
  })
}

// authType 'oauth' (default, and the only mode before this) uses the
// admin's Claude Code subscription login via CLAUDE_CODE_OAUTH_TOKEN.
// authType 'api_key' is the opt-in advanced path (see blog_ai_accounts.auth_type)
// for admins who want to use a plain Anthropic API key instead of a
// subscription login for a given account -- it sets ANTHROPIC_API_KEY
// instead. Either way, only ONE of the two credential env vars is ever set
// so the unused one can never shadow the intended credential.
function buildClaudeEnv(token, authType = 'oauth') {
  const env = { ...process.env }
  if (authType === 'api_key') {
    env.ANTHROPIC_API_KEY = token
    delete env.CLAUDE_CODE_OAUTH_TOKEN
  } else {
    env.CLAUDE_CODE_OAUTH_TOKEN = token
    delete env.ANTHROPIC_API_KEY
  }
  return env
}

// -- Claude Code CLI ----------------------------------------------------------

// Runs `claude -p ... --tools "" --json-schema ...` non-interactively and
// returns raw stdout (expected to be the JSON-schema-constrained answer as
// plain text, since --output-format is "text"). Throws on non-zero exit.
//
// `model` is optional: when unset, `--model` is omitted entirely rather than
// defaulting to a hardcoded alias, so the CLI/plan picks its own default —
// this matches the admin UI's "Default (let the plan choose)" option.
export async function invokeClaude({ prompt, schema, token, model, authType = 'oauth', cliPath }) {
  const args = [
    '-p', prompt,
    '--output-format', 'text',
    '--tools', '',
    '--no-session-persistence',
  ]
  if (model) args.push('--model', model)
  if (schema) {
    args.push('--json-schema', JSON.stringify(schema))
  }

  const { code, stdout, stderr } = await runSubprocess(resolveClaudeBin(cliPath), args, {
    env: buildClaudeEnv(token, authType),
    timeoutMs: GENERATION_TIMEOUT_MS,
  })

  if (code !== 0) {
    throw new Error(`claude CLI exited with code ${code}: ${(stderr || stdout || '(no output)').slice(0, 1000)}`)
  }

  return stdout
}

// Trivial ping used by the "Test" button on a Claude account row. No
// json-schema constraint, short timeout, just checks the CLI actually runs
// and produces output for the given token. Same `--model` omission rule as
// invokeClaude() above.
export async function testClaudeAccount({ token, model, authType = 'oauth', cliPath }) {
  const args = [
    '-p', 'Reply with the single word OK.',
    '--output-format', 'text',
    '--tools', '',
    '--no-session-persistence',
  ]
  if (model) args.push('--model', model)

  try {
    const { code, stdout, stderr } = await runSubprocess(resolveClaudeBin(cliPath), args, {
      env: buildClaudeEnv(token, authType),
      timeoutMs: TEST_TIMEOUT_MS,
    })

    if (code === 0 && stdout.trim()) {
      return { ok: true, message: stdout.trim().slice(0, 200) }
    }
    return { ok: false, message: (stderr || stdout || `claude CLI exited with code ${code}`).trim().slice(0, 500) }
  } catch (error) {
    return { ok: false, message: error?.message || String(error) }
  }
}

// -- Codex CLI ------------------------------------------------------------

async function withScratchDir(fn) {
  const dir = path.join(os.tmpdir(), `blog-ai-${randomUUID()}`)
  await fs.mkdir(dir, { recursive: true })
  try {
    return await fn(dir)
  } finally {
    await fs.rm(dir, { recursive: true, force: true }).catch(() => {})
  }
}

// Runs `codex exec` in a fresh empty scratch directory and reads back
// `-o/--output-last-message`'s file for the clean final-message text (rather
// than parsing stdout/JSONL). Deliberately does NOT set/override CODEX_HOME —
// Codex has no per-call pasted token; it uses whatever ambient
// `codex login --device-auth` session is already active on the box (default
// ~/.codex), so the child process just inherits the parent env as-is.
async function runCodexExec(prompt, { schema, model, timeoutMs, cliPath }) {
  return withScratchDir(async (dir) => {
    const outputFile = path.join(dir, 'output.txt')
    const args = ['exec', '--sandbox', 'read-only', '--skip-git-repo-check', '--ignore-user-config', '-C', dir]

    if (schema) {
      const schemaFile = path.join(dir, 'schema.json')
      await fs.writeFile(schemaFile, JSON.stringify(schema), 'utf8')
      args.push('--output-schema', schemaFile)
    }
    if (model) {
      args.push('-m', model)
    }
    args.push('-o', outputFile, prompt)

    const { code, stdout, stderr } = await runSubprocess(resolveCodexBin(cliPath), args, { env: process.env, timeoutMs })

    if (code !== 0) {
      throw new Error(`codex CLI exited with code ${code}: ${(stderr || stdout || '(no output)').slice(0, 1000)}`)
    }

    let output
    try {
      output = await fs.readFile(outputFile, 'utf8')
    } catch {
      throw new Error('codex CLI exited successfully but did not write an output-last-message file')
    }

    if (!output.trim()) {
      throw new Error('codex CLI produced an empty response')
    }

    return output
  })
}

export async function invokeCodex({ prompt, schema, model, cliPath }) {
  return runCodexExec(prompt, { schema, model, timeoutMs: GENERATION_TIMEOUT_MS, cliPath })
}

// Trivial ping used by the Codex settings panel's "Test connection" button —
// reports whether the ambient VPS-level `codex login --device-auth` session
// is still valid (vs. expired/absent), since there's no per-account token to
// check here.
export async function testCodexConnection({ model, cliPath } = {}) {
  try {
    const output = await runCodexExec('Reply with the single word OK.', { model, timeoutMs: TEST_TIMEOUT_MS, cliPath })
    return { ok: true, message: output.trim().slice(0, 200) }
  } catch (error) {
    return { ok: false, message: error?.message || String(error) }
  }
}

// Plain (non-pty) status check for the admin UI's Codex "connect from this
// browser" panel. Verified live on the target VPS: `codex login status`
// printed a clean single line, "Logged in using ChatGPT" — there may be
// more detail available in other states (e.g. logged out, or a different
// login method) that wasn't observed live, so this deliberately doesn't try
// to parse out specific fields (email/plan) beyond a simple logged-in
// check — the raw line is returned as-is for the UI to display as a
// fallback.
export async function codexLoginStatus(cliPath) {
  try {
    const { code, stdout, stderr } = await runSubprocess(resolveCodexBin(cliPath), ['login', 'status'], {
      env: process.env,
      timeoutMs: TEST_TIMEOUT_MS,
    })
    const raw = (stdout || stderr || '').trim()
    return { loggedIn: code === 0 && /logged in/i.test(raw), raw: raw.slice(0, 1000) }
  } catch (error) {
    return { loggedIn: false, raw: error?.message || String(error) }
  }
}

// Plain (non-pty) `codex logout` — disconnects the single ambient
// device-auth session used by the Codex fallback provider. Quick one-shot
// command, not an interactive flow, so a plain invocation (not a pty) is
// fine here, same as testCodexConnection() above.
export async function codexLogout(cliPath) {
  try {
    const { code, stdout, stderr } = await runSubprocess(resolveCodexBin(cliPath), ['logout'], {
      env: process.env,
      timeoutMs: TEST_TIMEOUT_MS,
    })
    if (code === 0) return { ok: true, message: (stdout || 'Logged out.').trim().slice(0, 200) }
    return { ok: false, message: (stderr || stdout || `codex logout exited with code ${code}`).trim().slice(0, 500) }
  } catch (error) {
    return { ok: false, message: error?.message || String(error) }
  }
}
