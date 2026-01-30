Get Sections Endpoint

GET /api/sections

Returns a paginated list of sections with filters and search.

Authorization

Requires authentication

Requires permission: section.view

Query Parameters
Name	Type	Description
page	number	Page number (default: 1)
limit	number	Items per page (default: 20, max: 50)
gradeLevelId	number	Filter by grade level
schoolYearId	number	Filter by school year
adviserId	number	Filter by adviser
q	string	Search by section name
Example Requests
GET /api/sections
GET /api/sections?gradeLevelId=4&schoolYearId=3
GET /api/sections?q=Rose
GET /api/sections?adviserId=12

Success Response (200)
{
    "success": true,
    "message": "Sections fetched successfully",
    "data": [
        {
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
    ],
    "count": 1,
    "page": 1,
    "limit": 20
}

🔒 Performance Notes

Indexed by grade level, school year, and adviser

Lightweight joins only

Stable ordering by grade level then section name