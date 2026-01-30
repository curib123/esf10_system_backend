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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advised students',
    });
  }
};
