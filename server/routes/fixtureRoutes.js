const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const query = {};
    if (req.query.upcoming === 'true') {
      query.date = { $gte: new Date() };
    }
    const fixtures = await db.collection('fixtures').find(query).sort({ date: 1 }).toArray();
    res.json(fixtures);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const fixture = await db.collection('fixtures').findOne({ _id: new ObjectId(req.params.id) });
    if (!fixture) return res.status(404).json({ success: false, message: 'Fixture not found' });
    res.json(fixture);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('fixtures').insertOne(req.body);
    res.status(201).json({ success: true, id: result.insertedId, ...req.body });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('fixtures').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: 'Fixture not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('fixtures').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: 'Fixture not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
