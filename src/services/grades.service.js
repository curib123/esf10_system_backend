import { db } from '../configs/db.config.js';

/* =========================
   CONSTANTS & CONFIG
========================= */
export const ALLOWED_PERIODS = ['Q1', 'Q2', 'Q3', 'Q4'];
export const FINAL_PERIOD = 'FINAL';
export const PASSING_GRADE = 75;

// Configurable quarter weights (default: equal weights)
// Can be overridden via SystemSetting table
export const DEFAULT_QUARTER_WEIGHTS = {
  Q1: 0.25,
  Q2: 0.25,
  Q3: 0.25,
  Q4: 0.25,
};

/* =========================
   PHILIPPINE DEPED GRADING SCALE
   Based on DepEd Order No. 8, s. 2015
========================= */
export const GRADE_DESCRIPTORS = [
  { min: 90, max: 100, descriptor: 'Outstanding', code: 'O' },
  { min: 85, max: 89, descriptor: 'Very Satisfactory', code: 'VS' },
  { min: 80, max: 84, descriptor: 'Satisfactory', code: 'S' },
  { min: 75, max: 79, descriptor: 'Fairly Satisfactory', code: 'FS' },
  { min: 0, max: 74, descriptor: 'Did Not Meet Expectations', code: 'DNME' },
];

/* =========================
   HELPER FUNCTIONS
========================= */

/**
 * Get grade descriptor based on numeric grade
 */
export const getGradeDescriptor = (grade) => {
  if (grade === null || grade === undefined) return null;
  const rounded = Math.round(grade);
  return GRADE_DESCRIPTORS.find(d => rounded >= d.min && rounded <= d.max) || null;
};

/**
 * Determine if grade is passing
 */
export const isPassing = (grade) => {
  if (grade === null || grade === undefined) return false;
  return Math.round(grade) >= PASSING_GRADE;
};

/**
 * Get remarks based on grade
 */
export const getRemarks = (grade) => {
  if (grade === null || grade === undefined) return null;
  return isPassing(grade) ? 'PASSED' : 'FAILED';
};

/**
 * Round grade to nearest whole number (DepEd standard)
 * Uses banker's rounding for .5 cases
 */
export const roundGrade = (grade) => {
  if (grade === null || grade === undefined) return null;
  return Math.round(grade);
};

/**
 * Compute weighted average
 */
export const computeWeightedAverage = (grades, weights = DEFAULT_QUARTER_WEIGHTS) => {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const period of ALLOWED_PERIODS) {
    const grade = grades[period];
    if (grade !== undefined && grade !== null) {
      weightedSum += grade * weights[period];
      totalWeight += weights[period];
    }
  }

  // Only compute if all quarters have grades
  if (totalWeight < 1) return null;

  return weightedSum / totalWeight;
};

/**
 * Compute simple average (fallback)
 */
export const computeSimpleAverage = (values) => {
  if (!values || values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
};

/**
 * Fetch quarter weights from system settings (if configured)
 */
const getQuarterWeights = async () => {
  try {
    const setting = await db.systemSetting.findUnique({
      where: { key: 'QUARTER_WEIGHTS' },
    });
    if (setting?.value) {
      return JSON.parse(setting.value);
    }
  } catch {
    // Silently fall back to defaults
  }
  return DEFAULT_QUARTER_WEIGHTS;
};

/* =========================
   GET ALLOWED GRADING PERIODS
========================= */
export const getAllowedGradingPeriodsService = async () => {
  const weights = await getQuarterWeights();
  
  return {
    editable: ALLOWED_PERIODS,
    final: FINAL_PERIOD,
    finalEditable: false,
    passingGrade: PASSING_GRADE,
    weights,
    descriptors: GRADE_DESCRIPTORS,
  };
};

/* =========================
   CREATE / UPDATE GRADES
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

    if (g.period === FINAL_PERIOD) {
      throw new Error('FINAL_NOT_EDITABLE');
    }

    if (!ALLOWED_PERIODS.includes(g.period)) {
      throw new Error('INVALID_GRADING_PERIOD');
    }

    // Grade must be 0-100 (DepEd range)
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

  const results = await db.$transaction(operations);

  /* =========================
     AUTO-COMPUTE FINALS
     (for subjects with all 4 quarters)
  ========================= */
  await computeAndStoreFinalGrades(enrollmentId, subjectIds);

  return results;
};

