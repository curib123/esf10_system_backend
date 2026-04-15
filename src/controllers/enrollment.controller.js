import {
  completeEnrollmentService,
  createEnrollmentService,
  getEnrollmentByIdService,
  getEnrollmentsService,
  getSubjectsByEnrollmentService,
  updateEnrollmentService,
} from '../services/enrollment.service.js';
import { sendError } from '../utils/http.util.js';
import {
  getAuthenticatedUserId,
  parsePositiveInt,
} from '../utils/request.util.js';

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
    sendError(res, error, 'Failed to create enrollment');
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
  } catch (error) {
    sendError(res, error, 'Failed to fetch enrollments');
  }
};

/* =========================
   READ ONE
========================= */
export const getEnrollmentById = async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id, 'enrollmentId');
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
  } catch (error) {
    sendError(res, error, 'Failed to fetch enrollment');
  }
};

/* =========================
   UPDATE
========================= */
export const updateEnrollment = async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id, 'enrollmentId');
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
    sendError(res, error, 'Failed to update enrollment');
  }
};

/* =========================
   COMPLETE
========================= */
export const completeEnrollment = async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id, 'enrollmentId');
    await completeEnrollmentService(id);

    res.json({
      success: true,
      message: 'Enrollment completed successfully',
    });
  } catch (error) {
    sendError(res, error, 'Failed to complete enrollment');
  }
};


export const getSubjectsByEnrollment = async (req, res) => {
  try {
    const subjects = await getSubjectsByEnrollmentService({
      enrollmentId: parsePositiveInt(req.params.id, 'enrollmentId'),
      currentUserId: getAuthenticatedUserId(req),
      permissions: req.user.permissions,
    });

    res.json({
      success: true,
      message: 'Subjects fetched successfully',
      data: subjects,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch subjects');
  }
};
