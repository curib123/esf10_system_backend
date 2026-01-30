import { db } from '../configs/db.config.js';

/* =========================
   HELPERS
========================= */
const getPagination = (page = 1, limit = 20) => {
  const take = Math.min(Number(limit), 50); // hard cap for safety
  const skip = (Number(page) - 1) * take;
  return { take, skip };
};

/* =========================
   CREATE
========================= */
export const createStudentService = async (data) => {
  return db.student.create({
    data,
  });
};

/* =========================
   READ ALL (FAST)
   search + pagination + filters
========================= */
export const getStudentsService = async ({
  page = 1,
  limit = 20,
  q,
  gender,
  archived,
}) => {
  const { take, skip } = getPagination(page, limit);

  const where = {
    ...(archived === 'true'
      ? { deletedAt: { not: null } }
      : { deletedAt: null }),

    ...(gender && { gender }),

    ...(q && {
      OR: [
        { lrn: { contains: q } },
        { lastName: { contains: q } },
        { firstName: { contains: q } },
      ],
    }),
  };

  const [data, count] = await Promise.all([
    db.student.findMany({
      where,
      skip,
      take,
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' },
      ],
      select: {
        id: true,
        lrn: true,
        firstName: true,
        middleName: true,
        lastName: true,
        gender: true,
        birthDate: true,
      },
    }),
    db.student.count({ where }),
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
export const getStudentByIdService = async (id) => {
  return db.student.findUnique({
    where: { id },
  });
};

/* =========================
   UPDATE
========================= */
export const updateStudentService = async (id, data) => {
  return db.student.update({
    where: { id },
    data,
  });
};

/* =========================
   ARCHIVE (SOFT DELETE)
========================= */
export const archiveStudentService = async (id) => {
  return db.student.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
