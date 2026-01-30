import { getMyAdvisedStudentsService } from '../services/teacher.service.js';

export const getMyAdvisedStudents = async (req, res) => {
  try {
    const {
      schoolYearId,
      gradeLevelId,
      sectionId,
      status,
      q,
      page,
      limit,
    } = req.query;

    const result = await getMyAdvisedStudentsService({
      currentUserId: req.user.id,
      schoolYearId,
      gradeLevelId,
      sectionId,
      status,
      q,
      page,
      limit,
    });

    res.json({
      success: true,
      message: 'Advised students fetched successfully',
      ...result, // data, count, page, limit
    });
  } catch (error) {
    const map = {
      FORBIDDEN: {
        status: 403,
        message: 'You are not allowed to view these students',
      },
      NO_ACTIVE_SCHOOL_YEAR: {
        status: 400,
        message: 'No active school year found',
      },
    };

    const err = map[error.message];

    res.status(err?.status || 500).json({
      success: false,
      message: err?.message || 'Failed to fetch advised students',
    });
  }
};
