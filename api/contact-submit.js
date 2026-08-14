/* global process */
const webhookUrl = 'https://services.leadconnectorhq.com/hooks/j53xn6YJHwIdPImV00rn/webhook-trigger/788ab1c6-9220-4731-ba35-9919821c2fe2'

// Server-side base URL for the self-hosted Express API (NOT the VITE_-prefixed
// browser var, though that's accepted as a fallback in case only it is set).
const apiBaseUrl = (process.env.API_URL || process.env.VITE_API_URL || '').replace(/\/$/, '')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = {
      fullName: String(req.body?.fullName || '').trim(),
      email: String(req.body?.email || '').trim(),
      phone: String(req.body?.phone || '').trim(),
      company: String(req.body?.company || '').trim(),
      message: String(req.body?.message || '').trim(),
      source: 'ghlprime-contact-page',
      submittedAt: new Date().toISOString(),
      website: String(req.body?.website || '').trim(),
      formStartedAt: Number(req.body?.formStartedAt || 0),
    }

    if (payload.website) {
      return res.status(200).json({ ok: true, spam: true })
    }

    const elapsedMs = payload.formStartedAt ? Date.now() - payload.formStartedAt : 0
    if (elapsedMs > 0 && elapsedMs < 2500) {
      return res.status(200).json({ ok: true, spam: true })
    }

    if (apiBaseUrl) {
      try {
        const leadResponse = await fetch(`${apiBaseUrl}/api/contact-leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            company: payload.company,
            message: payload.message,
            source: payload.source,
            submitted_at: payload.submittedAt,
          }),
        })
        if (!leadResponse.ok) {
          console.warn('contact_leads insert failed:', await leadResponse.text())
        }
      } catch (leadError) {
        // Never let a lead-storage failure block the GHL webhook below.
        console.warn('contact_leads insert request failed:', leadError)
      }
    } else {
      console.warn('API_URL is not configured — skipping contact_leads insert.')
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        company: payload.company,
        message: payload.message,
        source: payload.source,
        submittedAt: payload.submittedAt,
      }),
    })

    if (!response.ok) {
      return res.status(502).json({ error: 'Webhook submission failed' })
    }

    return res.status(200).json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'Submission failed' })
  }
}
