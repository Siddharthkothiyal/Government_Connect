import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino-http';
import dotenv from 'dotenv';

import authRoutes from './modules/auth/auth.routes';
import schemesRoutes from './modules/schemes/schemes.routes';
import eligibilityRoutes from './modules/eligibility/eligibility.routes';
import aiRoutes from './modules/ai/ai.routes';
import chatRoutes from './modules/chat/chat.routes';
import adminRoutes from './modules/admin/admin.routes';
import usersRoutes from './modules/users/users.routes';

import { errorHandler, notFoundHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' },
});

app.use(pino());
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
