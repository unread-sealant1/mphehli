const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getDB } = require('../config/db');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDB();

    const user = await db.collection('admins').findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Temporary setup route to create the first admin user
router.post('/setup-admin', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const db = getDB();

    const existingUser = await db.collection('admins').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Admin user already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection('admins').insertOne({
      name,
      email,
      password: hashedPassword,
      role: 'Super Admin',
      status: 'active',
      createdAt: new Date()
    });

    res.json({ success: true, message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
