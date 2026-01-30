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
   CREATE
========================= */
export const createSectionService = async ({
  name,
  gradeLevelId,
  schoolYearId,
  adviserId,
}) => {
  return db.section.create({
    data: {
      name: name.trim(),
      gradeLevelId,
      schoolYearId,
      adviserId,
    },
  });
};

/* =========================
   READ ALL (FAST)
   search + pagination + filters
========================= */
export const getSectionsService = async ({
  page = 1,
  limit = 20,
  gradeLevelId,
  schoolYearId,
  adviserId,
  q,
}) => {
  const { take, skip } = getPagination(page, limit);

  const where = {
    ...(gradeLevelId && { gradeLevelId: Number(gradeLevelId) }),
    ...(schoolYearId && { schoolYearId: Number(schoolYearId) }),
    ...(adviserId && { adviserId: Number(adviserId) }),
    ...(q && {
      name: { contains: q },
    }),
  };

  const [data, count] = await Promise.all([
    db.section.findMany({
      where,
      skip,
      take,
      orderBy: [
        { gradeLevelId: 'asc' },
        { name: 'asc' },
      ],
      include: {
        gradeLevel: true,
        schoolYear: true,
        adviser: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    }),
    db.section.count({ where }),
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
export const getSectionByIdService = async (id) => {
  return db.section.findUnique({
    where: { id },
    include: {
      gradeLevel: true,
      schoolYear: true,
      adviser: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });
};

/* =========================
   UPDATE
========================= */
export const updateSectionService = async (id, data) => {
  return db.section.update({
    where: { id },
    data,
  });
};

/* =========================
   DELETE (GUARDED)
========================= */
export const deleteSectionService = async (id) => {
  const hasEnrollments = await db.enrollment.count({
    where: { sectionId: id },
  });

  if (hasEnrollments > 0) {
    throw new Error('SECTION_IN_USE');
  }

  return db.section.delete({
    where: { id },
  });
};
