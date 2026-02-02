import {
  getAllowedGradingPeriodsService,
  getFinalGradesByEnrollmentService,
  getGradesByEnrollmentService,
  getQuarterSummaryService,
  getReportCardService,
  upsertGradesService,
} from '../services/grades.service.js';

/* =========================
   ERROR MAPPING
========================= */
const ERROR_MAP = {
  ENROLLMENT_NOT_FOUND: { status: 404, message: 'Enrollment not found' },
  NOT_SECTION_ADVISER: { status: 403, message: 'Only the section adviser can encode grades' },
  ENROLLMENT_NOT_ACTIVE: { status: 400, message: 'Enrollment is not active' },
  INVALID_GRADING_PERIOD: { status: 400, message: 'Invalid grading period' },
  INVALID_GRADE_VALUE: { status: 400, message: 'Grade must be a number between 0 and 100' },
  INVALID_SUBJECT_FOR_ENROLLMENT: { status: 400, message: 'Subject does not belong to this enrollment' },
  DUPLICATE_SUBJECT_PERIOD: { status: 400, message: 'Duplicate subject and period detected' },
  FINAL_NOT_EDITABLE: { status: 400, message: 'Final grades are auto-computed and cannot be edited' },
  EMPTY_GRADES_PAYLOAD: { status: 400, message: 'No grades provided' },
  INVALID_GRADE_PAYLOAD: { status: 400, message: 'Invalid grade payload structure' },
  FORBIDDEN: { status: 403, message: 'You do not have permission to access these grades' },
  SECTION_NOT_FOUND: { status: 404, message: 'Section not found' },
};

const handleError = (res, error) => {
  const mapped = ERROR_MAP[error.message];
  if (mapped) {
    return res.status(mapped.status).json({
      success: false,
      message: mapped.message,
      code: error.message,
    });
  }
  console.error('Grades error:', error);
  return res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
  });
};

/* =========================
   GET ALLOWED GRADING PERIODS
========================= */
export const getAllowedGradingPeriods = async (req, res) => {
  try {
    const periods = await getAllowedGradingPeriodsService();

    res.json({
      success: true,
      message: 'Grading configuration fetched successfully',
      data: periods,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/* =========================
   VIEW GRADES BY ENROLLMENT
========================= */
export const getGradesByEnrollment = async (req, res) => {
  try {
    const grades = await getGradesByEnrollmentService({
      enrollmentId: Number(req.params.enrollmentId),
      currentUserId: req.user.id,
      permissions: req.user.permissions || [],
    });

    res.json({
      success: true,
      data: grades,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/* =========================
   VIEW FINAL GRADES BY ENROLLMENT
========================= */
export const getFinalGradesByEnrollment = async (req, res) => {
  try {
    const grades = await getFinalGradesByEnrollmentService({
      enrollmentId: Number(req.params.enrollmentId),
      currentUserId: req.user.id,
      permissions: req.user.permissions || [],
    });

    res.json({
      success: true,
      data: grades,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/* =========================
   GET FULL REPORT CARD
========================= */
export const getReportCard = async (req, res) => {
  try {
    const reportCard = await getReportCardService({
      enrollmentId: Number(req.params.enrollmentId),
      currentUserId: req.user.id,
      permissions: req.user.permissions || [],
    });

    res.json({
      success: true,
      data: reportCard,
    });
  } catch (error) {
    handleError(res, error);
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
      });
    }

    const summary = await getQuarterSummaryService({
      sectionId: Number(sectionId),
      subjectId: Number(subjectId),
      period,
      currentUserId: req.user.id,
    });

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/* =========================
   ENCODE / UPDATE GRADES
========================= */
export const upsertGrades = async (req, res) => {
  try {
    const enrollmentId = Number(req.params.enrollmentId);
    const { grades } = req.body;

    await upsertGradesService({
      enrollmentId,
      grades,
      currentUserId: req.user.id,
    });

    res.json({
      success: true,
      message: 'Grades saved successfully. Final grades auto-computed.',
    });
  } catch (error) {
    handleError(res, error);
  }
};