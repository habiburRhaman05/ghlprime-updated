import type { Metadata, Viewport } from 'next'

// This file is the Next.js equivalent of the original index.html + src/main.jsx
// pairing. It is written from those two files, not rebuilt from a template —
// every static <head>/<body> tag below has a 1:1 source line called out in the
// comments so the origin of each piece is traceable.
//
// CSS import order matches src/main.jsx exactly (index.css first, then the
// six route-level stylesheets it used to load, in the same sequence). App.jsx
// keeps its own './App.css' and './styles/service-detail.css' imports, which
// ran immediately after this block in the original file graph.
import '../index.css'
import '../styles/section-overrides.css'
import '../styles/services-redesign.css'
import '../styles/certifications.css'
import '../styles/footer-redesign.css'
import '../styles/contact-page.css'
import '../styles/certification-badges.css'
import '../styles/faq.css'
import '../styles/icon-system.css'

import App from '../App'

// --- index.html static <head> tags, ported to the Metadata API -------------
//
// Root-level values here are the site-wide defaults from index.html. Any page
// whose own metadata export (ported from that page's old <Helmet>) supplies
// the same field overrides this default, exactly reproducing which value was
// "in effect" in the old build. The one behavioural difference: the old build
// rendered BOTH the static tag and the page's Helmet tag (two <meta
// name="robots"> etc. on the 10 /services/* pages — see robots below), which
// react-helmet-async does not deduplicate. Next's metadata model can only
// resolve to a single value per field, so that pre-existing duplicate-tag
// artifact is naturally resolved rather than reproduced; the same value each
// page authored is what search engines see either way.
export const metadata: Metadata = {
  title: 'GHL Prime',
  authors: [{ name: 'Niyamul Islam Sajal' }], // <meta name="author" content="Niyamul Islam Sajal" />
  publisher: 'Niyamul Islam Sajal', // <meta name="publisher" content="Niyamul Islam Sajal" />
  robots: 'index,follow,max-image-preview:large', // <meta name="robots" .../>
  openGraph: {
    siteName: 'GHL Prime', // <meta property="og:site_name" content="GHL Prime" />
    locale: 'en_US', // <meta property="og:locale" content="en_US" />
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image', // <meta name="twitter:card" content="summary_large_image" />
  },
  icons: {
    // <link rel="icon" href="/favicon.ico" sizes="32x32" />
    // <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    // <link rel="icon" type="image/png" href="/favicon.png" />
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
}

// <meta name="viewport" content="width=device-width, initial-scale=1.0" />
// <meta name="theme-color" content="#0f2236" />
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f2236',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* <meta http-equiv="content-language" content="en" /> -- no Metadata
            API field for http-equiv metas, so kept as a literal tag. */}
        <meta httpEquiv="content-language" content="en" />

        {/* Google Tag Manager -- verbatim from index.html */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WB2HL47N');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Microsoft Clarity -- verbatim from index.html */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "wznl9x1rbz");`,
          }}
        />
        {/* End Microsoft Clarity */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DM Sans (h1-h4 / section titles) and Inter (body) were originally
            loaded via a `@import url(...)` at the top of App.css. Next's
            Turbopack CSS pipeline silently drops that @import when it
            bundles App.css alongside the other imported stylesheets (it's
            no longer literally the first rule once merged), so the font
            never actually downloaded and both families silently fell back
            to system fonts. Loading them the same way JetBrains Mono
            already does here -- a plain <link rel="stylesheet"> in <head> --
            sidesteps the bundler entirely and is what actually works. */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />

        <style
          dangerouslySetInnerHTML={{
            __html:
              '.seo-shell { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }',
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) -- verbatim from index.html, same
            position: first thing inside <body>. */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WB2HL47N"
            height={0}
            width={0}
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <App>{children}</App>
      </body>
    </html>
  )
}
