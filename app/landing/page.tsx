'use client'
import Link from 'next/link'

export default function Landing() {
  return (
    <div style={{ background: '#0F1117', minHeight: '100vh', color: '#F1F5F9', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 24px' }}>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#4ADE80,#22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="#0F1117"><path d="M10 2L3 7v11h14V7z"/></svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700 }}>invvest</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link href="#features" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Fonctionnalités</Link>
            <Link href="#pricing" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Tarifs</Link>
            <Link href="/sign-in" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>Connexion</Link>
            <Link href="/sign-up" style={{ background: '#4ADE80', color: '#0F1117', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Commencer gratuitement
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '80px 0 60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: '#4ADE80', marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }} />
            Analyse IA en temps réel
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 700, letterSpacing: -2, lineHeight: 1.1, marginBottom: 20 }}>
            Votre patrimoine,{' '}
            <span style={{ color: '#4ADE80' }}>enfin sous contrôle</span>
          </h1>
          <p style={{ fontSize: 17, color: '#94A3B8', maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Suivez tous vos actifs en un seul endroit. Actions, ETF, crypto, immobilier avec une IA qui analyse et conseille.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <Link href="/sign-up" style={{ background: '#4ADE80', color: '#0F1117', borderRadius: 10, padding: '13px 26px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
              Commencer gratuitement
            </Link>
            <Link href="/sign-in" style={{ background: 'transparent', color: '#F1F5F9', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '13px 26px', fontSize: 15, textDecoration: 'none' }}>
              Se connecter
            </Link>
          </div>
          <p style={{ fontSize: 12, color: '#475569', marginTop: 16 }}>Aucune carte bancaire requise</p>
        </div>

        {/* App preview */}
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#161B27', marginBottom: 80 }}>
          <div style={{ height: 36, background: '#1C2333', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 6 }}>
            {['#F87171','#FBBF24','#4ADE80'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '130px 1fr', gap: 12, minHeight: 220 }}>
            <div style={{ background: '#0F1117', borderRadius: 10, padding: '12px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: 'linear-gradient(135deg,#4ADE80,#22C55E)' }} />
                <span style={{ fontSize: 11, fontWeight: 700 }}>invvest</span>
              </div>
              {['Dashboard','Portefeuille','Watchlist','Analyse IA'].map((item, i) => (
                <div key={item} style={{ padding: '5px 7px', borderRadius: 6, fontSize: 10, color: i === 0 ? '#4ADE80' : '#64748B', background: i === 0 ? 'rgba(74,222,128,0.1)' : 'transparent', marginBottom: 3 }}>
                  {item}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#1C2333', borderRadius: 10, padding: 16, flex: 1 }}>
                <div style={{ fontSize: 9, color: '#475569', letterSpacing: '.5px', marginBottom: 6 }}>PATRIMOINE NET TOTAL</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#F1F5F9', letterSpacing: -1 }}>87 430 €</div>
                <div style={{ display: 'inline-block', background: 'rgba(74,222,128,0.15)', color: '#4ADE80', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, marginTop: 6 }}>+12,4 % YTD</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 32, marginTop: 12, opacity: 0.4 }}>
                  {[40,52,46,60,55,68,62,75,70,82,77,92].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, background: '#4ADE80', borderRadius: '2px 2px 0 0' }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: '#1C2333', borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 8, color: '#475569', marginBottom: 3 }}>POSITIONS</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#F1F5F9' }}>14</div>
                </div>
                <div style={{ background: '#1C2333', borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 8, color: '#475569', marginBottom: 3 }}>PLUS-VALUE</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#4ADE80' }}>+9 840 €</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.8px', color: '#4ADE80', textAlign: 'center', marginBottom: 10 }}>FONCTIONNALITÉS</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: -.5, textAlign: 'center', marginBottom: 10 }}>Tout ce dont vous avez besoin</h2>
          <p style={{ fontSize: 15, color: '#94A3B8', textAlign: 'center', maxWidth: 420, margin: '0 auto 48px', lineHeight: 1.6 }}>Une plateforme complète pour gérer et faire croître votre patrimoine.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { icon: '📊', color: 'rgba(74,222,128,0.1)', title: 'Suivi en temps réel', desc: 'Toutes vos positions centralisées. Cours mis à jour, performance instantanée.' },
              { icon: '✦', color: 'rgba(129,140,248,0.1)', title: 'Analyse IA', desc: 'Un assistant IA qui connaît votre portefeuille et vous conseille.' },
              { icon: '🔔', color: 'rgba(251,191,36,0.1)', title: 'Alertes de prix', desc: 'Recevez une notification quand un actif atteint votre seuil.' },
              { icon: '📈', color: 'rgba(56,189,248,0.1)', title: 'Graphiques avancés', desc: "Visualisez l'évolution de votre patrimoine sur n'importe quelle période." },
              { icon: '🏦', color: 'rgba(248,113,113,0.1)', title: 'Multi-comptes', desc: 'PEA, CTO, crypto, SCPI — tous vos comptes dans une seule vue.' },
              { icon: '🔒', color: 'rgba(74,222,128,0.1)', title: 'Sécurisé', desc: 'Authentification sécurisée. Vos données vous appartiennent.' },
            ].map(f => (
              <div key={f.title} style={{ background: '#161B27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#F1F5F9', marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.8px', color: '#4ADE80', textAlign: 'center', marginBottom: 10 }}>TARIFS</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: -.5, textAlign: 'center', marginBottom: 10 }}>Simple et transparent</h2>
          <p style={{ fontSize: 15, color: '#94A3B8', textAlign: 'center', maxWidth: 380, margin: '0 auto 48px', lineHeight: 1.6 }}>Commencez gratuitement, passez en Premium quand vous voulez.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 580, margin: '0 auto' }}>
            <div style={{ background: '#161B27', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Gratuit</div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1, marginBottom: 4 }}>0 €</div>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>Pour toujours</div>
              {["Jusqu'à 10 positions",'Dashboard complet','Watchlist'].map(f => (
                <div key={f} style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#4ADE80' }}>✓</span>{f}
                </div>
              ))}
              <Link href="/sign-up" style={{ display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.06)', color: '#F1F5F9', borderRadius: 9, padding: '10px 0', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginTop: 20 }}>
                Commencer gratuitement
              </Link>
            </div>
            <div style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'inline-block', background: 'rgba(74,222,128,0.1)', color: '#4ADE80', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, marginBottom: 10 }}>✦ Premium</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Pro</div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1, marginBottom: 4 }}>9 €</div>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>par mois · sans engagement</div>
              {['Positions illimitées','Analyse IA avancée','Alertes de prix','Graphiques historiques','Export CSV / PDF'].map(f => (
                <div key={f} style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#4ADE80' }}>✓</span>{f}
                </div>
              ))}
              <Link href="/sign-up" style={{ display: 'block', textAlign: 'center', background: '#4ADE80', color: '#0F1117', borderRadius: 9, padding: '10px 0', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginTop: 20 }}>
                Essayer 14 jours gratuits
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.12)', borderRadius: 20, padding: 52, textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: -.5, marginBottom: 12 }}>Prenez le contrôle de votre patrimoine</h2>
          <p style={{ fontSize: 15, color: '#94A3B8', marginBottom: 28 }}>Rejoignez des milliers d'investisseurs qui suivent leur portefeuille avec invvest.</p>
          <Link href="/sign-up" style={{ display: 'inline-block', background: '#4ADE80', color: '#0F1117', borderRadius: 10, padding: '14px 28px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            Commencer gratuitement
          </Link>
        </div>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: '#475569' }}>2025 invvest. Tous droits réservés.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Confidentialité','CGU','Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </footer>

      </div>
    </div>
  )
}