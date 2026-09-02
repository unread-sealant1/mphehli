const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

router.get('/:section', async (req, res) => {
  try {
    const db = getDB();
    const section = req.params.section;
    const setting = await db.collection('settings').findOne({ section });

    if (!setting) {
      return res.status(404).json({ error: `Settings for section ${section} not found` });
    }

    res.json(setting.values);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/:section', async (req, res) => {
  try {
    const db = getDB();
    const section = req.params.section;
    const values = req.body;

    await db.collection('settings').updateOne(
      { section },
      { $set: { values } },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
