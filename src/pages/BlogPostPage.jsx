import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import SiteFooter from '../components/SiteFooter'
import { fetchBlogPostBySlug, fetchRelatedPosts } from '../lib/blogApi'
import contentSnapshot from '../data/contentSnapshot.json'

const SEEDED_POSTS = contentSnapshot.blogPosts || []

function findSeededPost(slug) {
  return SEEDED_POSTS.find((post) => post.slug === slug) || null
}

function formatBlogDate(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const seededPost = findSeededPost(slug)
  const [post, setPost] = useState(seededPost)
  const [status, setStatus] = useState(seededPost ? 'found' : 'loading') // 'loading' | 'found' | 'notfound'
  const [relatedPosts, setRelatedPosts] = useState([])

  // Re-seed synchronously during render when the slug changes (SPA navigation)
  // so real snapshot content is present on the first frame. This is React's
  // documented "adjust state while rendering" pattern it never wipes a
  // snapshot match to a loading/empty state.
  const [renderedSlug, setRenderedSlug] = useState(slug)
  if (renderedSlug !== slug) {
    setRenderedSlug(slug)
    setPost(seededPost)
    setStatus(seededPost ? 'found' : 'loading')
    setRelatedPosts([])
  }

  useEffect(() => {
    let cancelled = false
    const seeded = findSeededPost(slug)

    fetchBlogPostBySlug(slug)
      .then((result) => {
        if (cancelled) return
        if (result) {
          setPost(result)
          setStatus('found')
          fetchRelatedPosts(result.category, result.slug, 3)
            .then((related) => {
              if (!cancelled) setRelatedPosts(Array.isArray(related) ? related : [])
            })
            .catch(() => {
              if (!cancelled) setRelatedPosts([])
            })
        } else if (!seeded) {
          setStatus('notfound')
        }
      })
      .catch(() => {
        if (!cancelled && !seeded) setStatus('notfound')
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  // While navigating between slugs the effect re-fetches; treat a post that
  // belongs to a previous slug as still-loading so we never flash stale content.
  const isStalePost = post && post.slug && slug && post.slug !== slug

  if (status === 'loading' || isStalePost) {
    return (
      <main className="section section-white blog-post-page">
        <Helmet>
          <title>Loading post… | GHL Prime</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="container client-study-state" role="status" aria-live="polite">
          <span className="client-study-state-spinner" aria-hidden="true" />
          <p className="client-study-state-text">Loading post…</p>
        </div>
      </main>
    )
  }

  if (status === 'notfound' || !post) {
    return (
      <main className="section section-white blog-post-page">
        <Helmet>
          <title>Post not found | GHL Prime</title>
          <meta name="description" content="The blog post you're looking for could not be found. Browse all GHL Prime GoHighLevel guides, tutorials, and case studies." />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="container client-study-notfound">
          <span className="eyebrow-label">404 Blog</span>
          <h1>Post not found</h1>
          <p className="client-study-notfound-intro">
            The blog post you're looking for doesn't exist, may have been moved, or isn't
            published yet. Explore our other GoHighLevel guides and case studies instead.
          </p>
          <div className="client-study-notfound-actions">
            <Link to="/blog" className="primary-pill large">Browse all posts</Link>
            <Link to="/booking" className="secondary-pill">Book a free consultation</Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    )
  }

  const canonical = `https://ghlprime.com/blog/${slug}`
  const metaTitle = post.seo_title || post.title
  const metaDescription = post.seo_description || post.excerpt
  // Never emit an empty og:image. Use the post's own cover when it has one,
  // otherwise fall back to the blog hub card.
  const shareImage = post.cover_image || 'https://ghlprime.com/og-blog.png'

  return (
    <main className="section section-white blog-post-page">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={post.seo_keywords || [post.category, 'GoHighLevel', 'GHL Prime'].filter(Boolean).join(', ')} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={shareImage} />
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:modified_time" content={post.updated_at || post.published_at} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={shareImage} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': canonical + '#article',
          headline: post.title,
          description: post.excerpt,
          image: shareImage,
          author: { '@type': 'Organization', name: post.author || 'GHL Prime Team' },
          publisher: {
            '@type': 'Organization',
            name: 'GHL Prime',
            logo: { '@type': 'ImageObject', url: 'https://ghlprime.com/ghl-prime-logo.png' },
          },
          datePublished: post.published_at,
          dateModified: post.updated_at || post.published_at,
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
          articleSection: post.category,
          inLanguage: 'en-US',
          isPartOf: { '@id': 'https://ghlprime.com/#website' },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ghlprime.com/' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://ghlprime.com/blog' },
            { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
          ],
        })}</script>
      </Helmet>

      <article className="container blog-article">
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/blog">Blog</Link>
          <span aria-hidden="true">/</span>
          <span className="blog-breadcrumb-current">{post.title}</span>
        </nav>

        {post.cover_image ? (
          <figure className="blog-post-hero">
            <img src={post.cover_image} alt={post.title} className="blog-post-hero-image" loading="eager" decoding="async" onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }} />
          </figure>
        ) : null}

        <h1 className="blog-article-title">{post.title}</h1>

        <div className="blog-meta-bar">
          <span>{post.author || 'GHL Prime Team'}</span>
          <span aria-hidden="true">|</span>
          <span>{formatBlogDate(post.published_at)}</span>
          {post.reading_time ? (
            <>
              <span aria-hidden="true">|</span>
              <span>{post.reading_time} min read</span>
            </>
          ) : null}
          <span className="blog-card-badge">{post.category}</span>
        </div>

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        {relatedPosts.length ? (
          <section className="blog-related" aria-labelledby="blog-related-heading">
            <h2 id="blog-related-heading">Related posts</h2>
            <div className="blog-grid">
              {relatedPosts.map((related) => (
                <article key={related.slug} className="blog-card">
                  <Link to={`/blog/${related.slug}`} className="blog-card-link" aria-label={`Read ${related.title}`}>
                    {related.cover_image ? (
                      <div className="blog-card-image-wrap">
                        <img src={related.cover_image} alt={related.title} className="blog-card-image" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }} />
                      </div>
                    ) : null}
                    <div className="blog-card-body">
                      <span className="blog-card-badge">{related.category}</span>
                      <h3>{related.title}</h3>
                      <p className="blog-card-excerpt">{related.excerpt}</p>
                      <div className="blog-card-meta">
                        <span>{formatBlogDate(related.published_at)}</span>
                        {related.reading_time ? (
                          <>
                            <span aria-hidden="true">•</span>
                            <span>{related.reading_time} min read</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="blog-cta-box">
          <h2>Need help implementing this in GoHighLevel?</h2>
          <p>Our team builds, automates, and scales GoHighLevel systems for agencies every day. Book a free call and we'll map out exactly what to ship next.</p>
          <Link to="/booking" className="primary-pill large">Book a free call</Link>
        </section>
      </article>

      <SiteFooter />
    </main>
  )
}
