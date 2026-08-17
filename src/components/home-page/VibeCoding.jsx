import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LayoutDashboard, RefreshCw, Share2, Sparkles, Webhook, Zap } from 'lucide-react'
import './vibe-coding.css'

/*
 * "Vibe Coding & Custom Development".
 *
 * Reordered per the brief: copy first, service cards second, and the code
 * editor promoted to a full-width visual at the bottom instead of being
 * squeezed into a half-width column.
 *
 * The cards and the editor are genuinely linked rather than decoratively
 * so: hovering a card pushes a pulse down the connector rail, tints the
 * editor's glow with that card's hue, and names the card in the editor
 * status bar. Every one of those uses the card's own existing label, so
 * nothing new is authored.
 *
 * All copy, the token stream, and the README contents are carried over
 * verbatim. The old scroll-parallax handler is gone: it nudged the editor
 * and the copy in opposite directions, which only meant anything while
 * they sat side by side.
 *
 * IDE chrome deliberately reuses the existing .code-window / .ide-* /
 * .tok-* class names so the syntax colours already defined in App.css keep
 * applying; only layout and scale are new here.
 */

const VIBE_TAGS = [
  { label: 'Custom Integrations', icon: Webhook, tone: '#1684ea' },
  { label: 'API Connections', icon: Share2, tone: '#06b6d4' },
  { label: 'Custom Dashboards', icon: LayoutDashboard, tone: '#8b5cf6' },
  { label: 'AI-Assisted Dev', icon: Sparkles, tone: '#f59e0b' },
  { label: 'Webhooks & Triggers', icon: Zap, tone: '#10b981' },
  { label: 'Third-Party Syncs', icon: RefreshCw, tone: '#f43f5e' },
]

const EASE = [0.22, 1, 0.36, 1]

