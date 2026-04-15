import { createAuditLog, db } from '../configs/db.config.js';
import { createHttpError } from '../utils/http.util.js';

const getPagination = (page = 1, limit = 20) => {
  const take = Math.min(Number(limit), 100);
  const skip = (Number(page) - 1) * take;
  return { take, skip };
};

const parseOptionalDate = (value, fieldName) => {
  if (!value) return undefined;

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw createHttpError(400, `${fieldName} must be a valid date`, 'INVALID_DATE');
  }

  return parsed;
};

const buildAuditWhere = ({
  userId,
  entity,
  action,
  from,
  to,
}) => {
  const createdAt = {};
  const fromDate = parseOptionalDate(from, 'from');
  const toDate = parseOptionalDate(to, 'to');

  if (fromDate) {
    createdAt.gte = fromDate;
  }

  if (toDate) {
    createdAt.lte = toDate;
  }

  return {
    ...(userId ? { userId: Number(userId) } : {}),
    ...(entity ? { entity } : {}),
    ...(action ? { action } : {}),
    ...(Object.keys(createdAt).length > 0 ? { createdAt } : {}),
  };
};

export const listAuditLogsService = async ({
  page = 1,
  limit = 20,
  userId,
  entity,
  action,
  from,
  to,
}) => {
  const where = buildAuditWhere({
    userId,
    entity,
    action,
    from,
    to,
  });
  const { take, skip } = getPagination(page, limit);

  const [data, count] = await Promise.all([
    db.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    db.auditLog.count({ where }),
  ]);

  return {
    data,
    count,
    page: Number(page),
    limit: Number(limit),
  };
};

const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

export const exportAuditLogsService = async (filters) => {
  const where = buildAuditWhere(filters);
  const logs = await db.auditLog.findMany({
    where,
    include: {
      user: {
        select: {
          email: true,
          fullName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const rows = [
    [
      'id',
      'createdAt',
      'action',
      'entity',
      'entityId',
      'userEmail',
      'userFullName',
      'ipAddress',
      'userAgent',
      'oldValue',
      'newValue',
    ].join(','),
    ...logs.map((log) =>
      [
        log.id,
        log.createdAt.toISOString(),
        log.action,
        log.entity,
        log.entityId ?? '',
        log.user?.email ?? '',
        log.user?.fullName ?? '',
        log.ipAddress ?? '',
        log.userAgent ?? '',
        escapeCsv(JSON.stringify(log.oldValue ?? null)),
        escapeCsv(JSON.stringify(log.newValue ?? null)),
      ].join(',')
    ),
  ];

  return rows.join('\n');
};

export const recordAuditEventService = async ({
  action,
  entity,
  entityId,
  oldValue,
  newValue,
}) =>
  createAuditLog({
    action,
    entity,
    entityId,
    oldValue,
    newValue,
  });
