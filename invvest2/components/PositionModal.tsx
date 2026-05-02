'use client'
import { useState } from 'react'
import Modal, { Field, iStyle } from './Modal'
import { ASSET_TYPES, AssetType, Position, uid, fmtPct } from '@/lib/store'

interface Props { onClose: () => void; onSave: (p: Position) => void; initial?: Position }

export default function PositionModal({ onClose, onSave, initial }: Props) {
  const [nom, setNom] = useState(initial?.nom ?? '')
  const [ticker, setTicker] = useState(initial?.ticker ?? '')
  const [type, setType] = useState<AssetType>(initial?.type ?? 'Action')
  const [qty, setQty] = useState(initial?.qty?.toString() ?? '')
  const [pru, setPru] = useState(initial?.pru?.toString() ?? '')
  const [cours, setCours] = useState(initial?.cours?.toString() ?? '')
  const [err, setErr] = useState('')

  const perf = pru && cours && parseFloat(pru) > 0
    ? (parseFloat(cours) - parseFloat(pru)) / parseFloat(pru) * 100
    : null

  function save() {
    if (!nom.trim() || !qty || !pru || !cours) { setErr('Tous les champs * sont requis.'); return }
    onSave({ id: initial?.id ?? uid(), nom: nom.trim(), ticker: ticker.trim(), type, qty: parseFloat(qty), pru: parseFloat(pru), cours: parseFloat(cours) })
    onClose()
  }

  return (
    <Modal title={initial ? `Modifier — ${initial.nom}` : 'Ajouter un actif'} onClose={onClose}>
      <Field label="NOM *">
        <input style={iStyle} value={nom} onChange={e => setNom(e.target.value)} placeholder="LVMH, Bitcoin, MSCI World..." />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="TICKER"><input style={iStyle} value={ticker} onChange={e => setTicker(e.target.value)} placeholder="MC.PA" /></Field>
        <Field label="TYPE">
          <select style={iStyle} value={type} onChange={e => setType(e.target.value as AssetType)}>
            {ASSET_TYPES.map(t => <option key={t} style={{ background: '#1C2333' }}>{t}</option>)}
          </select>
        </Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="QUANTITÉ *"><input style={iStyle} type="number" step="any" value={qty} onChange={e => setQty(e.target.value)} placeholder="10" /></Field>
        <Field label="PRU (€) *"><input style={iStyle} type="number" step="any" value={pru} onChange={e => setPru(e.target.value)} placeholder="150.00" /></Field>
      </div>
      <Field label="COURS ACTUEL (€) *">
        <input style={iStyle} type="number" step="any" value={cours} onChange={e => setCours(e.target.value)} placeholder="162.00" />
      </Field>

      {perf !== null && (
        <div style={{ fontSize: 12, padding: '7px 12px', borderRadius: 8, background: 'var(--bg3)', marginBottom: 10, color: 'var(--t2)' }}>
          Perf. vs PRU : <b style={{ color: perf >= 0 ? '#4ADE80' : '#F87171' }}>{fmtPct(perf)}</b>
        </div>
      )}
      {err && <p style={{ fontSize: 12, color: '#F87171', marginBottom: 10 }}>{err}</p>}

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button onClick={onClose} style={{ flex: 1, border: '1px solid var(--bd2)', background: 'transparent', borderRadius: 8, padding: '9px 0', fontSize: 13, cursor: 'pointer', color: 'var(--t2)' }}>Annuler</button>
        <button onClick={save} style={{ flex: 1, background: '#4ADE80', color: '#0F1117', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{initial ? 'Sauvegarder' : 'Ajouter →'}</button>
      </div>
    </Modal>
  )
}
