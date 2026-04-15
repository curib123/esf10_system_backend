# ESF10 System Developer Flow

This document describes the practical backend development order for the current codebase.

## 1. Foundation First

Before building feature APIs, make sure these are working:

- Environment loading
- Database connectivity
- Prisma schema
- Prisma CLI config
- Seed data
- Authentication
- RBAC middleware
- Validation and error handling
- Request context and audit logging

Key files:

- `src/configs`
- `src/middleware`
- `src/utils`
- `prisma/schema.prisma`
- `prisma/seed.js`
- `prisma.config.ts`

Prisma 7 note:

- Prisma CLI reads `DATABASE_URL` from `prisma.config.ts`
- `prisma/schema.prisma` keeps only the datasource provider
- Direct Prisma CLI work should use Node `20.19+`

## 2. Build Order

The safest backend order is still:

```text
RBAC -> master data -> student/enrollment -> grading -> support modules -> export/reporting
```

That means:

1. Permissions, roles, users, and auth
2. School years, curricula, curriculum versions, grade levels, subjects, and sections
3. Students and enrollments
4. Grades and report card flows
5. Documents, system settings, audit logs, and SF10

## 3. Newly Completed Support Modules

These backend modules are now implemented:

- Document upload, retrieval, listing, and soft delete
- System settings list, single update, and bulk update
- Audit log list and CSV export
- SF10 preview, generation, and JSON export

## 4. Development Pattern To Follow

For new work, stay consistent with the current structure:

1. Validate request data at the route layer
2. Keep controllers thin
3. Put domain rules in services
4. Let audit logging happen automatically for writes
5. Add manual audit events for important non-write actions such as exports

## 5. Testing Rhythm

Use both test layers during development:

```bash
npm test
```

```bash
npm run test:db
```

Notes:

- `npm run test:db` already wraps Node `20.19` for Prisma 7 CLI compatibility
- Manual `npx prisma ...` commands still expect your shell Node version to be `20.19+`
