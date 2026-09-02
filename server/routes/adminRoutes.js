const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

router.get('/stats', async (req, res) => {
  try {
    const db = getDB();
    const results = await db.collection('fixtures').find({ status: 'completed' }).toArray();

    let wins = 0, draws = 0, losses = 0, goals = 0;
    results.forEach(res => {
      const isHome = res.homeTeam === 'Mphehli All Stars';
      const mphehliScore = isHome ? res.homeScore : res.awayScore;
      const oppScore = isHome ? res.awayScore : res.homeScore;

      if (mphehliScore > oppScore) wins++;
      else if (mphehliScore === oppScore) draws++;
      else losses++;

      goals += mphehliScore;
    });

    const stats = {
      // Home Page Stats
      matches: results.length,
      wins,
      draws,
      losses,
      goals,
      players: await db.collection('players').countDocuments({ status: 'active' }),
      followers: 1500,

      // Admin Dashboard Stats
      totalPlayers: await db.collection('players').countDocuments({ status: 'active' }),
      upcomingFixtures: await db.collection('fixtures').countDocuments({ status: 'upcoming' }),
      publishedNews: await db.collection('news').countDocuments({ status: 'published' }),
      galleryCount: await db.collection('gallery').countDocuments({ published: true }),
      activeSponsors: await db.collection('sponsors').countDocuments({ active: true }),
      totalResults: results.length,
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/activity', async (req, res) => {
  try {
    // This is a mock implementation since we don't have an activity log table
    // In a real app, we would fetch from an 'activity' collection
    res.json([
      { action: 'New Player Added', detail: 'Sipho Dlamini joined the squad', color: '#121B47', time: '2 hours ago' },
      { action: 'Fixture Updated', detail: 'Match vs Riverside United confirmed', color: '#16A34A', time: '5 hours ago' },
      { action: 'News Published', detail: 'Season Ambitions article live', color: '#CA8A04', time: '1 day ago' },
    ]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection('admins').find({}).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin users' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const db = getDB();
    await db.collection('admins').updateOne({ _id: req.params.id }, { $set: req.body });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const db = getDB();
    await db.collection('admins').deleteOne({ _id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
