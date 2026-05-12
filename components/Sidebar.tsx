'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import { LayoutDashboard, Briefcase, Star, ArrowUpDown, Sparkles, LogOut, User } from 'lucide-react'

const NAV = [
  { section: 'PRINCIPAL', items: [
    { href: '/',             icon: LayoutDashboard, label: "Vue d'ensemble" },
    { href: '/portfolio',    icon: Briefcase,        label: 'Portefeuille' },
    { href: '/watchlist',    icon: Star,             label: 'Watchlist' },
    { href: '/transactions', icon: ArrowUpDown,      label: 'Transactions' },
    { href: '/profile', icon: User, label: 'Profil' },
  ]},
  { section: 'OUTILS', items: [
    { href: '/ai', icon: Sparkles, label: 'Analyse IA' },
  ]},
]

export default function Sidebar() {
  const path = usePathname()
  const { signOut } = useClerk()
  const { user } = useUser()

  const initials = user
    ? ((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')).toUpperCase() ||
      user.emailAddresses[0]?.emailAddress[0].toUpperCase() || '?'
    : '?'

  return (
    <aside style={{ width: 220, background: 'var(--bg)', borderRight: '1px solid var(--bd)', display: 'flex', flexDirection: 'column', padding: '20px 12px', flexShrink: 0, height: '100vh', position: 'sticky', top: 0 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 28 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#4ADE80,#22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="#0F1117"><path d="M10 2L3 7v11h14V7z"/></svg>
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--t)' }}>invvest</span>
      </div>

      {NAV.map(({ section, items }) => (
        <div key={section} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.8px', color: 'var(--t3)', padding: '0 10px', marginBottom: 5 }}>{section}</div>
          {items.map(({ href, icon: Icon, label }) => {
            const active = path === href
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8,
                fontSize: 13, marginBottom: 2, textDecoration: 'none', transition: 'all .15s',
                background: active ? 'rgba(74,222,128,0.1)' : 'transparent',
                color: active ? 'var(--acc)' : 'var(--t2)',
                fontWeight: active ? 500 : 400,
              }}>
                <Icon size={15} strokeWidth={active ? 2 : 1.6} />
                {label}
              </Link>
            )
          })}
        </div>
      ))}

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--bd)', paddingTop: 14 }}>
        <button onClick={() => signOut()} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8,
          fontSize: 13, width: '100%', marginBottom: 6, background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--t3)',
        }}>
          <LogOut size={15} strokeWidth={1.6} />
          Déconnexion
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
          {user?.imageUrl
            ? <img src={user.imageUrl} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            : <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#818CF8,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>{initials}</div>
          }
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--t)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : 'Mon compte'}
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--acc)' }}>✦ Premium</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
