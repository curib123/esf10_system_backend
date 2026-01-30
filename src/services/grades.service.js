import { db } from '../configs/db.config.js';

/* =========================
   CONSTANTS
========================= */
export const ALLOWED_PERIODS = ['Q1', 'Q2', 'Q3', 'Q4'];
export const FINAL_PERIOD = 'FINAL';

/* =========================
   GET ALLOWED GRADING PERIODS
   (for dropdowns / UI)
========================= */
export const getAllowedGradingPeriodsService = async () => {
  return {
    editable: ALLOWED_PERIODS,
    final: FINAL_PERIOD,
    finalEditable: false,
  };
};

/* =========================
   CREATE / UPDATE GRADES
   (Adviser only, hardened)
========================= */
export const upsertGradesService = async ({
  enrollmentId,
  grades,
  currentUserId,
}) => {
  /* =========================
     LOAD ENROLLMENT + OWNERSHIP
  ========================= */
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

  if (!Array.isArray(grades) || grades.length === 0) {
    throw new Error('EMPTY_GRADES_PAYLOAD');
  }

  /* =========================
     VALIDATE PAYLOAD
  ========================= */
  const seen = new Set();

  for (const g of grades) {
    if (!g.subjectId || !g.period || g.value === undefined) {
      throw new Error('INVALID_GRADE_PAYLOAD');
    }

    // ❌ FINAL is computed, never encoded
    if (g.period === FINAL_PERIOD) {
      throw new Error('FINAL_NOT_EDITABLE');
    }

    if (!ALLOWED_PERIODS.includes(g.period)) {
      throw new Error('INVALID_GRADING_PERIOD');
    }

    if (typeof g.value !== 'number' || g.value < 0 || g.value > 100) {
      throw new Error('INVALID_GRADE_VALUE');
    }

    const key = `${g.subjectId}-${g.period}`;
    if (seen.has(key)) {
      throw new Error('DUPLICATE_SUBJECT_PERIOD');
    }
    seen.add(key);
  }

  /* =========================
     VALIDATE SUBJECT OWNERSHIP
  ========================= */
  const subjectIds = [...new Set(grades.map(g => g.subjectId))];

  const validSubjects = await db.subject.findMany({
    where: {
      id: { in: subjectIds },
      curriculumVersionId: enrollment.curriculumVersionId,
      gradeLevelId: enrollment.gradeLevelId,
    },
    select: { id: true },
  });

  if (validSubjects.length !== subjectIds.length) {
    throw new Error('INVALID_SUBJECT_FOR_ENROLLMENT');
  }

  /* =========================
     UPSERT GRADES (ATOMIC)
  ========================= */
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

/* =========================
   GET GRADES BY ENROLLMENT
   (Adviser OR Admin)
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
        select: { id: true, code: true, name: true },
      },
    },
    orderBy: [
      { subjectId: 'asc' },
      { period: 'asc' },
    ],
  });
};

/* =========================
   GET FINAL GRADES (COMPUTED)
========================= */
export const getFinalGradesByEnrollmentService = async ({
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

  const grades = await db.grade.findMany({
    where: {
      enrollmentId,
      period: { in: ALLOWED_PERIODS },
    },
    include: {
      subject: { select: { id: true, code: true, name: true } },
    },
  });

  /* =========================
     GROUP & COMPUTE FINAL
  ========================= */
  const grouped = {};

  for (const g of grades) {
    grouped[g.subjectId] ||= {
      subject: g.subject,
      values: [],
    };
    grouped[g.subjectId].values.push(g.value);
  }

  return Object.values(grouped)
    .filter(g => g.values.length === ALLOWED_PERIODS.length)
    .map(g => ({
      subject: g.subject,
      period: FINAL_PERIOD,
      value: Number(
        (
          g.values.reduce((a, b) => a + b, 0) /
          ALLOWED_PERIODS.length
        ).toFixed(2)
      ),
    }));
};
