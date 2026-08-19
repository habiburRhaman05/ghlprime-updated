/*
 * "Our Stack" marquee contents.
 *
 * The section renders these in order, chunked into three rows of six, so the
 * order below IS the on-screen layout. Every mark is served from /public --
 * nothing here reaches out to a third-party CDN at runtime.
 *
 * A logo is either:
 *   - mark + name  -> brand glyph followed by the wordmark text
 *   - name only    -> wordmark text tinted with `tone` (used for the brands we
 *                     have no glyph for, so a missing file can never leave a
 *                     broken image in the row)
 *   - chip: true   -> wordmark reversed out of a solid `tone` block (Duda)
 */

export const STACK_LOGOS = [
  { name: 'Figma', mark: '/stack-logos/figma.svg' },
  { name: 'Framer', mark: '/stack-logos/framer.svg' },
  { name: 'HighLevel', mark: '/gohighlevel.png' },
  { name: 'Webflow', mark: '/stack-logos/webflow.svg' },
  { name: 'Kajabi', tone: '#8f0182' },
  { name: 'WordPress', mark: '/stack-logos/wordpress.svg' },

  { name: 'Bubble', tone: '#1a1a1a' },
  { name: 'CSS', mark: '/stack-logos/css.svg' },
  { name: 'HTML', mark: '/stack-logos/html.svg' },
  { name: 'JavaScript', mark: '/stack-logos/javascript.svg' },
  { name: 'PHP', mark: '/stack-logos/php.svg' },
  { name: 'Python', mark: '/stack-logos/python.svg' },

  { name: 'Node.js', mark: '/stack-logos/nodejs.svg' },
  { name: 'Duda', tone: '#ff4e1a', chip: true },
  { name: 'n8n', mark: '/stack-logos/n8n.svg' },
  { name: 'Retell AI', tone: '#111827' },
  { name: 'Pabbly', tone: '#16a34a' },
  { name: 'Make', mark: '/stack-logos/make.svg' },
]

export default STACK_LOGOS
