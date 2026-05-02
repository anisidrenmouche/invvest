'use client'

export type AssetType = 'Action' | 'ETF' | 'Crypto' | 'Obligation' | 'SCPI' | 'Matière première' | 'Autre'

export interface Position {
  id: string; nom: string; ticker: string; type: AssetType; qty: number; pru: number; cours: number
}
export interface Transaction {
  id: string; type: 'achat' | 'vente'; nom: string; qty: number; prix: number; date: string
}
export interface WatchlistItem {
  id: string; nom: string; ticker: string; cours: number; signal: 'buy' | 'hold' | 'sell'
}
export interface AppState {
  positions: Position[]; transactions: Transaction[]; watchlist: WatchlistItem[]
}

const DEFAULT: AppState = { positions: [], transactions: [], watchlist: [] }

function key(userId: string) { return `invvest-v1-${userId}` }

export function loadState(userId?: string | null): AppState {
  if (!userId) return DEFAULT
  try { const r = localStorage.getItem(key(userId)); if (r) return JSON.parse(r) } catch {}
  return DEFAULT
}

export function saveState(state: AppState, userId?: string | null) {
  if (!userId) return
  try { localStorage.setItem(key(userId), JSON.stringify(state)) } catch {}
}

export function calcTotals(positions: Position[]) {
  const totalVal = positions.reduce((s, p) => s + p.cours * p.qty, 0)
  const totalCost = positions.reduce((s, p) => s + p.pru * p.qty, 0)
  const pl = totalVal - totalCost
  return { totalVal, totalCost, pl, pct: totalCost > 0 ? pl / totalCost * 100 : 0 }
}

export function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' €'
}
export function fmtPct(n: number) { return (n >= 0 ? '+' : '') + n.toFixed(2) + ' %' }
export function uid() { return Math.random().toString(36).slice(2) }

export const COLORS = ['#4ADE80', '#818CF8', '#F59E0B', '#F87171', '#38BDF8', '#FB7185', '#34D399', '#A78BFA']
export const ASSET_TYPES: AssetType[] = ['Action', 'ETF', 'Crypto', 'Obligation', 'SCPI', 'Matière première', 'Autre']
