import {
  completeEnrollmentService,
  createEnrollmentService,
  getEnrollmentByIdService,
  getEnrollmentsService,
  getSubjectsByEnrollmentService,
  updateEnrollmentService,
} from '../services/enrollment.service.js';

/* =========================
   CREATE
========================= */
export const createEnrollment = async (req, res) => {
  try {
    const {
      studentId,
      schoolYearId,
      curriculumVersionId,
      gradeLevelId,
      sectionId,
    } = req.body;

    const enrollment = await createEnrollmentService({
      studentId,
      schoolYearId,
      curriculumVersionId,
      gradeLevelId,
      sectionId,
    });

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: enrollment,
    });
  } catch (error) {
    const map = {
      SCHOOL_YEAR_NOT_ACTIVE: 'School year is not active',
      CURRICULUM_VERSION_NOT_ACTIVE: 'Curriculum version is not active',
      GRADE_LEVEL_NOT_ACTIVE: 'Grade level is not active',
      INVALID_SECTION: 'Invalid section for selected grade level and school year',
    };

    res.status(400).json({
      success: false,
      message: map[error.message] || 'Failed to create enrollment',
    });
  }
};

/* =========================
   READ ALL
========================= */
export const getEnrollments = async (req, res) => {
  try {
    // sectionId, q, filters handled in service
    const result = await getEnrollmentsService(req.query);

    res.json({
      success: true,
      message: 'Enrollments fetched successfully',
      ...result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
    });
  }
};

/* =========================
   READ ONE
========================= */
export const getEnrollmentById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const enrollment = await getEnrollmentByIdService(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    res.json({
      success: true,
      message: 'Enrollment fetched successfully',
      data: enrollment,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollment',
    });
  }
};

/* =========================
   UPDATE
========================= */
export const updateEnrollment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { sectionId } = req.body;

    const enrollment = await updateEnrollmentService(id, {
      ...(sectionId !== undefined && { sectionId }),
    });

    res.json({
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment,
    });
  } catch (error) {
    const map = {
      INVALID_SECTION: 'Invalid section for selected grade level and school year',
    };

    res.status(400).json({
      success: false,
      message: map[error.message] || 'Failed to update enrollment',
    });
  }
};

/* =========================
   COMPLETE
========================= */
export const completeEnrollment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await completeEnrollmentService(id);

    res.json({
      success: true,
      message: 'Enrollment completed successfully',
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to complete enrollment',
    });
  }
};


export const getSubjectsByEnrollment = async (req, res) => {
  try {
    const subjects = await getSubjectsByEnrollmentService({
      enrollmentId: Number(req.params.id),
      currentUserId: req.user.id,
      permissions: req.user.permissions,
    });

    res.json({
      success: true,
      message: 'Subjects fetched successfully',
      data: subjects,
    });
  } catch (error) {
    const map = {
      ENROLLMENT_NOT_FOUND: 'Enrollment not found',
      FORBIDDEN: 'You do not have permission to view subjects',
    };

    res.status(error.message === 'ENROLLMENT_NOT_FOUND' ? 404 : 403).json({
      success: false,
      message: map[error.message] || 'Failed to fetch subjects',
    });
  }
};