const express = require('express');
const router = express.Router();
const { q } = require('../db');

// GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const rows = await q('SELECT * FROM expenses ORDER BY spent_at DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
