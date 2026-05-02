'use client'
import { useState } from 'react'
import Modal, { Field, iStyle } from './Modal'
import { Position, fmtPct } from '@/lib/store'

interface Props { position: Position; onClose: () => void; onSave: (cours: number) => void }

export default function CoursModal({ position, onClose, onSave }: Props) {
  const [val, setVal] = useState(position.cours.toString())
  const nv = parseFloat(val)
  const ok = !isNaN(nv) && nv > 0
  const perf = ok ? (nv - position.pru) / position.pru * 100 : null
  const delta = ok ? (nv - position.cours) * position.qty : null

  return (
    <Modal title="Mettre à jour le cours" onClose={onClose}>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t)', marginBottom: 12 }}>{position.nom}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg3)', borderRadius: 8, padding: '9px 13px', fontSize: 12, color: 'var(--t2)', marginBottom: 14 }}>
        <span>Actuel : <b style={{ color: 'var(--t)' }}>{position.cours.toFixed(2)} €</b></span>
        <span>PRU : <b style={{ color: 'var(--t)' }}>{position.pru.toFixed(2)} €</b></span>
      </div>
      <Field label="NOUVEAU COURS (€)">
        <input style={iStyle} type="number" step="any" value={val} onChange={e => setVal(e.target.value)} autoFocus />
      </Field>
      {ok && perf !== null && delta !== null && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, background: 'var(--bg3)', borderRadius: 8, padding: '7px 12px', marginBottom: 14, color: 'var(--t2)' }}>
          <span>Perf. : <b style={{ color: perf >= 0 ? '#4ADE80' : '#F87171' }}>{fmtPct(perf)}</b></span>
          <span>Δ : <b style={{ color: delta >= 0 ? '#4ADE80' : '#F87171' }}>{delta >= 0 ? '+' : ''}{delta.toFixed(0)} €</b></span>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onClose} style={{ flex: 1, border: '1px solid var(--bd2)', background: 'transparent', borderRadius: 8, padding: '9px 0', fontSize: 13, cursor: 'pointer', color: 'var(--t2)' }}>Annuler</button>
        <button onClick={() => { if (ok) { onSave(nv); onClose() } }} disabled={!ok}
          style={{ flex: 1, background: '#4ADE80', color: '#0F1117', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontWeight: 600, cursor: ok ? 'pointer' : 'not-allowed', opacity: ok ? 1 : 0.4 }}>
          Mettre à jour
        </button>
      </div>
    </Modal>
  )
}
