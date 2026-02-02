# 📘 Get Grades by Enrollment API

Fetch all grades for a specific enrollment with DepEd descriptors and remarks.

This endpoint is **read-only** and returns enriched grade data including descriptors and passing status.

---

## 🎯 Intended Use

- Display student grades in grading forms
- Show quarterly progress with descriptors
- Build grade summary views
- Populate editable grade tables for advisers

---

## Endpoint

```
GET /api/grades/enrollment/:enrollmentId
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
GET /api/grades/enrollment/12
```

---

## Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "enrollmentId": 12,
      "subjectId": 3,
      "period": "Q1",
      "value": 89,
      "source": "SYSTEM",
      "subject": {
        "id": 3,
        "code": "MATH",
        "name": "Mathematics"
      },
      "roundedValue": 89,
      "descriptor": {
        "min": 85,
        "max": 89,
        "descriptor": "Very Satisfactory",
        "code": "VS"
      },
      "remarks": null,
      "isPassing": true
    },
    {
      "id": 5,
      "enrollmentId": 12,
      "subjectId": 3,
      "period": "FINAL",
      "value": 88.5,
      "source": "SYSTEM",
      "subject": {
        "id": 3,
        "code": "MATH",
        "name": "Mathematics"
      },
      "roundedValue": 89,
      "descriptor": {
        "min": 85,
        "max": 89,
        "descriptor": "Very Satisfactory",
        "code": "VS"
      },
      "remarks": "PASSED",
      "isPassing": true
    }
  ]
}
```

---

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | number | Grade record ID |
| enrollmentId | number | Associated enrollment ID |
| subjectId | number | Associated subject ID |
| period | string | Grading period (Q1, Q2, Q3, Q4, FINAL) |
| value | number | Raw grade value |
| source | string | Grade source (SYSTEM, IMPORTED) |
| subject | object | Subject details |
| roundedValue | number | Grade rounded to nearest whole number |
| descriptor | object | DepEd grade descriptor |
| remarks | string | PASSED or FAILED (only for FINAL grades) |
| isPassing | boolean | Whether grade meets passing threshold |

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

- Grades are ordered by subject, then by period
- FINAL grades include remarks (PASSED/FAILED)
- Quarterly grades do not include remarks
- Passing threshold is 75
- Descriptors follow DepEd Order No. 8, s. 2015

---

## 🧠 Notes

- This endpoint returns all periods including FINAL
- Use `roundedValue` for display purposes
- `remarks` is null for quarterly grades
- FINAL grades are auto-computed when all quarters exist
