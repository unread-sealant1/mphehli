const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../api.log');
function log(msg) {
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
}

router.get('/', async (req, res) => {
  try {
    log(`GET /players - team: ${req.query.team || 'all'}, featured: ${req.query.featured || 'all'}, position: ${req.query.position || 'all'}`);
    const db = getDB();
    const query = {};
    if (req.query.team) {
      query.team = req.query.team;
    }
    if (req.query.featured === 'true') {
      query.featured = true;
    }
    if (req.query.position) {
      query.position = req.query.position;
    }
    const players = await db.collection('players').find(query).toArray();
    log(`Found ${players.length} players`);
    res.json(players);
  } catch (error) {
    log(`Error in GET /players: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const player = await db.collection('players').findOne({ _id: new ObjectId(req.params.id) });
    if (!player) return res.status(404).json({ success: false, message: 'Player not found' });
    res.json(player);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    log(`POST /players - body: ${JSON.stringify(req.body)}`);
    const db = getDB();
    const result = await db.collection('players').insertOne(req.body);
    res.status(201).json({ success: true, id: result.insertedId, ...req.body });
  } catch (error) {
    log(`Error in POST /players: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('players').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: 'Player not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('players').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: 'Player not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
