import {
  getAllowedGradingPeriodsService,
  getFinalGradesByEnrollmentService,
  getGradesByEnrollmentService,
  getQuarterSummaryService,
  getReportCardService,
  upsertGradesService,
} from '../services/grades.service.js';
import { sendError } from '../utils/http.util.js';
import {
  getAuthenticatedUserId,
  parsePositiveInt,
} from '../utils/request.util.js';

/* =========================
   GET ALLOWED GRADING PERIODS
========================= */
export const getAllowedGradingPeriods = async (_req, res) => {
  try {
    const periods = await getAllowedGradingPeriodsService();

    res.json({
      success: true,
      message: 'Grading configuration fetched successfully',
      data: periods,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch grading configuration');
  }
};

/* =========================
   VIEW GRADES BY ENROLLMENT
========================= */
export const getGradesByEnrollment = async (req, res) => {
  try {
    const grades = await getGradesByEnrollmentService({
      enrollmentId: parsePositiveInt(req.params.enrollmentId, 'enrollmentId'),
      currentUserId: getAuthenticatedUserId(req),
      permissions: req.user.permissions || [],
    });

    res.json({
      success: true,
      data: grades,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch grades');
  }
};

/* =========================
   VIEW FINAL GRADES BY ENROLLMENT
========================= */
export const getFinalGradesByEnrollment = async (req, res) => {
  try {
    const grades = await getFinalGradesByEnrollmentService({
      enrollmentId: parsePositiveInt(req.params.enrollmentId, 'enrollmentId'),
      currentUserId: getAuthenticatedUserId(req),
      permissions: req.user.permissions || [],
    });

    res.json({
      success: true,
      data: grades,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch final grades');
  }
};

/* =========================
   GET FULL REPORT CARD
========================= */
export const getReportCard = async (req, res) => {
  try {
    const reportCard = await getReportCardService({
      enrollmentId: parsePositiveInt(req.params.enrollmentId, 'enrollmentId'),
      currentUserId: getAuthenticatedUserId(req),
      permissions: req.user.permissions || [],
    });

    res.json({
      success: true,
      data: reportCard,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch report card');
  }
};

/* =========================
   GET QUARTER SUMMARY (CLASS STATS)
========================= */
export const getQuarterSummary = async (req, res) => {
  try {
    const { sectionId, subjectId, period } = req.query;

    if (!sectionId || !subjectId || !period) {
      return res.status(400).json({
        success: false,
        message: 'sectionId, subjectId, and period are required',
        code: 'INVALID_QUERY',
      });
    }

    const summary = await getQuarterSummaryService({
      sectionId: parsePositiveInt(sectionId, 'sectionId'),
      subjectId: parsePositiveInt(subjectId, 'subjectId'),
      period,
      currentUserId: getAuthenticatedUserId(req),
    });

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch quarter summary');
  }
};

/* =========================
   ENCODE / UPDATE GRADES
========================= */
export const upsertGrades = async (req, res) => {
  try {
    const enrollmentId = parsePositiveInt(req.params.enrollmentId, 'enrollmentId');
    const { grades } = req.body;
    const currentUserId = getAuthenticatedUserId(req);

    await upsertGradesService({
      enrollmentId,
      grades,
      currentUserId,
    });

    res.json({
      success: true,
      message: 'Grades saved successfully. Final grades auto-computed.',
    });
  } catch (error) {
    sendError(res, error, 'Failed to save grades');
  }
};
