module.exports = [
"[project]/src/lib/apiClient.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Thin fetch wrapper for the self-hosted GHL Prime Express API (replaces the
// Supabase JS client). Every helper resolves to a Supabase-style
// `{ data, error }` shape so existing callers (the *Api.js files and admin
// pages, which already destructure `{ data, error }` from Supabase calls)
// don't need to change how they consume the result.
// In dev (Vite dev server on :5173) the API runs separately on :5013, so we
// need an absolute URL. In production the API is always reverse-proxied
// through the same Nginx host that serves the static site, so a relative
// path works on any domain it's deployed to (dev/stg/prod) with no rebuild.
__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "apiDelete",
    ()=>apiDelete,
    "apiGet",
    ()=>apiGet,
    "apiPatch",
    ()=>apiPatch,
    "apiPost",
    ()=>apiPost,
    "apiPut",
    ()=>apiPut,
    "clearToken",
    ()=>clearToken,
    "getToken",
    ()=>getToken,
    "setToken",
    ()=>setToken,
    "uploadImage",
    ()=>uploadImage
]);
const API_BASE_URL = (process.env.VITE_API_URL || (("TURBOPACK compile-time truthy", 1) ? 'http://localhost:5013' : "TURBOPACK unreachable")).replace(/\/$/, '');
const TOKEN_STORAGE_KEY = 'ghlprime_admin_token';
function getToken() {
    try {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch  {
        return null;
    }
}
function setToken(token) {
    try {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch  {
    // localStorage unavailable (private mode / SSR) — session just won't persist.
    }
}
function clearToken() {
    try {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch  {
    // ignore
    }
}
async function parseJsonBody(response) {
    try {
        return await response.json();
    } catch  {
        return null;
    }
}
function errorMessageFrom(payload, fallback) {
    return payload?.error?.message || (typeof payload?.error === 'string' ? payload.error : null) || payload?.message || fallback;
}
async function request(path, { method = 'GET', body, auth = false } = {}) {
    const headers = {
        'Content-Type': 'application/json'
    };
    if (auth) {
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }
    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined
        });
    } catch (networkError) {
        return {
            data: null,
            error: new Error(networkError?.message || 'Network request failed')
        };
    }
    const payload = await parseJsonBody(response);
    if (!response.ok) {
        return {
            data: null,
            error: new Error(errorMessageFrom(payload, `Request failed (${response.status})`))
        };
    }
    return {
        data: payload,
        error: null
    };
}
const apiGet = (path, options)=>request(path, {
        ...options,
        method: 'GET'
    });
const apiPost = (path, body, options)=>request(path, {
        ...options,
        method: 'POST',
        body
    });
const apiPut = (path, body, options)=>request(path, {
        ...options,
        method: 'PUT',
        body
    });
const apiPatch = (path, body, options)=>request(path, {
        ...options,
        method: 'PATCH',
        body
    });
const apiDelete = (path, options)=>request(path, {
        ...options,
        method: 'DELETE'
    });
async function uploadImage(file) {
    const headers = {};
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const formData = new FormData();
    formData.append('file', file);
    let response;
    try {
        response = await fetch(`${API_BASE_URL}/api/admin/uploads`, {
            method: 'POST',
            headers,
            body: formData
        });
    } catch (networkError) {
        return {
            data: null,
            error: new Error(networkError?.message || 'Network request failed')
        };
    }
    const payload = await parseJsonBody(response);
    if (!response.ok) {
        return {
            data: null,
            error: new Error(errorMessageFrom(payload, `Upload failed (${response.status})`))
        };
    }
    return {
        data: payload,
        error: null
    };
}
}),
"[project]/src/lib/caseStudiesApi.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SEEDED_CASE_STUDIES",
    ()=>SEEDED_CASE_STUDIES,
    "createCaseStudy",
    ()=>createCaseStudy,
    "fetchAdminCaseStudies",
    ()=>fetchAdminCaseStudies,
    "fetchCaseStudies",
    ()=>fetchCaseStudies,
    "fetchCaseStudyBySlug",
    ()=>fetchCaseStudyBySlug,
    "updateCaseStudy",
    ()=>updateCaseStudy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$caseStudies$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/caseStudies.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$contentSnapshot$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/contentSnapshot.json.[json].cjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.js [app-ssr] (ecmascript)");
