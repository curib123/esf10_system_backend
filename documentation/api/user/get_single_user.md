Get User by ID Endpoint

GET /api/users/:id

Retrieves a single user along with their assigned roles.

Authorization

Requires authentication

Requires roles: SUPER_ADMIN

Requires permission: user.view

Path Parameters
Parameter	Type	Description
id	number	User ID
Success Response (200)
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@esf10.local",
    "fullName": "System Admin",
    "isActive": true,
    "createdAt": "2026-01-29T04:00:48.407Z",
    "roles": [
      {
        "role": {
          "id": 1,
          "name": "SUPER_ADMIN",
          "description": "Full system access",
          "createdAt": "2026-01-29T03:58:51.673Z",
          "updatedAt": "2026-01-29T03:58:51.673Z"
        }
      }
    ]
  }
}

Error Responses
Unauthorized (401)
{
  "message": "Unauthorized"
}

User Not Found (404)
{
  "success": false,
  "message": "User not found"
}

🔒 Notes

Passwords are never included in responses

Roles are returned as a relation array (roles → role)

This endpoint is restricted to administrators