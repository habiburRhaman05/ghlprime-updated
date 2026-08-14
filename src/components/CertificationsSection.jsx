import { motion } from 'framer-motion'

const certifications = [
  {
    title: 'A2P Compliance',
    image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/6809495041e8e478540a0fc9.png',
  },
  {
    title: 'Course Creator',
    image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/6809495041e8e45bd10a0fc8.png',
  },
  {
    title: 'SaaSPRENEUR Local Hero',
    image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/680949503e3c66b620e619d1.png',
  },
  {
    title: 'AI Employee',
    image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/680a7b4f4dd5ff729ab2a907.png',
  },
  {
    title: 'HIPAA Compliance',
    image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/680a7b4f9269efa6bde5bf39.png',
  },
  {
    title: 'Paid Ads',
    image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/680a7b4f8776df24f56abd1e.png',
  },
  {
    title: 'Social Media Manager',
    image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/680a7b4f9020da60c080434f.png',
  },
  {
    title: 'Automated Swag Store',
    image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/680a7b4f4af0d97027ebc43b.png',
  },
  {
    title: 'Quick Wins',
    image: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/knES3eSWYIsc5YSZ3YLl/media/680a7b4f71b53c1ac414297f.png',
  },
  {
    title: 'WhatsApp Integration',
    image: 'https://directory.gohighlevel.com/objects/uploads/a74f547e-f745-43b6-a981-e833d7ec89c1',
  },
]

export default function CertificationsSection() {
  return (
    <section className="section section-white certifications-section">
      <div className="container">
        <div className="section-title centered certifications-title">
          <span className="eyebrow-label">Certifications</span>
          <h2 className="certifications-single-line">Certified Across Every Major GHL Specialty</h2>
          <p>Every badge below is an official GoHighLevel certification — earned by our team, not just claimed.</p>
        </div>

        <motion.div className="certifications-featured-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45 }}>
          <img src="https://directory.gohighlevel.com/objects/uploads/284cf43c-3358-4259-8aee-6e43855333a6" alt="Certified Admin Badge" className="certifications-featured-badge" loading="lazy" decoding="async" />
          <div>
            <strong>Certified Admin</strong>
            <p>Highest-level GHL certification — full platform mastery</p>
          </div>
        </motion.div>

        <div className="certifications-divider"><span>10 Additional Skills Certifications</span></div>

        <div className="certifications-grid">
          {certifications.map((item, index) => (
            <motion.article key={item.title} className="certification-item" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.35, delay: index * 0.03 }}>
              <div className="certification-badge-wrap">
                <img src={item.image} alt={item.title} className="certification-badge" loading="lazy" decoding="async" />
              </div>
              <h3>{item.title}</h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
