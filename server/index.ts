import { createServer } from 'http';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { serveStatic } from './vite';
import { setupAuth } from './replitAuth';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

console.log('[SERVER] Starting server setup...');
console.log('[SERVER] PORT:', PORT);
console.log('[SERVER] NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[SERVER] ${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Setup authentication FIRST (this adds session middleware and auth routes)
    console.log('[SERVER] Setting up authentication...');
    await setupAuth(app);

    // API routes - mount other routes under /api
    console.log('[SERVER] Setting up API routes...');
    app.use('/api', routes);

    // Setup Vite in development or serve static files in production
    if (process.env.NODE_ENV === 'production') {
      console.log('[SERVER] Setting up static file serving...');
      serveStatic(app);
    } else {
      console.log('[SERVER] Development mode - Vite will handle static files');
    }

    // Error handling middleware
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('[SERVER] Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    // 404 handler for API routes
    app.use('/api/*', (_req, res) => {
      console.log('[SERVER] 404 - API endpoint not found:', _req.originalUrl);
      res.status(404).json({ error: 'API endpoint not found' });
    });

    console.log('[SERVER] Starting server on port:', PORT);
    server.listen(PORT, () => {
      console.log(`[SERVER] Server running on port ${PORT}`);
      console.log(`[SERVER] Health check: http://localhost:${PORT}/health`);
      console.log(`[SERVER] API base: http://localhost:${PORT}/api`);
      console.log(`[SERVER] Login: http://localhost:${PORT}/api/login`);
    });
  } catch (error) {
    console.error('[SERVER] Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;