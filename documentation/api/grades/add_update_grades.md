2️⃣ Encode / Update Grades

Create or update grades for an enrollment.

This endpoint uses UPSERT logic (create if missing, update if exists).

Endpoint
POST /api/grades/enrollment/:enrollmentId

Authorization

Requires authentication

Requires permission: grades.create

Must be the section adviser

Path Parameters
Name	Type	Required	Description
enrollmentId	number	Yes	Enrollment ID
Request Body
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
Field	Type	Required	Description
subjectId	number	Yes	Subject ID
period	string	Yes	Q1, Q2, Q3, Q4
value	number	Yes	Grade value (0–100)
Success Response (200)
{
  "success": true,
  "message": "Grades saved successfully"
}

Error Responses

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


Enrollment Not Found (404)

{
  "success": false,
  "message": "Enrollment not found"
}

🔒 Business Rules

Only the assigned section adviser may encode grades

Admins cannot encode grades

Completed enrollments cannot be modified

Grades are stored per:

enrollment

subject

grading period