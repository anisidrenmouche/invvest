'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Plus, Trash2 } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import ToastProvider, { toast } from '@/components/Toast'
import Modal, { Field, iStyle } from '@/components/Modal'
import { loadState, saveState, AppState, WatchlistItem, uid } from '@/lib/store'

const SIG = {
  buy:  { label: 'Acheter',    bg: 'rgba(74,222,128,0.15)',  color: '#4ADE80' },
  hold: { label: 'Conserver',  bg: 'rgba(251,191,36,0.12)',  color: '#FBBF24' },
  sell: { label: 'Vendre',     bg: 'rgba(248,113,113,0.12)', color: '#F87171' },
}

export default function Watchlist() {
  const { user } = useUser(); const userId = user?.id
  const [state, setState] = useState<AppState>({ positions: [], transactions: [], watchlist: [] })
  const [showAdd, setShowAdd] = useState(false)
  const [nom, setNom] = useState('')
  const [ticker, setTicker] = useState('')
  const [cours, setCours] = useState('')
  const [signal, setSignal] = useState<'buy' | 'hold' | 'sell'>('hold')

  useEffect(() => { if (userId) setState(loadState(userId)) }, [userId])

  function add() {
    if (!nom.trim() || !cours) { toast('Nom et cours requis'); return }
    const item: WatchlistItem = { id: uid(), nom: nom.trim(), ticker: ticker.trim(), cours: parseFloat(cours), signal }
    const ns = { ...state, watchlist: [...state.watchlist, item] }
    setState(ns); saveState(ns, userId); setShowAdd(false)
    toast('Ajouté à la watchlist !'); setNom(''); setTicker(''); setCours('')
  }

  function remove(id: string) {
    const ns = { ...state, watchlist: state.watchlist.filter(w => w.id !== id) }
    setState(ns); saveState(ns, userId); toast('Retiré')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar title="Watchlist"
          action={
            <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4ADE80', color: '#0F1117', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={14} strokeWidth={2.5} /> Ajouter
            </button>
          }
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.4px', color: 'var(--t2)', marginBottom: 14 }}>MA WATCHLIST</div>
            {state.watchlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--t3)', fontSize: 13 }}>⭐ Watchlist vide</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 30px', fontSize: 10, fontWeight: 600, letterSpacing: '.5px', color: 'var(--t3)', paddingBottom: 8, borderBottom: '1px solid var(--bd)' }}>
                  <span>ACTIF</span><span style={{ textAlign: 'right' }}>COURS</span><span style={{ textAlign: 'right' }}>SIGNAL</span><span />
                </div>
                {state.watchlist.map(w => (
                  <div key={w.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 30px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--bd)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--t)' }}>{w.nom}</div>
                      <div style={{ fontSize: 10, color: 'var(--t3)' }}>{w.ticker || '—'}</div>
                    </div>
                    <span style={{ textAlign: 'right', fontSize: 13, fontWeight: 500, color: 'var(--t)' }}>{w.cours.toFixed(2)} €</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: SIG[w.signal].bg, color: SIG[w.signal].color }}>
                        {SIG[w.signal].label}
                      </span>
                    </div>
                    <button onClick={() => remove(w.id)} style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(248,113,113,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={12} color="#F87171" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>

          <div style={{ background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.12)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.4px', color: '#4ADE80', marginBottom: 12 }}>SIGNAUX IA</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { bg: 'rgba(74,222,128,0.06)',  bd: 'rgba(74,222,128,0.15)',  c: '#86EFAC', t: 'ASML — Rebond probable. RSI oversold 28, support clé testé 3×.' },
                { bg: 'rgba(129,140,248,0.06)', bd: 'rgba(129,140,248,0.15)', c: '#A5B4FC', t: 'Air Liquide — Dividende en hausse 29 ans. Sous sa moyenne de valorisation.' },
                { bg: 'rgba(248,113,113,0.06)', bd: 'rgba(248,113,113,0.15)', c: '#FCA5A5', t: 'Tesla — Volatilité élevée, 3 révisions baisse analystes. Prudence CT.' },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, border: `1px solid ${s.bd}`, borderRadius: 9, padding: '9px 13px', fontSize: 12, color: s.c, lineHeight: 1.5 }}>{s.t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <Modal title="Ajouter à la watchlist" onClose={() => setShowAdd(false)}>
          <Field label="NOM *"><input style={iStyle} value={nom} onChange={e => setNom(e.target.value)} placeholder="ASML" /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="TICKER"><input style={iStyle} value={ticker} onChange={e => setTicker(e.target.value)} placeholder="ASML.AS" /></Field>
            <Field label="COURS (€) *"><input style={iStyle} type="number" step="any" value={cours} onChange={e => setCours(e.target.value)} placeholder="657" /></Field>
          </div>
          <Field label="SIGNAL">
            <select style={iStyle} value={signal} onChange={e => setSignal(e.target.value as any)}>
              <option value="buy" style={{ background: '#1C2333' }}>Acheter</option>
              <option value="hold" style={{ background: '#1C2333' }}>Conserver</option>
              <option value="sell" style={{ background: '#1C2333' }}>Vendre</option>
            </select>
          </Field>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={() => setShowAdd(false)} style={{ flex: 1, border: '1px solid var(--bd2)', background: 'transparent', borderRadius: 8, padding: '9px 0', fontSize: 13, cursor: 'pointer', color: 'var(--t2)' }}>Annuler</button>
            <button onClick={add} style={{ flex: 1, background: '#4ADE80', color: '#0F1117', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Ajouter →</button>
          </div>
        </Modal>
      )}
      <ToastProvider />
    </div>
  )
}
