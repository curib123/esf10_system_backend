# ESF10 System – Application & Development Flow

This document describes the **correct flow** of building and operating the ESF10 (SF10) system.
Follow this order strictly to ensure data integrity, RBAC security, and DepEd compliance.

---

## 🧠 CORE PRINCIPLES

- **SF10 is generated, not stored**
- **Enrollment = one grade level + one school year**
- **Only ONE active enrollment per student**
- **Past records are read-only**
- **Curriculum versions never change once used**

---

## PHASE 1 – DATABASE & RBAC FOUNDATION (FIRST)

### 1.1 Prisma Migration (MANDATORY FIRST STEP)

```bash
npx prisma migrate dev --name init_esf10_rbac
```

This:
- Creates all tables
- Locks schema design
- Generates Prisma Client

🚫 Do not build features before this step.

---

### 1.2 RBAC Seed (REQUIRED)

```bash
npx prisma db seed
```

Seeds:
- All permissions
- Default roles:
  - SUPER_ADMIN
  - REGISTRAR
  - TEACHER
  - VIEWER
- Role → Permission mappings

RBAC is now **data-driven**, not hardcoded.

---

### 1.3 (Optional) Seed SUPER_ADMIN User
- Create initial admin account
- Assign SUPER_ADMIN role

---

## PHASE 2 – SYSTEM CONFIGURATION

### 2.1 System Settings
Configure:
- School name
- Address
- Active grading periods
- System defaults

---

### 2.2 School Year Management
- Create school year
- Activate exactly ONE school year
- Closing a school year locks grades

---

## PHASE 3 – CURRICULUM SETUP (BEFORE STUDENTS)

### 3.1 Curriculum
Examples:
- K–12
- MATATAG
- Private / Special

---

### 3.2 Curriculum Versions
Each curriculum can have multiple versions:
- Version name
- Effective years
- Once used → LOCKED

---

### 3.3 Subjects
- Created per curriculum version
- Assigned per grade level
- Immutable once grades exist

🚫 Never edit subjects after grade encoding starts.

---

## PHASE 4 – STUDENT & ENROLLMENT FLOW

### 4.1 Student Registration
- Encode student information
- No grades at this stage

---

### 4.2 Enrollment (CRITICAL RULE)
- One enrollment per student per school year
- Only one ACTIVE enrollment

Enrollment includes:
- Grade level
- School year
- Curriculum version

---

## PHASE 5 – GRADE MANAGEMENT

### 5.1 Grade Encoding
- Encode grades ONLY for ACTIVE enrollment
- Based on curriculum subjects
- Grading periods: Q1–Q4 / FINAL

---

### 5.2 Imported Grades (Transferees)
- Create historical enrollment
- Assign correct curriculum version
- Encode grades as IMPORTED
- Lock immediately

---

### 5.3 Grade Locking
- When school year is closed
- Grades become read-only
- Unlock requires admin + audit log

---

## PHASE 6 – DOCUMENT MANAGEMENT

- Upload SF9
- Upload birth certificate
- Upload other credentials
- Documents are read-only after upload

---

## PHASE 7 – SF10 GENERATION (LAST)

### 7.1 Generation Logic
- Fetch all enrollments (sorted by grade level)
- Fetch grades per enrollment
- Respect curriculum differences
- Render dynamically

---

### 7.2 Excel Templates
- One template per curriculum/version
- Print-ready (A4 / Legal)
- No manual editing allowed

---

## PHASE 8 – DASHBOARD & REPORTS

- Enrollment statistics
- Missing grades
- Promotion readiness
- Exportable reports

---

## 🔐 RUNTIME SECURITY FLOW

1. User logs in
2. Roles loaded
3. Permissions resolved
4. Every action checks permission
5. Sensitive actions logged in AuditLog

---

## ❌ WHAT NOT TO DO

🚫 Store SF10 in database  
🚫 Allow editing past enrollments  
🚫 Mix subjects across curricula  
🚫 Hardcode roles in backend  
🚫 Encode grades without enrollment  

---

## 🟢 GOLDEN RULE

> **Security first, data second, output last.**

---