export default function VibeCoding() {
  const tokenLines = useMemo(() => [
    [{ k: 'comment', t: '// Custom integration  built fast' }],
    [],
    [
      { k: 'kw', t: 'const' },
      { k: 'plain', t: ' ' },
      { k: 'var', t: 'ghlPrime' },
      { k: 'op', t: ' = ' },
      { k: 'kw', t: 'new' },
      { k: 'plain', t: ' ' },
      { k: 'class', t: 'ExpertTeam' },
      { k: 'punc', t: '({' },
    ],
    [
      { k: 'plain', t: '  ' },
      { k: 'prop', t: 'skills' },
      { k: 'punc', t: ': [' },
      { k: 'str', t: "'GHL'" },
      { k: 'punc', t: ', ' },
      { k: 'str', t: "'Automation'" },
      { k: 'punc', t: ',' },
    ],
    [
      { k: 'plain', t: '    ' },
      { k: 'str', t: "'AI Agents'" },
      { k: 'punc', t: ', ' },
      { k: 'str', t: "'Vibe Coding'" },
      { k: 'punc', t: '],' },
    ],
    [
      { k: 'plain', t: '  ' },
      { k: 'prop', t: 'availability' },
      { k: 'punc', t: ': ' },
      { k: 'str', t: "'24/7'" },
      { k: 'punc', t: ',' },
    ],
    [
      { k: 'plain', t: '  ' },
      { k: 'prop', t: 'brandedAs' },
      { k: 'punc', t: ': ' },
      { k: 'str', t: "'your agency'" },
      { k: 'punc', t: ',' },
    ],
    [
      { k: 'plain', t: '  ' },
      { k: 'prop', t: 'clientFacing' },
      { k: 'punc', t: ': ' },
      { k: 'bool', t: 'true' },
    ],
    [{ k: 'punc', t: '});' }],
    [],
    [{ k: 'comment', t: '// We handle the build.' }],
    [{ k: 'comment', t: '// You deliver the result.' }],
    [],
    [
      { k: 'var', t: 'ghlPrime' },
      { k: 'punc', t: '.' },
      { k: 'fn', t: 'buildAnything' },
      { k: 'punc', t: '();' },
    ],
    [{ k: 'comment', t: '// ✓ Done. Client-ready.' }],
  ], [])

  const lineLengths = useMemo(() => tokenLines.map(line => line.reduce((sum, tok) => sum + tok.t.length, 0)), [tokenLines])

  const [lineIdx, setLineIdx] = useState(-1)
  const [charIdx, setCharIdx] = useState(0)
  const [hasStartedTyping, setHasStartedTyping] = useState(false)
  const [showDots, setShowDots] = useState(false)
  const [rippleStyle, setRippleStyle] = useState(null)
  const [ghostSuggestion, setGhostSuggestion] = useState(null)
  const [activeTab, setActiveTab] = useState('ts')
  // Which service card the pointer is on. Drives the rail pulse, the
  // editor's glow colour, and the chip in the status bar.
  const [spotlight, setSpotlight] = useState(null)

  const readmeLines = useMemo(() => [
    [{ k: 'md-h1', t: '# GHL Prime' }],
    [],
    [{ k: 'md-quote', t: '> Your dedicated GHL & automation expert team.' }],
    [],
    [{ k: 'md-h2', t: '## What we build' }],
    [{ k: 'md-bullet', t: '- GHL setup, sub-accounts & whitelabel' }],
    [{ k: 'md-bullet', t: '- Automation, AI agents & voice receptionists' }],
    [{ k: 'md-bullet', t: '- Custom dev for anything GHL can\'t do natively' }],
    [],
    [{ k: 'md-h2', t: '## Get started' }],
    [{ k: 'md-code', t: 'npm run hire --expert-team' }],
    [],
    [{ k: 'md-link', t: '[Book a demo →](https://ghlprime.com/booking)' }],
  ], [])

  useEffect(() => {
    if (!hasStartedTyping) return undefined

    setLineIdx(-1)
    setCharIdx(0)
    setShowDots(false)
    setGhostSuggestion(null)

    let cancelled = false
    let timeoutId = null

    const wait = (ms) => new Promise((resolve) => {
      timeoutId = window.setTimeout(resolve, ms)
    })

    const ghostHints = {
      2: 'ExpertTeam',
      13: 'buildAnything',
    }

    const run = async () => {
      setShowDots(true)
      await wait(420)
      if (cancelled) return

      for (let i = 0; i < tokenLines.length; i += 1) {
        if (cancelled) return
        setLineIdx(i)
        const len = lineLengths[i]

        if (ghostHints[i]) {
          setGhostSuggestion({ line: i, text: ghostHints[i] })
          await wait(380)
          if (cancelled) return
          setGhostSuggestion(null)
        }

        for (let c = 0; c <= len; c += 1) {
          if (cancelled) return
          setCharIdx(c)
          const wobble = (c % 5) * 6
          const burst = (c > 0 && c % 9 === 0) ? 60 : 0
          await wait(14 + wobble + burst)
        }
        await wait(len === 0 ? 70 : 110)
      }

      if (!cancelled) {
        setLineIdx(tokenLines.length)
      }
    }

    run()

    return () => {
      cancelled = true
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [tokenLines, lineLengths, hasStartedTyping])

  function handleCtaRipple(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    setRippleStyle({ width: size, height: size, left: x, top: y })
    window.setTimeout(() => setRippleStyle(null), 550)
  }

  const spotTone = spotlight ? spotlight.tone : null

  return (
    <section className="section section-white vibe-coding-section vv2">
      <span className="vv2-glow vv2-glow-a" aria-hidden="true" />
      <span className="vv2-glow vv2-glow-b" aria-hidden="true" />

      <div className="container vv2-inner">
        {/* 1. Copy, moved to the top -------------------------------------- */}
        <div className="vv2-head">
          {/* Soft light behind the headline. Keeps the top of the section
              from reading as a flat white band. */}
          <span className="vv2-head-glow" aria-hidden="true" />

          <motion.span
            className="vv2-eyebrow"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45 }}
          >
            <span className="vv2-eyebrow-dot" aria-hidden="true" />
            Vibe Coding &amp; Custom Development
          </motion.span>

          {/* One heading, allowed to set itself on one line and to break to
              two when the viewport is narrower. The colour split is the same
              as before: the question dark, the answer in brand. */}
          <motion.h2
            className="vv2-heading"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="vv2-heading-dark">If GHL Can’t Do It,</span>{' '}
            <span className="vv2-heading-accent">We Build It.</span>
          </motion.h2>

          <motion.p
            className="vv2-lede"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.16, ease: EASE }}
          >
            Most GHL agencies are stuck with what’s inside the platform. We’re not. Our vibe coding team builds custom features, tools, and integrations that GHL doesn’t support natively  fast, clean, and ready to deploy. Need a custom dashboard? A unique integration? A bespoke automation that connects 5 different systems? We build it using modern AI-assisted development and hand it back to you production-ready.
          </motion.p>

          <motion.div
            className="vv2-cta-row"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
          >
            <Link to="/booking" className="primary-pill large vibe-cta-premium" onClick={handleCtaRipple}>
              Talk to Our Dev Team
              {rippleStyle ? <span className="vibe-cta-ripple" style={rippleStyle} aria-hidden="true" /> : null}
            </Link>
          </motion.div>
        </div>

        {/* 2. Capability cards -------------------------------------------- */}
        <motion.div
          className="vv2-cards"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          onMouseLeave={() => setSpotlight(null)}
        >
          {VIBE_TAGS.map((tag) => (
            <motion.div
              key={tag.label}
              className={`vv2-card${spotlight?.label === tag.label ? ' is-lit' : ''}`}
              style={{ '--tone': tag.tone }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
              }}
              whileHover={{ y: -6 }}
              onMouseEnter={() => setSpotlight(tag)}
              onFocus={() => setSpotlight(tag)}
              tabIndex={0}
            >
              <span className="vv2-card-icon"><tag.icon size={18} /></span>
              <span className="vv2-card-label">{tag.label}</span>
              <span className="vv2-card-glow" aria-hidden="true" />
            </motion.div>
          ))}
        </motion.div>

        {/* 3. The connector, and the editor it feeds ----------------------- */}
        <div className={`vv2-rail${spotlight ? ' is-live' : ''}`} aria-hidden="true">
          <span className="vv2-rail-line" style={spotTone ? { '--tone': spotTone } : undefined} />
          <span className="vv2-rail-pulse" style={spotTone ? { '--tone': spotTone } : undefined} />
        </div>

        <motion.div
          className={`vv2-editor-stage${spotlight ? ' is-lit' : ''}`}
          style={spotTone ? { '--tone': spotTone } : undefined}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => setHasStartedTyping(true)}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="vv2-editor-backglow" aria-hidden="true" />

          <div className={`code-window code-window-ide vv2-window ${showDots ? 'is-ready' : ''}`}>
            <div className={`ide-titlebar ${showDots ? 'visible' : ''}`}>
              <div className="ide-titlebar-dots">
                <span /><span /><span />
              </div>
              <div className="ide-titlebar-title">ghl-prime  vibe-coding</div>
              <div className="ide-titlebar-ai" aria-hidden="true">
                <span className="ide-ai-dot" />
                Copilot
              </div>
            </div>
            <div className={`ide-tabbar ${showDots ? 'visible' : ''}`}>
              <button type="button" className={`ide-tab ${activeTab === 'ts' ? 'ide-tab-active' : 'ide-tab-inactive'}`} onClick={() => setActiveTab('ts')}>
                <span className="ide-tab-icon" aria-hidden="true">TS</span>
                ghl-prime.ts
                <span className="ide-tab-close" aria-hidden="true">×</span>
              </button>
              <button type="button" className={`ide-tab ${activeTab === 'md' ? 'ide-tab-active' : 'ide-tab-inactive'}`} onClick={() => setActiveTab('md')}>
                <span className="ide-tab-icon ide-tab-icon-md" aria-hidden="true">md</span>
                README.md
              </button>
            </div>
            <div className="ide-breadcrumbs">
              <span>{activeTab === 'ts' ? 'src' : 'root'}</span><span className="ide-crumb-sep">›</span>
              <span>{activeTab === 'ts' ? 'integrations' : 'docs'}</span><span className="ide-crumb-sep">›</span>
              <span className="ide-crumb-active">{activeTab === 'ts' ? 'ghl-prime.ts' : 'README.md'}</span>
            </div>
            <div className="ide-editor">
              {activeTab === 'ts' ? (
                <>
                  {tokenLines.map((line, idx) => {
                    const isCurrent = idx === lineIdx
                    const isPast = idx < lineIdx || lineIdx >= tokenLines.length
                    if (!isCurrent && !isPast) return null
                    let remaining = isPast ? Infinity : charIdx
                    const showGhost = ghostSuggestion && ghostSuggestion.line === idx && isCurrent && remaining === 0
                    return (
                      <div key={idx} className={`ide-line${isCurrent ? ' ide-line-current' : ''}`}>
                        <span className="ide-gutter">{idx + 1}</span>
                        <span className="ide-line-content">
                          {line.map((tok, tIdx) => {
                            if (remaining <= 0) return null
                            if (tok.t.length <= remaining) {
                              remaining -= tok.t.length
                              return <span key={tIdx} className={`tok-${tok.k}`}>{tok.t}</span>
                            }
                            const slice = tok.t.slice(0, remaining)
                            remaining = 0
                            return <span key={tIdx} className={`tok-${tok.k}`}>{slice}</span>
                          })}
                          {showGhost ? <span className="ide-ghost">{ghostSuggestion.text}</span> : null}
                          {isCurrent ? <span className="ide-caret" aria-hidden="true" /> : null}
                        </span>
                      </div>
                    )
                  })}
                  {lineIdx >= tokenLines.length ? (
                    <div className="ide-status-pulse" aria-hidden="true">
                      <span className="ide-status-check">✓</span> Saved · Build passing
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  {readmeLines.map((line, idx) => (
                    <div key={idx} className="ide-line">
                      <span className="ide-gutter">{idx + 1}</span>
                      <span className="ide-line-content">
                        {line.map((tok, tIdx) => (
                          <span key={tIdx} className={`tok-${tok.k}`}>{tok.t}</span>
                        ))}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className={`ide-statusbar ${showDots ? 'visible' : ''}`}>
              <span className="ide-status-section ide-status-branch">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="6" cy="3" r="2" /><circle cx="6" cy="21" r="2" /><circle cx="18" cy="12" r="2" />
                  <path d="M6 5v14" /><path d="M18 10c0-4-6-3-6-7" /><path d="M18 14c0 4-6 3-6 7" />
                </svg>
                main
              </span>
              <span className="ide-status-section">0 ⚠ 0 ✖</span>
              {/* Names whichever card the pointer is on, using that card's
                  own label. This is the visible half of the card-to-editor
                  link. */}
              {spotlight ? (
                <span className="ide-status-section vv2-status-chip">{spotlight.label}</span>
              ) : null}
              <span className="ide-status-spacer" />
              <span className="ide-status-section">{activeTab === 'ts' ? `Ln ${Math.min(lineIdx, tokenLines.length - 1) + 1}, Col ${charIdx + 1}` : `Ln 1, Col 1`}</span>
              <span className="ide-status-section">UTF-8</span>
              <span className="ide-status-section ide-status-lang">{activeTab === 'ts' ? 'TypeScript' : 'Markdown'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
