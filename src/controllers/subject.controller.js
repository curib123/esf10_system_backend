import {
  createSubjectService,
  getSubjectByIdService,
  getSubjectsService,
  updateSubjectService,
} from '../services/subject.service.js';

/* =========================
   CREATE
========================= */
export const createSubject = async (req, res) => {
  try {
    const {
      curriculumVersionId,
      gradeLevelId,
      code,
      name,
    } = req.body;

    if (!curriculumVersionId || !gradeLevelId || !code || !name) {
      return res.status(400).json({
        success: false,
        message: 'curriculumVersionId, gradeLevelId, code, and name are required',
      });
    }

    const subject = await createSubjectService({
      curriculumVersionId,
      gradeLevelId,
      code,
      name,
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Subject code already exists for this grade level and curriculum version',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create subject',
    });
  }
};

/* =========================
   READ ALL
========================= */
export const getSubjects = async (req, res) => {
  try {
    const result = await getSubjectsService(req.query);

    res.json({
      success: true,
      message: 'Subjects fetched successfully',
      ...result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects',
    });
  }
};

/* =========================
   READ ONE
========================= */
export const getSubjectById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const subject = await getSubjectByIdService(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    res.json({
      success: true,
      message: 'Subject fetched successfully',
      data: subject,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subject',
    });
  }
};

/* =========================
   UPDATE
========================= */
export const updateSubject = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { code, name } = req.body;

    const data = {
      ...(code && { code: code.trim() }),
      ...(name && { name: name.trim() }),
    };

    const subject = await updateSubjectService(id, data);

    res.json({
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update subject',
    });
  }
};
