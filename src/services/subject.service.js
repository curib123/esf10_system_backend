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
export const createSubjectService = async ({
  curriculumVersionId,
  gradeLevelId,
  code,
  name,
}) => {
  return db.subject.create({
    data: {
      curriculumVersionId: Number(curriculumVersionId),
      gradeLevelId: Number(gradeLevelId),
      code: code.trim(),
      name: name.trim(),
    },
  });
};

/* =========================
   READ ALL
   search + pagination + filters
========================= */
export const getSubjectsService = async ({
  page = 1,
  limit = 10,
  q,
  curriculumVersionId,
  gradeLevelId,
}) => {
  const { take, skip } = getPagination(page, limit);

  const where = {
    ...(q && {
      OR: [
        { code: { contains: q } },
        { name: { contains: q } },
      ],
    }),
    ...(curriculumVersionId && {
      curriculumVersionId: Number(curriculumVersionId),
    }),
    ...(gradeLevelId && {
      gradeLevelId: Number(gradeLevelId),
    }),
  };

  const [data, count] = await Promise.all([
    db.subject.findMany({
      where,
      orderBy: { code: 'asc' },
      skip,
      take,
      include: {
        gradeLevel: true,
        curriculumVersion: true,
      },
    }),
    db.subject.count({ where }),
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
export const getSubjectByIdService = async (id) => {
  return db.subject.findUnique({
    where: { id },
    include: {
      gradeLevel: true,
      curriculumVersion: true,
    },
  });
};

/* =========================
   UPDATE
========================= */
export const updateSubjectService = async (id, data) => {
  return db.subject.update({
    where: { id },
    data,
  });
};
