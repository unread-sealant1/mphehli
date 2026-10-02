import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth.routes';
import publicRoutes from './routes/public';
import { authenticateJWT, authorizeRole } from './middleware/auth.middleware';
import env from './config/env';

dotenv.config();

const app = express();
const port = parseInt(env.PORT);

app.use(cors({
  origin: ['http://localhost:8443', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api', routes);
app.use('/api/public', publicRoutes);
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin', authenticateJWT, authorizeRole(['ADMIN', 'STAFF']), adminRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the MPHEHLI ALL STARS API Server');
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`🩺 Health check: http://localhost:${port}/api/health`);
  console.log(`🛠️ Admin Players: http://localhost:${port}/api/admin/players`);
});
