import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../server/routes/auth.js';
import aiRoutes from '../server/routes/ai.js';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MEDITRACK Express API',
    time: new Date().toISOString(),
  });
});

export default app;
