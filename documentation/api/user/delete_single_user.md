Delete User Endpoint

DELETE /api/users/:id

Deletes a user from the system.

Authorization

Requires authentication

Requires roles: SUPER_ADMIN

Requires permission: user.delete

Path Parameters
Parameter	Type	Description
id	number	User ID
Success Response (200)
{
  "success": true,
  "message": "User deleted"
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

This action is irreversible

Passwords are never included in responses

Intended for administrative use only