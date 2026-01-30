import { db } from '../configs/db.config.js';

/* =========================
   HELPERS
========================= */
const getPagination = (page = 1, limit = 20) => {
  const take = Math.min(Number(limit), 50);
  const skip = (Number(page) - 1) * take;
  return { take, skip };
};

/* =========================
   CREATE ENROLLMENT
========================= */
export const createEnrollmentService = async ({
  studentId,
  schoolYearId,
  curriculumVersionId,
  gradeLevelId,
  sectionId,
}) => {
  // ✅ validate school year is active
  const schoolYear = await db.schoolYear.findFirst({
    where: { id: schoolYearId, isActive: true },
  });
  if (!schoolYear) throw new Error('SCHOOL_YEAR_NOT_ACTIVE');

  // ✅ validate curriculum version is active
  const curriculumVersion = await db.curriculumVersion.findFirst({
    where: { id: curriculumVersionId, effectiveTo: null },
  });
  if (!curriculumVersion) throw new Error('CURRICULUM_VERSION_NOT_ACTIVE');

  // ✅ validate grade level is active
  const gradeLevel = await db.gradeLevel.findFirst({
    where: { id: gradeLevelId, isActive: true },
  });
  if (!gradeLevel) throw new Error('GRADE_LEVEL_NOT_ACTIVE');

  // ✅ validate section belongs to grade level + school year
  if (sectionId) {
    const section = await db.section.findFirst({
      where: {
        id: sectionId,
        gradeLevelId,
        schoolYearId,
      },
    });
    if (!section) throw new Error('INVALID_SECTION');
  }

  return db.enrollment.create({
    data: {
      studentId,
      schoolYearId,
      curriculumVersionId,
      gradeLevelId,
      sectionId,
    },
  });
};

/* =========================
   READ ENROLLMENTS
========================= */
export const getEnrollmentsService = async ({
  page = 1,
  limit = 20,
  schoolYearId,
  gradeLevelId,
  status,
  sectionId,
  q,
}) => {
  const { take, skip } = getPagination(page, limit);

  const where = {
    deletedAt: null,

    ...(schoolYearId && { schoolYearId: Number(schoolYearId) }),
    ...(gradeLevelId && { gradeLevelId: Number(gradeLevelId) }),
    ...(status && { status }),
    ...(sectionId && { sectionId: Number(sectionId) }),

    ...(q && {
      OR: [
        {
          section: {
            name: { contains: q },
          },
        },
        {
          student: {
            OR: [
              { lrn: { contains: q } },
              { firstName: { contains: q } },
              { lastName: { contains: q } },
            ],
          },
        },
      ],
    }),
  };

  const [data, count] = await Promise.all([
    db.enrollment.findMany({
      where,
      skip,
      take,
      orderBy: [
        { gradeLevelId: 'asc' },
        { section: { name: 'asc' } },
        { createdAt: 'asc' },
      ],
      include: {
        student: {
          select: {
            id: true,
            lrn: true,
            firstName: true,
            lastName: true,
          },
        },
        gradeLevel: true,
        schoolYear: true,
        section: {
          select: {
            id: true,
            name: true,
            adviser: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    }),
    db.enrollment.count({ where }),
  ]);

  return {
    data,
    count,
    page: Number(page),
    limit: Number(limit),
  };
};

/* =========================
   READ ONE
========================= */
export const getEnrollmentByIdService = async (id) => {
  return db.enrollment.findUnique({
    where: { id },
    include: {
      student: true,
      gradeLevel: true,
      schoolYear: true,
      curriculumVersion: true,
      section: {
        include: {
          adviser: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

/* =========================
   UPDATE ENROLLMENT
========================= */
export const updateEnrollmentService = async (id, data) => {
  if (data.sectionId) {
    const enrollment = await db.enrollment.findUnique({
      where: { id },
      select: { gradeLevelId: true, schoolYearId: true },
    });

    const section = await db.section.findFirst({
      where: {
        id: data.sectionId,
        gradeLevelId: enrollment.gradeLevelId,
        schoolYearId: enrollment.schoolYearId,
      },
    });

    if (!section) throw new Error('INVALID_SECTION');
  }

  return db.enrollment.update({
    where: { id },
    data,
  });
};

/* =========================
   COMPLETE ENROLLMENT
========================= */
export const completeEnrollmentService = async (id) => {
  return db.enrollment.update({
    where: { id },
    data: { status: 'COMPLETED' },
  });
};
export const getSubjectsByEnrollmentService = async ({
  enrollmentId,
  currentUserId,
}) => {
  const enrollment = await db.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      section: { select: { adviserId: true } },
    },
  });

  if (!enrollment) throw new Error('ENROLLMENT_NOT_FOUND');

  // 🔒 Adviser-only for grading context
  if (enrollment.section?.adviserId !== currentUserId) {
    throw new Error('FORBIDDEN');
  }

  return db.subject.findMany({
    where: {
      curriculumVersionId: enrollment.curriculumVersionId,
      gradeLevelId: enrollment.gradeLevelId,
    },
    select: {
      id: true,
      code: true,
      name: true,
    },
    orderBy: { code: 'asc' },
  });
};
