import {
  createGradeLevelService,
  getGradeLevelByIdService,
  getGradeLevelsService,
  toggleGradeLevelStatusService,
  updateGradeLevelService,
} from '../services/gradeLevel.service.js';

/* =========================
   CREATE
========================= */
export const createGradeLevel = async (req, res) => {
  try {
    const { code, name, order } = req.body;

    if (!code || !name || order === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Code, name, and order are required',
      });
    }

    const gradeLevel = await createGradeLevelService({
      code,
      name,
      order,
    });

    res.status(201).json({
      success: true,
      message: 'Grade level created successfully',
      data: gradeLevel,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Grade level code already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create grade level',
    });
  }
};

/* =========================
   READ ALL
========================= */
export const getGradeLevels = async (req, res) => {
  try {
    const result = await getGradeLevelsService(req.query);

    res.json({
      success: true,
      message: 'Grade levels fetched successfully',
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grade levels',
    });
  }
};

/* =========================
   READ ONE
========================= */
export const getGradeLevelById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const gradeLevel = await getGradeLevelByIdService(id);

    if (!gradeLevel) {
      return res.status(404).json({
        success: false,
        message: 'Grade level not found',
      });
    }

    res.json({
      success: true,
      message: 'Grade level fetched successfully',
      data: gradeLevel,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grade level',
    });
  }
};

/* =========================
   UPDATE
========================= */
export const updateGradeLevel = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { code, name, order, isActive } = req.body;

    const data = {
      ...(code && { code: code.trim() }),
      ...(name && { name: name.trim() }),
      ...(order !== undefined && { order: Number(order) }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    };

    const gradeLevel = await updateGradeLevelService(id, data);

    res.json({
      success: true,
      message: 'Grade level updated successfully',
      data: gradeLevel,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Grade level not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update grade level',
    });
  }
};

/* =========================
   TOGGLE STATUS
========================= */
export const toggleGradeLevelStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const updated = await toggleGradeLevelStatusService(id);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Grade level not found',
      });
    }

    res.json({
      success: true,
      message: 'Grade level status updated successfully',
      data: updated,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle grade level status',
    });
  }
};
