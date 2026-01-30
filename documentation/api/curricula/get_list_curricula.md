Get Curricula Endpoint

GET /api/curricula

Returns a paginated list of curricula with their versions.

Authorization

Requires authentication

Requires permission: curriculum.read

Query Parameters
Parameter	Type	Optional	Description
page	number	✅	Page number (default: 1)
limit	number	✅	Items per page (default: 10)
search	string	✅	Search by curriculum name
hasActiveVersion	boolean	✅	Filter curricula with active versions
Example Request
GET /api/curricula?page=1&limit=10&search=k-12&hasActiveVersion=true

Success Response (200)
{
    "success": true,
    "message": "Curricula retrieved successfully",
    "data": [
        {
            "id": 1,
            "name": "K–12 Basic Education",
            "versions": []
        },
        {
            "id": 2,
            "name": "K–12 Basic Education",
            "versions": []
        },
        {
            "id": 3,
            "name": "K–12 Basic Education",
            "versions": []
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 3,
        "totalPages": 1
    }
}

🔒 Security Notes

Pagination is enforced server-side

Search is case-insensitive

Only authorized users can view curricula