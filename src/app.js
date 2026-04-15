import './configs/env.config.js';

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'node:path';

import authRoutes from './routes/auth.route.js';
import auditRoutes from './routes/audit.route.js';
import curriculumRoutes from './routes/curriculum.route.js';
import documentRoutes from './routes/document.route.js';
import enrollmentRoutes from './routes/enrollment.route.js';
import gradeLevelRoutes from './routes/gradeLevel.route.js';
import gradeRoutes from './routes/grades.route.js';
import permissionRoutes from './routes/permission.route.js';
import { requestContextMiddleware } from './middleware/request-context.middleware.js';
import roleRoutes from './routes/role.route.js';
import schoolYearRoutes from './routes/schoolYear.route.js';
import sectionRoutes from './routes/section.route.js';
import sf10Routes from './routes/sf10.route.js';
import studentRoutes from './routes/student.route.js';
import subjectRoutes from './routes/subject.route.js';
import systemSettingRoutes from './routes/systemSetting.route.js';
import teacherRoutes from './routes/teacher.route.js';
import userRoutes from './routes/user.route.js';
import { LOCAL_UPLOADS_DIR, LOCAL_UPLOADS_ROUTE } from './configs/env.config.js';
import { normalizeError } from './utils/http.util.js';

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
app.use(requestContextMiddleware);
app.use(
  LOCAL_UPLOADS_ROUTE,
  express.static(path.resolve(LOCAL_UPLOADS_DIR))
);

if (!['production', 'test'].includes(process.env.NODE_ENV)) {
  app.use(morgan('dev'));
}

/* ============================
   HEALTH CHECK
============================ */
app.get('/', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'ESF10 API is running',
  });
});

/* ============================
   API ROUTES
============================ */
app.use('/api/auth', authRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/school-years', schoolYearRoutes);
app.use('/api/curricula', curriculumRoutes);
app.use('/api/grade-levels', gradeLevelRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/system-settings', systemSettingRoutes);
app.use('/api/sf10', sf10Routes);

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
  const normalized = normalizeError(err);
  if (normalized.status >= 500) {
    console.error('ERROR:', err);
  }

  res.status(normalized.status).json({
    success: false,
    message: normalized.message,
    code: normalized.code,
    ...(normalized.details ? { details: normalized.details } : {}),
  });
});

export default app;
