import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

/* ================= INITIALIZE APP ================= */
const app = express();

/* ================= GLOBAL MIDDLEWARES ================= */
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* ================= HEALTH CHECK ================= */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ESF10 API is running 🚀',
  });
});

/* ================= ROUTES ================= */
// example:
// import teacherRoutes from './routes/teacher.routes.js';
// app.use('/esf10/teachers', teacherRoutes);

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error('🔥 ERROR:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

/* ================= EXPORT APP ================= */
export default app;
