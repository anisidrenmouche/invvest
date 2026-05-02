import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#4ADE80,#22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="#0F1117"><path d="M10 2L3 7v11h14V7z"/></svg>
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#F1F5F9' }}>invvest</span>
      </div>
      <SignUp />
    </div>
  )
}
