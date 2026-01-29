Get All Users Endpoint

GET /api/users

Retrieves a paginated list of all users in the system.

Authorization

Requires authentication

Requires roles: SUPER_ADMIN

Requires permission: user.view

Query Parameters
Parameter	Type	Description
page	number	Page number (default: 1)
limit	number	Items per page (default: 10)
search	string	Search by email or full name
isActive	boolean	Filter by active status
sortBy	string	Sort field (default: createdAt)
sortOrder	string	asc or desc (default: desc)
Success Response (200)
{
  "success": true,
  "data": [
    {
      "id": 4,
      "email": "viewer@esf10.local",
      "fullName": "Viewer User",
      "isActive": true,
      "createdAt": "2026-01-29T04:00:56.870Z",
      "roles": [
        {
          "role": {
            "id": 4,
            "name": "VIEWER"
          }
        }
      ]
    },
    {
      "id": 3,
      "email": "teacher@esf10.local",
      "fullName": "Teacher User",
      "isActive": true,
      "createdAt": "2026-01-29T04:00:54.601Z",
      "roles": [
        {
          "role": {
            "id": 3,
            "name": "TEACHER"
          }
        }
      ]
    },
    {
      "id": 2,
      "email": "registrar@esf10.local",
      "fullName": "Registrar User",
      "isActive": true,
      "createdAt": "2026-01-29T04:00:51.947Z",
      "roles": [
        {
          "role": {
            "id": 2,
            "name": "REGISTRAR"
          }
        }
      ]
    },
    {
      "id": 1,
      "email": "admin@esf10.local",
      "fullName": "System Admin",
      "isActive": true,
      "createdAt": "2026-01-29T04:00:48.407Z",
      "roles": [
        {
          "role": {
            "id": 1,
            "name": "SUPER_ADMIN"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  }
}

Error Responses
Unauthorized (401)
{
  "message": "Unauthorized"
}

🔒 Notes

Passwords are never included in responses

Roles are returned as a relation array (roles → role)

Designed for admin user management interfaces

Supports pagination, filtering, and sorting