const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const sponsors = await db.collection('sponsors').find({}).toArray();
    res.json(sponsors);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const sponsor = await db.collection('sponsors').findOne({ _id: new ObjectId(req.params.id) });
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    res.json(sponsor);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('sponsors').insertOne(req.body);
    res.status(201).json({ success: true, id: result.insertedId, ...req.body });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('sponsors').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('sponsors').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
