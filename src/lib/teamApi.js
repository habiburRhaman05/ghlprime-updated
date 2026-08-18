import { teamMembers } from '../data/teamMembers'
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

function normalizeSortOrder(value, fallback = 999) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function sortByDisplayOrder(items = []) {
  return [...items].sort((a, b) => {
    const sortDiff = normalizeSortOrder(a.sort_order) - normalizeSortOrder(b.sort_order)
    if (sortDiff !== 0) return sortDiff

    const createdAtA = a.created_at ? new Date(a.created_at).getTime() : 0
    const createdAtB = b.created_at ? new Date(b.created_at).getTime() : 0
    return createdAtA - createdAtB
  })
}

function fallbackExperts() {
  return []
}

export async function fetchTeamMembers() {
  const { data, error } = await apiGet('/api/team/members')
  // `data` can resolve to a valid, empty array (API reachable, but the
  // team_members table has nothing in it) -- `!data` alone doesn't catch
  // that since `![]` is false, so the section silently rendered nothing
  // instead of falling back to the bundled team list. Falling back on
  // "nothing usable came back" (missing OR empty) instead of just "nothing
  // came back" means the section always has content.
  if (error || !data || !data.length) return sortByDisplayOrder(teamMembers)
  return sortByDisplayOrder(data)
}

export async function createTeamMember(payload) {
  return apiPost('/api/team/members', payload, { auth: true })
}

export async function updateTeamMember(id, payload) {
  return apiPut(`/api/team/members/${encodeURIComponent(id)}`, payload, { auth: true })
}

export async function deleteTeamMember(id) {
  const { error } = await apiDelete(`/api/team/members/${encodeURIComponent(id)}`, { auth: true })
  return { error }
}

export async function fetchTeamPageExperts() {
  const { data, error } = await apiGet('/api/team/experts')
  if (error || !data) return fallbackExperts()
  return sortByDisplayOrder(data)
}

export async function createTeamPageExpert(payload) {
  return apiPost('/api/team/experts', payload, { auth: true })
}

export async function updateTeamPageExpert(id, payload) {
  return apiPut(`/api/team/experts/${encodeURIComponent(id)}`, payload, { auth: true })
}

export async function deleteTeamPageExpert(id) {
  const { error } = await apiDelete(`/api/team/experts/${encodeURIComponent(id)}`, { auth: true })
  return { error }
}
