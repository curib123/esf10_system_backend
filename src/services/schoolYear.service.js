// src/services/schoolYear.service.js
import { db } from '../configs/db.config.js';

/* ============================
   CREATE
============================ */
export const createSchoolYear = async ({ year, isActive }) => {
  if (isActive) {
    await db.schoolYear.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  return db.schoolYear.create({
    data: {
      year,
      isActive: Boolean(isActive),
    },
  });
};

/* ============================
   READ
============================ */
export const getSchoolYears = async () => {
  return db.schoolYear.findMany({
    orderBy: { year: 'desc' },
    include: {
      _count: {
        select: {
          enrollments: {
            where: { deletedAt: null }, // 👈 respect soft delete
          },
        },
      },
    },
  });
};

export const getSchoolYearById = async (id) => {
  return db.schoolYear.findUnique({
    where: { id },
  });
};

/* ============================
   UPDATE
============================ */
export const updateSchoolYear = async (id, { year, isActive }) => {
  if (isActive) {
    await db.schoolYear.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  return db.schoolYear.update({
    where: { id },
    data: { year, isActive },
  });
};

/* ============================
   ACTIVATE
============================ */
export const activateSchoolYear = async (id) => {
  await db.schoolYear.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });

  return db.schoolYear.update({
    where: { id },
    data: { isActive: true },
  });
};

/* ============================
   DELETE (SAFE)
============================ */
export const deleteSchoolYear = async (id) => {
  const activeEnrollments = await db.enrollment.count({
    where: {
      schoolYearId: id,
      deletedAt: null, // 👈 only real enrollments
    },
  });

  if (activeEnrollments > 0) {
    throw new Error('Cannot delete school year with active enrollments');
  }

  return db.schoolYear.delete({
    where: { id },
  });
};
