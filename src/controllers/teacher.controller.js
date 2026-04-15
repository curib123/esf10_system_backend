import { getMyAdvisedStudentsService } from '../services/teacher.service.js';
import { sendError } from '../utils/http.util.js';
import { getAuthenticatedUserId } from '../utils/request.util.js';

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
      currentUserId: getAuthenticatedUserId(req),
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
    sendError(res, error, 'Failed to fetch advised students');
  }
};
