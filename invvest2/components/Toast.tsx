'use client'
import { useEffect, useState } from 'react'

let _toast: ((m: string) => void) | null = null
export function toast(msg: string) { _toast?.(msg) }

export default function ToastProvider() {
  const [msg, setMsg] = useState<string | null>(null)
  useEffect(() => {
    _toast = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2500) }
    return () => { _toast = null }
  }, [])
  if (!msg) return null
  return <div className="toast">{msg}</div>
}
