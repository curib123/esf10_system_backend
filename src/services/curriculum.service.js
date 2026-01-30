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
   CURRICULUM
========================= */

/**
 * Create curriculum (IDEMPOTENT)
 * If name already exists → return it
 */
export const createCurriculum = async (name) => {
  if (!name || !name.trim()) {
    throw new Error('Curriculum name is required');
  }

  const trimmed = name.trim();

  const existing = await db.curriculum.findFirst({
    where: { name: trimmed },
  });

  if (existing) return existing;

  return db.curriculum.create({
    data: { name: trimmed },
  });
};

/**
 * Rename curriculum (IDEMPOTENT)
 */
export const renameCurriculum = async (curriculumId, name) => {
  if (!curriculumId) throw new Error('Curriculum ID is required');
  if (!name || !name.trim()) throw new Error('Curriculum name is required');

  const trimmed = name.trim();

  const curriculum = await db.curriculum.findUnique({
    where: { id: curriculumId },
  });

  if (!curriculum) {
    throw new Error('Curriculum not found');
  }

  // ✅ No-op if same name
  if (curriculum.name === trimmed) {
    return curriculum;
  }

  return db.curriculum.update({
    where: { id: curriculumId },
    data: { name: trimmed },
  });
};

/**
 * Get curricula with pagination, search, and filters
 */
export const getCurricula = async ({
  page = 1,
  limit = 10,
  search = '',
  hasActiveVersion,
} = {}) => {
  const { take, skip } = getPagination(page, limit);

  const where = {
    ...(search && {
      name: { contains: search, mode: 'insensitive' },
    }),
    ...(hasActiveVersion !== undefined && {
      versions: {
        some: hasActiveVersion
          ? { effectiveTo: null }
          : { effectiveTo: { not: null } },
      },
    }),
  };

  const [data, total] = await Promise.all([
    db.curriculum.findMany({
      where,
      take,
      skip,
      include: {
        versions: { orderBy: { effectiveFrom: 'desc' } },
      },
      orderBy: { id: 'asc' },
    }),
    db.curriculum.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* =========================
   CURRICULUM VERSION
========================= */

/**
 * Create curriculum version (IDEMPOTENT)
 */
export const createCurriculumVersion = async (
  curriculumId,
  name,
  effectiveFrom
) => {
  if (!curriculumId) throw new Error('Curriculum ID is required');
  if (!name || !name.trim()) throw new Error('Curriculum version name is required');
  if (!effectiveFrom) throw new Error('effectiveFrom is required');

  const trimmed = name.trim();

  return db.$transaction(async (tx) => {
    const active = await tx.curriculumVersion.findFirst({
      where: {
        curriculumId,
        effectiveTo: null,
      },
    });

    // ✅ Idempotent: same request → return active
    if (active && active.name === trimmed) {
      return active;
    }

    if (active) {
      throw new Error(
        'An active curriculum version already exists. Close it before creating a new one.'
      );
    }

    return tx.curriculumVersion.create({
      data: {
        curriculumId,
        name: trimmed,
        effectiveFrom,
      },
    });
  });
};

/**
 * Rename curriculum version (IDEMPOTENT, DISPLAY ONLY)
 */
export const renameCurriculumVersion = async (versionId, name) => {
  if (!versionId) throw new Error('Curriculum version ID is required');
  if (!name || !name.trim()) throw new Error('Version name is required');

  const trimmed = name.trim();

  return db.$transaction(async (tx) => {
    const version = await tx.curriculumVersion.findUnique({
      where: { id: versionId },
    });

    if (!version) throw new Error('Curriculum version not found');

    // ✅ No-op if same name
    if (version.name === trimmed) {
      return version;
    }

    const enrollmentCount = await tx.enrollment.count({
      where: { curriculumVersionId: versionId },
    });

    if (enrollmentCount > 0) {
      throw new Error(
        'Cannot rename curriculum version already used in enrollments'
      );
    }

    return tx.curriculumVersion.update({
      where: { id: versionId },
      data: { name: trimmed },
    });
  });
};

/**
 * Get all versions of a curriculum
 */
export const getCurriculumVersions = async (curriculumId) => {
  if (!curriculumId) throw new Error('Curriculum ID is required');

  return db.curriculumVersion.findMany({
    where: { curriculumId },
    orderBy: { effectiveFrom: 'desc' },
  });
};

/**
 * Close curriculum version (IDEMPOTENT)
 */
export const closeCurriculumVersion = async (versionId) => {
  if (!versionId) throw new Error('Curriculum version ID is required');

  return db.$transaction(async (tx) => {
    const version = await tx.curriculumVersion.findUnique({
      where: { id: versionId },
    });

    if (!version) throw new Error('Curriculum version not found');

    // ✅ Idempotent: already closed → return as-is
    if (version.effectiveTo !== null) {
      return version;
    }

    const enrollmentCount = await tx.enrollment.count({
      where: { curriculumVersionId: versionId },
    });

    if (enrollmentCount > 0) {
      throw new Error(
        'Cannot close curriculum version with existing enrollments'
      );
    }

    return tx.curriculumVersion.update({
      where: { id: versionId },
      data: { effectiveTo: new Date().getFullYear() },
    });
  });
};
