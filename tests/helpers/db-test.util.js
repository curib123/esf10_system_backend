import { execFileSync, execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

const prismaBinary = process.platform === 'win32'
  ? path.join(projectRoot, 'node_modules', '.bin', 'prisma.cmd')
  : path.join(projectRoot, 'node_modules', '.bin', 'prisma');

const randomSuffix = () => Math.random().toString(36).slice(2, 8);

export const buildSchemaDatabaseUrl = (baseUrl, schema) => {
  const parsedUrl = new URL(baseUrl);
  parsedUrl.searchParams.set('schema', schema);
  return parsedUrl.toString();
};

export const runPrismaDbPush = (databaseUrl) => {
  const env = {
    ...process.env,
    DATABASE_URL: databaseUrl,
    PRISMA_HIDE_UPDATE_MESSAGE: '1',
  };

  if (process.platform === 'win32') {
    execSync(`"${prismaBinary}" db push`, {
      cwd: projectRoot,
      env,
      stdio: 'pipe',
    });
    return;
  }

  execFileSync(
    prismaBinary,
    ['db', 'push'],
    {
      cwd: projectRoot,
      env,
      stdio: 'pipe',
    },
  );
};

export const createPrismaClient = (databaseUrl) =>
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseUrl,
    }),
  });

export const createIsolatedTestDatabase = async (baseUrl) => {
  const schema = `itest_${Date.now()}_${randomSuffix()}`;
  const testDatabaseUrl = buildSchemaDatabaseUrl(baseUrl, schema);
  const adminPrisma = createPrismaClient(baseUrl);

  await adminPrisma.$connect();
  await adminPrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

  runPrismaDbPush(testDatabaseUrl);

  const prisma = createPrismaClient(testDatabaseUrl);
  await prisma.$connect();

  return {
    adminPrisma,
    prisma,
    schema,
    testDatabaseUrl,
  };
};

export const destroyIsolatedTestDatabase = async ({
  adminPrisma,
  prisma,
  schema,
}) => {
  await prisma?.$disconnect();

  if (adminPrisma) {
    await adminPrisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await adminPrisma.$disconnect();
  }
};
