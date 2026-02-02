# 📘 Create / Update Grades API

Create or update grades for a specific enrollment.

This endpoint uses **UPSERT logic** and automatically computes FINAL grades when all quarters are complete.

---

## 🎯 Intended Use

- Teacher grade encoding
- Adviser grading workflows
- Batch grade entry per student
- Quarterly grade updates

This endpoint is **NOT** intended for:

- Admin manual grade editing
- Direct FINAL grade modification

---

## Endpoint

```
POST /api/grades/enrollment/:enrollmentId
```

**Also supports:** `PUT /api/grades/enrollment/:enrollmentId`

---

## Authorization

- Requires authentication
- **Must be the section adviser**

> ⚠️ Even admins cannot encode grades unless they are the assigned adviser.

---

## Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| enrollmentId | number | Yes | Enrollment ID |

---

## Request Body

```json
{
  "grades": [
    {
      "subjectId": 1,
      "period": "Q1",
      "value": 88
    },
    {
      "subjectId": 1,
      "period": "Q2",
      "value": 90
    },
    {
      "subjectId": 2,
      "period": "Q1",
      "value": 85
    }
  ]
}
```

---

## Request Body Fields

### grades (array, required)

Each grade object must include:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| subjectId | number | Yes | Subject ID |
| period | string | Yes | Grading period (Q1, Q2, Q3, Q4) |
| value | number | Yes | Grade value (0–100) |

---

## ✅ Allowed Grading Periods

| Period | Allowed |
|--------|---------|
| Q1 | ✅ Yes |
| Q2 | ✅ Yes |
| Q3 | ✅ Yes |
| Q4 | ✅ Yes |
| FINAL | ❌ No |

> ❌ FINAL is not allowed — final grades are **auto-computed** when all 4 quarters exist.

---

## Success Response (200)

```json
{
  "success": true,
  "message": "Grades saved successfully. Final grades auto-computed."
}
```

---

## Error Responses

### Enrollment Not Found (404)

```json
{
  "success": false,
  "message": "Enrollment not found",
  "code": "ENROLLMENT_NOT_FOUND"
}
```

### Not Section Adviser (403)

```json
{
  "success": false,
  "message": "Only the section adviser can encode grades",
  "code": "NOT_SECTION_ADVISER"
}
```

### Enrollment Not Active (400)

```json
{
  "success": false,
  "message": "Enrollment is not active",
  "code": "ENROLLMENT_NOT_ACTIVE"
}
```

### Empty Grades Payload (400)

```json
{
  "success": false,
  "message": "No grades provided",
  "code": "EMPTY_GRADES_PAYLOAD"
}
```

### Invalid Grade Payload (400)

```json
{
  "success": false,
  "message": "Invalid grade payload structure",
  "code": "INVALID_GRADE_PAYLOAD"
}
```

### Invalid Grading Period (400)

```json
{
  "success": false,
  "message": "Invalid grading period",
  "code": "INVALID_GRADING_PERIOD"
}
```

### Invalid Grade Value (400)

```json
{
  "success": false,
  "message": "Grade must be a number between 0 and 100",
  "code": "INVALID_GRADE_VALUE"
}
```

### Duplicate Subject + Period (400)

```json
{
  "success": false,
  "message": "Duplicate subject and period detected",
  "code": "DUPLICATE_SUBJECT_PERIOD"
}
```

### Invalid Subject for Enrollment (400)

```json
{
  "success": false,
  "message": "Subject does not belong to this enrollment",
  "code": "INVALID_SUBJECT_FOR_ENROLLMENT"
}
```

### Final Not Editable (400)

```json
{
  "success": false,
  "message": "Final grades are auto-computed and cannot be edited",
  "code": "FINAL_NOT_EDITABLE"
}
```

---

## 🔒 Business Rules (Strictly Enforced)

1. **Only the assigned section adviser may encode grades**
   - Admin users cannot encode grades

2. **Enrollment must be ACTIVE**
   - Completed or imported enrollments cannot be edited

3. **Subjects must match enrollment**
   - Belong to the enrollment's curriculum version
   - Match the enrollment's grade level

4. **Grades are unique per**
   - Enrollment
   - Subject
   - Grading period

5. **FINAL grades**
   - Cannot be submitted manually
   - Auto-computed when Q1-Q4 exist
   - Uses configured quarter weights

6. **Grade values**
   - Must be between 0 and 100
   - Stored as float for precision

7. **Atomic transactions**
   - All grades saved or none
   - Partial writes prevented

---

## 🧠 Notes

- Use UPSERT: existing grades are updated, new grades are created
- Submit multiple subjects/periods in one request
- FINAL grades auto-compute after successful save
- Both POST and PUT methods are supported
- Idempotent: safe to retry failed requests
