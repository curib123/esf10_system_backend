import {
  getAllowedGradingPeriodsService,
  getGradesByEnrollmentService,
  upsertGradesService,
} from '../services/grades.service.js';

/* =========================
   GET ALLOWED GRADING PERIODS
   (for dropdowns)
========================= */
export const getAllowedGradingPeriods = async (req, res) => {
  try {
    const periods = await getAllowedGradingPeriodsService();

    res.json({
      success: true,
      message: 'Allowed grading periods fetched successfully',
      data: periods,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grading periods',
    });
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
      permissions: req.user.permissions,
    });

    res.json({
      success: true,
      data: grades,
    });
  } catch (error) {
    const map = {
      ENROLLMENT_NOT_FOUND: 'Enrollment not found',
      FORBIDDEN: 'You do not have permission to view grades',
    };

    res.status(403).json({
      success: false,
      message: map[error.message] || 'Failed to fetch grades',
    });
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
      message: 'Grades saved successfully',
    });
  } catch (error) {
    const map = {
      ENROLLMENT_NOT_FOUND: 'Enrollment not found',
      NOT_SECTION_ADVISER: 'Only the section adviser can encode grades',
      ENROLLMENT_NOT_ACTIVE: 'Enrollment is not active',
      INVALID_GRADING_PERIOD: 'Invalid grading period',
      INVALID_GRADE_VALUE: 'Invalid grade value',
      INVALID_SUBJECT_FOR_ENROLLMENT: 'Subject does not belong to this enrollment',
      DUPLICATE_SUBJECT_PERIOD: 'Duplicate subject and period detected',
      FINAL_NOT_EDITABLE: 'Final grades cannot be edited manually',
    };

    res.status(403).json({
      success: false,
      message: map[error.message] || 'Failed to save grades',
    });
  }
};
