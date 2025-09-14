
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*' }));
app.use(express.json());

// ✅ health (ให้มีแน่ ๆ)
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: 'railway', time: new Date().toISOString() });
});

// --- ถ้ามี router อื่น ควร mount แบบนี้ ---
import expensesRouter from './routes/expenses.js';
import categoriesRouter from './routes/categories.js';
import statsRouter from './routes/stats.js';

// สังเกตว่าเรา mount ด้วย path เต็มแล้ว
app.use('/api/expenses', expensesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/stats', statsRouter);

// 404 fallback (ไม่บังคับ แต่ช่วย debug)
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API running on :' + PORT));
