const express = require('express');
const router = express.Router();
const { q } = require('../db');

// GET /api/stats/summary
router.get('/summary', async (req, res) => {
  try {
    const rows = await q(`
      SELECT c.name AS category, SUM(e.amount) AS total
      FROM expenses e
      LEFT JOIN categories c ON c.id = e.category_id
      GROUP BY c.name
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
