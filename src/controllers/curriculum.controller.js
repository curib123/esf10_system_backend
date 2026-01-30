import * as curriculumService from '../services/curriculum.service.js';

/* =========================
   CURRICULUM
========================= */

/**
 * Create curriculum (program name)
 */
export const createCurriculum = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Curriculum name is required',
      });
    }

    const curriculum = await curriculumService.createCurriculum(name);

    return res.status(201).json({
      success: true,
      message: 'Curriculum created successfully',
      data: curriculum,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Rename curriculum (SAFE – label only)
 */
export const renameCurriculum = async (req, res) => {
  try {
    const curriculumId = Number(req.params.curriculumId);
    const { name } = req.body;

    if (!curriculumId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid curriculumId',
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Curriculum name is required',
      });
    }

    const curriculum = await curriculumService.renameCurriculum(
      curriculumId,
      name
    );

    return res.json({
      success: true,
      message: 'Curriculum renamed successfully',
      data: curriculum,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get curricula with pagination, search, and filters
 */
export const getCurricula = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      hasActiveVersion,
    } = req.query;

    const result = await curriculumService.getCurricula({
      page: Number(page),
      limit: Number(limit),
      search,
      hasActiveVersion:
        hasActiveVersion !== undefined
          ? hasActiveVersion === 'true'
          : undefined,
    });

    return res.json({
      success: true,
      message: 'Curricula retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   CURRICULUM VERSION
========================= */

/**
 * Create curriculum version
 */
export const createCurriculumVersion = async (req, res) => {
  try {
    const curriculumId = Number(req.params.curriculumId);
    const { name, effectiveFrom } = req.body;

    if (!curriculumId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid curriculumId',
      });
    }

    if (!name || !effectiveFrom) {
      return res.status(400).json({
        success: false,
        message: 'name and effectiveFrom are required',
      });
    }

    const version = await curriculumService.createCurriculumVersion(
      curriculumId,
      name,
      effectiveFrom
    );

    return res.status(201).json({
      success: true,
      message: 'Curriculum version created successfully',
      data: version,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Rename curriculum version
 * ⚠️ DISPLAY ONLY – service blocks if already used by enrollments
 */
export const renameCurriculumVersion = async (req, res) => {
  try {
    const versionId = Number(req.params.versionId);
    const { name } = req.body;

    if (!versionId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid versionId',
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Version name is required',
      });
    }

    const version = await curriculumService.renameCurriculumVersion(
      versionId,
      name
    );

    return res.json({
      success: true,
      message: 'Curriculum version renamed successfully',
      data: version,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get curriculum versions (no pagination by design)
 */
export const getCurriculumVersions = async (req, res) => {
  try {
    const curriculumId = Number(req.params.curriculumId);

    if (!curriculumId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid curriculumId',
      });
    }

    const versions = await curriculumService.getCurriculumVersions(curriculumId);

    return res.json({
      success: true,
      message: 'Curriculum versions retrieved successfully',
      data: versions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Close curriculum version
 */
export const closeCurriculumVersion = async (req, res) => {
  try {
    const versionId = Number(req.params.versionId);

    if (!versionId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid versionId',
      });
    }

    const version = await curriculumService.closeCurriculumVersion(versionId);

    return res.json({
      success: true,
      message: 'Curriculum version closed successfully',
      data: version,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
