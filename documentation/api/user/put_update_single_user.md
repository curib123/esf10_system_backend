Update User Endpoint

PUT /api/users/:id

Updates an existing user. Supports optional password and role updates.

Authorization

Requires authentication

Requires roles: SUPER_ADMIN

Requires permission: user.update

Request Body
{
  "email": "john.doe@esf10.local",
  "fullName": "John Doe",
  "password": "NewStrongPassword@123",
  "isActive": true,
  "roleIds": [2, 3]
}

Request Body Fields

email (string, optional) – User email

fullName (string, optional) – Full name

password (string, optional) – New password

isActive (boolean, optional) – Activate / deactivate user

roleIds (number[], optional) – Role IDs to assign to the user

Success Response (200)
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 4,
    "email": "john.doe@esf10.local",
    "fullName": "John Doe",
    "isActive": true,
    "createdAt": "2026-01-29T04:00:48.407Z"
  }
}

🔒 Security Notes

Passwords are hashed before storage

Passwords are never returned in responses

Roles are updated only when roleIds is provided

Role changes require admin privileges and user.update permission