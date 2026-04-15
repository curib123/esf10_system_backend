import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@prisma/client';

const isTestEnv = process.env.NODE_ENV === 'test';
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const basePrisma = new PrismaClient({
  adapter,
});

/* ================= AUTO SYSTEM ACTIVITY LOGGER ================= */
const db = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const result = await query(args);

        const writeOperations = ['create', 'update', 'delete'];
        const systemLogDelegate = basePrisma.systemLog;

        if (
          writeOperations.includes(operation) &&
          model !== 'SystemLog' &&
          typeof systemLogDelegate?.create === 'function'
        ) {
          try {
            await systemLogDelegate.create({
              data: {
                level: 'INFO',
                message: `${model} ${operation}`,
              },
            });
          } catch (error) {
            if (!isTestEnv) {
              console.error('System log failed:', error);
            }
          }
        }

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

export { connectDB, db, disconnectDB };
