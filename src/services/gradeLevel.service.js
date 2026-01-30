import { db } from '../configs/db.config.js';

/* =========================
   HELPERS
========================= */
const getPagination = (page = 1, limit = 10) => {
  const take = Number(limit);
  const skip = (Number(page) - 1) * take;
  return { take, skip };
};

/* =========================
   CREATE
========================= */
export const createGradeLevelService = async ({ code, name, order }) => {
  return db.gradeLevel.create({
    data: {
      code: code.trim(),
      name: name.trim(),
      order: Number(order),
    },
  });
};

/* =========================
   READ ALL
   search + pagination + filters
========================= */
export const getGradeLevelsService = async ({
  page = 1,
  limit = 10,
  q,
  isActive,
}) => {
  const { take, skip } = getPagination(page, limit);

  const where = {
    ...(q && {
      OR: [
        { code: { contains: q } },
        { name: { contains: q } },
      ],
    }),
    ...(isActive !== undefined && {
      isActive: isActive === true || isActive === 'true',
    }),
  };

  const [data, count] = await Promise.all([
    db.gradeLevel.findMany({
      where,
      orderBy: { order: 'asc' },
      skip,
      take,
    }),
    db.gradeLevel.count({ where }),
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
export const getGradeLevelByIdService = async (id) => {
  return db.gradeLevel.findUnique({
    where: { id },
  });
};

/* =========================
   UPDATE
========================= */
export const updateGradeLevelService = async (id, data) => {
  return db.gradeLevel.update({
    where: { id },
    data,
  });
};

/* =========================
   TOGGLE STATUS
========================= */
export const toggleGradeLevelStatusService = async (id) => {
  const current = await db.gradeLevel.findUnique({
    where: { id },
    select: { isActive: true },
  });

  if (!current) return null;

  return db.gradeLevel.update({
    where: { id },
    data: { isActive: !current.isActive },
  });
};
