# 📘 Get Report Card API

Fetch complete report card data for a specific enrollment.

This endpoint returns **comprehensive grade data** including student info, all subjects, all quarters, final grades, general average, and promotion status.

---

## 🎯 Intended Use

- Generate printable report cards
- Display complete student grade summary
- Determine promotion status
- Export to SF10 or other DepEd forms

---

## Endpoint

```
GET /api/grades/enrollment/:enrollmentId/report-card
```

---

## Authorization

- Requires authentication
- **Section adviser** → allowed
- **Users with `grades.view` permission** → allowed
- **Other users** → forbidden

---

## Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| enrollmentId | number | Yes | Enrollment ID |

---

## Example Request

```
GET /api/grades/enrollment/12/report-card
```

---

## Success Response (200)

```json
{
  "success": true,
  "data": {
    "enrollment": {
      "id": 12,
      "status": "ACTIVE"
    },
    "student": {
      "id": 1,
      "lrn": "123456789012",
      "firstName": "Juan",
      "middleName": "Santos",
      "lastName": "Dela Cruz"
    },
    "gradeLevel": {
      "id": 7,
      "code": "G7",
      "name": "Grade 7"
    },
    "schoolYear": {
      "id": 1,
      "year": "2025-2026"
    },
    "section": {
      "id": 1,
      "name": "Section A",
      "adviser": {
        "id": 5,
        "fullName": "Maria Clara"
      }
    },
    "subjects": [
      {
        "subject": {
          "id": 3,
          "code": "MATH",
          "name": "Mathematics"
        },
        "grades": {
          "Q1": { "value": 85, "rounded": 85 },
          "Q2": { "value": 88, "rounded": 88 },
          "Q3": { "value": 90, "rounded": 90 },
          "Q4": { "value": 92, "rounded": 92 },
          "FINAL": {
            "value": 88.75,
            "rounded": 89,
            "descriptor": {
              "min": 85,
              "max": 89,
              "descriptor": "Very Satisfactory",
              "code": "VS"
            },
            "remarks": "PASSED"
          }
        },
        "isComplete": true,
        "isPassing": true
      }
    ],
    "summary": {
      "totalSubjects": 8,
      "completedSubjects": 8,
      "passedSubjects": 8,
      "failedSubjects": 0,
      "generalAverage": {
        "value": 87.25,
        "rounded": 87,
        "descriptor": {
          "min": 85,
          "max": 89,
          "descriptor": "Very Satisfactory",
          "code": "VS"
        }
      },
      "overallRemarks": "PASSED",
      "isPromoted": true
    }
  }
}
```

---

## Response Structure

### Enrollment Object

| Field | Type | Description |
|-------|------|-------------|
| id | number | Enrollment ID |
| status | string | ACTIVE, COMPLETED, or IMPORTED |

### Student Object

| Field | Type | Description |
|-------|------|-------------|
| id | number | Student ID |
| lrn | string | Learner Reference Number |
| firstName | string | Student first name |
| middleName | string | Student middle name |
| lastName | string | Student last name |

### Grade Level Object

| Field | Type | Description |
|-------|------|-------------|
| id | number | Grade level ID |
| code | string | Grade level code (e.g., G7) |
| name | string | Grade level name |

### School Year Object

| Field | Type | Description |
|-------|------|-------------|
| id | number | School year ID |
| year | string | School year (e.g., 2025-2026) |

### Section Object

| Field | Type | Description |
|-------|------|-------------|
| id | number | Section ID |
| name | string | Section name |
| adviser | object | Adviser details |

### Subject Row Object

| Field | Type | Description |
|-------|------|-------------|
| subject | object | Subject details |
| grades | object | All grades by period |
| isComplete | boolean | Whether all quarters and final exist |
| isPassing | boolean | Whether final grade is passing |

### Summary Object

| Field | Type | Description |
|-------|------|-------------|
| totalSubjects | number | Total subjects in curriculum |
| completedSubjects | number | Subjects with final grades |
| passedSubjects | number | Subjects with passing final grade |
| failedSubjects | number | Subjects with failing final grade |
| generalAverage | object | Computed general average |
| overallRemarks | string | PASSED or FAILED |
| isPromoted | boolean | Whether student is promoted |

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

### Forbidden (403)

```json
{
  "success": false,
  "message": "You do not have permission to access these grades",
  "code": "FORBIDDEN"
}
```

---

## 🔒 Business Rules

- General average is computed from all FINAL grades
- `isPromoted` is true only if all subjects are passed and complete
- Subjects without all 4 quarters show null for FINAL
- General average is null if any subject is incomplete
- Passing threshold is 75 for all computations

---

## 🧠 Notes

- Use this endpoint for complete report card generation
- All curriculum subjects are included even without grades
- Quarterly grades show `null` if not yet encoded
- This is the most comprehensive grades endpoint
