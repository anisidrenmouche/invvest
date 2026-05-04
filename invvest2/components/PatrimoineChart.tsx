'use client'
import { useEffect, useRef } from 'react'

interface Props {
  period?: string
}

const DATA: Record<string, { labels: string[]; values: number[] }> = {
  '1S': {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    values: [85200, 85800, 85400, 86100, 86800, 87100, 87430],
  },
  '1M': {
    labels: ['S1', 'S2', 'S3', 'S4'],
    values: [84200, 85100, 86300, 87430],
  },
  '3M': {
    labels: ['Jan', 'Fév', 'Mar'],
    values: [82000, 84500, 87430],
  },
  '1A': {
    labels: ['Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'],
    values: [72000, 73200, 74100, 75800, 73900, 76200, 78100, 79800, 81200, 83500, 85100, 87430],
  },
  'Max': {
    labels: ['2021', '2022', '2023', '2024', '2025'],
    values: [42000, 55000, 63000, 74000, 87430],
  },
}

export default function PatrimoineChart({ period = '1A' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const loadChart = async () => {
      const { Chart, LineElement, LinearScale, CategoryScale, PointElement, Filler, Tooltip } = await import('chart.js')
      Chart.register(LineElement, LinearScale, CategoryScale, PointElement, Filler, Tooltip)

      if (chartRef.current) chartRef.current.destroy()

      const d = DATA[period] || DATA['1A']
      const start = d.values[0]
      const end = d.values[d.values.length - 1]
      const isUp = end >= start
      const color = isUp ? '#4ADE80' : '#F87171'

      chartRef.current = new Chart(canvasRef.current!, {
        type: 'line',
        data: {
          labels: d.labels,
          datasets: [{
            data: d.values,
            borderColor: color,
            borderWidth: 2,
            fill: true,
            backgroundColor: (ctx: any) => {
              const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200)
              gradient.addColorStop(0, isUp ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)')
              gradient.addColorStop(1, 'rgba(0,0,0,0)')
              return gradient
            },
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: color,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 400 },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1C2333',
              titleColor: '#94A3B8',
              bodyColor: '#F1F5F9',
              bodyFont: { size: 13, weight: 'bold' as any },
              padding: 10,
              callbacks: {
                label: (ctx: any) => `  ${ctx.raw.toLocaleString('fr-FR')} €`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#475569', font: { size: 11 } },
              border: { display: false },
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#475569',
                font: { size: 11 },
                callback: (v: any) => v >= 1000 ? (v / 1000).toFixed(0) + 'k €' : v + ' €',
              },
              border: { display: false },
            },
          },
        },
      })
    }

    loadChart()
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [period])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}