import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import SiteFooter from '../components/SiteFooter'
import { fetchBlogPosts } from '../lib/blogApi'
import contentSnapshot from '../data/contentSnapshot.json'

const SEEDED_POSTS = contentSnapshot.blogPosts || []

// Category order for the filter row. Any category present on a post but not
// listed here is appended automatically, so the filter can never drift out of
// sync with the posts the way a hardcoded list did.
const CATEGORY_ORDER = ['GoHighLevel', 'Automation', 'AI Agents', 'Voice AI', 'Integrations', 'Development', 'Tutorials', 'SaaS Mode', 'Vibe Coding', 'Case Studies']

function formatBlogDate(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function BlogCard({ post }) {
  return (
    <motion.article
      className="blog-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/blog/${post.slug}`} className="blog-card-link" aria-label={`Read ${post.title}`}>
        {post.cover_image ? (
          <div className="blog-card-image-wrap">
            <img src={post.cover_image} alt={post.title} className="blog-card-image" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }} />
          </div>
        ) : null}
        <div className="blog-card-body">
          <span className="blog-card-badge">{post.category}</span>
          <h3>{post.title}</h3>
          <p className="blog-card-excerpt">{post.excerpt}</p>
          <div className="blog-card-meta">
            <span>{post.author || 'GHL Prime Team'}</span>
            <span aria-hidden="true">•</span>
            <span>{formatBlogDate(post.published_at)}</span>
            {post.reading_time ? (
              <>
                <span aria-hidden="true">•</span>
                <span>{post.reading_time} min read</span>
              </>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function BlogIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState(SEEDED_POSTS)
  const [loading, setLoading] = useState(SEEDED_POSTS.length === 0)
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState(() => searchParams.get('q') || '')

  useEffect(() => {
    let cancelled = false
    fetchBlogPosts()
      .then((result) => {
        if (cancelled) return
        setPosts(Array.isArray(result) ? result : [])
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function handleSearchChange(event) {
    const value = event.target.value
    setQuery(value)
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const normalizedQuery = query.trim().toLowerCase()

  // Derived from the live posts, ordered by CATEGORY_ORDER first.
  const blogCategories = useMemo(() => {
    const present = new Set(posts.map((post) => post.category).filter(Boolean))
    const ordered = CATEGORY_ORDER.filter((c) => present.has(c))
    const extras = [...present].filter((c) => !CATEGORY_ORDER.includes(c)).sort()
    return ['All', ...ordered, ...extras]
  }, [posts])

  const filteredPosts = useMemo(() => {
    let result = posts
    if (activeCategory !== 'All') result = result.filter((post) => post.category === activeCategory)
    if (normalizedQuery) {
      result = result.filter((post) => {
        const haystack = [
          post.title,
          post.excerpt,
          post.category,
          post.author,
          Array.isArray(post.tags) ? post.tags.join(' ') : '',
        ].filter(Boolean).join(' ').toLowerCase()
        return haystack.includes(normalizedQuery)
      })
    }
    return result
  }, [activeCategory, posts, normalizedQuery])

  const featuredPost = useMemo(() => {
    if (activeCategory !== 'All' || normalizedQuery || !posts.length) return null
    return posts.find((post) => post.featured === true) || posts[0]
  }, [activeCategory, normalizedQuery, posts])

  const gridPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts
    return filteredPosts.filter((post) => post.slug !== featuredPost.slug)
  }, [filteredPosts, featuredPost])

  return (
    <main className="blog-index-page">
      <Helmet>
        <title>GoHighLevel Blog Tips, Guides &amp; Case Studies | GHL Prime</title>
        <meta name="description" content="Expert GoHighLevel tutorials, automation guides, AI agent setup walkthroughs, and GHL case studies from the GHL Prime team." />
        <meta name="keywords" content="GoHighLevel blog, GoHighLevel tutorials, GHL automation guides, AI agent guides, GoHighLevel tips, white-label CRM blog" />
        <link rel="canonical" href="https://ghlprime.com/blog" />
        <meta name="last-modified" content="2026-05-24" />
        {normalizedQuery ? <meta name="robots" content="noindex,follow" /> : null}
        <meta property="og:title" content="GoHighLevel Blog Tips, Guides & Case Studies | GHL Prime" />
        <meta property="og:description" content="Expert GoHighLevel tutorials, automation guides, AI agent setup walkthroughs, and GHL case studies from the GHL Prime team." />
        <meta property="og:url" content="https://ghlprime.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ghlprime.com/og-blog.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GoHighLevel Blog Tips, Guides & Case Studies | GHL Prime" />
        <meta name="twitter:description" content="Expert GoHighLevel tutorials, automation guides, AI agent setup walkthroughs, and GHL case studies from the GHL Prime team." />
        <meta name="twitter:image" content="https://ghlprime.com/og-blog.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': 'https://ghlprime.com/blog#collection',
          name: 'GHL Prime Blog',
          description: 'GoHighLevel tutorials, automation guides, AI agent walkthroughs and case studies.',
          url: 'https://ghlprime.com/blog',
          isPartOf: { '@id': 'https://ghlprime.com/#website' },
          publisher: { '@id': 'https://ghlprime.com/#organization' },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://ghlprime.com/blog' },
          ],
        })}</script>
      </Helmet>

      <section className="section section-white blog-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="eyebrow-label">Blog</span>
            <h1>GoHighLevel Insights &amp; Guides</h1>
            <p className="blog-hero-intro">
              Tutorials, automation playbooks, AI agent walkthroughs, and real GoHighLevel case
              studies from the GHL Prime team written to help agencies build faster and scale.
            </p>
            {!loading ? (
              <p className="blog-post-count">
                {normalizedQuery
                  ? `${filteredPosts.length} ${filteredPosts.length === 1 ? 'result' : 'results'} for "${query.trim()}"`
                  : `${posts.length} ${posts.length === 1 ? 'article' : 'articles'} published`}
              </p>
            ) : null}
          </motion.div>

          <form className="blog-search" role="search" onSubmit={(event) => event.preventDefault()}>
            <Search size={18} className="blog-search-icon" aria-hidden="true" />
            <input
              type="search"
              className="blog-search-input"
              placeholder="Search articles..."
              value={query}
              onChange={handleSearchChange}
              aria-label="Search the blog"
            />
          </form>

          <div className="blog-filter-row">
            {blogCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`blog-filter-pill ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {featuredPost ? (
            <Link to={`/blog/${featuredPost.slug}`} className="blog-featured-card blog-card-link" aria-label={`Read ${featuredPost.title}`}>
              {featuredPost.cover_image ? (
                <div className="blog-featured-image-wrap">
                  <img src={featuredPost.cover_image} alt={featuredPost.title} className="blog-featured-image" loading="eager" decoding="async" onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }} />
                </div>
              ) : null}
              <div className="blog-featured-body">
                <span className="blog-card-badge">{featuredPost.category}</span>
                <h2>{featuredPost.title}</h2>
                <p className="blog-featured-excerpt">{featuredPost.excerpt}</p>
                <div className="blog-card-meta">
                  <span>{featuredPost.author || 'GHL Prime Team'}</span>
                  <span aria-hidden="true">•</span>
                  <span>{formatBlogDate(featuredPost.published_at)}</span>
                  {featuredPost.reading_time ? (
                    <>
                      <span aria-hidden="true">•</span>
                      <span>{featuredPost.reading_time} min read</span>
                    </>
                  ) : null}
                </div>
              </div>
            </Link>
          ) : null}

          {gridPosts.length ? (
            <div className="blog-grid">
              {gridPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : null}

          {!loading && !filteredPosts.length ? (
            <div className="client-studies-empty-state">
              <h3>{normalizedQuery ? 'No articles match your search.' : 'No posts in this category yet.'}</h3>
              <p>{normalizedQuery ? 'Try a different keyword or browse by category above.' : 'New articles will appear here once they are published.'}</p>
            </div>
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
