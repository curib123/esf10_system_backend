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

export const handleError = (res, error, debug = {}) => {
  const isDev = process.env.NODE_ENV !== 'production';

  // Known domain errors
  const knownErrors = {
    ENROLLMENT_NOT_FOUND: 404,
    NOT_SECTION_ADVISER: 403,
    ENROLLMENT_NOT_ACTIVE: 409,
    EMPTY_GRADES_PAYLOAD: 400,
    INVALID_GRADE_PAYLOAD: 400,
    INVALID_GRADING_PERIOD: 400,
    FINAL_NOT_EDITABLE: 409,
    DUPLICATE_SUBJECT_PERIOD: 409,
    INVALID_SUBJECT_FOR_ENROLLMENT: 400,
  };

  const status = knownErrors[error.message] || 500;

  res.status(status).json({
    success: false,
    error: error.message || 'INTERNAL_SERVER_ERROR',
    ...(isDev && {
      debug,
    }),
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
  const enrollmentId = Number(req.params.enrollmentId);
  const { grades } = req.body;
  const currentUserId = Number(req.user?.userId);

  if (!currentUserId) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHENTICATED',
      ...(process.env.NODE_ENV !== 'production' && {
        debug: { enrollmentId, reqUser: req.user },
      }),
    });
  }

  try {
    await upsertGradesService({
      enrollmentId,
      grades,
      currentUserId,
    });

    res.json({
      success: true,
      message: 'Grades saved successfully. Final grades auto-computed.',
      ...(process.env.NODE_ENV !== 'production' && {
        debug: { enrollmentId, currentUserId },
      }),
    });
  } catch (error) {
    handleError(res, error, {
      enrollmentId,
      currentUserId,
    });
  }
};

