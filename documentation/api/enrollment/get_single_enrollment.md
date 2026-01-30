2️⃣ Get Enrollment by ID
GET /api/enrollments/:id

Fetch a single enrollment by ID.

Authorization

Requires authentication

Requires permission: enrollment.view

Path Parameters
Name	Type	Required	Description
id	number	Yes	Enrollment ID
Example Request
GET /api/enrollments/12

{
    "success": true,
    "message": "Enrollment fetched successfully",
    "data": {
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
            "middleName": "Santos",
            "lastName": "Dela Cruz",
            "gender": "Male",
            "birthDate": "2012-05-14T00:00:00.000Z",
            "address": "Quezon City",
            "deletedAt": null,
            "createdAt": "2026-01-30T10:20:18.654Z",
            "updatedAt": "2026-01-30T10:20:18.654Z"
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
        "curriculumVersion": {
            "id": 1,
            "curriculumId": 1,
            "name": "K–12 2025–2026",
            "effectiveFrom": 2025,
            "effectiveTo": null
        },
        "section": {
            "id": 1,
            "name": "B",
            "gradeLevelId": 1,
            "schoolYearId": 1,
            "adviserId": 1,
            "createdAt": "2026-01-30T10:07:54.151Z",
            "updatedAt": "2026-01-30T10:16:12.627Z",
            "adviser": {
                "id": 1,
                "fullName": "System Admin",
                "email": "admin@esf10.local"
            }
        }
    }
}

Error Response (Not Found)
{
  "success": false,
  "message": "Enrollment not found"
}