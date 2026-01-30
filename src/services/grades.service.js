import { db } from '../configs/db.config.js';

/* =========================
   GET GRADES BY ENROLLMENT
========================= */
export const getGradesByEnrollmentService = async ({
  enrollmentId,
  currentUserId,
  permissions,
}) => {
  const enrollment = await db.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      section: { select: { adviserId: true } },
    },
  });

  if (!enrollment) throw new Error('ENROLLMENT_NOT_FOUND');

  const isAdviser = enrollment.section?.adviserId === currentUserId;
  const canView = permissions.includes('grades.view');

  if (!isAdviser && !canView) {
    throw new Error('FORBIDDEN');
  }

  return db.grade.findMany({
    where: { enrollmentId },
    include: {
      subject: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
    orderBy: [
      { subjectId: 'asc' },
      { period: 'asc' },
    ],
  });
};

/* =========================
   CREATE / UPDATE GRADES
========================= */
export const upsertGradesService = async ({
  enrollmentId,
  grades,
  currentUserId,
}) => {
  const enrollment = await db.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      section: { select: { adviserId: true } },
    },
  });

  if (!enrollment) throw new Error('ENROLLMENT_NOT_FOUND');

  if (enrollment.section?.adviserId !== currentUserId) {
    throw new Error('NOT_SECTION_ADVISER');
  }

  if (enrollment.status !== 'ACTIVE') {
    throw new Error('ENROLLMENT_NOT_ACTIVE');
  }

  const operations = grades.map(g =>
    db.grade.upsert({
      where: {
        enrollmentId_subjectId_period: {
          enrollmentId,
          subjectId: g.subjectId,
          period: g.period,
        },
      },
      update: {
        value: g.value,
        source: 'SYSTEM',
      },
      create: {
        enrollmentId,
        subjectId: g.subjectId,
        period: g.period,
        value: g.value,
        source: 'SYSTEM',
      },
    })
  );

  return db.$transaction(operations);
};
