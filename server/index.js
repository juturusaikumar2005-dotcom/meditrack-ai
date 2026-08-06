import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow frontend origin (configurable via env) or localhost in dev
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://meditrack-ai.com',
  'https://meditrack-ai.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o.replace('https://', '').replace('http://', '')))) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev; tighten in prod
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MEDITRACK AI API',
    version: '1.0.0',
    time: new Date().toISOString(),
    aiProviders: {
      gemini: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? 'configured' : 'not configured',
      openrouter: process.env.OPENROUTER_API_KEY ? 'configured' : 'fallback mode',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.message || err);
  res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
});

app.listen(PORT, () => {
  console.log(`MEDITRACK Express API Server running on port ${PORT}`);
  console.log(`Gemini API: ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? 'Active' : 'Not configured (OpenRouter fallback enabled)'}`);
  console.log(`OpenRouter API: ${process.env.OPENROUTER_API_KEY ? 'Active' : 'Using built-in fallback key'}`);
});
