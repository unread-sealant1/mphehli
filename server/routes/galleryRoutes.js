const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const items = await db.collection('gallery').find({}).toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const item = await db.collection('gallery').findOne({ _id: req.params.id });
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('gallery').insertOne(req.body);
    res.status(201).json({ success: true, id: result.insertedId, ...req.body });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('gallery').updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('gallery').deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
