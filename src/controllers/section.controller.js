import {
  createSectionService,
  deleteSectionService,
  getSectionByIdService,
  getSectionsService,
  updateSectionService,
} from '../services/section.service.js';

/* =========================
   CREATE
========================= */
export const createSection = async (req, res) => {
  try {
    const { name, gradeLevelId, schoolYearId, adviserId } = req.body;

    if (!name || !gradeLevelId || !schoolYearId) {
      return res.status(400).json({
        success: false,
        message: 'Name, grade level, and school year are required',
      });
    }

    const section = await createSectionService({
      name,
      gradeLevelId,
      schoolYearId,
      adviserId,
    });

    res.status(201).json({
      success: true,
      message: 'Section created successfully',
      data: section,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Section already exists for this grade level and school year',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create section',
    });
  }
};

/* =========================
   READ ALL
========================= */
export const getSections = async (req, res) => {
  try {
    const result = await getSectionsService(req.query);

    res.json({
      success: true,
      message: 'Sections fetched successfully',
      ...result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sections',
    });
  }
};

/* =========================
   READ ONE
========================= */
export const getSectionById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const section = await getSectionByIdService(id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    res.json({
      success: true,
      message: 'Section fetched successfully',
      data: section,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch section',
    });
  }
};

/* =========================
   UPDATE
========================= */
export const updateSection = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, adviserId } = req.body;

    const section = await updateSectionService(id, {
      ...(name && { name: name.trim() }),
      ...(adviserId !== undefined && { adviserId }),
    });

    res.json({
      success: true,
      message: 'Section updated successfully',
      data: section,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to update section',
    });
  }
};

/* =========================
   DELETE
========================= */
export const deleteSection = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await deleteSectionService(id);

    res.json({
      success: true,
      message: 'Section deleted successfully',
    });
  } catch (error) {
    if (error.message === 'SECTION_IN_USE') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete section with enrolled students',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete section',
    });
  }
};
