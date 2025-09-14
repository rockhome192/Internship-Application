import { Router } from 'express';
import { q } from '../db.js';
export const statsRouter = Router();
statsRouter.get('/summary', async (req, res) => {
  const { from, to } = req.query;
  const params = [1];
  let where = 'user_id=?';
  if (from) { params.push(from); where += ' AND spent_at >= ?'; }
  if (to)   { params.push(to);   where += ' AND spent_at <= ?'; }
  const totalQ = q(`SELECT COALESCE(SUM(amount),0) AS total FROM expenses WHERE ${where}`, params);
  const onParams = [1];
  let onClause = 'e.category_id=c.id AND e.user_id=c.user_id';
  if (from) { onClause += ' AND e.spent_at >= ?'; onParams.push(from); }
  if (to)   { onClause += ' AND e.spent_at <= ?'; onParams.push(to); }
  const byCatQ  = q(
    `SELECT c.name AS category, COALESCE(SUM(e.amount),0) AS total
     FROM categories c
     LEFT JOIN expenses e ON ${onClause}
     WHERE c.user_id=1
     GROUP BY c.name
     ORDER BY total DESC`, onParams);
  const byMonthQ = q(
    `SELECT DATE_FORMAT(spent_at, '%Y-%m') AS ym, SUM(amount) AS total
     FROM expenses
     WHERE ${where}
     GROUP BY ym
     ORDER BY ym`, params);
  const [total, byCat, byMonth] = await Promise.all([totalQ, byCatQ, byMonthQ]);
  res.json({ total: Number(total.rows[0]?.total || 0), byCategory: byCat.rows, byMonth: byMonth.rows });
});
