import { db } from '../configs/db.config.js';
import { createHttpError } from '../utils/http.util.js';
import {
  computeSimpleAverage,
  getGradeDescriptor,
  getRemarks,
  roundGrade,
} from './grades.service.js';
import { recordAuditEventService } from './audit.service.js';

const SCHOOL_SETTING_KEYS = [
  'school_name',
  'school_id',
  'school_address',
  'school_district',
  'school_region',
  'school_principal',
];

const buildSchoolProfile = async () => {
  const settings = await db.systemSetting.findMany({
    where: {
      key: {
        in: SCHOOL_SETTING_KEYS,
      },
    },
  });

  return settings.reduce((accumulator, setting) => {
    accumulator[setting.key] = setting.value;
    return accumulator;
  }, {});
};

const buildEnrollmentRecord = async (enrollment) => {
  const [subjects, documents] = await Promise.all([
    db.subject.findMany({
      where: {
        curriculumVersionId: enrollment.curriculumVersionId,
        gradeLevelId: enrollment.gradeLevelId,
      },
      orderBy: { order: 'asc' },
    }),
    db.document.findMany({
      where: {
        studentId: enrollment.studentId,
        enrollmentId: enrollment.id,
        deletedAt: null,
      },
      orderBy: { uploadedAt: 'asc' },
    }),
  ]);

  const finalGradesBySubjectId = new Map(
    enrollment.grades
      .filter((grade) => grade.period === 'FINAL')
      .map((grade) => [grade.subjectId, grade])
  );

  const subjectsWithGrades = subjects.map((subject) => {
    const finalGrade = finalGradesBySubjectId.get(subject.id);
    const rounded = finalGrade ? roundGrade(finalGrade.value) : null;

    return {
      subjectId: subject.id,
      code: subject.code,
      name: subject.name,
      finalGrade: finalGrade ? finalGrade.value : null,
      roundedFinalGrade: rounded,
      descriptor: rounded !== null ? getGradeDescriptor(rounded) : null,
      remarks: rounded !== null ? getRemarks(rounded) : null,
    };
  });

  const completedFinalGrades = subjectsWithGrades
    .filter((subject) => subject.finalGrade !== null)
    .map((subject) => subject.finalGrade);

  const generalAverage = completedFinalGrades.length > 0
    ? computeSimpleAverage(completedFinalGrades)
    : null;

  return {
    enrollmentId: enrollment.id,
    status: enrollment.status,
    schoolYear: enrollment.schoolYear,
    gradeLevel: enrollment.gradeLevel,
    section: enrollment.section,
    curriculumVersion: enrollment.curriculumVersion,
    subjects: subjectsWithGrades,
    summary: {
      totalSubjects: subjectsWithGrades.length,
      completedSubjects: completedFinalGrades.length,
      generalAverage: generalAverage !== null
        ? {
            value: generalAverage,
            rounded: roundGrade(generalAverage),
            descriptor: getGradeDescriptor(generalAverage),
            remarks: getRemarks(generalAverage),
          }
        : null,
    },
    documents: documents.map((document) => ({
      id: document.id,
      type: document.type,
      fileUrl: document.fileUrl,
      uploadedAt: document.uploadedAt,
    })),
    createdAt: enrollment.createdAt,
    updatedAt: enrollment.updatedAt,
  };
};

export const buildSf10PayloadService = async (studentId) => {
  const student = await db.student.findFirst({
    where: {
      id: studentId,
      deletedAt: null,
    },
    include: {
      enrollments: {
        where: {
          deletedAt: null,
        },
        include: {
          schoolYear: true,
          gradeLevel: true,
          section: true,
          curriculumVersion: {
            include: {
              curriculum: true,
            },
          },
          grades: {
            include: {
              subject: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      documents: {
        where: {
          deletedAt: null,
          enrollmentId: null,
        },
        orderBy: {
          uploadedAt: 'asc',
        },
      },
    },
  });

  if (!student) {
    throw createHttpError(404, 'Student not found', 'STUDENT_NOT_FOUND');
  }

  const schoolProfile = await buildSchoolProfile();
  const academicHistory = await Promise.all(
    student.enrollments.map((enrollment) => buildEnrollmentRecord(enrollment))
  );

  return {
    generatedAt: new Date().toISOString(),
    schoolProfile,
    student: {
      id: student.id,
      lrn: student.lrn,
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      gender: student.gender,
      birthDate: student.birthDate,
      address: student.address,
    },
    studentDocuments: student.documents.map((document) => ({
      id: document.id,
      type: document.type,
      fileUrl: document.fileUrl,
      uploadedAt: document.uploadedAt,
    })),
    academicHistory,
  };
};

export const viewSf10Service = async (studentId) => {
  const payload = await buildSf10PayloadService(studentId);

  await recordAuditEventService({
    action: 'VIEW',
    entity: 'SF10',
    entityId: studentId,
    newValue: {
      studentId,
    },
  });

  return payload;
};

export const generateSf10Service = async (studentId) => {
  const payload = await buildSf10PayloadService(studentId);

  await recordAuditEventService({
    action: 'GENERATE',
    entity: 'SF10',
    entityId: studentId,
    newValue: {
      studentId,
      generatedAt: payload.generatedAt,
    },
  });

  return payload;
};

export const exportSf10Service = async (studentId) => {
  const payload = await buildSf10PayloadService(studentId);

  await recordAuditEventService({
    action: 'EXPORT',
    entity: 'SF10',
    entityId: studentId,
    newValue: {
      studentId,
      generatedAt: payload.generatedAt,
    },
  });

  return payload;
};