;
;
;
// Merge case-study arrays by slug. Entries from `primary` win on slug
// collisions; any `secondary` entry whose slug is absent from `primary` is
// appended. Used so static flagship studies that live only in caseStudies.js
// (and are linked from the nav, homepage, and sitemap) always resolve, even
// when they are absent from the API / the content snapshot.
function mergeStudiesBySlug(primary, secondary) {
    const seen = new Set();
    const merged = [];
    for (const list of [
        primary,
        secondary
    ]){
        for (const item of list || []){
            if (!item || !item.slug || seen.has(item.slug)) continue;
            seen.add(item.slug);
            merged.push(item);
        }
    }
    return merged;
}
const SNAPSHOT_STUDIES = Array.isArray(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$contentSnapshot$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].caseStudies) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$contentSnapshot$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].caseStudies : [];
// Snapshot/live data takes precedence; static caseStudies.js entries fill in any
// slug the snapshot lacks (e.g. the always-on flagship case studies).
const FALLBACK_STUDIES = mergeStudiesBySlug(SNAPSHOT_STUDIES, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$caseStudies$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["caseStudies"]);
const SEEDED_CASE_STUDIES = FALLBACK_STUDIES;
async function refreshSitemap() {
    try {
        const response = await fetch('/api/refresh-sitemap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const body = await response.text();
            console.warn('Sitemap refresh failed:', body);
        }
    } catch (error) {
        console.warn('Sitemap refresh request failed:', error);
    }
}
function mapFallbackStudy(item) {
    if (!item) return null;
    return {
        ...item,
        assigned_team_members: []
    };
}
async function fetchCaseStudies() {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/case-studies');
    if (error || !data) return FALLBACK_STUDIES.map(mapFallbackStudy);
    // Append static flagship studies not present in the live result so the index
    // always has a card for every nav/sitemap link. Live data wins on slug match.
    return mergeStudiesBySlug(data, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$caseStudies$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["caseStudies"]);
}
async function fetchCaseStudyBySlug(slug) {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])(`/api/case-studies/${encodeURIComponent(slug)}`);
    if (error || !data) {
        return mapFallbackStudy(FALLBACK_STUDIES.find((item)=>item.slug === slug) ?? null);
    }
    return data;
}
async function fetchAdminCaseStudies() {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/admin/case-studies', {
        auth: true
    });
    if (error || !data) return FALLBACK_STUDIES.map(mapFallbackStudy);
    return data;
}
async function createCaseStudy(payload) {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/admin/case-studies', payload, {
        auth: true
    });
    if (error) return {
        data: null,
        error
    };
    await refreshSitemap();
    return {
        data,
        error: null
    };
}
async function updateCaseStudy(id, payload) {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPut"])(`/api/admin/case-studies/${encodeURIComponent(id)}`, payload, {
        auth: true
    });
    if (error) return {
        data: null,
        error
    };
    await refreshSitemap();
    return {
        data,
        error: null
    };
}
}),
"[project]/src/lib/galleryApi.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createGalleryCategory",
    ()=>createGalleryCategory,
    "createGalleryImage",
    ()=>createGalleryImage,
    "deleteGalleryCategory",
    ()=>deleteGalleryCategory,
    "deleteGalleryImage",
    ()=>deleteGalleryImage,
    "fetchAdminGalleryCategories",
    ()=>fetchAdminGalleryCategories,
    "fetchAdminGalleryImages",
    ()=>fetchAdminGalleryImages,
    "fetchGalleryCategories",
    ()=>fetchGalleryCategories,
    "fetchGalleryImages",
    ()=>fetchGalleryImages,
    "updateGalleryCategory",
    ()=>updateGalleryCategory,
    "updateGalleryImage",
    ()=>updateGalleryImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.js [app-ssr] (ecmascript)");
