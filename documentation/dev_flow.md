✅ 1. School Year (DONE)

You already have:

year

isActive

Enforced uniqueness

Linked to Enrollment

👉 Rule to enforce:

Only ONE active school year at a time

🔥 NEXT: WHAT TO BUILD (IN ORDER)
🥈 2. Curriculum → Curriculum Version

Why next?
Enrollment depends on CurriculumVersion, not Curriculum directly.

CRUD order

Curriculum

create curriculum (e.g. “K–12 Basic Ed”)

list curricula

Curriculum Version

create version (e.g. “2025–2026”)

effectiveFrom / effectiveTo

ONE active version per curriculum

Rules

Old versions stay immutable (historical grading)

New year → new curriculum version (even if subjects don’t change)

✅ After this, your system can support versioned education rules

🥉 3. Subject

Subjects depend on:

CurriculumVersion

Grade Level

CRUD

create subject

list by curriculumVersion + gradeLevel

update subject name/code

soft delete (optional)

Rule
@@unique([curriculumVersionId, gradeLevel, code])


💡 This prevents duplicate Math subjects in the same grade.

🏫 4. Student

You already designed this correctly.

CRUD

create student

update student

soft delete student

search (LRN, name)

Rules

NEVER hard delete

LRN is immutable

Soft-deleted students can’t enroll

🧠 5. Enrollment (MOST IMPORTANT)

This is the core transaction of the system.

Depends on:

Student

SchoolYear

CurriculumVersion

CRUD

enroll student

update enrollment (section, status)

soft delete enrollment

Rules

❌ No duplicate enrollment per year:

@@unique([studentId, schoolYearId])


❌ Cannot enroll if:

SchoolYear is not active

Student is soft deleted

📊 6. Grade

Grades depend on:

Enrollment

Subject

CRUD

create grade

update grade

import grades (bulk)

recompute FINAL grade

Rules

Q1–Q4 auto-calculate FINAL

FINAL should be read-only

📁 7. Document

Used for:

Report cards

Birth certificate

Enrollment proof

CRUD

upload document

list documents per student

soft delete

🔐 8. AUTH & RBAC (ADMIN SIDE)

You already modeled this perfectly.

Build order

Permission CRUD

Role CRUD

Assign permissions to role

Assign role to user

Rule

Roles are soft-deletable

Permissions are NOT soft-deleted (system integrity)

⚙️ 9. System Settings

Used for:

active grading rules

enrollment deadlines

system flags

CRUD

key/value only

cached in memory

🧾 10. Audit Log (NO CRUD)

This is read-only.

Only:

list logs

filter by user / entity / date

🚫 No update
🚫 No delete

🧩 FINAL FLOW (BIG PICTURE)
SchoolYear
   ↓
Curriculum
   ↓
CurriculumVersion
   ↓
Subject
   ↓
Student
   ↓
Enrollment
   ↓
Grade
   ↓
Document