/* =========================
   COMPUTE & STORE FINAL GRADES
   (Materialized for performance)
========================= */
const computeAndStoreFinalGrades = async (enrollmentId, subjectIds) => {
  const weights = await getQuarterWeights();

  for (const subjectId of subjectIds) {
    const quarterGrades = await db.grade.findMany({
      where: {
        enrollmentId,
        subjectId,
        period: { in: ALLOWED_PERIODS },
      },
    });

    // Only compute if all 4 quarters exist
    if (quarterGrades.length !== ALLOWED_PERIODS.length) {
      // Delete existing FINAL if quarters are incomplete
      await db.grade.deleteMany({
        where: {
          enrollmentId,
          subjectId,
          period: FINAL_PERIOD,
        },
      });
      continue;
    }

    // Build grades map
    const gradesMap = {};
    for (const g of quarterGrades) {
      gradesMap[g.period] = g.value;
    }

    // Compute weighted final
    const finalValue = computeWeightedAverage(gradesMap, weights);

    if (finalValue !== null) {
      await db.grade.upsert({
        where: {
          enrollmentId_subjectId_period: {
            enrollmentId,
            subjectId,
            period: FINAL_PERIOD,
          },
        },
        update: { value: finalValue, source: 'SYSTEM' },
        create: {
          enrollmentId,
          subjectId,
          period: FINAL_PERIOD,
          value: finalValue,
          source: 'SYSTEM',
        },
      });
    }
  }
};

/* =========================
   GET GRADES BY ENROLLMENT
   (Enhanced with descriptors)
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

  const grades = await db.grade.findMany({
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

  // Enrich with descriptors and remarks
  return grades.map(g => ({
    ...g,
    roundedValue: roundGrade(g.value),
    descriptor: getGradeDescriptor(g.value),
    remarks: g.period === FINAL_PERIOD ? getRemarks(g.value) : null,
    isPassing: isPassing(g.value),
  }));
};

/* =========================
   GET FINAL GRADES (COMPUTED)
   With full metadata
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

  // Get stored FINAL grades (already computed)
  const finalGrades = await db.grade.findMany({
    where: {
      enrollmentId,
      period: FINAL_PERIOD,
    },
    include: {
      subject: { select: { id: true, code: true, name: true } },
    },
  });

  return finalGrades.map(g => ({
    subject: g.subject,
    period: FINAL_PERIOD,
    value: g.value,
    roundedValue: roundGrade(g.value),
    descriptor: getGradeDescriptor(g.value),
    remarks: getRemarks(g.value),
    isPassing: isPassing(g.value),
  }));
};

/* =========================
   GET FULL REPORT CARD
   (All subjects with all periods + summary)
========================= */
export const getReportCardService = async ({
  enrollmentId,
  currentUserId,
  permissions,
}) => {
  const enrollment = await db.enrollment.findUnique({
    where: { id: enrollmentId },
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
      gradeLevel: { select: { id: true, code: true, name: true } },
      schoolYear: { select: { id: true, year: true } },
      section: {
        select: {
          id: true,
          name: true,
          adviser: { select: { id: true, fullName: true } },
        },
      },
    },
  });

  if (!enrollment) throw new Error('ENROLLMENT_NOT_FOUND');

  const isAdviser = enrollment.section?.adviserId === currentUserId;
  const canView = permissions?.includes('grades.view');

  if (!isAdviser && !canView) {
    throw new Error('FORBIDDEN');
  }

  // Get all subjects for this enrollment
  const subjects = await db.subject.findMany({
    where: {
      curriculumVersionId: enrollment.curriculumVersionId,
      gradeLevelId: enrollment.gradeLevelId,
    },
    orderBy: { code: 'asc' },
  });

  // Get all grades
  const grades = await db.grade.findMany({
    where: { enrollmentId },
  });

  // Build grades lookup
  const gradesMap = {};
  for (const g of grades) {
    const key = `${g.subjectId}-${g.period}`;
    gradesMap[key] = g.value;
  }

  // Build subject rows
  const subjectRows = subjects.map(subject => {
    const q1 = gradesMap[`${subject.id}-Q1`] ?? null;
    const q2 = gradesMap[`${subject.id}-Q2`] ?? null;
    const q3 = gradesMap[`${subject.id}-Q3`] ?? null;
    const q4 = gradesMap[`${subject.id}-Q4`] ?? null;
    const final = gradesMap[`${subject.id}-FINAL`] ?? null;

    return {
      subject: {
        id: subject.id,
        code: subject.code,
        name: subject.name,
      },
      grades: {
        Q1: q1 !== null ? { value: q1, rounded: roundGrade(q1) } : null,
        Q2: q2 !== null ? { value: q2, rounded: roundGrade(q2) } : null,
        Q3: q3 !== null ? { value: q3, rounded: roundGrade(q3) } : null,
        Q4: q4 !== null ? { value: q4, rounded: roundGrade(q4) } : null,
        FINAL: final !== null ? {
          value: final,
          rounded: roundGrade(final),
          descriptor: getGradeDescriptor(final),
          remarks: getRemarks(final),
        } : null,
      },
      isComplete: final !== null,
      isPassing: isPassing(final),
    };
  });

  // Compute general average (only from FINAL grades)
  const completeFinals = subjectRows
    .filter(r => r.grades.FINAL !== null)
    .map(r => r.grades.FINAL.value);

  const generalAverage = completeFinals.length === subjects.length
    ? computeSimpleAverage(completeFinals)
    : null;

  // Count passed/failed subjects
  const passedCount = subjectRows.filter(r => r.isPassing).length;
  const failedCount = subjectRows.filter(r => r.grades.FINAL && !r.isPassing).length;

  return {
    enrollment: {
      id: enrollment.id,
      status: enrollment.status,
    },
    student: enrollment.student,
    gradeLevel: enrollment.gradeLevel,
    schoolYear: enrollment.schoolYear,
    section: enrollment.section,
    subjects: subjectRows,
    summary: {
      totalSubjects: subjects.length,
      completedSubjects: completeFinals.length,
      passedSubjects: passedCount,
      failedSubjects: failedCount,
      generalAverage: generalAverage !== null ? {
        value: generalAverage,
        rounded: roundGrade(generalAverage),
        descriptor: getGradeDescriptor(generalAverage),
      } : null,
      overallRemarks: generalAverage !== null ? getRemarks(generalAverage) : null,
      isPromoted: failedCount === 0 && completeFinals.length === subjects.length,
    },
  };
};

