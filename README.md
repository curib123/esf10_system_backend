# ESF10 System Backend

Backend API for ESF10/SF10-related school records management, built with Node.js, Express, Prisma, and PostgreSQL.

## What This Project Currently Covers

- Authentication with JWT
- RBAC with users, roles, and permissions
- School year management
- Curriculum and curriculum version management
- Grade level management
- Subject management
- Section management
- Student management
- Enrollment management
- Grade encoding, final-grade computation, report card, and quarter summary APIs
- Adviser-focused teacher endpoint for student grading workflows

## What Exists in the Schema But Is Not Yet Fully Exposed

- `Document`
- `SystemSetting`
- `AuditLog`
- Full SF10 generation/export flow

These are part of the data model, but they are not all implemented as complete public API modules yet.

## Stack

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT authentication
- Bcrypt
- Zod validation
- Supertest and Node test runner for automated tests

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL='postgresql://user:password@host/db?sslmode=require'
PORT=3001
NODE_ENV=development

JWT_SECRET="super_secret_jwt_key_change_this"
JWT_EXPIRES_IN="1d"

BCRYPT_SALT_ROUNDS=10

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_ROOT_FOLDER='esf10_system'

RBAC_ADMIN_ROLE=SUPER_ADMIN
```

Notes:

- `DATABASE_URL` is required
- `RBAC_ADMIN_ROLE` controls which role can access admin-only routes
- Cloudinary config is present, but document upload flows are not yet a complete public feature

## Getting Started

Install dependencies:

```bash
npm install
```

Push the Prisma schema to your database:

```bash
npx prisma db push
```

Seed initial data:

```bash
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:3001
```

## Available Scripts

Start dev server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

Run fast tests:

```bash
npm test
```

Run DB-backed integration tests:

```bash
npm run test:db
```

## API Base Paths

The app currently mounts these route groups:

- `/api/auth`
- `/api/roles`
- `/api/permissions`
- `/api/users`
- `/api/school-years`
- `/api/curricula`
- `/api/grade-levels`
- `/api/subjects`
- `/api/students`
- `/api/enrollments`
- `/api/sections`
- `/api/teachers`
- `/api/grades`

Health check:

```text
GET /
```

## Core Data Rules Enforced Today

- A student can have only one enrollment per school year
- Enrollments are the academic anchor for grades
- Grades belong to enrollments, not directly to students
- Quarter grades are manually encoded for `Q1` to `Q4`
- `FINAL` grades are auto-computed by the system
- Soft deletes are used in several domains such as users, students, and enrollments
- Admin-only route groups are protected by both role and permission checks

## Testing

There are two test layers:

- Fast route and utility tests that do not require a live database
- Real DB-backed integration tests that create an isolated Prisma schema and exercise login, register, enrollment creation, and grade upsert flows

## Documentation

- [documentation/FLOW.md/](esf10/esf10_system_backend/documentation/FLOW.md)
- [documentation/dev_flow.md](esf10/esf10_system_backend/documentation/dev_flow.md)
- API endpoint docs under [documentation/api](/esf10/esf10_system_backend/documentation/api)
- Prisma schema at [prisma/schema.prisma](/esf10/esf10_system_backend/prisma/schema.prisma)

## Current Caveats

- Some permissions seeded in `prisma/seed.js` use names that may differ from newer route expectations, so keep seed data and route permission checks aligned
- Audit logging exists in the schema, but a full audit trail implementation is not complete
- SF10 generation is still a domain goal, not a finished feature in this backend
