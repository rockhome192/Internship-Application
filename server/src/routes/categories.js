const express = require('express');
const router = express.Router();
const { q } = require('../db'); // ฟังก์ชัน query ของคุณ

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const rows = await q('SELECT id, name FROM categories ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
