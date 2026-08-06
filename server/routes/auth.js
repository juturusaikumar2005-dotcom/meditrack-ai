import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'meditrack_default_jwt_secret_key_change_in_production';

// In-memory mock database store (Ready for MongoDB Atlas or Supabase PostgreSQL connection)
const usersDb = new Map();

// Default demo user profile
const demoHashedPassword = await bcrypt.hash('password123', 10);
usersDb.set('demo@hospital.com', {
  id: 'usr-demo-001',
  email: 'demo@hospital.com',
  passwordHash: demoHashedPassword,
  full_name: 'Dr. Sarah Jenkins',
  role: 'doctor',
  created_at: new Date().toISOString(),
});

// Zod Validation Schemas
const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  role: z.enum(['patient', 'doctor', 'admin', 'lab']).default('doctor'),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * @route POST /api/auth/register
 * @desc Register user with bcrypt hashing and JWT token generation
 */
router.post('/register', async (req, res) => {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { email, password, fullName, role } = parseResult.data;

    if (usersDb.has(email.toLowerCase())) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr-${Date.now()}`,
      email: email.toLowerCase(),
      passwordHash,
      full_name: fullName,
      role,
      created_at: new Date().toISOString(),
    };

    usersDb.set(email.toLowerCase(), newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userProfile } = newUser;

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: userProfile,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Authenticate user with bcrypt hash check & issue JWT
 */
router.post('/login', async (req, res) => {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { email, password } = parseResult.data;
    const user = usersDb.get(email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userProfile } = user;

    return res.json({
      message: 'Sign in successful',
      token,
      user: userProfile,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current authenticated user profile using Bearer JWT token
 */
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = usersDb.get(decoded.email);

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const { passwordHash: _, ...userProfile } = user;
    return res.json({ user: userProfile });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;
