import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

const fallbackLogos = [
  { id: 'gohighlevel', company_name: 'GoHighLevel', image_url: 'https://s3.amazonaws.com/cdn.hotglue.xyz/images/logos/gohighlevel.png', website_url: '', sort_order: 1, published: true },
]

function mapLogoRecord(item = {}) {
  return {
    ...item,
    name: item.name || item.company_name || '',
    company_name: item.company_name || item.name || '',
  }
}

function normalizeLogos(items = []) {
  return items.filter((item) => item?.image_url).map(mapLogoRecord)
}

function sortLogos(items = []) {
  return [...items].sort((a, b) => {
    const orderA = Number(a.sort_order ?? 999)
    const orderB = Number(b.sort_order ?? 999)
    if (orderA !== orderB) return orderA - orderB

    const createdA = a.created_at ? new Date(a.created_at).getTime() : 0
    const createdB = b.created_at ? new Date(b.created_at).getTime() : 0
    return createdA - createdB
  })
}

export async function fetchPartnerLogos() {
  try {
    const { data, error } = await apiGet('/api/partner-logos')

    if (error) return sortLogos(normalizeLogos(fallbackLogos.filter((item) => item.published !== false)))

    const normalizedData = normalizeLogos(data || [])
    if (!normalizedData.length) return sortLogos(normalizeLogos(fallbackLogos.filter((item) => item.published !== false)))
    return sortLogos(normalizedData)
  } catch {
    return sortLogos(normalizeLogos(fallbackLogos.filter((item) => item.published !== false)))
  }
}

export async function fetchAdminPartnerLogos() {
  const { data, error } = await apiGet('/api/admin/partner-logos', { auth: true })
  if (error || !data) return sortLogos(normalizeLogos(fallbackLogos))
  return sortLogos((data || []).map(mapLogoRecord))
}

export async function createPartnerLogo(payload) {
  const dbPayload = {
    company_name: payload.name,
    image_url: payload.image_url,
    website_url: payload.website_url,
    sort_order: payload.sort_order,
    published: payload.published,
  }

  const result = await apiPost('/api/admin/partner-logos', dbPayload, { auth: true })
  return {
    ...result,
    data: result.data ? mapLogoRecord(result.data) : result.data,
  }
}

export async function updatePartnerLogo(id, payload) {
  const dbPayload = {
    company_name: payload.name,
    image_url: payload.image_url,
    website_url: payload.website_url,
    sort_order: payload.sort_order,
    published: payload.published,
  }

  const result = await apiPut(`/api/admin/partner-logos/${encodeURIComponent(id)}`, dbPayload, { auth: true })
  return {
    ...result,
    data: result.data ? mapLogoRecord(result.data) : result.data,
  }
}

export async function deletePartnerLogo(id) {
  const { error } = await apiDelete(`/api/admin/partner-logos/${encodeURIComponent(id)}`, { auth: true })
  return { error }
}
