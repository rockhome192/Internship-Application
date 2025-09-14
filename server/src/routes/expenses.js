import { Router } from 'express';
import { q } from '../db.js';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
export const expensesRouter = Router();


expensesRouter.get('/', async (req, res) => {
  const { from, to, category, search } = req.query;
  const params = [1]; // demo user_id
  let where = 'e.user_id = ?'; // <<<< ใส่ e. ชัดๆ

  if (from)   { params.push(from);   where += ' AND e.spent_at >= ?'; }
  if (to)     { params.push(to);     where += ' AND e.spent_at <= ?'; }
  if (category){ params.push(Number(category)); where += ' AND e.category_id = ?'; }
  if (search) { params.push(`%${search}%`); where += ' AND (e.note LIKE ?)'; }

  const { rows } = await q(
    `SELECT e.*, c.name AS category_name
     FROM expenses e
     LEFT JOIN categories c ON c.id = e.category_id
     WHERE ${where}
     ORDER BY e.spent_at DESC, e.id DESC`,  // <<<< ใส่ e.
    params
  );
  res.json(rows);
});


expensesRouter.post('/', async (req, res) => {
  const { category_id, amount, currency = 'THB', method, note, spent_at } = req.body;
  await q(
    `INSERT INTO expenses (user_id, category_id, amount, currency, method, note, spent_at)
     VALUES (1, ?, ?, ?, ?, ?, ?)`,
    [category_id || null, amount, currency, method, note, spent_at]
  );
  const { rows: latest } = await q(`SELECT * FROM expenses ORDER BY id DESC LIMIT 1`);
  res.status(201).json(latest[0]);
});


expensesRouter.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { category_id, amount, currency, method, note, spent_at } = req.body;
  await q(
    `UPDATE expenses SET category_id=?, amount=?, currency=?, method=?, note=?, spent_at=?
     WHERE id=? AND user_id=1`,
    [category_id || null, amount, currency, method, note, spent_at, id]
  );
  const { rows } = await q(`SELECT * FROM expenses WHERE id=?`, [id]);
  res.json(rows[0]);
});


expensesRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  await q(`DELETE FROM expenses WHERE id=? AND user_id=1`, [id]);
  res.status(204).send();
});
const upload = multer({ storage: multer.memoryStorage() });


expensesRouter.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required' });
  const buf = req.file.buffer.toString('utf8');
  let records = [];
  try {
    records = parse(buf, { columns: true, trim: true, skip_empty_lines: true });
  } catch (e) {
    return res.status(400).json({ error: 'Invalid CSV' });
  }
  let count = 0;
  for (const r of records) {
    const { rows: catRows } = await q(`SELECT id FROM categories WHERE user_id=1 AND name=?`, [r.category]);
    const catId = (catRows[0] && catRows[0].id) || null;
    await q(
      `INSERT INTO expenses (user_id, category_id, amount, method, note, spent_at)
       VALUES (1, ?, ?, ?, ?, ?)`,
      [catId, Number(r.amount), r.method || null, r.note || null, r.date]
    );
    count++;
  }
  res.json({ imported: count });
});
