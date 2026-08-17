'use client'

import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import SiteFooter from '../components/SiteFooter'
import { fetchGalleryCategories, fetchGalleryImages } from '../lib/galleryApi'
import '../styles/gallery.css'

const SITE_URL = 'https://ghlprime.com'

export default function GalleryPage() {
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    let active = true
    Promise.all([fetchGalleryCategories(), fetchGalleryImages()]).then(([cats, imgs]) => {
      if (!active) return
      setCategories(Array.isArray(cats) ? cats : [])
      setImages(Array.isArray(imgs) ? imgs : [])
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') return images
    return images.filter((img) => img.category_id === activeCategory)
  }, [images, activeCategory])

  return (
    <main className="gallery-page">
      

      <section className="gallery-hero">
        <div className="container">
          <span className="gallery-eyebrow">Our Gallery</span>
          <h1 className="gallery-title">Moments from the team behind the builds</h1>
          <p className="gallery-subtitle">Events, milestones, and everyday life at GHL Prime. Filter by category to explore.</p>
        </div>
      </section>

      <section className="section gallery-body">
        <div className="container">
          <div className="gallery-filter-row">
            <button
              type="button"
              className={`gallery-filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`gallery-filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? <p className="gallery-note">Loading gallery...</p> : null}
          {!loading && filteredImages.length === 0 ? (
            <p className="gallery-note">No images in this category yet.</p>
          ) : null}

          <div className="gallery-grid">
            {filteredImages.map((img) => (
              <button key={img.id} type="button" className="gallery-item" onClick={() => setLightbox(img)}>
                <img
                  src={img.image_url}
                  alt={img.title || 'Gallery image'}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.parentElement.style.display = 'none'
                  }}
                />
                {img.title ? <span className="gallery-item-caption">{img.title}</span> : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox ? (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button type="button" className="gallery-lightbox-close" aria-label="Close" onClick={() => setLightbox(null)}>
            <X size={26} />
          </button>
          <img
            className="gallery-lightbox-img"
            src={lightbox.image_url}
            alt={lightbox.title || 'Gallery image'}
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox.title ? <p className="gallery-lightbox-caption">{lightbox.title}</p> : null}
        </div>
      ) : null}

      <SiteFooter />
    </main>
  )
}
