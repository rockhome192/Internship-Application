import React, { useEffect, useState } from 'react'
import { Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js'
import { getSummary } from '../api.js'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => {
    const p = new URLSearchParams()
    if (from) p.set('from', from)
    if (to) p.set('to', to)
    getSummary(p).then(setSummary)
  }, [from, to])

  if (!summary) return <div>Loading…</div>

  // Pie colors (หมวดหมู่)
  const labels = summary.byCategory.map(x => x.category)
  const values = summary.byCategory.map(x => x.total)
  const palette = ['#2563EB','#06B6D4','#22C55E','#F59E0B','#EF4444','#A855F7','#14B8A6','#84CC16','#F97316','#E11D48']
  const pieColors = labels.map((_, i) => palette[i % palette.length])

  const pie = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: pieColors,
      borderWidth: 0
    }]
  }

  // Bar chart (รายเดือน)
  const bar = {
    labels: summary.byMonth.map(x => x.ym),
    datasets: [{
      label: 'Total',
      data: summary.byMonth.map(x => x.total),
      backgroundColor: '#2563EB'
    }]
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <div className="label mb-1">From</div>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="input" />
        </div>
        <div>
          <div className="label mb-1">To</div>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="input" />
        </div>
        <div className="text-sm text-gray-500">
          {!from && !to ? 'Showing: all time' : `Showing: ${from || '…'} to ${to || '…'}`}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-gray-500 text-sm">Total Expense</div>
          <div className="text-3xl font-semibold mt-1">{Number(summary.total).toLocaleString()} THB</div>
        </div>

        <div className="card md:col-span-1">
          <div className="font-semibold mb-2">By Category</div>
          <Pie data={pie} />
        </div>

        <div className="card md:col-span-2">
          <div className="font-semibold mb-2">Monthly Trend</div>
          <Bar data={bar} />
        </div>
      </div>
    </div>
  )
}
