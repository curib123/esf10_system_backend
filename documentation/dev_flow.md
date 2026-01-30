# ESF10 System – Complete Development Flow (Updated)
*(Fully aligned with current Prisma schema, including Section)*

This document defines the **authoritative build and runtime flow** of the ESF10 (SF10) system.
Follow this order strictly to maintain **data integrity, DepEd compliance, and RBAC security**.

---

## 🧠 CORE PRINCIPLES

- **SF10 is GENERATED, never stored**
- **Enrollment is the academic truth**
- **Grades belong to Enrollment**
- **Curriculum rules are versioned**
- **Sections are operational, not academic**
- **Past data is immutable**
- **Soft delete uses `deletedAt`**
- **RBAC is fully data-driven**

---

## 🥇 1. School Year

**Model:** `SchoolYear`

**Fields**
- `year` (unique)
- `isActive`

**Rules**
- Exactly **ONE active school year**
- Inactive school year:
  - Disallows new enrollments
  - Locks grade encoding

---

## 🥈 2. Curriculum → Curriculum Version

### 2.1 Curriculum
Represents the **education program**, not the rules.

**Examples**
- K–12
- MATATAG
- Special Program

**Rules**
- Cannot delete if versions exist

---

### 2.2 Curriculum Version
Defines the **ruleset for a time period**.

**Fields**
- `name`
- `effectiveFrom`
- `effectiveTo`

**Rules**
- Enrollment references CurriculumVersion
- Once used → **IMMUTABLE**
- New school year → new version

---

## 🥉 3. Grade Level

**Model:** `GradeLevel`

**Fields**
- `code` (unique)
- `name`
- `order`
- `isActive`

**Rules**
- Controls SF10 ordering
- Inactive levels block enrollment

---

## 🏫 4. Section

**Model:** `Section`

**Belongs to**
- GradeLevel
- SchoolYear

**Optional**
- Adviser (`User` with TEACHER role)

**Rules**
- Unique per (gradeLevel, schoolYear, name)
- Created ONLY for active school year
- Reset every school year
- Cannot delete if enrollments exist

---

## 🧑‍🎓 5. Student

**Model:** `Student`

**Rules**
- LRN is immutable
- Soft delete only
- Soft-deleted students cannot enroll

---

## 🧠 6. Enrollment (CORE TRANSACTION)

**Model:** `Enrollment`

**Depends on**
- Student
- SchoolYear
- CurriculumVersion
- GradeLevel
- Optional Section

**Rules**
- One enrollment per student per school year
- Only ACTIVE enrollment accepts grades
- Status:
  - ACTIVE
  - COMPLETED
  - IMPORTED
- COMPLETED enrollments are read-only

Enrollment = **academic snapshot**

---

## 📊 7. Grade

**Model:** `Grade`

**Rules**
- Unique per (enrollment, subject, period)
- Periods: Q1–Q4, FINAL
- FINAL auto-calculated
- FINAL is read-only
- Locked after enrollment completion

---

## 📁 8. Document

**Model:** `Document`

**Rules**
- Belongs to Student
- Optionally linked to Enrollment
- Read-only after upload
- Soft delete only

---

## 🔐 9. Auth & RBAC

**Models**
- User
- Role
- Permission
- UserRole
- RolePermission

**Rules**
- Roles are soft-deletable
- Permissions are permanent
- All sensitive actions logged

---

## ⚙️ 10. System Settings

**Model:** `SystemSetting`

**Rules**
- Key/value only
- Cached in memory
- Used for global flags and grading rules

---

## 🧾 11. Audit Log (NO CRUD)

**Model:** `AuditLog`

**Rules**
- Append-only
- No update
- No delete
- Filter only

---

## 🧩 FINAL SYSTEM FLOW

```
SchoolYear
   ↓
Curriculum
   ↓
CurriculumVersion
   ↓
GradeLevel
   ↓
Section
   ↓
Student
   ↓
Enrollment
   ↓
Grade
   ↓
Document
```

---

## 🟢 GOLDEN RULE

> **Enrollment defines reality.  
> Curriculum defines structure.  
> Section defines placement.  
> SF10 is pure output.**
