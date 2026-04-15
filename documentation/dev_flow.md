# ESF10 System Developer Flow

This document describes the practical development order for the current backend, based on what is already implemented in code.

## Goal of This Flow

Use this when developing new features or onboarding into the project. It follows the actual backend dependencies so features are built in a safe order.

## 1. Foundation First

Before building feature APIs, make sure these are working:

- Environment loading
- Database connectivity
- Prisma schema
- Prisma CLI config
- Seed data
- Authentication
- RBAC middleware
- Shared validation and error handling

In this codebase, those foundations live mostly in:

- `src/configs`
- `prisma.config.ts`
- `src/middleware`
- `src/utils`
- `prisma/schema.prisma`
- `prisma/seed.js`

Prisma 7 note:

- `DATABASE_URL` for Prisma CLI now lives in `prisma.config.ts`
- `prisma/schema.prisma` should keep `datasource db { provider = "postgresql" }` without a `url` field
- Use Node `20.19+` for direct Prisma CLI commands

## 2. Seed and Access Control

The backend assumes RBAC exists before most business features are useful.

Build order:

1. Permissions
2. Roles
3. Role-permission assignments
4. Users
5. User-role assignments
6. Login and `/me`

Why this comes first:

- Most route groups require authentication
- Several route groups also require admin role plus permission checks
- Teacher and grading flows depend on role and permission context

## 3. Academic Master Data

These records should exist before student transactions:

1. School years
2. Curricula
3. Curriculum versions
4. Grade levels
5. Subjects
6. Sections

Current dependency notes:

- Sections depend on school year and grade level
- Subjects depend on curriculum version and grade level
- Enrollments depend on school year, curriculum version, grade level, and optionally section

## 4. Student and Enrollment Layer

Once the master data is ready, the transactional flow is:

1. Create students
2. Create enrollments
3. Assign section placement during enrollment or enrollment update
4. Complete enrollments when needed

Rules enforced by the current backend include:

- A student must exist and not be soft-deleted
- School year must be active to create an enrollment
- Curriculum version must be active
- Grade level must be active
- A section must match the enrollment's grade level and school year
- A student can only have one enrollment per school year

## 5. Teacher Grading Flow

The implemented grading flow is:

1. Teacher fetches advised students from `/api/teachers/my-students`
2. Frontend uses the returned `enrollment.id`
3. Frontend fetches enrollment subjects or current grades
4. Adviser upserts Q1 to Q4 grades
5. System auto-computes `FINAL`
6. Frontend can fetch final grades, report card, or quarter summary

Important current behavior:

- Only the section adviser may encode grades
- Users with `grades.view` can read grades, but not encode them unless they are the adviser
- `FINAL` is not manually editable
- Final grades are computed after all quarter grades exist

## 6. Validation and Error Handling

All new route work should follow the existing pattern:

1. Validate params, query, and body at the route layer
2. Let controllers stay thin
3. Put domain rules in services
4. Normalize errors through shared HTTP helpers

Current files to follow:

- `src/middleware/validation.middleware.js`
- `src/validators/request.schemas.js`
- `src/utils/http.util.js`
- `src/utils/request.util.js`

## 7. Testing Flow

Use both test layers during development:

Fast checks:

```bash
npm test
```

DB-backed flow tests:

```bash
npm run test:db
```

CLI/runtime note:

- The repo script for `npm run test:db` already wraps Node `20.19` because Prisma 7 CLI requires it
- If you run `npx prisma ...` manually, use a shell running Node `20.19+`

Recommended development rhythm:

1. Update schema or service logic
2. Add or update request validation
3. Add fast route/unit coverage
4. Add DB-backed integration coverage for critical write paths
5. Update docs

## 8. What To Treat As Planned, Not Finished

These exist conceptually or in schema but are not yet complete end-user modules:

- Document management workflow
- Full audit log feature set
- SF10 generation/export pipeline
- Production-ready system settings management UI/API surface

When building in those areas, treat the Prisma schema as partial groundwork rather than proof that the whole feature is already done.

## 9. Practical Golden Rule

Build in this order:

```text
RBAC -> master data -> student/enrollment -> grading -> reporting -> export features
```

If something depends on enrollment, do not design it as if it belongs directly to student records.
