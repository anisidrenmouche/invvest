'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import ToastProvider, { toast } from '@/components/Toast'
import PositionModal from '@/components/PositionModal'
import { loadState, saveState, calcTotals, fmt, fmtPct, COLORS, AppState, Position } from '@/lib/store'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const userId = user?.id
  const [state, setState] = useState<AppState>({ positions: [], transactions: [], watchlist: [] })
  const [showAdd, setShowAdd] = useState(false)
  const [period, setPeriod] = useState('1M')
  const router = useRouter()

  useEffect(() => { if (userId) setState(loadState(userId)) }, [userId])

  function addPosition(p: Position) {
    const ns = {
      ...state,
      positions: [...state.positions, p],
      transactions: [...state.transactions, { id: p.id + 't', type: 'achat' as const, nom: p.nom, qty: p.qty, prix: p.pru, date: new Date().toLocaleDateString('fr-FR') }]
    }
    setState(ns); saveState(ns, userId); toast('Position ajoutée !')
  }

  if (!isLoaded) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--t3)', fontSize: 13 }}>
      Chargement...
    </div>
  )

  const { totalVal, totalCost, pl, pct } = calcTotals(state.positions)

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar title="Vue d'ensemble" showPeriod period={period} onPeriod={setPeriod}
          action={
            <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4ADE80', color: '#0F1117', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={14} strokeWidth={2.5} /> Ajouter
            </button>
          }
        />

        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Hero */}
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ flex: 1.4, background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.8px', color: 'var(--t3)', marginBottom: 8 }}>PATRIMOINE NET TOTAL</div>
              <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -1.5, color: 'var(--t)', lineHeight: 1, marginBottom: 12 }}>{fmt(totalVal)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: pct >= 0 ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', color: pct >= 0 ? '#4ADE80' : '#F87171' }}>
                  {fmtPct(pct)}
                </span>
                <span style={{ fontSize: 13, color: 'var(--t3)' }}>P/L : {pl >= 0 ? '+' : ''}{pl.toFixed(0)} €</span>
              </div>
              {/* Sparkline décoratif */}
              <div style={{ marginTop: 16, height: 44, display: 'flex', alignItems: 'flex-end', gap: 2, opacity: 0.35 }}>
                {[40,52,46,60,55,68,62,75,70,82,77,92].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: '#4ADE80', borderRadius: '2px 2px 0 0' }} />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 190 }}>
              <div style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.5px', color: 'var(--t3)', marginBottom: 6 }}>INVESTI</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--t)' }}>{fmt(totalCost)}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3 }}>Coût de revient</div>
              </div>
              <div style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.5px', color: 'var(--t3)', marginBottom: 6 }}>PLUS-VALUE</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: pl >= 0 ? '#4ADE80' : '#F87171' }}>{pl >= 0 ? '+' : ''}{pl.toFixed(0)} €</div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3 }}>{fmtPct(pct)} latente</div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
            {/* Positions */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.4px', color: 'var(--t2)' }}>MES POSITIONS</span>
                <button onClick={() => router.push('/portfolio')} style={{ fontSize: 12, color: '#4ADE80', background: 'none', border: 'none', cursor: 'pointer' }}>Voir tout →</button>
              </div>

              {state.positions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--t3)' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
                  <div style={{ fontSize: 13, marginBottom: 4, color: 'var(--t2)' }}>Bonjour {user?.firstName || ''} !</div>
                  <div style={{ fontSize: 12, marginBottom: 14 }}>Ajoutez votre premier actif</div>
                  <button onClick={() => setShowAdd(true)} style={{ fontSize: 12, color: '#4ADE80', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}>
                    + Ajouter un actif
                  </button>
                </div>
              ) : (
                state.positions.slice(0, 5).map((p, i) => {
                  const val = p.cours * p.qty
                  const perf = (p.cours - p.pru) / p.pru * 100
                  const share = totalVal > 0 ? val / totalVal * 100 : 0
                  const color = COLORS[i % COLORS.length]
                  return (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--bd)' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: color + '18', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                        {p.nom.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--t)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nom}</div>
                        <div style={{ fontSize: 10, color: 'var(--t3)' }}>{p.ticker || p.type} · {p.qty}</div>
                      </div>
                      <div style={{ flex: 1, padding: '0 10px' }}>
                        <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, share).toFixed(0)}%`, background: color, borderRadius: 1 }} />
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3 }}>{share.toFixed(0)} %</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--t)' }}>{fmt(val)}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: perf >= 0 ? '#4ADE80' : '#F87171' }}>{fmtPct(perf)}</div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Répartition */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.4px', color: 'var(--t2)', marginBottom: 14 }}>RÉPARTITION</div>
              {state.positions.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100, fontSize: 12, color: 'var(--t3)' }}>Ajoutez des actifs</div>
              ) : (() => {
                const grp: Record<string, number> = {}
                state.positions.forEach(p => { grp[p.type] = (grp[p.type] || 0) + p.cours * p.qty })
                return Object.entries(grp).map(([type, val], i) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                    <span style={{ flex: 1, color: 'var(--t2)' }}>{type}</span>
                    <div style={{ width: 70, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(val / totalVal * 100).toFixed(0)}%`, background: COLORS[i % COLORS.length], borderRadius: 2 }} />
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--t)', width: 30, textAlign: 'right' }}>{(val / totalVal * 100).toFixed(0)}%</span>
                  </div>
                ))
              })()}
            </div>
          </div>
        </div>
      </div>

      {showAdd && <PositionModal onClose={() => setShowAdd(false)} onSave={addPosition} />}
      <ToastProvider />
    </div>
  )
}
