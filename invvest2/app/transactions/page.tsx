'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import ToastProvider, { toast } from '@/components/Toast'
import Modal, { Field, iStyle } from '@/components/Modal'
import { loadState, saveState, AppState, Transaction, uid } from '@/lib/store'

export default function Transactions() {
  const { user } = useUser(); const userId = user?.id
  const [state, setState] = useState<AppState>({ positions: [], transactions: [], watchlist: [] })
  const [showAdd, setShowAdd] = useState(false)
  const [type, setType] = useState<'achat' | 'vente'>('achat')
  const [nom, setNom] = useState('')
  const [qty, setQty] = useState('')
  const [prix, setPrix] = useState('')

  useEffect(() => { if (userId) setState(loadState(userId)) }, [userId])

  function add() {
    if (!nom.trim() || !qty || !prix) { toast('Champs manquants'); return }
    const tx: Transaction = { id: uid(), type, nom: nom.trim(), qty: parseFloat(qty), prix: parseFloat(prix), date: new Date().toLocaleDateString('fr-FR') }
    const ns = { ...state, transactions: [...state.transactions, tx] }
    setState(ns); saveState(ns, userId); setShowAdd(false)
    toast('Transaction enregistrée !'); setNom(''); setQty(''); setPrix('')
  }

  const sorted = [...state.transactions].reverse()

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar title="Transactions"
          action={
            <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4ADE80', color: '#0F1117', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={14} strokeWidth={2.5} /> Nouvelle
            </button>
          }
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.4px', color: 'var(--t2)', marginBottom: 14 }}>HISTORIQUE</div>
            {sorted.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--t3)', fontSize: 13 }}>📋 Aucune transaction</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 150px 90px 80px', fontSize: 10, fontWeight: 600, letterSpacing: '.5px', color: 'var(--t3)', paddingBottom: 8, borderBottom: '1px solid var(--bd)' }}>
                  <span>TYPE</span><span>ACTIF</span><span style={{ textAlign: 'right' }}>DÉTAIL</span><span style={{ textAlign: 'right' }}>MONTANT</span><span style={{ textAlign: 'right' }}>DATE</span>
                </div>
                {sorted.map(tx => (
                  <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 150px 90px 80px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--bd)', fontSize: 13 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: tx.type === 'achat' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', color: tx.type === 'achat' ? '#4ADE80' : '#F87171', width: 'fit-content' }}>
                      {tx.type === 'achat' ? 'Achat' : 'Vente'}
                    </span>
                    <span style={{ fontWeight: 500, color: 'var(--t)' }}>{tx.nom}</span>
                    <span style={{ textAlign: 'right', color: 'var(--t2)' }}>{tx.qty} × {tx.prix.toFixed(2)} €</span>
                    <span style={{ textAlign: 'right', fontWeight: 600, color: 'var(--t)' }}>{(tx.qty * tx.prix).toFixed(0)} €</span>
                    <span style={{ textAlign: 'right', fontSize: 11, color: 'var(--t3)' }}>{tx.date}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {showAdd && (
        <Modal title="Nouvelle transaction" onClose={() => setShowAdd(false)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="TYPE">
              <select style={iStyle} value={type} onChange={e => setType(e.target.value as any)}>
                <option value="achat" style={{ background: '#1C2333' }}>Achat</option>
                <option value="vente" style={{ background: '#1C2333' }}>Vente</option>
              </select>
            </Field>
            <Field label="ACTIF">
              {state.positions.length > 0
                ? <select style={iStyle} value={nom} onChange={e => setNom(e.target.value)}>
                    <option value="" style={{ background: '#1C2333' }}>Choisir...</option>
                    {state.positions.map(p => <option key={p.id} style={{ background: '#1C2333' }}>{p.nom}</option>)}
                  </select>
                : <input style={iStyle} value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom de l'actif" />
              }
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="QUANTITÉ"><input style={iStyle} type="number" step="any" value={qty} onChange={e => setQty(e.target.value)} placeholder="5" /></Field>
            <Field label="PRIX UNITAIRE (€)"><input style={iStyle} type="number" step="any" value={prix} onChange={e => setPrix(e.target.value)} placeholder="150" /></Field>
          </div>
          {qty && prix && !isNaN(parseFloat(qty)) && !isNaN(parseFloat(prix)) && (
            <div style={{ fontSize: 12, background: 'var(--bg3)', borderRadius: 8, padding: '7px 12px', marginBottom: 4, color: 'var(--t2)' }}>
              Total : <b style={{ color: 'var(--t)' }}>{(parseFloat(qty) * parseFloat(prix)).toFixed(2)} €</b>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => setShowAdd(false)} style={{ flex: 1, border: '1px solid var(--bd2)', background: 'transparent', borderRadius: 8, padding: '9px 0', fontSize: 13, cursor: 'pointer', color: 'var(--t2)' }}>Annuler</button>
            <button onClick={add} style={{ flex: 1, background: '#4ADE80', color: '#0F1117', border: 'none', borderRadius: 8, padding: '9px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Enregistrer</button>
          </div>
        </Modal>
      )}
      <ToastProvider />
    </div>
  )
}
