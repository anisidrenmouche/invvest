'use client'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { Send, Sparkles } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import { loadState, calcTotals, AppState, fmt, fmtPct } from '@/lib/store'

interface Msg { role: 'user' | 'assistant'; content: string }

const CHIPS = [
  'Analyse les risques de mon portefeuille',
  'Comment améliorer ma diversification ?',
  'Meilleurs ETF pour un PEA en 2025 ?',
  'Stratégie DCA vs lump sum',
  'Fiscalité PEA vs CTO',
]

export default function AI() {
  const { user } = useUser(); const userId = user?.id
  const [state, setState] = useState<AppState>({ positions: [], transactions: [], watchlist: [] })
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'assistant', content: "Bonjour ! Je connais votre portefeuille en temps réel. Posez-moi n'importe quelle question sur vos actifs, la stratégie ou les marchés." }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showChips, setShowChips] = useState(true)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (userId) setState(loadState(userId)) }, [userId])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  async function send(q?: string) {
    const text = (q ?? input).trim(); if (!text || loading) return
    setInput(''); setShowChips(false)
    const newMsgs: Msg[] = [...msgs, { role: 'user', content: text }]
    setMsgs(newMsgs); setLoading(true)
    const { totalVal, pl, pct } = calcTotals(state.positions)
    const ctx = state.positions.length
      ? `Portefeuille: ${totalVal.toFixed(0)}€, ${state.positions.length} positions (${state.positions.map(p => p.nom).join(', ')}), P/L ${pl.toFixed(0)}€ (${pct.toFixed(1)}%).`
      : 'Portefeuille vide.'
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          system: `Expert en investissement et finances personnelles. Réponds en français, concis (4-6 phrases max). Contexte: ${ctx}`,
          messages: newMsgs.slice(1).map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text ?? 'Désolé, erreur.'
      setMsgs([...newMsgs, { role: 'assistant', content: reply }])
    } catch {
      setMsgs([...newMsgs, { role: 'assistant', content: "Erreur de connexion à l'IA." }])
    }
    setLoading(false)
  }

  const { totalVal, pct } = calcTotals(state.positions)

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar title="Analyse IA" />
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg,rgba(74,222,128,0.08),rgba(129,140,248,0.08))', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 14, padding: '14px 18px' }}>
            <Sparkles size={18} color="#4ADE80" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#4ADE80' }}>Assistant IA — analyse en temps réel</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                {state.positions.length > 0 ? `${state.positions.length} position(s) · ${fmt(totalVal)} · ${fmtPct(pct)}` : 'Ajoutez des actifs pour une analyse personnalisée'}
              </div>
            </div>
          </div>

          {/* Chat */}
          <div style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 14, padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%', fontSize: 13, lineHeight: 1.6, padding: '10px 14px',
                    borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '4px 12px 12px 12px',
                    background: m.role === 'user' ? '#4ADE80' : 'var(--bg3)',
                    color: m.role === 'user' ? '#0F1117' : 'var(--t)',
                    fontWeight: m.role === 'user' ? 500 : 400,
                  }}>{m.content}</div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ background: 'var(--bg3)', borderRadius: '4px 12px 12px 12px', padding: '10px 14px', display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--t3)', animation: `pulse 1s ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {showChips && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingBottom: 12, borderBottom: '1px solid var(--bd)', marginBottom: 12 }}>
                {CHIPS.map(c => (
                  <button key={c} onClick={() => send(c)} style={{ fontSize: 12, padding: '5px 11px', borderRadius: 20, background: 'var(--bg3)', border: '1px solid var(--bd2)', color: 'var(--t2)', cursor: 'pointer' }}>
                    {c}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Votre question..."
                style={{ flex: 1, border: '1px solid var(--bd2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, background: 'var(--bg3)', color: 'var(--t)', outline: 'none' }}
              />
              <button onClick={() => send()} disabled={loading || !input.trim()}
                style={{ width: 42, height: 42, borderRadius: 10, background: '#4ADE80', border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading || !input.trim() ? 0.4 : 1 }}>
                <Send size={16} color="#0F1117" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.2}50%{opacity:1}}`}</style>
    </div>
  )
}
