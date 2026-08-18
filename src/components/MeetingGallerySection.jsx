'use client'

import { useEffect, useState } from 'react'
import { fetchMeetingGallery } from '../lib/meetingGalleryApi'

export default function MeetingGallerySection() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchMeetingGallery().then(setItems)
  }, [])

  if (!items.length) return null

  return (
    <section className="section section-white meeting-gallery-section">
      <div className="container">
        <div className="section-title centered meeting-gallery-title-block">
          <h2>Working Together To Drive Innovation And Success</h2>
          <p>A glimpse into our client meetings, collaborations, meaningful conversations, and the strong partnerships that fuel lasting business growth.</p>
        </div>

        <div className="meeting-gallery-grid">
          {items.map((item) => (
            <article key={item.id || item.title} className="meeting-gallery-card">
              <img src={item.image_url} alt={item.title || 'Client meeting'} className="meeting-gallery-image" loading="lazy" decoding="async" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
