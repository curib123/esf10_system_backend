import { db } from '../configs/db.config.js';
import { createHttpError } from '../utils/http.util.js';
import { uploadFile } from '../utils/cloudinaryUpload.js';

const getPagination = (page = 1, limit = 20) => {
  const take = Math.min(Number(limit), 100);
  const skip = (Number(page) - 1) * take;
  return { take, skip };
};

const ensureStudentExists = async (studentId) => {
  const student = await db.student.findFirst({
    where: {
      id: studentId,
      deletedAt: null,
    },
    select: {
      id: true,
      lrn: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!student) {
    throw createHttpError(404, 'Student not found', 'STUDENT_NOT_FOUND');
  }

  return student;
};

const ensureEnrollmentExists = async (enrollmentId, studentId) => {
  if (!enrollmentId) return null;

  const enrollment = await db.enrollment.findFirst({
    where: {
      id: enrollmentId,
      studentId,
      deletedAt: null,
    },
    select: {
      id: true,
      studentId: true,
      schoolYearId: true,
      gradeLevelId: true,
    },
  });

  if (!enrollment) {
    throw createHttpError(
      400,
      'Enrollment does not belong to the selected student',
      'INVALID_ENROLLMENT_FOR_STUDENT'
    );
  }

  return enrollment;
};

const resolveDocumentUrl = async ({ file, fileUrl, studentId }) => {
  if (fileUrl) return fileUrl;
  if (!file) {
    throw createHttpError(
      400,
      'A document file or fileUrl is required',
      'DOCUMENT_FILE_REQUIRED'
    );
  }

  return uploadFile(file, `students/${studentId}/documents`, 'raw');
};

export const createDocumentService = async ({
  studentId,
  enrollmentId,
  type,
  file,
  fileUrl,
}) => {
  const student = await ensureStudentExists(studentId);
  const enrollment = await ensureEnrollmentExists(enrollmentId, studentId);
  const resolvedFileUrl = await resolveDocumentUrl({
    file,
    fileUrl,
    studentId,
  });

  return db.document.create({
    data: {
      studentId: student.id,
      enrollmentId: enrollment?.id,
      type,
      fileUrl: resolvedFileUrl,
    },
    include: {
      student: {
        select: {
          id: true,
          lrn: true,
          firstName: true,
          lastName: true,
        },
      },
      enrollment: {
        select: {
          id: true,
          schoolYearId: true,
          gradeLevelId: true,
        },
      },
    },
  });
};

export const getDocumentsService = async ({
  page = 1,
  limit = 20,
  studentId,
  enrollmentId,
  type,
  includeDeleted = false,
}) => {
  const { take, skip } = getPagination(page, limit);
  const where = {
    ...(includeDeleted ? {} : { deletedAt: null }),
    ...(studentId ? { studentId: Number(studentId) } : {}),
    ...(enrollmentId ? { enrollmentId: Number(enrollmentId) } : {}),
    ...(type ? { type } : {}),
  };

  const [data, count] = await Promise.all([
    db.document.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            lrn: true,
            firstName: true,
            lastName: true,
          },
        },
        enrollment: {
          select: {
            id: true,
            schoolYear: {
              select: {
                id: true,
                year: true,
              },
            },
          },
        },
      },
      orderBy: { uploadedAt: 'desc' },
      skip,
      take,
    }),
    db.document.count({ where }),
  ]);

  return {
    data,
    count,
    page: Number(page),
    limit: Number(limit),
  };
};

export const getDocumentByIdService = async (id) => {
  const document = await db.document.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          lrn: true,
          firstName: true,
          middleName: true,
          lastName: true,
        },
      },
      enrollment: {
        include: {
          schoolYear: true,
          gradeLevel: true,
          section: true,
        },
      },
    },
  });

  if (!document || document.deletedAt) {
    throw createHttpError(404, 'Document not found', 'DOCUMENT_NOT_FOUND');
  }

  return document;
};

export const deleteDocumentService = async (id) => {
  const document = await db.document.findUnique({
    where: { id },
  });

  if (!document || document.deletedAt) {
    throw createHttpError(404, 'Document not found', 'DOCUMENT_NOT_FOUND');
  }

  return db.document.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};
