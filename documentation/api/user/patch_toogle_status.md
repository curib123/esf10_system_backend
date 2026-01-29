Toggle User Active Status Endpoint

PATCH /api/users/:id/toggle-status

Activates or deactivates a user account.

Authorization

Requires authentication

Requires roles: SUPER_ADMIN

Requires permission: user.update

Path Parameters
Parameter	Type	Description
id	number	User ID
Success Response (200)
{
  "success": true,
  "message": "User activated",
  "data": {
    "id": 1,
    "email": "admin@esf10.local",
    "fullName": "System Admin",
    "isActive": true
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

This endpoint toggles the current isActive value

Passwords are never included in responses

Intended for administrative user management