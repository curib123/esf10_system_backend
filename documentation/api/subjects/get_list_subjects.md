Get Subjects Endpoint

GET /api/subjects

Returns a paginated list of subjects with search and filters.

Authorization

Requires authentication

Requires permission: subject.view

Query Parameters
Name	Type	Description
page	number	Page number (default: 1)
limit	number	Items per page (default: 10)
q	string	Search by subject code or name
curriculumVersionId	number	Filter by curriculum version
gradeLevelId	number	Filter by grade level
Example Request
GET /api/subjects?page=1&limit=10&gradeLevelId=2

Success Response (200)
{
    "success": true,
    "message": "Subjects fetched successfully",
    "data": [
        {
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
        },
        {
            "id": 6,
            "curriculumVersionId": 1,
            "gradeLevelId": 1,
            "code": "MATHs",
            "name": "Mathematicss",
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
    ],
    "count": 2,
    "page": 1,
    "limit": 10
}
🔒 Security Notes

Search is case-sensitive

Results are ordered by subject code ascending

Filtering is optional and combinable