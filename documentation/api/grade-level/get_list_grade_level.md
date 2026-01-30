Get Grade Levels Endpoint

GET /api/grade-levels

Returns a paginated list of grade levels with search and filters.

Authorization

Requires authentication

Requires permission: grade_level.view

Query Parameters
Name	Type	Description
page	number	Page number (default: 1)
limit	number	Items per page (default: 10)
q	string	Search by code or name
isActive	boolean	Filter by active status
Example Request
GET /api/grade-levels?page=1&limit=10&q=Grade&isActive=true

Success Response (200)
{
    "success": true,
    "message": "Grade levels fetched successfully",
    "data": [
        {
            "id": 1,
            "code": "G1",
            "name": "Grade 1",
            "order": 1,
            "isActive": true,
            "createdAt": "2026-01-30T04:33:58.068Z",
            "updatedAt": "2026-01-30T04:33:58.068Z"
        },
        {
            "id": 2,
            "code": "G2",
            "name": "Grade 2",
            "order": 2,
            "isActive": true,
            "createdAt": "2026-01-30T04:35:14.950Z",
            "updatedAt": "2026-01-30T04:35:14.950Z"
        }
    ],
    "count": 2,
    "page": 1,
    "limit": 10
}

🔒 Security Notes

Search is case-sensitive

Results are ordered by order ascending