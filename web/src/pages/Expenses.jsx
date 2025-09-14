import React, { useEffect, useState } from 'react'
import { listExpenses, listCategories, createExpense } from '../api.js'

export default function Expenses() {
  const [rows, setRows] = useState([])
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    amount: '',
    category_id: '',
    method: 'Cash',
    note: '',
    spent_at: ''
  })

  async function refresh() {
    setLoading(true)
    const p = new URLSearchParams()
    const [r, c] = await Promise.all([listExpenses(p), listCategories()])
    setRows(r); setCats(c)
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  async function onSubmit(e) {
    e.preventDefault()

    // --- Validation ---
    const amt = Number(form.amount)
    if (isNaN(amt) || amt <= 0) {
      alert('กรุณากรอกจำนวนเงินให้ถูกต้อง (> 0)')
      return
    }
    if (!form.spent_at) {
      alert('กรุณาเลือกวันที่')
      return
    }

    // ส่งข้อมูล
    try {
      await createExpense({
        category_id: form.category_id || null,
        amount: amt,
        currency: 'THB',
        method: form.method || null,
        note: form.note || null,
        spent_at: form.spent_at
      })
      // เคลียร์ฟอร์ม
      setForm({
        amount: '',
        category_id: '',
        method: 'Cash',
        note: '',
        spent_at: ''
      })
      refresh()
    } catch (err) {
      console.error(err)
      alert('บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง')
    }
  }

  if (loading) return <div>Loading…</div>

  return (
    <div>
      <h2>Expenses</h2>

      <form onSubmit={onSubmit}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr auto', gap: 8 }}>

        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          required
        />

        <select
          value={form.category_id}
          onChange={e => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">(no category)</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <input
          placeholder="Method"
          value={form.method}
          onChange={e => setForm({ ...form, method: e.target.value })}
        />

        <input
          placeholder="Note"
          value={form.note}
          onChange={e => setForm({ ...form, note: e.target.value })}
        />

        <input
          type="date"
          value={form.spent_at}
          onChange={e => setForm({ ...form, spent_at: e.target.value })}
          max={today}
          required
        />

        <button type="submit">Add</button>
      </form>

      <table style={{ marginTop: 16, width: '100%' }}>
        <thead>
          <tr><th>Date</th><th>Category</th><th>Amount</th><th>Method</th><th>Note</th></tr>
        </thead>
        <tbody>
          {rows.map(r =>
            <tr key={r.id}>
              <td>{r.spent_at}</td>
              <td>{r.category_name || '-'}</td>
              <td>{Number(r.amount).toLocaleString()}</td>
              <td>{r.method || '-'}</td>
              <td>{r.note || ''}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
