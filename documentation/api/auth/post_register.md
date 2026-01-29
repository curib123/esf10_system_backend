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
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInJvbGVzIjpbIlJFR0lTVFJBUiJdLCJwZXJtaXNzaW9ucyI6WyJzdHVkZW50LmNyZWF0ZSIsInN0dWRlbnQudXBkYXRlIiwic3R1ZGVudC52aWV3Iiwic3R1ZGVudC5zZWFyY2giLCJzdHVkZW50LmFyY2hpdmUiLCJlbnJvbGxtZW50LmNyZWF0ZSIsImVucm9sbG1lbnQudXBkYXRlIiwiZW5yb2xsbWVudC52aWV3IiwiZW5yb2xsbWVudC5jb21wbGV0ZSIsImVucm9sbG1lbnQuaW1wb3J0IiwiZG9jdW1lbnQudXBsb2FkIiwiZG9jdW1lbnQudmlldyIsInNmMTAuZ2VuZXJhdGUiLCJzZjEwLnZpZXciLCJzZjEwLmV4cG9ydCIsInJlcG9ydC52aWV3IiwicmVwb3J0LmV4cG9ydCJdLCJpYXQiOjE3Njk2NjI1NzgsImV4cCI6MTc2OTc0ODk3OH0.uqJElw7ZFk3SxBXzOGFF9T94Q9W8KFZWc5JeOw7VM8A",
        "user": {
            "id": 5,
            "email": "user@example.com",
            "fullName": "Juan Dela Cruz",
            "roles": [
                "REGISTRAR"
            ],
            "permissions": [
                "student.create",
                "student.update",
                "student.view",
                "student.search",
                "student.archive",
                "enrollment.create",
                "enrollment.update",
                "enrollment.view",
                "enrollment.complete",
                "enrollment.import",
                "document.upload",
                "document.view",
                "sf10.generate",
                "sf10.view",
                "sf10.export",
                "report.view",
                "report.export"
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