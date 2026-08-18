import { CalendarCheck2, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react'
import './evidence-visuals.css'

/*
 * Compact "evidence" visuals for the What We Handle cards.
 *
 * WHY: every card in the section previously led with a generic icon tile,
 * which named a capability without showing it. These are small, authentic
 * UI fragments -- a support queue, a certified roster, a billing setup, a
 * repaired workflow -- so each card demonstrates the thing its copy claims.
 *
 * Built as DOM + CSS rather than images: they stay sharp at any width, cost
 * no assets, and follow the same idiom as the existing TrainingMockups
 * (.tm-*) so the two sets read as one product language. Sizing is in cqw off
 * the .ev-frame container, so a visual scales as one object instead of
 * reflowing internally.
 *
 * Purely decorative -- each frame is aria-hidden; the card's own heading and
 * paragraph carry the meaning for assistive tech.
 */

/* 00. The feature card: an AI agent qualifying a lead, live. Dark variant --
   this one sits on the navy feature card, so it inverts. */
function AgentThread() {
  return (
    <div className="ev-stack">
      <div className="ev-bar">
        <span className="ev-bar-title">AI agent · inbound lead</span>
        <span className="ev-live"><i />Online</span>
      </div>
      <div className="ev-msg">Hi, do you handle GHL migrations?</div>
      <div className="ev-msg is-agent">We do. What's your current CRM and roughly how many contacts?</div>
      <div className="ev-msg">HubSpot, about 12k.</div>
      <div className="ev-msg is-agent">Perfect fit. I can book you in Thursday 2pm or Friday 10am.</div>
      <div className="ev-agent-foot">
        <span className="ev-tick"><CheckCircle2 size={10} /> Qualified</span>
        <span className="ev-tick"><CalendarCheck2 size={10} /> Meeting booked</span>
      </div>
    </div>
  )
}

/* 01. Round-the-clock support queue: replies landing, one resolved. */
function SupportQueue() {
  const rows = [
    { who: 'AR', name: 'Acme Retail', msg: 'Calendar not syncing', time: '2m', state: 'ok' },
    { who: 'NV', name: 'Northvale', msg: 'A2P rejected — resubmit?', time: '4m', state: 'ok' },
    { who: 'BT', name: 'Bright Co', msg: 'Add user to sub-account', time: '6m', state: '' },
  ]
  return (
    <div className="ev-stack">
      <div className="ev-bar">
        <span className="ev-bar-title">Support inbox</span>
        <span className="ev-live"><i />Live</span>
      </div>
      {rows.map((r) => (
        <div className="ev-row" key={r.name}>
          <span className="ev-av">{r.who}</span>
          <span className="ev-row-copy">
            <span className="ev-row-name">{r.name}</span>
            <span className="ev-row-sub">{r.msg}</span>
          </span>
          <span className={`ev-time${r.state === 'ok' ? ' is-ok' : ''}`}>{r.time}</span>
        </div>
      ))}
      <div className="ev-foot">
        <CheckCircle2 size={10} /> Avg first reply 6m · under your brand
      </div>
    </div>
  )
}

/* 02. Certified specialists available on demand. */
function ExpertRoster() {
  return (
    <div className="ev-stack">
      <div className="ev-bar">
        <span className="ev-bar-title">Available specialists</span>
      </div>
      <div className="ev-avatars">
        {['JR', 'NS', 'AM', 'AH', 'MB'].map((a) => <span className="ev-av lg" key={a}>{a}</span>)}
        <span className="ev-av lg ghost">+9</span>
      </div>
      <div className="ev-chips">
        {['Automations', 'A2P / Twilio', 'Snapshots', 'API'].map((c) => (
          <span className="ev-chip" key={c}>{c}</span>
        ))}
      </div>
      <div className="ev-foot">
        <ShieldCheck size={10} /> GoHighLevel Certified Admin
      </div>
    </div>
  )
}

/* 03. White-label SaaS launch: plans + rebilling wired up. */
function SaasLaunch() {
  const plans = [
    { name: 'Starter', price: '$97', on: false },
    { name: 'Pro', price: '$297', on: true },
    { name: 'Agency', price: '$497', on: false },
  ]
  return (
    <div className="ev-stack">
      <div className="ev-bar">
        <span className="ev-bar-title">Plans &amp; rebilling</span>
      </div>
      {plans.map((p) => (
        <div className={`ev-plan${p.on ? ' is-on' : ''}`} key={p.name}>
          <span className="ev-plan-name">{p.name}</span>
          <span className="ev-plan-price">{p.price}<i>/mo</i></span>
        </div>
      ))}
      <div className="ev-foot">
        <CreditCard size={10} /> Stripe connected · your branding
      </div>
    </div>
  )
}

/* 04. Broken automation, audited and repaired. */
function WorkflowRepair() {
  const steps = [
    { label: 'Form submitted', state: 'ok' },
    { label: 'Missing trigger', state: 'bad' },
    { label: 'Rebuilt + tested', state: 'ok' },
  ]
  return (
    <div className="ev-stack">
      <div className="ev-bar">
        <span className="ev-bar-title">Workflow audit</span>
        <span className="ev-pill-ok">0 errors</span>
      </div>
      {steps.map((s, i) => (
        <div className={`ev-step is-${s.state}`} key={s.label}>
          <span className="ev-step-dot" />
          <span className="ev-step-label">{s.label}</span>
          {i < steps.length - 1 ? <span className="ev-step-join" /> : null}
        </div>
      ))}
      <div className="ev-foot">
        <CheckCircle2 size={10} /> End-to-end, every lead handled
      </div>
    </div>
  )
}

const MAP = {
  ai: AgentThread,
  team: SupportQueue,
  crm: ExpertRoster,
  support: SaasLaunch,
  backend: WorkflowRepair,
}

export default function EvidenceVisual({ variant, dark }) {
  const Vis = MAP[variant]
  if (!Vis) return null
  return (
    <div className={`ev-frame${dark ? ' is-dark' : ''}`} aria-hidden="true">
      <Vis />
    </div>
  )
}
