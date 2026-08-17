import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchTeamPageExperts } from '../../lib/teamApi'

export default function ExpertsSection() {
  const [experts, setExperts] = useState([])
  useEffect(() => { fetchTeamPageExperts().then(setExperts) }, [])

  return (
    <section className="section section-white experts-section">
      <div className="container">
        <div className="section-title centered experts-section-title">
          <span className="eyebrow-label">Meet The Experts</span>
          <h2>Specialists supporting the work <span className="hl">behind the scenes.</span></h2>
          <p>Focused team members supporting design, systems, delivery, and execution across GHL Prime projects.</p>
        </div>
        {!experts.length ? <div> failed to fetch teams</div> : <div className="experts-grid">
          {experts.map((member, index) => (
            <motion.article
              key={member.id || member.name}
              className="expert-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <div className="expert-card-image-wrap">
                <img src={member.image_url} alt={member.name} className="expert-card-image" />
              </div>
              <div className="expert-card-body">
                <h3>{member.name}</h3>
                <p>{member.title}</p>
              </div>
            </motion.article>
          ))}
        </div>}
      </div>
    </section>
  )
}
