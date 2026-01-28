# ESF10 System Backend (SF10 Management System)

A **DepEd-aligned ESF10 (SF10) backend system** built with **Node.js, Prisma, PostgreSQL**, and **RBAC (Role-Based Access Control)**.

This system is designed to:
- Manage **students, enrollments, grades, curricula**
- Support **historical grades & transferees**
- Generate **SF10 (Learner’s Permanent Record)** dynamically
- Enforce **audit-safe academic rules**
- Scale for real-world school deployments

---

## 🧠 Core Principles

- **SF10 is generated, never stored**
- **Enrollment = one grade level + one school year**
- **Only ONE active enrollment per student**
- **Past grades are read-only**
- **Curriculum versions never change once used**
- **Security first (RBAC before features)**

---

## 🛠️ Tech Stack

- **Node.js** (ES Modules)
- **Express**
- **Prisma ORM**
- **PostgreSQL (Neon compatible)**
- **JWT Authentication**
- **RBAC (User → Role → Permission)**
- **Cloudinary (Document storage)**

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Database connection (Neon / PostgreSQL)
DATABASE_URL='postgresql://user:password@host/db?sslmode=require'

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET="super_secret_jwt_key_change_this"
JWT_EXPIRES_IN="1d"

# Password hashing
BCRYPT_SALT_ROUNDS=10

# Cloudinary (Document uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_ROOT_FOLDER='esf10_system'
```

⚠️ **Never expose `.env` values to client-side code**

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
```

---

### 2️⃣ Prisma Migration (FIRST STEP)

```bash
npx prisma migrate dev --name init_esf10_rbac
```

This:
- Creates all tables
- Locks schema design
- Generates Prisma Client

---

### 3️⃣ Seed RBAC (REQUIRED)

```bash
npx prisma db seed
```

Seeds:
- All permissions
- Default roles:
  - `SUPER_ADMIN`
  - `REGISTRAR`
  - `TEACHER`
  - `VIEWER`
- Role → Permission mappings

---

### 4️⃣ Start the server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3001
```

---

## 🔐 RBAC Overview

### Roles

| Role | Description |
|----|----|
| SUPER_ADMIN | Full system access |
| REGISTRAR | Students, enrollment, SF10 |
| TEACHER | Grade encoding only |
| VIEWER | Read-only |

### Permission Model

```
User → Role → Permission
```

Permissions are **data-driven**, not hardcoded.

---

## 🎓 Academic Data Model

```
Student
 └── Enrollment (Grade Level + School Year)
      ├── Grades
      ├── Documents (optional)
      └── Curriculum Version
```

- One enrollment per grade level
- Only active enrollment is editable
- Historical enrollments are locked

---

## 📄 Document Management

- Supports SF9, report cards, birth certificates
- Documents can be linked to:
  - Student (general)
  - Specific enrollment (previous grades)
- Documents act as **evidence**, not data sources

---

## 📊 SF10 Generation

- SF10 is generated dynamically
- Reads:
  - Student enrollments
  - Grades
  - Curriculum versions
- Supports:
  - Transferees
  - Multiple curricula
  - Missing historical data

🚫 SF10 is **never stored** in the database

---

## 🧪 Development Rules

✔ Build RBAC first  
✔ Curriculum before enrollment  
✔ Enrollment before grades  
✔ Grades before SF10  

🚫 Do not edit past grades  
🚫 Do not hardcode roles  
🚫 Do not store SF10  

---

## 📘 Documentation

- `FLOW.md` – Full build & runtime flow
- `schema.prisma` – Source of truth for data model
- `prisma/seed.js` – RBAC and system seed

---


---

## 📌 License

This project is intended for **educational and institutional use**.  
Ensure compliance with **DepEd data privacy and record policies** before production deployment.

---

## ✨ Final Note

> **Security first, data second, output last.**  
> If this rule is followed, ESF10 will remain correct, auditable, and future-proof.

---
