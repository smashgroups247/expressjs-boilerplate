import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './core/config/env';
import { errorHandler } from './api/v1/middlewares/errorHandler.middleware';
import { v1Router } from './api/v1/routes';
import { logger } from './monitoring/logger';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// API Routes
app.use('/api/v1', v1Router);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

const PORT = config.port || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
