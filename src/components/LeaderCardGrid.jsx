import { socialConfig } from './socialConfig'

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
