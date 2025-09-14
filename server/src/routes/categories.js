import { Router } from 'express';
import { q } from '../db.js';
export const categoriesRouter = Router();
categoriesRouter.get('/', async (_req, res) => {
  const { rows } = await q(`SELECT * FROM categories WHERE user_id=1 ORDER BY name`);
  res.json(rows);
});
categoriesRouter.post('/', async (req, res) => {
  const { name } = req.body;
  await q(`INSERT INTO categories (user_id, name) VALUES (1, ?)`, [name]);
  const { rows } = await q(`SELECT * FROM categories WHERE user_id=1 AND name=? ORDER BY id DESC LIMIT 1`, [name]);
  res.status(201).json(rows[0]);
});
