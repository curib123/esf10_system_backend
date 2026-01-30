import {
  archiveStudentService,
  createStudentService,
  getStudentByIdService,
  getStudentsService,
  updateStudentService,
} from '../services/student.service.js';

/* =========================
   CREATE
========================= */
export const createStudent = async (req, res) => {
  try {
    const {
      lrn,
      firstName,
      middleName,
      lastName,
      gender,
      birthDate,
      address,
    } = req.body;

    if (!lrn || !firstName || !lastName || !gender || !birthDate || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const student = await createStudentService({
      lrn: lrn.trim(),
      firstName: firstName.trim(),
      middleName: middleName?.trim(),
      lastName: lastName.trim(),
      gender,
      birthDate: new Date(birthDate),
      address: address.trim(),
    });

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'LRN already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create student',
    });
  }
};

/* =========================
   READ ALL
========================= */
export const getStudents = async (req, res) => {
  try {
    const result = await getStudentsService(req.query);

    res.json({
      success: true,
      ...result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
    });
  }
};

/* =========================
   READ ONE
========================= */
export const getStudentById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const student = await getStudentByIdService(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
    });
  }
};

/* =========================
   UPDATE
========================= */
export const updateStudent = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const student = await updateStudentService(id, req.body);

    res.json({
      success: true,
      message: 'Student updated',
      data: student,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update student',
    });
  }
};

/* =========================
   ARCHIVE
========================= */
export const archiveStudent = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await archiveStudentService(id);

    res.json({
      success: true,
      message: 'Student archived',
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to archive student',
    });
  }
};
