# 📘 Get Final Grades by Enrollment API

Fetch only the final grades for a specific enrollment.

This endpoint returns **computed FINAL grades** with full DepEd descriptors and remarks.

---

## 🎯 Intended Use

- Display final grade summary
- Generate promotion lists
- Build report card final grade section
- Export final grades for records

---

## Endpoint

```
GET /api/grades/enrollment/:enrollmentId/final
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
GET /api/grades/enrollment/12/final
```

---

## Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "subject": {
        "id": 3,
        "code": "MATH",
        "name": "Mathematics"
      },
      "period": "FINAL",
      "value": 88.75,
      "roundedValue": 89,
      "descriptor": {
        "min": 85,
        "max": 89,
        "descriptor": "Very Satisfactory",
        "code": "VS"
      },
      "remarks": "PASSED",
      "isPassing": true
    },
    {
      "subject": {
        "id": 4,
        "code": "SCI",
        "name": "Science"
      },
      "period": "FINAL",
      "value": 92.25,
      "roundedValue": 92,
      "descriptor": {
        "min": 90,
        "max": 100,
        "descriptor": "Outstanding",
        "code": "O"
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
| subject | object | Subject details (id, code, name) |
| period | string | Always "FINAL" |
| value | number | Computed final grade value |
| roundedValue | number | Grade rounded to nearest whole number |
| descriptor | object | DepEd grade descriptor |
| remarks | string | PASSED or FAILED |
| isPassing | boolean | Whether grade meets passing threshold (75) |

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

- Only returns subjects with complete quarterly grades (Q1-Q4)
- Final grades are computed using configured quarter weights
- Default computation: (Q1 + Q2 + Q3 + Q4) / 4
- Subjects with incomplete quarters are excluded
- Final grades are stored in database for performance

---

## 🧠 Notes

- Final grades are auto-computed when all 4 quarters are submitted
- Use this endpoint for final grade reports
- For full report card data, use `/report-card` endpoint instead
- Remarks are always included for final grades