;
async function fetchGalleryCategories() {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/gallery-categories');
    if (error || !data) return [];
    return data;
}
async function fetchGalleryImages() {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/gallery-images');
    if (error || !data) return [];
    return data;
}
async function fetchAdminGalleryCategories() {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/admin/gallery-categories', {
        auth: true
    });
    if (error || !data) return [];
    return data;
}
async function createGalleryCategory(payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/admin/gallery-categories', payload, {
        auth: true
    });
}
async function updateGalleryCategory(id, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPut"])(`/api/admin/gallery-categories/${encodeURIComponent(id)}`, payload, {
        auth: true
    });
}
async function deleteGalleryCategory(id) {
    const { error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiDelete"])(`/api/admin/gallery-categories/${encodeURIComponent(id)}`, {
        auth: true
    });
    return {
        error
    };
}
async function fetchAdminGalleryImages() {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/admin/gallery-images', {
        auth: true
    });
    if (error || !data) return [];
    return data;
}
async function createGalleryImage(payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/admin/gallery-images', payload, {
        auth: true
    });
}
async function updateGalleryImage(id, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPut"])(`/api/admin/gallery-images/${encodeURIComponent(id)}`, payload, {
        auth: true
    });
}
async function deleteGalleryImage(id) {
    const { error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiDelete"])(`/api/admin/gallery-images/${encodeURIComponent(id)}`, {
        auth: true
    });
    return {
        error
    };
}
}),
"[project]/src/lib/logosApi.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPartnerLogo",
    ()=>createPartnerLogo,
    "deletePartnerLogo",
    ()=>deletePartnerLogo,
    "fetchAdminPartnerLogos",
    ()=>fetchAdminPartnerLogos,
    "fetchPartnerLogos",
    ()=>fetchPartnerLogos,
    "updatePartnerLogo",
    ()=>updatePartnerLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.js [app-ssr] (ecmascript)");
;
const fallbackLogos = [
    {
        id: 'gohighlevel',
        company_name: 'GoHighLevel',
        image_url: 'https://s3.amazonaws.com/cdn.hotglue.xyz/images/logos/gohighlevel.png',
        website_url: '',
        sort_order: 1,
        published: true
    }
];
function mapLogoRecord(item = {}) {
    return {
        ...item,
        name: item.name || item.company_name || '',
        company_name: item.company_name || item.name || ''
    };
}
function normalizeLogos(items = []) {
    return items.filter((item)=>item?.image_url).map(mapLogoRecord);
}
function sortLogos(items = []) {
    return [
        ...items
    ].sort((a, b)=>{
        const orderA = Number(a.sort_order ?? 999);
        const orderB = Number(b.sort_order ?? 999);
        if (orderA !== orderB) return orderA - orderB;
        const createdA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const createdB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return createdA - createdB;
    });
}
async function fetchPartnerLogos() {
    try {
        const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/partner-logos');
        if (error) return sortLogos(normalizeLogos(fallbackLogos.filter((item)=>item.published !== false)));
        const normalizedData = normalizeLogos(data || []);
        if (!normalizedData.length) return sortLogos(normalizeLogos(fallbackLogos.filter((item)=>item.published !== false)));
        return sortLogos(normalizedData);
    } catch  {
        return sortLogos(normalizeLogos(fallbackLogos.filter((item)=>item.published !== false)));
    }
}
async function fetchAdminPartnerLogos() {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/admin/partner-logos', {
        auth: true
    });
    if (error || !data) return sortLogos(normalizeLogos(fallbackLogos));
    return sortLogos((data || []).map(mapLogoRecord));
}
async function createPartnerLogo(payload) {
    const dbPayload = {
        company_name: payload.name,
        image_url: payload.image_url,
        website_url: payload.website_url,
        sort_order: payload.sort_order,
        published: payload.published
    };
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/admin/partner-logos', dbPayload, {
        auth: true
    });
    return {
        ...result,
        data: result.data ? mapLogoRecord(result.data) : result.data
    };
}
async function updatePartnerLogo(id, payload) {
    const dbPayload = {
        company_name: payload.name,
        image_url: payload.image_url,
        website_url: payload.website_url,
        sort_order: payload.sort_order,
        published: payload.published
    };
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPut"])(`/api/admin/partner-logos/${encodeURIComponent(id)}`, dbPayload, {
        auth: true
    });
    return {
        ...result,
        data: result.data ? mapLogoRecord(result.data) : result.data
    };
}
async function deletePartnerLogo(id) {
    const { error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiDelete"])(`/api/admin/partner-logos/${encodeURIComponent(id)}`, {
        auth: true
    });
    return {
        error
    };
}
}),
"[project]/src/lib/showcaseApi.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createShowcaseItem",
    ()=>createShowcaseItem,
    "createShowcaseStat",
    ()=>createShowcaseStat,
    "deleteShowcaseItem",
    ()=>deleteShowcaseItem,
    "deleteShowcaseStat",
    ()=>deleteShowcaseStat,
    "fetchAdminShowcaseItems",
    ()=>fetchAdminShowcaseItems,
    "fetchAdminShowcaseStats",
    ()=>fetchAdminShowcaseStats,
    "fetchShowcaseForPage",
    ()=>fetchShowcaseForPage,
    "fetchShowcaseStats",
    ()=>fetchShowcaseStats,
    "updateShowcaseItem",
    ()=>updateShowcaseItem,
    "updateShowcaseStat",
    ()=>updateShowcaseStat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.js [app-ssr] (ecmascript)");
