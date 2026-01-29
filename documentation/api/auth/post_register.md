Register User Endpoint

POST /api/auth/register

Creates a new user account and assigns one or more roles from the system roles table.

Authorization

Requires authentication

Requires roles: SUPER_ADMIN

Requires permission: user.create

Request Body
{
  "email": "user@example.com",
  "password": "StrongPass123",
  "fullName": "Juan Dela Cruz",
  "roleIds": [2]
}

Fields
Field	Type	Required	Description
email	string	✅	Valid email address
password	string	✅	Strong password
fullName	string	✅	User full name
roleIds	number[]	✅	Array of role IDs from /api/roles
Validation Rules
email

Must be a valid email format

password

Minimum 8 characters

Must include:

1 uppercase letter

1 lowercase letter

1 number

fullName

Required

Trimmed before storage

roleIds

Must reference existing roles

SUPER_ADMIN role cannot be assigned

At least one role is required

Success Response — 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 6,
      "email": "user@example.com",
      "fullName": "Juan Dela Cruz",
      "roles": ["REGISTRAR"],
      "permissions": [
        "student.view",
        "student.search",
        "enrollment.view"
      ],
      "isActive": true
    }
  }
}

Error Responses
Status	Message
400	Email already exists
400	Invalid email format
400	Weak password
400	One or more selected roles do not exist
400	SUPER_ADMIN role cannot be assigned
400	Missing required fields
500	Internal server error
Notes

Roles are database-driven (no hardcoded roles)

Permissions are derived from assigned roles

Passwords are hashed using bcrypt

Passwords are never returned

JWT token includes:

userId

roles

permissions

Token expiry: 1 day

User registration is admin-controlled, not public signup