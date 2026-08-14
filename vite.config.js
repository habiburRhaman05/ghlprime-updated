import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer'
import path from 'node:path'
import fs from 'node:fs'

// The @prerenderer/rollup-plugin has a bug where its `/` route (which maps to
// `index.html`) gets deleted from the Rollup bundle and the subsequent
// emitFile silently fails â€” leaving no homepage in dist/. This tiny companion
// plugin runs Puppeteer once more after the bundle is written to render `/`
// directly to dist/index.html.
function prerenderHomepage(serverlessLaunchOptions) {
  return {
    name: 'prerender-homepage-fallback',
    apply: 'build',
    async closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist')
      const targetPath = path.join(distDir, 'index.html')
      if (fs.existsSync(targetPath)) return // already there

      const fallbackPath = path.join(distDir, 'index_fallback.html')
      if (!fs.existsSync(fallbackPath)) return // nothing to serve

      const Prerenderer = (await import('@prerenderer/prerenderer')).default
      const { default: Puppeteer } = await import('@prerenderer/renderer-puppeteer')
      const instance = new Prerenderer({
        staticDir: distDir,
        indexPath: 'index_fallback.html',
        renderer: new Puppeteer({
          renderAfterDocumentEvent: 'render-event',
          renderAfterTime: 9000,
          timeout: 60000,
          headless: true,
          launchOptions: serverlessLaunchOptions || {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          },
        }),
      })
      try {
        await instance.initialize()
        const results = await instance.renderRoutes(['/'])
        if (results && results[0] && results[0].html) {
          fs.writeFileSync(targetPath, results[0].html.trim(), 'utf8')
        }
      } finally {
        await instance.destroy()
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  // Vercel's build container lacks the system shared libraries (libnspr4, libnss3,
  // libatk-bridge, etc.) that Puppeteer's bundled Chromium needs to start. When
  // running on Vercel/CI we swap in @sparticuz/chromium, a Chromium build packaged
  // for serverless runtimes that ships its own copy of those libraries. Locally
  // (Windows/macOS/dev) we let puppeteer use its auto-downloaded Chromium.
  const isCI = !!process.env.VERCEL || !!process.env.CI

  let serverlessLaunchOptions = null
  if (isCI) {
    const { default: chromium } = await import('@sparticuz/chromium')
    serverlessLaunchOptions = {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    }
  }

  // Best-effort enumeration of published blog post slugs at build time so they
  // get prerendered. This must NEVER fail the build â€” any error falls back to [].
  const env = loadEnv(mode, process.cwd(), '')
  let blogRoutes = []
  try {
    if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
      const res = await fetch(
        `${env.VITE_SUPABASE_URL}/rest/v1/blog_posts?select=slug&published=eq.true`,
        {
          headers: {
            apikey: env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
          },
        },
      )
      if (res.ok) {
        const rows = await res.json()
        if (Array.isArray(rows)) {
          blogRoutes = rows.filter((row) => row && row.slug).map((row) => `/blog/${row.slug}`)
        }
      }
    }
  } catch {
    blogRoutes = []
  }

  // Best-effort enumeration of published case study slugs at build time so they
  // get prerendered. This must NEVER fail the build â€” any error falls back to [].
  let caseStudyRoutes = []
  try {
    if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
      const res = await fetch(
        `${env.VITE_SUPABASE_URL}/rest/v1/case_studies?select=slug&published=eq.true`,
        {
          headers: {
            apikey: env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
          },
        },
      )
      if (res.ok) {
        const rows = await res.json()
        if (Array.isArray(rows)) {
          caseStudyRoutes = rows
            .filter((row) => row && row.slug)
            .map((row) => `/case-studies/${row.slug}`)
        }
      }
    }
  } catch {
    caseStudyRoutes = []
  }

  // Merge Supabase-backed case study routes with the 3 local-fallback slugs
  // (these exist in the local fallback data) and de-duplicate.
  const caseStudyFallbacks = [
  ]
  const caseStudyRouteSet = new Set([...caseStudyRoutes, ...caseStudyFallbacks])
  const caseStudyPrerenderRoutes = [...caseStudyRouteSet]

  return {
  plugins: [
    react(),
    prerender({
      routes: [
        '/',
        '/services',
        '/services/vibe-coding',
        '/services/ai-agent-builder',
        '/services/custom-saas-development',
        '/services/figma-to-code',
        '/services/saas-customer-support',
        '/services/ghl-setup',
        '/services/automation',
        '/services/saas-crm',
        '/services/white-label-support',
        '/services/app-development',
        '/about',
        '/team',
        '/case-studies',
        '/faq',
        '/contact',
        '/booking',
        '/privacy-policy',
        '/terms',
        // Supabase-backed case study slugs (merged + de-duped with 3 local fallbacks)
        ...caseStudyPrerenderRoutes,
        '/blog',
        '/gallery',
        ...blogRoutes,
      ],
      fallback: '_fallback',
      renderer: new PuppeteerRenderer({
        maxConcurrentRoutes: 4,
        renderAfterDocumentEvent: 'render-event',
        renderAfterTime: 9000,
        timeout: 60000,
        headless: true,
        launchOptions: serverlessLaunchOptions || {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      }),
    }),
    prerenderHomepage(serverlessLaunchOptions),
  ],
  // Baked at build time so the footer "Last updated" reflects the real
  // deploy date instead of a hand-maintained constant that goes stale.
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  esbuild: {
    legalComments: 'none',
    drop: ['debugger'],
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    cssMinify: true,
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: false,
        passes: 2,
      },
      format: {
        comments: false,
      },
      mangle: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('/react/')) return 'react'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('@supabase/supabase-js')) return 'supabase'
        },
      },
    },
  },
  }
})