/* =========================
   GET QUARTER SUMMARY
   (Per-quarter class average, useful for teachers)
========================= */
export const getQuarterSummaryService = async ({
  sectionId,
  subjectId,
  period,
  currentUserId,
}) => {
  if (!ALLOWED_PERIODS.includes(period)) {
    throw new Error('INVALID_GRADING_PERIOD');
  }

  const section = await db.section.findUnique({
    where: { id: sectionId },
    select: { adviserId: true },
  });

  if (!section) throw new Error('SECTION_NOT_FOUND');

  if (section.adviserId !== currentUserId) {
    throw new Error('NOT_SECTION_ADVISER');
  }

  // Get all enrollments in section
  const enrollments = await db.enrollment.findMany({
    where: {
      sectionId,
      status: 'ACTIVE',
    },
    select: { id: true },
  });

  const enrollmentIds = enrollments.map(e => e.id);

  // Get grades for all students
  const grades = await db.grade.findMany({
    where: {
      enrollmentId: { in: enrollmentIds },
      subjectId,
      period,
    },
  });

  if (grades.length === 0) {
    return {
      totalStudents: enrollments.length,
      gradedStudents: 0,
      average: null,
      highest: null,
      lowest: null,
      passingCount: 0,
      failingCount: 0,
    };
  }

  const values = grades.map(g => g.value);
  const average = computeSimpleAverage(values);
  const passingCount = values.filter(v => isPassing(v)).length;

  return {
    totalStudents: enrollments.length,
    gradedStudents: grades.length,
    average: average !== null ? roundGrade(average) : null,
    highest: Math.max(...values),
    lowest: Math.min(...values),
    passingCount,
    failingCount: grades.length - passingCount,
    passingRate: grades.length > 0 
      ? Math.round((passingCount / grades.length) * 100) 
      : 0,
  };
};