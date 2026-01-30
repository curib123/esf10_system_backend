Get My Advised Students API

Fetch enrolled students belonging to sections advised by the currently authenticated user.

This endpoint is designed as the primary entry point for grading workflows.

🎯 Intended Use

Teacher grading dashboards

Adviser class lists

Entry point before grade encoding

Endpoint
GET /api/teachers/my-students

Authorization

Requires authentication

Requires permission: grades.view (or enrollment.view)

Access is automatically restricted to sections advised by the logged-in user

Query Parameters (Optional)
Name	Type	Required	Description
page	number	No	Page number (default: 1)
limit	number	No	Items per page (default: 20, max: 50)
schoolYearId	number	No	Filter by school year (defaults to active school year)
gradeLevelId	number	No	Filter by grade level
sectionId	number	No	Filter by section
status	string	No	ACTIVE, COMPLETED, IMPORTED (default: ACTIVE)
q	string	No	Search by LRN, student first name, last name, or section name
What This Endpoint Does

Returns only enrollments that:

belong to sections advised by the logged-in user

match the provided filters

Automatically scopes data to the adviser

Prevents teachers from seeing students in other sections

Supports pagination for large class lists

Example Requests
Basic (teacher dashboard)
GET /api/teachers/my-students

With pagination
GET /api/teachers/my-students?page=1&limit=10

Search by student name or LRN
GET /api/teachers/my-students?q=Juan

Filter by grade level
GET /api/teachers/my-students?gradeLevelId=1

Filter by section
GET /api/teachers/my-students?sectionId=2

Success Response (200)
{
    "success": true,
    "message": "Advised students fetched successfully",
    "data": [
        {
            "id": 1,
            "studentId": 1,
            "schoolYearId": 1,
            "curriculumVersionId": 1,
            "gradeLevelId": 1,
            "sectionId": 1,
            "status": "ACTIVE",
            "deletedAt": null,
            "createdAt": "2026-01-30T10:27:56.389Z",
            "student": {
                "id": 1,
                "lrn": "123456789010",
                "firstName": "Juan",
                "lastName": "Dela Cruz"
            },
            "gradeLevel": {
                "id": 1,
                "code": "G3",
                "name": "Grade 3"
            },
            "section": {
                "id": 1,
                "name": "B"
            },
            "schoolYear": {
                "id": 1,
                "year": "2025-2026"
            }
        },
        {
            "id": 6,
            "studentId": 3,
            "schoolYearId": 1,
            "curriculumVersionId": 1,
            "gradeLevelId": 1,
            "sectionId": 2,
            "status": "ACTIVE",
            "deletedAt": null,
            "createdAt": "2026-01-30T11:03:37.447Z",
            "student": {
                "id": 3,
                "lrn": "123456789011",
                "firstName": "Juan",
                "lastName": "Dela Cruz"
            },
            "gradeLevel": {
                "id": 1,
                "code": "G3",
                "name": "Grade 3"
            },
            "section": {
                "id": 2,
                "name": "Tae"
            },
            "schoolYear": {
                "id": 1,
                "year": "2025-2026"
            }
        }
    ]
}
Error Responses
Unauthorized (401)
{
  "success": false,
  "message": "Unauthorized"
}

Forbidden (403)
{
  "success": false,
  "message": "You do not have permission to view advised students"
}

Internal Server Error (500)
{
  "success": false,
  "message": "Failed to fetch advised students"
}

🔒 Security & Business Rules

Only the section adviser can view students in that section

RBAC permission is required

Cross-section access is not allowed

Default status filter is ACTIVE

Pagination is enforced to prevent large payloads

🧠 Notes

This endpoint is the recommended entry point for grading

Use the returned enrollment.id to:

fetch grades

encode grades

Grades are intentionally not included in this response

Completed or imported enrollments can be included only if explicitly filtered