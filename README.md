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
- Document upload, listing, retrieval, and soft-delete APIs
- System settings read/update APIs
- Audit log listing and CSV export APIs
- SF10 preview, generation, and JSON export APIs

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

UPLOAD_DRIVER=local
LOCAL_UPLOADS_DIR=uploads
LOCAL_UPLOADS_ROUTE=/uploads

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_ROOT_FOLDER='esf10_system'

RBAC_ADMIN_ROLE=SUPER_ADMIN
```

Notes:

- `DATABASE_URL` is required
- In Prisma 7, Prisma CLI reads `DATABASE_URL` from `prisma.config.ts`, not from `prisma/schema.prisma`
- `RBAC_ADMIN_ROLE` controls which role can access admin-only routes
- Upload storage is selected with `UPLOAD_DRIVER`
- Supported values are `local` and `cloudinary`
- The system uses one upload driver at a time, not both simultaneously
- If `UPLOAD_DRIVER=local`, uploaded files are served from `LOCAL_UPLOADS_ROUTE`
- If `UPLOAD_DRIVER=cloudinary`, Cloudinary credentials must be configured

## Getting Started

Prisma 7 note:

- Keep the database connection URL in `prisma.config.ts`
- Do not add `url = env("DATABASE_URL")` back into `prisma/schema.prisma`
- Use Node `20.19+` when running Prisma CLI commands such as `prisma db push`, `prisma db seed`, `prisma generate`, or `prisma validate`

Install dependencies:

```bash
npm install
```

Push the Prisma schema to your database:

```bash
npx prisma db push
```

If your local Node version is below `20.19`, upgrade Node first before running Prisma CLI commands.

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

Notes:

- `npm run test:db` already uses a Node `20.19` wrapper for Prisma 7 CLI compatibility
- Manual Prisma CLI commands still expect your shell Node version to be `20.19+`

## API Base Paths

The app currently mounts these route groups:

- `/api/auth`
- `/api/roles`
- `/api/permissions`
- `/api/users`
- `/api/documents`
- `/api/school-years`
- `/api/curricula`
- `/api/grade-levels`
- `/api/subjects`
- `/api/students`
- `/api/enrollments`
- `/api/sections`
- `/api/teachers`
- `/api/grades`
- `/api/system-settings`
- `/api/audit-logs`
- `/api/sf10`

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
- Real DB-backed integration tests that create an isolated Prisma schema and exercise login, register, enrollment creation, grade upsert, document lifecycle, system settings, audit logs, and SF10 flows

## Documentation

- [documentation/FLOW.md/](esf10/esf10_system_backend/documentation/FLOW.md)
- [documentation/dev_flow.md](esf10/esf10_system_backend/documentation/dev_flow.md)
- API endpoint docs under [documentation/api](/esf10/esf10_system_backend/documentation/api)
- Prisma schema at [prisma/schema.prisma](/esf10/esf10_system_backend/prisma/schema.prisma)
- Prisma CLI config at [prisma.config.ts](/esf10/esf10_system_backend/prisma.config.ts)

## Current Caveats

- Multipart document uploads in `cloudinary` mode need valid Cloudinary configuration
- Upload storage is environment-driven and exclusive, so the same running app instance does not use local and Cloudinary at the same time
- Audit logging now records write activity and manual SF10 events, but older rows created before this implementation will not contain the same metadata depth
