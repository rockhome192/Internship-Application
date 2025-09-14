const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export async function getSummary(params) { const res = await fetch(`${API}/stats/summary?${params.toString()}`); return res.json(); }
export async function listExpenses(params) { const res = await fetch(`${API}/expenses?${params.toString()}`); return res.json(); }
export async function createExpense(data) { const res = await fetch(`${API}/expenses`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }); return res.json(); }
export async function listCategories() { const res = await fetch(`${API}/categories`); return res.json(); }
export async function importCSV(file) { const form = new FormData(); form.append('file', file); const res = await fetch(`${API}/expenses/import`, { method:'POST', body: form }); if (!res.ok) throw new Error('Import failed'); return res.json(); }
