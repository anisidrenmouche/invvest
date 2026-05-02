'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Plus, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import ToastProvider, { toast } from '@/components/Toast'
import PositionModal from '@/components/PositionModal'
import CoursModal from '@/components/CoursModal'
import { loadState, saveState, fmt, fmtPct, COLORS, AppState, Position } from '@/lib/store'

export default function Portfolio() {
  const { user } = useUser()
  const userId = user?.id
  const [state, setState] = useState<AppState>({ positions: [], transactions: [], watchlist: [] })
  const [showAdd, setShowAdd] = useState(false)
  const [editPos, setEditPos] = useState<Position | null>(null)
  const [coursPos, setCoursPos] = useState<Position | null>(null)

  useEffect(() => { if (userId) setState(loadState(userId)) }, [userId])

  function upsert(p: Position) {
    const exists = state.positions.find(x => x.id === p.id)
    const positions = exists ? state.positions.map(x => x.id === p.id ? p : x) : [...state.positions, p]
    const transactions = exists ? state.transactions : [...state.transactions, { id: p.id + 't', type: 'achat' as const, nom: p.nom, qty: p.qty, prix: p.pru, date: new Date().toLocaleDateString('fr-FR') }]
    const ns = { ...state, positions, transactions }
    setState(ns); saveState(ns, userId); toast(exists ? 'Modifié !' : 'Ajouté !')
  }

  function updateCours(id: string, cours: number) {
    const ns = { ...state, positions: state.positions.map(p => p.id === id ? { ...p, cours } : p) }
    setState(ns); saveState(ns, userId); toast('Cours mis à jour !')
  }

  function del(id: string) {
    if (!confirm('Supprimer cette position ?')) return
    const ns = { ...state, positions: state.positions.filter(p => p.id !== id) }
    setState(ns); saveState(ns, userId); toast('Supprimé')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar title="Portefeuille" showPeriod
          action={
            <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4ADE80', color: '#0F1117', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={14} strokeWidth={2.5} /> Ajouter
            </button>
          }
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.4px', color: 'var(--t2)', marginBottom: 14 }}>TOUTES LES POSITIONS</div>

            {state.positions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--t3)' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>💼</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--t2)', marginBottom: 6 }}>Aucune position</div>
                <button onClick={() => setShowAdd(true)} style={{ fontSize: 12, color: '#4ADE80', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', marginTop: 8 }}>
                  + Ajouter mon premier actif
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 55px 80px 80px 90px 80px', fontSize: 10, fontWeight: 600, letterSpacing: '.5px', color: 'var(--t3)', paddingBottom: 8, borderBottom: '1px solid var(--bd)', marginBottom: 2 }}>
                  <span /><span>ACTIF</span>
                  <span style={{ textAlign: 'right' }}>QTÉ</span>
                  <span style={{ textAlign: 'right' }}>PRU</span>
                  <span style={{ textAlign: 'right' }}>COURS</span>
                  <span style={{ textAlign: 'right' }}>PERF.</span>
                  <span style={{ textAlign: 'right' }}>VALEUR</span>
                </div>

                {state.positions.map((p, i) => {
                  const val = p.cours * p.qty
                  const perf = (p.cours - p.pru) / p.pru * 100
                  const plv = (p.cours - p.pru) * p.qty
                  const color = COLORS[i % COLORS.length]
                  return (
                    <div key={p.id} className="group" style={{ display: 'grid', gridTemplateColumns: '30px 1fr 55px 80px 80px 90px 80px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--bd)' }}
                      onMouseEnter={e => (e.currentTarget.querySelector('.acts') as HTMLElement | null)?.style && ((e.currentTarget.querySelector('.acts') as HTMLElement).style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.querySelector('.acts') as HTMLElement | null)?.style && ((e.currentTarget.querySelector('.acts') as HTMLElement).style.opacity = '0')}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: color + '18', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                        {p.nom.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--t)' }}>{p.nom}</div>
                        <div style={{ fontSize: 10, color: 'var(--t3)' }}>{p.ticker || ''} · {p.type}</div>
                      </div>
                      <span style={{ textAlign: 'right', fontSize: 13, color: 'var(--t2)' }}>{p.qty}</span>
                      <span style={{ textAlign: 'right', fontSize: 13, color: 'var(--t2)' }}>{p.pru.toFixed(2)} €</span>
                      <span style={{ textAlign: 'right', fontSize: 13, color: 'var(--t)' }}>{p.cours.toFixed(2)} €</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: perf >= 0 ? '#4ADE80' : '#F87171' }}>{fmtPct(perf)}</div>
                        <div style={{ fontSize: 10, color: perf >= 0 ? '#4ADE80' : '#F87171' }}>{plv >= 0 ? '+' : ''}{plv.toFixed(0)} €</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t)' }}>{fmt(val)}</span>
                        <div className="acts" style={{ display: 'flex', gap: 3, opacity: 0, transition: 'opacity .15s' }}>
                          <button onClick={() => setEditPos(p)} style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(129,140,248,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Pencil size={11} color="#818CF8" /></button>
                          <button onClick={() => setCoursPos(p)} style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(74,222,128,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RefreshCw size={11} color="#4ADE80" /></button>
                          <button onClick={() => del(p.id)} style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(248,113,113,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={11} color="#F87171" /></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {showAdd && <PositionModal onClose={() => setShowAdd(false)} onSave={upsert} />}
      {editPos && <PositionModal onClose={() => setEditPos(null)} onSave={upsert} initial={editPos} />}
      {coursPos && <CoursModal position={coursPos} onClose={() => setCoursPos(null)} onSave={c => updateCours(coursPos.id, c)} />}
      <ToastProvider />
    </div>
  )
}
