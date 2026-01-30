Get Section by ID Endpoint

GET /api/sections/:id

Returns full details of a single section.

Authorization

Requires authentication

Requires permission: section.view

Path Parameters

id (number, required) – Section ID

Success Response (200)
{
    "success": true,
    "message": "Section fetched successfully",
    "data": {
        "id": 1,
        "name": "Tae",
        "gradeLevelId": 1,
        "schoolYearId": 1,
        "adviserId": 1,
        "createdAt": "2026-01-30T10:07:54.151Z",
        "updatedAt": "2026-01-30T10:07:54.151Z",
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
            "isActive": false
        },
        "adviser": {
            "id": 1,
            "fullName": "System Admin"
        }
    }
}

Error Response (404)
{
  "success": false,
  "message": "Section not found"
}