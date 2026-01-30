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
   GET MY ADVISED STUDENTS
   (with pagination, search, filters)
========================= */
export const getMyAdvisedStudentsService = async ({
  currentUserId,
  schoolYearId,
  gradeLevelId,
  sectionId,
  status = 'ACTIVE',
  q,
  page = 1,
  limit = 20,
}) => {
  const { take, skip } = getPagination(page, limit);

  // 🔁 default to active school year if not provided
  let activeSchoolYearId = schoolYearId;

  if (!activeSchoolYearId) {
    const activeSY = await db.schoolYear.findFirst({
      where: { isActive: true },
      select: { id: true },
    });
    activeSchoolYearId = activeSY?.id;
  }

  const where = {
    deletedAt: null,
    status,

    ...(gradeLevelId && { gradeLevelId: Number(gradeLevelId) }),
    ...(sectionId && { sectionId: Number(sectionId) }),

    section: {
      adviserId: currentUserId,
      ...(activeSchoolYearId && { schoolYearId: activeSchoolYearId }),
    },

    ...(q && {
      OR: [
        {
          student: {
            lrn: { contains: q },
          },
        },
        {
          student: {
            firstName: { contains: q },
          },
        },
        {
          student: {
            lastName: { contains: q },
          },
        },
        {
          section: {
            name: { contains: q },
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
        { sectionId: 'asc' },
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
        gradeLevel: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
          },
        },
        schoolYear: {
          select: {
            id: true,
            year: true,
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
