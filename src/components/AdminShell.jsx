'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, Bot, Boxes, Images, FilePlus2, Image as ImageIcon, Layers3, Link2, LogOut, Newspaper, Plug, Users, Wrench } from 'lucide-react'

const navGroups = [
  {
    title: 'Case Study Control',
    items: [
      { label: 'Dashboard', icon: Layers3, to: '/admin/case-studies' },
      { label: 'Case Studies', icon: FilePlus2, to: '/admin/case-studies/manage' },
      { label: 'Blog', icon: Newspaper, to: '/admin/blog' },
      { label: 'Auto Blog', icon: Bot, to: '/admin/blog-ai' },
      { label: 'AI Connections', icon: Plug, to: '/admin/ai-connections' },
      { label: 'Meeting Gallery', icon: ImageIcon, to: '/admin/meeting-gallery' },
      { label: 'Technology Logos', icon: Wrench, to: '/admin/technology-logos' },
      { label: 'Trusted Logos', icon: Link2, to: '/admin/trusted-logos' },
      { label: 'Shipped Evidence', icon: Boxes, to: '/admin/showcase' },
      { label: 'Gallery', icon: Images, to: '/admin/gallery' },
    ],
  },
  {
    title: 'Team Control',
    items: [
      { label: 'Leaders', icon: Users, to: '/admin/leaders' },
      { label: 'Meet The Experts', icon: BarChart3, to: '/admin/experts' },
    ],
  },
]

function AdminSidebar({ email, onSignOut }) {
  const pathname = usePathname()

  return (
    <aside className="admin-sidebar-panel refined-admin-sidebar">
      <div className="admin-brand-block">
        <span className="admin-mini-badge">GP</span>
        <div>
          <strong>GHL Prime</strong>
          <span>Control Panel</span>
        </div>
      </div>

      <div className="admin-nav-groups">
        {navGroups.map((group) => (
          <div key={group.title} className="admin-nav-group-block">
            <span className="admin-nav-group-title">{group.title}</span>
            <div className="admin-nav-stack">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.to
                return (
                  <Link key={item.label} href={item.to} className={`admin-nav-item ${isActive ? 'active' : ''}`}>
                    <Icon size={17} /> {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="admin-sidebar-footer">
        <span className="eyebrow-label">Session</span>
        <p>{email}</p>
        <button type="button" className="admin-logout-btn" onClick={onSignOut}><LogOut size={16} /> Logout</button>
      </div>
    </aside>
  )
}

// react-router's <Navigate replace /> redirected on mount without pushing a
// history entry; router.replace() in an effect is the next/navigation
// equivalent inside a client component.
function RedirectToLogin() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/login')
  }, [router])
  return null
}

export default function AdminShell({ session, onSignOut, children, loadingText = 'Loading admin panel...' }) {
  if (session === undefined) {
    return <main className="admin-shell"><div className="admin-loading">{loadingText}</div></main>
  }

  if (!session) {
    return <RedirectToLogin />
  }

  return (
    <main className="admin-shell futuristic-admin-shell refined-admin-shell">
      <div className="admin-shell-noise" />
      <AdminSidebar email={session.user?.email} onSignOut={onSignOut} />
      <section className="admin-main-panel refined-admin-main">{children}</section>
    </main>
  )
}
