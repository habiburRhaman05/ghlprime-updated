import { useEffect, useState } from 'react'
import { fetchTeamMembers } from '../../lib/teamApi'
import LeaderCardGrid from '../LeaderCardGrid'

export default function LeadersSection() {
  const [leaders, setLeaders] = useState([])
  useEffect(() => { fetchTeamMembers().then(setLeaders) }, [])

  return (
    <section className="section section-white mentor-showcase-section leader-card-section">
      <div className="container">
        <div className="section-title centered compact-team-title">
          <span className="eyebrow-label">Leaders</span>
          <h2>Meet <span className="hl">Your Mentors</span></h2>
          <p>Our leaders bring years of experience building automation systems, CRM infrastructures, and AI-powered workflows for growth-focused businesses.</p>
        </div>

        <LeaderCardGrid leaders={leaders} />

      </div>
    </section>
  )
}
