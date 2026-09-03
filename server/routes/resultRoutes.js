const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const results = await db.collection('fixtures').find({ status: 'completed' }).sort({ date: -1 }).toArray();
    res.json(results);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/latest', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('fixtures').find({ status: 'completed' }).sort({ date: -1 }).limit(1).toArray();
    if (result.length === 0) return res.status(404).json({ success: false, message: 'No results found' });
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
