import {
  getGradesByEnrollmentService,
  upsertGradesService,
} from '../services/grades.service.js';

/* =========================
   VIEW GRADES
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
    };

    res.status(403).json({
      success: false,
      message: map[error.message] || 'Failed to save grades',
    });
  }
};