;
async function fetchShowcaseForPage(pageKey) {
    if (!pageKey) return [];
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])(`/api/showcase?page=${encodeURIComponent(pageKey)}`);
    if (error || !data) return [];
    return data;
}
async function fetchShowcaseStats() {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/showcase-stats');
    if (error || !data) return [];
    return data;
}
async function fetchAdminShowcaseItems() {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/admin/showcase-items', {
        auth: true
    });
    if (error || !data) return [];
    return data;
}
async function createShowcaseItem(payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/admin/showcase-items', payload, {
        auth: true
    });
}
async function updateShowcaseItem(id, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPut"])(`/api/admin/showcase-items/${encodeURIComponent(id)}`, payload, {
        auth: true
    });
}
async function deleteShowcaseItem(id) {
    const { error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiDelete"])(`/api/admin/showcase-items/${encodeURIComponent(id)}`, {
        auth: true
    });
    return {
        error
    };
}
async function fetchAdminShowcaseStats() {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/admin/showcase-stats', {
        auth: true
    });
    if (error || !data) return [];
    return data;
}
async function createShowcaseStat(payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/admin/showcase-stats', payload, {
        auth: true
    });
}
async function updateShowcaseStat(id, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPut"])(`/api/admin/showcase-stats/${encodeURIComponent(id)}`, payload, {
        auth: true
    });
}
async function deleteShowcaseStat(id) {
    const { error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiDelete"])(`/api/admin/showcase-stats/${encodeURIComponent(id)}`, {
        auth: true
    });
    return {
        error
    };
}
}),
"[project]/src/lib/teamApi.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTeamMember",
    ()=>createTeamMember,
    "createTeamPageExpert",
    ()=>createTeamPageExpert,
    "deleteTeamMember",
    ()=>deleteTeamMember,
    "deleteTeamPageExpert",
    ()=>deleteTeamPageExpert,
    "fetchTeamMembers",
    ()=>fetchTeamMembers,
    "fetchTeamPageExperts",
    ()=>fetchTeamPageExperts,
    "updateTeamMember",
    ()=>updateTeamMember,
    "updateTeamPageExpert",
    ()=>updateTeamPageExpert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$teamMembers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/teamMembers.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.js [app-ssr] (ecmascript)");
