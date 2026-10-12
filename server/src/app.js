import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { env } from './config/env.js';
import { pool } from './db/pool.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import skillProofRoutes from './routes/skillProofRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
let sessionStore;
if (env.DATABASE_URL && !env.DATABASE_URL.includes('localhost:5432') && !env.DATABASE_URL.includes('127.0.0.1:5432')) {
  try {
    sessionStore = new (connectPgSimple(session))({ pool, createTableIfMissing: true });
  } catch {
    sessionStore = new session.MemoryStore();
  }
} else {
  sessionStore = new session.MemoryStore();
}

app.use(session({
  store: sessionStore,
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 }
}));
app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    if (!res.headersSent) res.status(408).json({ error: { message: 'Request timeout', statusCode: 408 } });
  });
  next();
});

// API Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', catalogRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/roadmaps', roadmapRoutes);
app.use('/api/v1', progressRoutes);
app.use('/api/v1', skillProofRoutes);

// Catch unmatched /api routes
app.use(notFound);
app.use(errorHandler);

export default app;
