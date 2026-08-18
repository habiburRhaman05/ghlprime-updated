import type { Metadata } from 'next'
import BlogPostPage from '../../../pages/BlogPostPage'
import contentSnapshot from '../../../data/contentSnapshot.json'

// Same seed contentSnapshot.blogPosts BlogPostPage.jsx itself reads for its
// synchronous first-paint post (see SEEDED_POSTS there). contentSnapshot.json
// is regenerated fresh from Supabase by scripts/generate-content-snapshot.mjs,
// which still runs immediately before `next build` (see package.json), so
// this is exactly as fresh as the seed the client component uses.
type SnapshotPost = {
  slug: string
  title: string
  excerpt?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  cover_image?: string
  category?: string
  published_at?: string
  updated_at?: string
}
const SEEDED_POSTS: SnapshotPost[] = (contentSnapshot as { blogPosts?: SnapshotPost[] }).blogPosts || []

function findSeededPost(slug: string) {
  return SEEDED_POSTS.find((post) => post.slug === slug) || null
}

export function generateStaticParams() {
  return SEEDED_POSTS.map((post) => ({ slug: post.slug }))
}

// Mirrors the metaTitle/metaDescription/canonical/shareImage computation that
// used to live in BlogPostPage.jsx's <Helmet> for the "found" case, and the
// separate not-found <Helmet> for an unknown slug.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = findSeededPost(slug)

  if (!post) {
    return {
      title: 'Post not found | GHL Prime',
      description:
        "The blog post you're looking for could not be found. Browse all GHL Prime GoHighLevel guides, tutorials, and case studies.",
      robots: 'noindex, follow',
    }
  }

  const canonical = `https://ghlprime.com/blog/${slug}`
  const metaTitle = post.seo_title || post.title
  const metaDescription = post.seo_description || post.excerpt
  const shareImage = post.cover_image || 'https://ghlprime.com/og-blog.png'
  const keywords =
    post.seo_keywords || [post.category, 'GoHighLevel', 'GHL Prime'].filter(Boolean).join(', ')

  return {
    title: metaTitle,
    description: metaDescription,
    keywords,
    alternates: { canonical },
    openGraph: {
      siteName: 'GHL Prime',
      locale: 'en_US',
      title: metaTitle,
      description: metaDescription,
      url: canonical,
      images: [shareImage],
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at || post.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [shareImage],
    },
  }
}

export default function Page() {
  return <BlogPostPage />
}
