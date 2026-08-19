const socialConfig = [
  {
    key: 'linkedin_url',
    label: 'LinkedIn',
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56a1.96 1.96 0 1 0-3.92 0a1.96 1.96 0 0 0 3.92 0ZM20.44 13.02c0-3.45-1.84-5.05-4.29-5.05c-1.98 0-2.87 1.09-3.36 1.86V8.5H9.41c.05.88 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.13-.92c.27-.68.89-1.38 1.93-1.38c1.36 0 1.9 1.04 1.9 2.57V20h3.38v-6.98Z"/></svg>
    ),
  },
  {
    key: 'facebook_url',
    label: 'Facebook',
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7h2.34l.35-2.73H13.5V9.53c0-.79.22-1.33 1.35-1.33h1.44V5.78c-.25-.03-1.1-.1-2.08-.1c-2.06 0-3.48 1.26-3.48 3.58v2.01H8.39V14h2.34v7h2.77Z"/></svg>
    ),
  },
  {
    key: 'instagram_url',
    label: 'Instagram',
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5A3.95 3.95 0 0 0 7.75 20.2h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5A3.95 3.95 0 0 0 16.25 3.8h-8.5Zm8.95 1.35a1.1 1.1 0 1 1 0 2.2a1.1 1.1 0 0 1 0-2.2ZM12 6.86A5.14 5.14 0 1 1 6.86 12A5.14 5.14 0 0 1 12 6.86Zm0 1.8A3.34 3.34 0 1 0 15.34 12A3.34 3.34 0 0 0 12 8.66Z"/></svg>
    ),
  },
  {
    key: 'twitter_url',
    label: 'Twitter / X',
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.39L5.6 22H2.5l7.25-8.29L1.2 2h6.4l4.43 6.78L18.9 2Zm-1.1 18h1.72L6.7 3.9H4.86L17.8 20Z"/></svg>
    ),
  },
  {
    key: 'upwork_url',
    label: 'Upwork',
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.2 7.2a4.8 4.8 0 0 0-4.35 2.8c-1.08-1.63-1.8-3.43-2.13-5.3H8.3v6.18a2.02 2.02 0 1 1-4.03 0V7.2H2v3.68a4.3 4.3 0 0 0 8.6 0v-.55c.42.76.9 1.48 1.43 2.16l-1.2 5.67h2.32l.85-4.03c.95.67 2.04 1.04 3.2 1.04A4.99 4.99 0 0 0 22 10.2a3 3 0 0 0-.02-.32A4.79 4.79 0 0 0 17.2 7.2Zm0 5.67c-.77 0-1.5-.26-2.09-.74l.24-1.12a2.5 2.5 0 0 1 1.85-1.54c.16-.03.32-.05.49-.05a2.5 2.5 0 1 1-.49 4.95Z"/></svg>
    ),
  },
  {
    key: 'website_url',
    label: 'Website',
    svg: (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm6.93 9h-3.16a15.56 15.56 0 0 0-1.18-4.52A8.03 8.03 0 0 1 18.93 11ZM12 4.07c.83 0 2.06 1.57 2.74 4.93H9.26C9.94 5.64 11.17 4.07 12 4.07ZM4.99 13h3.24a15.67 15.67 0 0 0 1.11 4.37A8.03 8.03 0 0 1 4.99 13Zm3.24-2H4.99a8.03 8.03 0 0 1 4.35-4.37A15.67 15.67 0 0 0 8.23 11Zm3.77 8.93c-.83 0-2.06-1.57-2.74-4.93h5.48c-.68 3.36-1.91 4.93-2.74 4.93Zm3.16-6.93H8.84a13.6 13.6 0 0 1 0-2h6.32a13.6 13.6 0 0 1 0 2Zm-.57 4.37A15.56 15.56 0 0 0 15.77 13h3.16a8.03 8.03 0 0 1-4.34 4.37Z"/></svg>
    ),
  },
]

// Badge glyphs, keyed off `badge_icon` in the team data. Kept here rather
// than in the data file so the data stays serialisable (it also comes from
// the API, which can only carry a string).
// Badge glyphs are solid (filled) so they read bold and punchy inside the
// badge disc. Kept here rather than in the data file so the data stays
// serialisable (it also comes from the API, which can only carry a string).
const BADGE_ICON = {
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33.26zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.29-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83L11.17 17zm6.48-2.19c-2.29 2.04-5.58 3.44-5.89 3.57L13.31 22l4.05-4.05c.47-.47.68-1.15.55-1.81l-.26-1.33zM9 18c0 .83-.34 1.58-.88 2.12C6.94 21.3 2 22 2 22s.7-4.94 1.88-6.12C4.42 15.34 5.17 15 6 15c1.66 0 3 1.34 3 3zm4-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
    </svg>
  ),
}

export default function LeaderCardGrid({ leaders = [] }) {
  if (!leaders.length) return null

  return (
    <div className="leader-card-grid leader-card-grid-centered">
      {leaders.map((leader) => {
        const socialLinks = socialConfig.filter(({ key }) => leader[key])
        const badgeIcon = BADGE_ICON[leader.badge_icon] || BADGE_ICON.star

        return (
          <article key={leader.id || leader.name} className="leader-profile-card">
            <div className="leader-profile-stage">
              {/* Top-left badge. Only renders when the record carries a
                  label -- API rows without one just show a plain stage. */}
              {leader.badge_label ? (
                <div className="leader-badge">
                  <span className="leader-badge-icon">{badgeIcon}</span>
                  <span className="leader-badge-label">{leader.badge_label}</span>
                </div>
              ) : null}



              <div className="leader-profile-image-wrap">
                <img src={leader.image_url} alt={leader.name} className="leader-profile-image" loading="lazy" decoding="async" />
              </div>

              {/* Bottom-right experience stat, same conditional treatment. */}
              {leader.years_experience ? (
                <div className="leader-exp">
                  <span className="leader-exp-num">{leader.years_experience}</span>
                  <span className="leader-exp-unit">Years</span>
                  <span className="leader-exp-caption">Experience</span>
                </div>
              ) : null}
            </div>

            <div className="leader-profile-body">
              <h3>{leader.name}</h3>
              <strong>{leader.role}</strong>
              <span className="leader-divider" aria-hidden="true" />
              <p>{leader.description}</p>
              {socialLinks.length ? (
                <div className="leader-social-links">
                  {socialLinks.map(({ key, label, svg }) => (
                    <a key={key} href={leader[key]} target="_blank" rel="noopener noreferrer" className={`leader-social-link brand-${key.replace('_url', '')}`} aria-label={`${leader.name} on ${label}`} title={`${leader.name} on ${label}`}>
                      {svg}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}