;
;
function normalizeSortOrder(value, fallback = 999) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}
function sortByDisplayOrder(items = []) {
    return [
        ...items
    ].sort((a, b)=>{
        const sortDiff = normalizeSortOrder(a.sort_order) - normalizeSortOrder(b.sort_order);
        if (sortDiff !== 0) return sortDiff;
        const createdAtA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const createdAtB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return createdAtA - createdAtB;
    });
}
function fallbackExperts() {
    return [];
}
async function fetchTeamMembers() {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/team-members');
    // `data` can resolve to a valid, empty array (API reachable, but the
    // team_members table has nothing in it) -- `!data` alone doesn't catch
    // that since `![]` is false, so the section silently rendered nothing
    // instead of falling back to the bundled team list. Falling back on
    // "nothing usable came back" (missing OR empty) instead of just "nothing
    // came back" means the section always has content.
    if (error || !data || !data.length) return sortByDisplayOrder(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$teamMembers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["teamMembers"]);
    return sortByDisplayOrder(data);
}
async function createTeamMember(payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/admin/team-members', payload, {
        auth: true
    });
}
async function updateTeamMember(id, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPut"])(`/api/admin/team-members/${encodeURIComponent(id)}`, payload, {
        auth: true
    });
}
async function deleteTeamMember(id) {
    const { error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiDelete"])(`/api/admin/team-members/${encodeURIComponent(id)}`, {
        auth: true
    });
    return {
        error
    };
}
async function fetchTeamPageExperts() {
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiGet"])('/api/team-page-members');
    if (error || !data) return fallbackExperts();
    return sortByDisplayOrder(data);
}
async function createTeamPageExpert(payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPost"])('/api/admin/team-page-members', payload, {
        auth: true
    });
}
async function updateTeamPageExpert(id, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiPut"])(`/api/admin/team-page-members/${encodeURIComponent(id)}`, payload, {
        auth: true
    });
}
async function deleteTeamPageExpert(id) {
    const { error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiDelete"])(`/api/admin/team-page-members/${encodeURIComponent(id)}`, {
        auth: true
    });
    return {
        error
    };
}
}),
"[project]/src/pages/HomePage.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SiteFooter$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SiteFooter.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FaqSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/FaqSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$faqs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/faqs.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CertificationsSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CertificationsSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$HomeSeoShell$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/HomeSeoShell.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ShippedEvidenceSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ShippedEvidenceSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$LifeAtGHL$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/LifeAtGHL.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$TeamTestimonials$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/TeamTestimonials.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$TrainingOnboarding$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/TrainingOnboarding.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$VibeCoding$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/VibeCoding.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$TrustedLogosSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/TrustedLogosSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$WhatWeAreSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/WhatWeAreSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$WhatWeHandleSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/WhatWeHandleSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$AgencyNeedsSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/AgencyNeedsSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$WhyChooseSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/WhyChooseSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$LeadersSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/LeadersSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$ExpertsSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/ExpertsSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$CaseStudiesSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/CaseStudiesSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$FinalCtaSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/FinalCtaSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$CertificationsOverviewSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home-page/CertificationsOverviewSection.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$HeroStatsBar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hero/HeroStatsBar.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$hero$2d$banner$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hero/hero-banner.jsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const SITE_URL = 'https://ghlprime.com';
const HOMEPAGE_LAST_MODIFIED = '2026-05-24';
const HOMEPAGE_SERVICES = [
    {
        name: 'GoHighLevel Setup & Sub-Account Configuration',
        description: 'Complete CRM setup from scratch  sub-accounts, pipelines, calendars, forms, and integrations configured for agency and SaaS use.',
        url: SITE_URL + '/services#setup'
    },
    {
        name: 'Automation Workflow Builds',
        description: 'End-to-end build, audit, and repair of GoHighLevel automation workflows so every lead is captured, nurtured, and followed up automatically.',
        url: SITE_URL + '/services#automation'
    },
    {
        name: 'AI Agents & Voice Receptionists',
        description: 'AI agents that qualify leads, answer inquiries, run AI call centers, and book meetings 24/7  deployed directly inside GoHighLevel.',
        url: SITE_URL + '/services#ai-agents'
    },
    {
        name: '24/7 White-Label Client Support',
        description: 'Round-the-clock GoHighLevel expert support delivered under your agency brand  your clients never know we exist.',
        url: SITE_URL + '/services#white-label-support'
    },
    {
        name: 'White-Label SaaS CRM Launch',
        description: 'Fully white-labeled GoHighLevel SaaS setups  branded sub-accounts, Stripe + Twilio configuration, and client-ready onboarding flows.',
        url: SITE_URL + '/services#saas-launch'
    },
    {
        name: 'API Integrations',
        description: 'Connect GoHighLevel to Zapier, Slack, Google Workspace, custom CRMs, databases, and any platform with an API  including custom integrations when no native option exists.',
        url: SITE_URL + '/services#integrations'
    },
    {
        name: 'Vibe Coding & Custom Development',
        description: 'AI-assisted custom development for anything GoHighLevel cannot do natively  custom dashboards, bespoke integrations, and unique automation logic.',
        url: SITE_URL + '/services#custom-development'
    },
    {
        name: 'Team Training & SOP Support',
        description: 'System walkthroughs, technical deep-dive sessions, and SOP documentation so your team can confidently run the platform after handoff.',
        url: SITE_URL + '/services#training'
    }
];
const HOMEPAGE_HOWTO_STEPS = [
    {
        name: 'System Walkthrough & Handoff',
        text: 'We walk you through everything we have built  how it works, why it is set up that way, and how to use it confidently with your clients.'
    },
    {
        name: 'Technical Deep Dive Sessions',
        text: 'Live sessions on GoHighLevel, automations, AI agents, and whatever part of the system you want to master. We go deep, not surface-level.'
    },
    {
        name: 'Ongoing Support & Upskilling',
        text: 'As the platform evolves and your agency grows, we keep you updated with new features, better workflows, and smarter approaches.'
    }
];
const buildHomepageSchemas = ()=>{
    const orgRef = {
        '@id': SITE_URL + '/#organization'
    };
    return [
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': SITE_URL + '/#webpage',
            url: SITE_URL + '/',
            name: 'GoHighLevel Experts for Agencies | GHL Prime',
            description: 'Hire a dedicated GoHighLevel AI automation team to set up your CRM, automations, and AI agents built for agencies and Local Businesses. GHL-certified, US-based, 24/7 support.',
            inLanguage: 'en-US',
            isPartOf: {
                '@id': SITE_URL + '/#website'
            },
            about: orgRef,
            primaryImageOfPage: {
                '@type': 'ImageObject',
                url: SITE_URL + '/ghl-prime-logo.png'
            },
            datePublished: '2024-08-01',
            dateModified: HOMEPAGE_LAST_MODIFIED,
            speakable: {
                '@type': 'SpeakableSpecification',
                cssSelector: [
                    'h1',
                    '.hero p',
                    '.faq-question',
                    '.faq-answer'
                ]
            },
            breadcrumb: {
                '@id': SITE_URL + '/#breadcrumb'
            }
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            '@id': SITE_URL + '/#breadcrumb',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: SITE_URL + '/'
                }
            ]
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': SITE_URL + '/#services',
            name: 'GHL Prime Services',
            numberOfItems: HOMEPAGE_SERVICES.length,
            itemListElement: HOMEPAGE_SERVICES.map((s, i)=>({
                    '@type': 'ListItem',
                    position: i + 1,
                    item: {
                        '@type': 'Service',
                        name: s.name,
                        description: s.description,
                        url: s.url,
                        provider: orgRef,
                        areaServed: [
                            {
                                '@type': 'Country',
                                name: 'United States'
                            },
                            {
                                '@type': 'Country',
                                name: 'Canada'
                            },
                            {
                                '@type': 'Country',
                                name: 'United Kingdom'
                            },
                            {
                                '@type': 'Country',
                                name: 'Australia'
                            }
                        ],
                        serviceType: s.name
                    }
                }))
        },
        {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            '@id': SITE_URL + '/#training',
            name: 'How GHL Prime trains and hands off your GoHighLevel platform',
            description: 'GHL Prime trains your team so you can run your own GoHighLevel platform with confidence after handoff.',
            step: HOMEPAGE_HOWTO_STEPS.map((s, i)=>({
                    '@type': 'HowToStep',
                    position: i + 1,
                    name: s.name,
                    text: s.text,
                    url: SITE_URL + '/#training-step-' + (i + 1)
                }))
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Jewel Rana',
            jobTitle: 'CEO & Co-Founder',
            worksFor: orgRef,
            url: 'https://www.linkedin.com/in/thejewelrana/',
            image: 'https://ghlprime.com/jewel-rana.png',
            description: 'Business coach and agency leader. CEO and Co-Founder of GHL Prime, a dedicated GoHighLevel expert team. Helps agencies build profitable, scalable service businesses.',
            sameAs: [
                'https://www.linkedin.com/in/thejewelrana/',
                'https://www.upwork.com/freelancers/~013caf34b8df0444cf/',
                'https://www.facebook.com/thenewjewel',
                'https://www.bokaboss.com/'
            ],
            knowsAbout: [
                'GoHighLevel',
                'Marketing Automation',
                'CRM Systems',
                'Agency Growth Strategy',
                'White-Label SaaS',
                'Business Coaching'
            ]
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Niyamul Islam Sajal',
            jobTitle: 'COO & Co-Founder',
            worksFor: orgRef,
            url: 'https://www.linkedin.com/in/niyamulislam/',
            image: 'https://ghlprime.com/niyamul-islam-sajal.png',
            description: 'Senior automation engineer and COO of GHL Prime. Specializes in GoHighLevel automation systems, AI-powered workflows, CRM architecture, and custom API integrations.',
            sameAs: [
                'https://www.linkedin.com/in/niyamulislam/',
                'https://www.upwork.com/freelancers/~010f634a8b80365e7b',
                'https://www.facebook.com/niaymul.islam.2025/'
            ],
            knowsAbout: [
                'GoHighLevel Automation',
                'AI Agents',
                'Voice AI',
                'CRM Architecture',
                'API Integrations',
                'n8n',
                'Vibe Coding',
                'Workflow Automation'
            ]
        }
    ];
};
const rotatingPills = [
    'GoHighLevel Experts',
    'Automation Specialists',
    'Vibe Coding Team',
    'AI Agent Builders',
    'AI Call Center Setup',
    'API Integrations',
    'Whitelabel Solutions',
    '24/7 Expert Support'
];
function HomePage() {
    const [activePill, setActivePill] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const interval = setInterval(()=>{
            setActivePill((current)=>(current + 1) % rotatingPills.length);
        }, 2200);
        return ()=>clearInterval(interval);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify(buildHomepageSchemas())
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 176,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'ProfessionalService',
                        name: 'GHL Prime',
                        image: 'https://ghlprime.com/ghl-prime-logo.png',
                        url: 'https://ghlprime.com',
                        email: 'info@ghlprime.com',
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: 'Albuquerque',
                            addressRegion: 'NM',
                            postalCode: '87110',
                            addressCountry: 'US'
                        },
                        areaServed: 'US',
                        priceRange: '$$'
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 177,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$HomeSeoShell$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 195,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$hero$2d$banner$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                activePill: activePill,
                rotatingPills: rotatingPills
            }, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 198,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$HeroStatsBar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 203,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$TrustedLogosSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$WhatWeAreSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$LifeAtGHL$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$TeamTestimonials$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 207,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$WhatWeHandleSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 208,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$AgencyNeedsSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 209,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$TrainingOnboarding$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 210,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$VibeCoding$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$WhyChooseSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$LeadersSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 214,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CertificationsSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 215,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$CertificationsOverviewSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 216,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$ExpertsSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$CaseStudiesSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 218,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ShippedEvidenceSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                pageKey: "home"
            }, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 219,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2d$page$2f$FinalCtaSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 220,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$FaqSection$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                faqs: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$faqs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HOMEPAGE_FAQS"],
                intro: "Common questions from agencies and founders before they engage GHL Prime."
            }, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 221,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SiteFooter$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/HomePage.jsx",
                lineNumber: 222,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/HomePage.jsx",
        lineNumber: 175,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_1gmoi8n._.js.map