import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@prisma/client';
import { getRequestContext } from '../utils/request-context.util.js';

const isTestEnv = process.env.NODE_ENV === 'test';
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const basePrisma = new PrismaClient({
  adapter,
});

const WRITE_OPERATIONS = new Set([
  'create',
  'createMany',
  'delete',
  'deleteMany',
  'update',
  'updateMany',
  'upsert',
]);

const toDelegateKey = (model) =>
  model ? `${model.charAt(0).toLowerCase()}${model.slice(1)}` : null;

const toAuditValue = (value) => {
  if (value === undefined) return null;

  return JSON.parse(
    JSON.stringify(value, (_key, currentValue) => {
      if (currentValue instanceof Date) {
        return currentValue.toISOString();
      }

      return currentValue;
    })
  );
};

const sanitizeAuditPayload = (value) => {
  if (!value || typeof value !== 'object') {
    return toAuditValue(value);
  }

  const clone = toAuditValue(value);

  const scrubPasswords = (current) => {
    if (!current || typeof current !== 'object') return current;

    if (Array.isArray(current)) {
      return current.map(scrubPasswords);
    }

    const next = { ...current };

    if (Object.prototype.hasOwnProperty.call(next, 'password')) {
      next.password = '[REDACTED]';
    }

    for (const key of Object.keys(next)) {
      next[key] = scrubPasswords(next[key]);
    }

    return next;
  };

  return scrubPasswords(clone);
};

const getRequestMetadata = () => {
  const request = getRequestContext()?.req;
  const forwardedFor = request?.headers?.['x-forwarded-for'];

  return {
    userId: Number(request?.user?.userId ?? request?.user?.id) || null,
    ipAddress: Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(',')[0]?.trim() || request?.ip || null,
    userAgent: request?.headers?.['user-agent'] || null,
  };
};

const loadPreviousValue = async (model, operation, args) => {
  if (!model || !args?.where) return null;
  if (!['delete', 'update', 'upsert'].includes(operation)) return null;

  const delegateKey = toDelegateKey(model);
  const delegate = delegateKey ? basePrisma[delegateKey] : null;

  if (typeof delegate?.findUnique === 'function') {
    try {
      return await delegate.findUnique({ where: args.where });
    } catch {
      return null;
    }
  }

  return null;
};

const createAuditLog = async ({
  action,
  entity,
  entityId,
  oldValue,
  newValue,
}) => {
  const metadata = getRequestMetadata();

  try {
    await basePrisma.auditLog.create({
      data: {
        userId: metadata.userId,
        action,
        entity,
        entityId,
        oldValue: sanitizeAuditPayload(oldValue),
        newValue: sanitizeAuditPayload(newValue),
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    });
  } catch (error) {
    if (!isTestEnv) {
      console.error('Audit log failed:', error);
    }
  }
};

/* ================= AUTO AUDIT LOGGER ================= */
const db = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (!model || model === 'AuditLog' || !WRITE_OPERATIONS.has(operation)) {
          return query(args);
        }

        const previousValue = await loadPreviousValue(model, operation, args);
        const result = await query(args);
        const entityId = result?.id ?? previousValue?.id ?? args?.where?.id ?? null;

        await createAuditLog({
          action: operation.toUpperCase(),
          entity: model,
          entityId,
          oldValue: previousValue,
          newValue: operation === 'delete' ? null : result,
        });

        return result;
      },
    },
  },
});

/* ================= CONNECT DB ================= */
const connectDB = async () => {
  try {
    await db.$connect();

    if (!isTestEnv) {
      console.log('Database connected successfully');
    }
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

/* ================= DISCONNECT DB ================= */
const disconnectDB = async () => {
  try {
    await db.$disconnect();

    if (!isTestEnv) {
      console.log('Database disconnected');
    }
  } catch (error) {
    console.error('Error disconnecting database:', error);
  }
};

export { connectDB, db, disconnectDB, createAuditLog };
