# 📘 Encode / Update Grades API

Create or update grades for a specific enrollment.

This endpoint uses **UPSERT logic**:
- Creates a grade if it does not exist
- Updates the grade if it already exists

---

## 🎯 Intended Use

- Teacher grade encoding
- Adviser grading workflows
- Controlled and secure grade entry

This endpoint is **NOT** intended for:
- Admin manual grade editing
- Final grade computation (handled separately)

---

## Endpoint

POST /api/grades/enrollment/:enrollmentId


---

## Authorization

- Requires authentication
- Requires permission: `grades.create`
- **Must be the section adviser**

> ⚠️ Even admins cannot encode grades unless they are the assigned adviser.

---

## Path Parameters

| Name | Type | Required | Description |
|----|----|----|----|
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
    }
  ]
}
Request Body Fields
grades (array, required)
Each grade object must include:

Field	Type	Required	Description
subjectId	number	Yes	Subject ID
period	string	Yes	Allowed values: Q1, Q2, Q3, Q4
value	number	Yes	Grade value (0–100)
✅ Allowed Grading Periods
Only the following grading periods are accepted:

Q1

Q2

Q3

Q4

❌ FINAL is not allowed in this endpoint
(final grades are system-computed)

Success Response (200)
{
  "success": true,
  "message": "Grades saved successfully"
}
Error Responses
Enrollment Not Found (404)
{
  "success": false,
  "message": "Enrollment not found"
}
Not Section Adviser (403)
{
  "success": false,
  "message": "Only the section adviser can encode grades"
}
Enrollment Not Active (400)
{
  "success": false,
  "message": "Enrollment is not active"
}
Empty Grades Payload (400)
{
  "success": false,
  "message": "Grades payload cannot be empty"
}
Invalid Grade Payload (400)
{
  "success": false,
  "message": "Invalid grade payload"
}
Invalid Grading Period (400)
{
  "success": false,
  "message": "Invalid grading period"
}
Invalid Grade Value (400)
{
  "success": false,
  "message": "Grade value must be between 0 and 100"
}
Duplicate Subject + Period (400)
{
  "success": false,
  "message": "Duplicate subject and grading period detected"
}
Invalid Subject for Enrollment (400)
{
  "success": false,
  "message": "Subject does not belong to the enrollment curriculum or grade level"
}
🔒 Business Rules (Strictly Enforced)
Only the assigned section adviser may encode grades

Admin users cannot encode grades

Enrollment must be ACTIVE

Subjects must:

Belong to the enrollment’s curriculum version

Match the enrollment’s grade level

Grades are unique per:

enrollment

subject

grading period

FINAL grades:

Are not accepted

Are computed separately

All operations are wrapped in a transaction

Partial writes are prevented