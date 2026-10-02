import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/public/settings - Global club metadata
router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.clubSettings.findFirst();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch club settings' });
  }
});

// GET /api/public/assets - Site-wide visual assets
router.get('/assets', async (req, res) => {
  try {
    const assets = await prisma.siteAsset.findMany();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site assets' });
  }
});

// GET /api/public/teams - List of all teams
router.get('/teams', async (req, res) => {
  try {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// GET /api/public/teams/:slug - Team details and squad
router.get('/teams/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const team = await prisma.team.findUnique({
      where: { slug },
      include: {
        players: { where: { isActive: true } },
        fixtures: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team details' });
  }
});

// GET /api/public/fixtures - List of all fixtures (filter by team or status)
router.get('/fixtures', async (req, res) => {
  try {
    const { teamSlug, status } = req.query;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (teamSlug) {
      where.team = { slug: teamSlug as string };
    }

    const fixtures = await prisma.fixture.findMany({
      where,
      include: { team: true },
      orderBy: { date: 'desc' },
    });
    res.json(fixtures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
});

// GET /api/public/news - Published news articles
router.get('/news', async (req, res) => {
  try {
    const { teamSlug } = req.query;
    const where: any = { published: true };

    if (teamSlug) {
      where.team = { slug: teamSlug as string };
    }

    const news = await prisma.news.findMany({
      where,
      include: { team: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// GET /api/public/news/:id - Single article
router.get('/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.news.findUnique({
      where: { id: parseInt(id) },
      include: { team: true },
    });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// GET /api/public/players/:id - Player profile
router.get('/players/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const player = await prisma.player.findUnique({
      where: { id: parseInt(id) },
      include: { team: true },
    });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player profile' });
  }
});

// GET /api/public/media - Gallery assets
router.get('/media', async (req, res) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { uploadedAt: 'desc' },
    });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

export default router;
