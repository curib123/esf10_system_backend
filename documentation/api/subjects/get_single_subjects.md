Get Subject by ID Endpoint

GET /api/subjects/:id

Returns a single subject.

Authorization

Requires authentication

Requires permission: subject.view

URL Parameters

id (number, required) – Subject ID

Success Response (200)
{
    "success": true,
    "message": "Subject fetched successfully",
    "data": {
        "id": 4,
        "curriculumVersionId": 1,
        "gradeLevelId": 1,
        "code": "MATH",
        "name": "Mathematics",
        "gradeLevel": {
            "id": 1,
            "code": "G1",
            "name": "Grade One",
            "order": 2,
            "isActive": false,
            "createdAt": "2026-01-30T04:33:58.068Z",
            "updatedAt": "2026-01-30T08:03:38.830Z"
        },
        "curriculumVersion": {
            "id": 1,
            "curriculumId": 1,
            "name": "K–12 2025–2026",
            "effectiveFrom": 2025,
            "effectiveTo": null
        }
    }
}

Error Response (404)
{
  "success": false,
  "message": "Subject not found"
}
