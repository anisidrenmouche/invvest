'use client'
import Link from 'next/link'

export default function Landing() {
  return (
    <div style={{ background: '#0F1117', minHeight: '100vh', color: '#F1F5F9' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 24px' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>invvest</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/sign-in" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none', padding: '8px 16px' }}>Connexion</Link>
            <Link href="/sign-up" style={{ background: '#4ADE80', color: '#0F1117', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Commencer</Link>
          </div>
        </nav>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <h1 style={{ fontSize: 52, fontWeight: 700, letterSpacing: -2, lineHeight: 1.1, marginBottom: 20 }}>
            Votre patrimoine,{' '}
            <span style={{ color: '#4ADE80' }}>enfin sous contrôle</span>
          </h1>
          <p style={{ fontSize: 17, color: '#94A3B8', maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Suivez tous vos actifs en un seul endroit. Actions, ETF, crypto — avec une IA qui analyse et conseille.
          </p>
          <Link href="/sign-up" style={{ background: '#4ADE80', color: '#0F1117', borderRadius: 10, padding: '13px 26px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            Commencer gratuitement →
          </Link>
        </div>
      </div>
    </div>
  )
}