import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import authRoutes from './routes/auth.route.js';

/* ============================
   APP SETUP
============================ */
const app = express();

/* ============================
   GLOBAL MIDDLEWARES
============================ */
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* ============================
   HEALTH CHECK
============================ */
app.get('/', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'ESF10 API is running 🚀',
  });
});

/* ============================
   API ROUTES
============================ */
app.use('/api/auth', authRoutes);

/* ============================
   NOT FOUND
============================ */
app.use((_, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/* ============================
   ERROR HANDLER
============================ */
app.use((err, _req, res, _next) => {
  console.error('🔥 ERROR:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
