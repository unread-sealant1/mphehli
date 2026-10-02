import { Router } from 'express';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../controllers/admin/player.controller';
import { getFixtures, createFixture, updateFixture, deleteFixture } from '../controllers/admin/fixture.controller';
import { getNews, createNews, updateNews, deleteNews } from '../controllers/admin/news.controller';
import { getMedia, createMedia, deleteMedia } from '../controllers/admin/media.controller';
import { getSettings, updateSettings } from '../controllers/admin/settings.controller';
import { getAssets, updateAsset } from '../controllers/admin/asset.controller';
import { getTeams, updateTeamImage } from '../controllers/admin/team.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Players
router.get('/players', getPlayers);
router.post('/players', upload.single('image'), createPlayer);
router.put('/players/:id', upload.single('image'), updatePlayer);
router.delete('/players/:id', deletePlayer);

// Fixtures
router.get('/fixtures', getFixtures);
router.post('/fixtures', createFixture);
router.put('/fixtures/:id', updateFixture);
router.delete('/fixtures/:id', deleteFixture);

// News
router.get('/news', getNews);
router.post('/news', upload.single('image'), createNews);
router.put('/news/:id', upload.single('image'), updateNews);
router.delete('/news/:id', deleteNews);

// Media
router.get('/media', getMedia);
router.post('/media', upload.single('file'), createMedia);
router.delete('/media/:id', deleteMedia);

// Settings
router.get('/settings', getSettings);
router.post('/settings', upload.single('logo'), updateSettings);

// Site Assets
router.get('/assets', getAssets);
router.post('/assets', upload.single('image'), updateAsset);

// Teams
router.get('/teams', getTeams);
router.put('/teams/:id/image', upload.single('image'), updateTeamImage);

export default router;
