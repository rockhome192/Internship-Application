import React, { useState } from 'react'
import { importCSV } from '../api.js'

function previewCSV(file, cb) {
  const reader = new FileReader()
  reader.onload = () => {
    const txt = reader.result
    const lines = String(txt).split(/\r?\n/).filter(Boolean)
    const headers = lines[0]?.split(',').map(s=>s.trim()) ?? []
    const rows = lines.slice(1, Math.min(lines.length, 11)).map(l=>{
      const cols = l.split(','); const obj = {}
      headers.forEach((h,i)=> obj[h]=cols[i] ?? '')
      return obj
    })
    cb({ headers, rows })
  }
  reader.readAsText(file)
}

export default function ImportPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold">Import CSV</div>
            <div className="text-gray-500 text-sm mt-1">
              รองรับ header: <code className="bg-gray-100 px-1 py-0.5 rounded">date, amount, category, method, note</code>
            </div>
          </div>
          <a
            className="btn btn-ghost"
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(
              'date,amount,category,method,note\n2025-09-01,120,Food,Cash,Lunch\n2025-09-02,45,Transport,QR,BTS\n'
            )}`}
            download="expense_template.csv"
          >
            ดาวน์โหลดเทมเพลต
          </a>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".csv"
            onChange={e=>{
              const f = e.target.files?.[0]
              setFile(f || null); setStatus('')
              if (f) previewCSV(f, setPreview)
            }}
            className="input"
          />
          <button className="btn btn-primary" disabled={!file || busy} onClick={async ()=>{
            if (!file) return
            try {
              setBusy(true); setStatus('กำลังอัปโหลด…')
              const res = await importCSV(file)
              setStatus(`นำเข้าแล้ว ${res.imported} แถว`)
            } catch {
              setStatus('นำเข้าล้มเหลว')
            } finally {
              setBusy(false)
            }
          }}>
            {busy ? 'กำลังอัปโหลด…' : 'อัปโหลดและนำเข้า'}
          </button>
          {status && <div className="text-sm text-blue-700">{status}</div>}
        </div>

        {preview && !!preview.headers.length && (
          <div className="mt-6">
            <div className="font-semibold mb-2">Preview (10 แถวแรก)</div>
            <table className="table">
              <thead>
                <tr>{preview.headers.map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {preview.rows.map((r,i)=>(
                  <tr key={i}>{preview.headers.map(h=> <td key={h}>{r[h]}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
