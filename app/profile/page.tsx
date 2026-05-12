'use client'
import { useUser, useClerk } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { User, Bell, Shield, Trash2, LogOut, ChevronRight } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import ToastProvider, { toast } from '@/components/Toast'
import { loadState, saveState, calcTotals, fmt, AppState } from '@/lib/store'

export default function Profile() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const userId = user?.id
  const [state, setState] = useState<AppState>({ positions: [], transactions: [], watchlist: [] })
  const [alerts, setAlerts] = useState(true)
  const [newsletter, setNewsletter] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => { if (userId) setState(loadState(userId)) }, [userId])

  function clearData() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    const empty: AppState = { positions: [], transactions: [], watchlist: [] }
    saveState(empty, userId)
    setState(empty)
    setConfirmDelete(false)
    toast('Données supprimées')
  }

  if (!isLoaded) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--t3)', fontSize: 13 }}>
      Chargement...
    </div>
  )

  const { totalVal, pl, pct } = calcTotals(state.positions)
  const initials = user ? ((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')).toUpperCase() || user.emailAddresses[0]?.emailAddress[0].toUpperCase() : '?'

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar title="Profil & Paramètres" />
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>

          {/* Avatar + infos */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 14, padding: '24px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              : <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#818CF8,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: 'white', flexShrink: 0 }}>{initials}</div>
            }
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--t)', marginBottom: 4 }}>
                {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : 'Mon compte'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 8 }}>
                {user?.emailAddresses[0]?.emailAddress}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, color: '#4ADE80' }}>
                ✦ Premium
              </div>
            </div>
          </div>

          {/* Stats patrimoine */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { label: 'PATRIMOINE', val: fmt(totalVal), color: 'var(--t)' },
              { label: 'PLUS-VALUE', val: (pl >= 0 ? '+' : '') + pl.toFixed(0) + ' €', color: pl >= 0 ? '#4ADE80' : '#F87171' },
              { label: 'POSITIONS', val: state.positions.length.toString(), color: 'var(--t)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.5px', color: 'var(--t3)', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Notifications */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Bell size={15} color="#4ADE80" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t)' }}>Notifications</span>
            </div>
            {[
              { label: 'Alertes de prix', sub: 'Notifié quand un actif atteint votre seuil', val: alerts, set: setAlerts },
              { label: 'Newsletter hebdomadaire', sub: 'Résumé de votre portefeuille chaque lundi', val: newsletter, set: setNewsletter },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--bd)' }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--t)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>{item.sub}</div>
                </div>
                <div
                  onClick={() => { item.set(!item.val); toast((!item.val ? 'Activé' : 'Désactivé') + ' : ' + item.label) }}
                  style={{ width: 40, height: 22, borderRadius: 11, background: item.val ? '#4ADE80' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: item.val ? 21 : 3, transition: 'left .2s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Compte */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <User size={15} color="#818CF8" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t)' }}>Compte</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--bd)', cursor: 'pointer' }}
              onClick={() => window.open('https://accounts.clerk.dev/user', '_blank')}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--t)' }}>Modifier le profil</div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>Nom, photo, mot de passe</div>
              </div>
              <ChevronRight size={15} color="var(--t3)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', cursor: 'pointer' }}
              onClick={() => signOut()}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--t)' }}>Se déconnecter</div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>Fermer la session</div>
              </div>
              <LogOut size={15} color="var(--t3)" />
            </div>
          </div>

          {/* Danger zone */}
          <div style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Shield size={15} color="#F87171" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#F87171' }}>Zone dangereuse</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--t)' }}>Supprimer toutes mes données</div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>Positions, transactions, watchlist — irréversible</div>
              </div>
              <button
                onClick={clearData}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: confirmDelete ? '#F87171' : 'rgba(248,113,113,0.1)', color: confirmDelete ? 'white' : '#F87171', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>
                <Trash2 size={13} />
                {confirmDelete ? 'Confirmer ?' : 'Supprimer'}
              </button>
            </div>
          </div>

        </div>
      </div>
      <ToastProvider />
    </div>
  )
}
