# 📘 Get Quarter Summary API

Fetch class-level statistics for a specific subject and grading period.

This endpoint provides **aggregated grade statistics** for advisers to monitor class performance.

---

## 🎯 Intended Use

- Monitor class performance per subject
- Identify students needing intervention
- Generate class summary reports
- Track passing rates per quarter

---

## Endpoint

```
GET /api/grades/summary
```

---

## Authorization

- Requires authentication
- **Section adviser only** → allowed
- **Other users** → forbidden

---

## Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| sectionId | number | Yes | Section ID |
| subjectId | number | Yes | Subject ID |
| period | string | Yes | Grading period (Q1, Q2, Q3, Q4) |

---

## Example Request

```
GET /api/grades/summary?sectionId=1&subjectId=5&period=Q1
```

---

## Success Response (200)

```json
{
  "success": true,
  "data": {
    "totalStudents": 35,
    "gradedStudents": 35,
    "average": 84,
    "highest": 98,
    "lowest": 72,
    "passingCount": 32,
    "failingCount": 3,
    "passingRate": 91
  }
}
```

---

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| totalStudents | number | Total students enrolled in section |
| gradedStudents | number | Students with grades for this period |
| average | number | Class average (rounded) |
| highest | number | Highest grade in class |
| lowest | number | Lowest grade in class |
| passingCount | number | Students with passing grades |
| failingCount | number | Students with failing grades |
| passingRate | number | Percentage of passing students |

---

## Response When No Grades Exist

```json
{
  "success": true,
  "data": {
    "totalStudents": 35,
    "gradedStudents": 0,
    "average": null,
    "highest": null,
    "lowest": null,
    "passingCount": 0,
    "failingCount": 0,
    "passingRate": 0
  }
}
```

---

## Error Responses

### Missing Parameters (400)

```json
{
  "success": false,
  "message": "sectionId, subjectId, and period are required"
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

### Section Not Found (404)

```json
{
  "success": false,
  "message": "Section not found",
  "code": "SECTION_NOT_FOUND"
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

---

## 🔒 Business Rules

- Only section advisers can view their section's statistics
- Only ACTIVE enrollments are included
- FINAL period is not allowed (use report card instead)
- Passing threshold is 75
- Average is rounded to nearest whole number

---

## 🧠 Notes

- Use this to identify at-risk students early
- Compare passing rates across quarters
- Statistics exclude inactive or dropped enrollments
- Helpful for parent-teacher conferences
