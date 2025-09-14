const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }));
app.use(express.json());

// ✅ health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Backend is running 🚀', time: new Date().toISOString() });
});

// ===== Routers =====
const expensesRouter = require('./routes/expenses');
const categoriesRouter = require('./routes/categories');
const statsRouter = require('./routes/stats');

// ✅ mount routers
app.use('/api/expenses', expensesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/stats', statsRouter);

// ✅ fallback 404 (ช่วย debug)
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));
