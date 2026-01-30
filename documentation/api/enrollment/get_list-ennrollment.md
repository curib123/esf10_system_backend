1️⃣ Get All Enrollments
GET /api/enrollments

Fetch a paginated list of enrollments with filters and search.

Authorization

Requires authentication

Requires permission: enrollment.view

Query Parameters
Name	Type	Required	Description
page	number	No	Page number (default: 1)
limit	number	No	Items per page (default: 20, max: 50)
schoolYearId	number	No	Filter by school year
gradeLevelId	number	No	Filter by grade level
status	string	No	ACTIVE, COMPLETED, IMPORTED
sectionId	number	No	Filter by section
q	string	No	Search by LRN, student name, or section name
Example Request
GET /api/enrollments?page=1&gradeLevelId=3&sectionId=5&q=Juan

{
    "success": true,
    "message": "Enrollments fetched successfully",
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
                "name": "Grade 3",
                "order": 3,
                "isActive": true,
                "createdAt": "2026-01-30T10:05:48.225Z",
                "updatedAt": "2026-01-30T10:05:48.225Z"
            },
            "schoolYear": {
                "id": 1,
                "year": "2025-2026",
                "isActive": true
            },
            "section": {
                "id": 1,
                "name": "B",
                "adviser": {
                    "id": 1,
                    "fullName": "System Admin",
                    "email": "admin@esf10.local"
                }
            }
        }
    ],
    "count": 1,
    "page": 1,
    "limit": 20
}