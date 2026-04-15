# ESF10 System Runtime and Data Flow

This document explains how the current backend behaves at runtime and how the major entities relate to one another.

## 1. Application Flow

At startup the server does this:

1. Load environment variables
2. Build the Express app
3. Connect to PostgreSQL through Prisma
4. Mount API routes
5. Serve requests
6. Normalize errors through the global error handler

Main entry points:

- `src/server.js`
- `src/app.js`

Prisma 7 configuration note:

- Runtime database access uses the Prisma client plus the PostgreSQL adapter
- Prisma CLI configuration now comes from `prisma.config.ts`
- `prisma/schema.prisma` defines the datasource provider, but the connection URL is no longer stored there

## 2. Request Lifecycle

For most protected endpoints, the request path is:

```text
Request
-> authentication middleware
-> role/permission middleware
-> request validation middleware
-> controller
-> service
-> Prisma
-> normalized response
```

This is the intended pattern for new endpoints too.

Operational note:

- For manual Prisma CLI work such as `db push`, `generate`, `seed`, or `validate`, use Node `20.19+`

## 3. High-Level Domain Flow

The current academic flow is:

```text
SchoolYear
-> Curriculum
-> CurriculumVersion
-> GradeLevel
-> Subject
-> Section
-> Student
-> Enrollment
-> Grade
```

Additional support entities:

- `User`
- `Role`
- `Permission`
- `UserRole`
- `RolePermission`
- `Document`
- `SystemSetting`
- `AuditLog`

## 4. Relationship Rules That Matter

### Enrollment

Enrollment is the main transactional academic record.

Each enrollment links:

- one student
- one school year
- one curriculum version
- one grade level
- optionally one section

Important current constraints:

- only one enrollment per student per school year
- enrollment status can be `ACTIVE`, `COMPLETED`, or `IMPORTED`
- grade encoding is only allowed for active enrollments

### Grades

Grades are attached to enrollments, not directly to students.

Rules currently implemented:

- quarter periods are `Q1`, `Q2`, `Q3`, and `Q4`
- `FINAL` exists but is auto-computed
- one grade per `(enrollment, subject, period)`
- subject must belong to the enrollment's curriculum version and grade level

### Sections

Sections are organizational placement records.

Current section behavior:

- section belongs to a school year
- section belongs to a grade level
- section may have an adviser
- section name is unique within `(gradeLevelId, schoolYearId)`

## 5. RBAC Flow

Authorization works like this:

```text
User
-> UserRole
-> Role
-> RolePermission
-> Permission
```

At login:

1. user is looked up
2. assigned roles are loaded
3. permissions are derived from those roles
4. JWT is issued with `userId`, `roles`, and `permissions`

At request time:

1. JWT is verified
2. `req.user` is populated
3. middleware checks role and/or permissions

## 6. Soft Delete Flow

Some modules use `deletedAt` instead of hard deletes.

Current examples:

- users
- students
- enrollments
- documents
- roles

Meaning:

- records may still exist in the database
- service queries often filter out deleted records
- auth and user-management flows already respect this pattern in key places

## 7. Current Reporting Flow

The backend currently supports these grading/reporting reads:

- grading configuration
- grades by enrollment
- final grades by enrollment
- full report card
- quarter summary

## 8. Additional Runtime Flows Now Implemented

The backend now also supports:

- Document upload, listing, retrieval, and soft delete
- System settings listing plus single and bulk updates
- Audit log listing and CSV export
- SF10 preview, generation, and JSON export

These flows use the same request pipeline as the other modules:

```text
Request
-> authentication middleware
-> permission middleware
-> validation middleware
-> controller
-> service
-> Prisma
-> normalized response
```

## 9. Operational Rule of Thumb

Use this mental model:

```text
RBAC guards access
Master data defines allowed structure
Enrollment captures academic placement
Grades describe performance inside that enrollment
Reports read from enrollment and grade data
```
