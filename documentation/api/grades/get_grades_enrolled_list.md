1️⃣ Get Grades by Enrollment

Fetch all grades for a specific enrollment.

This endpoint is read-only and does not allow grade modification.

Endpoint
GET /api/grades/enrollment/:enrollmentId

Authorization

Requires authentication

Requires permission: grades.view

🔒 Access Logic

Section adviser → allowed

Admin / Registrar / Viewer → allowed

Other teachers → forbidden

Path Parameters
Name	Type	Required	Description
enrollmentId	number	Yes	Enrollment ID
Example Request
GET /api/grades/enrollment/12

Success Response (200)
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
      }
    },
    {
      "id": 2,
      "enrollmentId": 12,
      "subjectId": 3,
      "period": "Q2",
      "value": 91,
      "source": "SYSTEM",
      "subject": {
        "id": 3,
        "code": "MATH",
        "name": "Mathematics"
      }
    }
  ]
}

Error Responses

Enrollment Not Found (404)

{
  "success": false,
  "message": "Enrollment not found"
}


Forbidden (403)

{
  "success": false,
  "message": "You do not have permission to view grades"
}

🧠 Notes

Grades are grouped by subject + grading period

FINAL grades are system-generated (not editable)

This endpoint does not expose student personal details