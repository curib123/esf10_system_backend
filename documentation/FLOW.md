# ESF10 System – Updated Application & Development Flow
*(Aligned with Current Prisma Schema)*

This document defines the **correct build and runtime flow** of the ESF10 (SF10) system based on the **latest Prisma schema**.

---

## 🧠 CORE RULES

- **SF10 is GENERATED, never stored**
- **Enrollment = Student + School Year**
- **Only ONE ACTIVE enrollment per student per school year**
- **Curriculum Versions are immutable once used**
- **Grades belong to Enrollment, not Student**
- **Past enrollments are READ-ONLY**
- **Soft deletes use `deletedAt`**

---

## PHASE 1 – DATABASE & RBAC FOUNDATION

### 1.1 Prisma Migration
```bash
npx prisma migrate dev --name init_esf10
```

Creates:
- Core entities
- RBAC structure
- Relations & constraints
- Prisma Client

---

### 1.2 RBAC Seed
```bash
npx prisma db seed
```

Seeds:
- Permissions
- Roles: SUPER_ADMIN, REGISTRAR, TEACHER, VIEWER
- Role–Permission mappings

---

### 1.3 Initial SUPER_ADMIN
- Create admin user
- Assign SUPER_ADMIN role

---

## PHASE 2 – SYSTEM CONFIGURATION

### 2.1 System Settings
Configured via `SystemSetting`:
- School name
- Address
- Defaults

### 2.2 School Year
- Create school years
- Exactly ONE active school year
- Closing locks grades & enrollments

---

## PHASE 3 – CURRICULUM SETUP

### 3.1 Curriculum
Examples:
- K–12
- MATATAG
- Special programs

### 3.2 Curriculum Versions
- Name
- Effective years
- Locked once used

### 3.3 Grade Levels
- Ordered
- Active/inactive

### 3.4 Subjects
- Per curriculum version & grade level
- Immutable once grades exist

---

## PHASE 4 – SECTION MANAGEMENT

- Sections belong to Grade Level + School Year
- Optional adviser (Teacher)
- Unique per year

---

## PHASE 5 – STUDENT & ENROLLMENT

### 5.1 Student Registration
- Personal info only
- No grades yet

### 5.2 Enrollment
Links:
- Student
- School Year
- Curriculum Version
- Grade Level
- Section (optional)

Rules:
- One enrollment per student per school year
- Status: ACTIVE, COMPLETED, IMPORTED

### 5.3 Completing Enrollment
- Set status to COMPLETED
- Locks record

---

## PHASE 6 – GRADE MANAGEMENT

### 6.1 Grade Encoding
- Only ACTIVE enrollment
- Periods: Q1–Q4, FINAL

### 6.2 Imported Grades
- Status: IMPORTED
- Source: IMPORTED
- Immediately locked

### 6.3 Grade Locking
- On completion or year close
- Unlock requires admin + audit log

---

## PHASE 7 – DOCUMENT MANAGEMENT

- Belongs to Student
- Optionally linked to Enrollment
- Read-only after upload

---

## PHASE 8 – SF10 GENERATION

- Fetch enrollments
- Sort by grade order
- Fetch grades per enrollment
- Generate dynamically

---

## PHASE 9 – DASHBOARD & REPORTS

- Enrollment stats
- Missing grades
- Promotion readiness
- Exports

---

## 🔐 SECURITY FLOW

1. Login
2. Resolve roles
3. Resolve permissions
4. Check permissions per action
5. Log sensitive actions

---

## ❌ FORBIDDEN

- Storing SF10
- Editing past enrollments
- Mixing curricula
- Bypassing RBAC

---

## 🟢 FINAL RULE

**Enrollment is truth. Curriculum defines structure. SF10 is output.**
