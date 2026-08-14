import { CERTIFIED_ADMIN_BADGE, getPersonBadges } from '../data/certifications'

export function CertifiedAdminOverlay() {
  return (
    <div className="certified-admin-overlay" aria-hidden="false">
      <img
        src={CERTIFIED_ADMIN_BADGE}
        alt="Certified Admin"
        className="certified-admin-overlay-img"
        loading="lazy"
        decoding="async"
      />
      <span className="certified-admin-overlay-tooltip">Certified Admin</span>
    </div>
  )
}

export function SkillsBadges({ personIndex = 0 }) {
  const badges = getPersonBadges(personIndex)
  return (
    <div className="skills-badges-section">
      <div className="skills-badges-divider" />
      <div className="skills-badges-label">Skills Badges</div>
      <div className="skills-badges-row">
        {badges.map((b) => (
          <span className="skill-badge" key={b.name}>
            <img src={b.url} alt={b.name} className="skill-badge-img" loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function CertificationBadges({ personIndex = 0 }) {
  return <SkillsBadges personIndex={personIndex} />
}
