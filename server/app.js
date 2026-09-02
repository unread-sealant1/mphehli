const express = require('express');
const cors = require('cors');
const path = require('path');
const playerRoutes = require('./routes/playerRoutes');
const fixtureRoutes = require('./routes/fixtureRoutes');
const newsRoutes = require('./routes/newsRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const staffRoutes = require('./routes/staffRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors()); // Allow all origins for development/initial deploy; specify origins in production
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/players', playerRoutes);
app.use('/api/fixtures', fixtureRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Mphehli All Stars API is running'
  });
});

module.exports = app;
