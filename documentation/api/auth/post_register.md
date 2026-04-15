# POST /api/auth/register

Create a new user and assign one or more existing roles.

## Authorization

- Requires authentication
- Requires the admin role configured by `RBAC_ADMIN_ROLE` (default: `SUPER_ADMIN`)
- Requires permission: `user.create`

## Request Body

```json
{
  "email": "user@example.com",
  "password": "StrongPass123",
  "fullName": "Juan Dela Cruz",
  "roleIds": [2]
}
```

## Validation

- `email` must be a valid email address
- `password` must be at least 8 characters and include uppercase, lowercase, and a number
- `fullName` is required
- `roleIds` must contain at least one positive integer

## Success Response (201)

```json
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
```

## Error Responses

### Invalid Body (400)

```json
{
  "success": false,
  "message": "Invalid body",
  "code": "VALIDATION_ERROR"
}
```

### Invalid Role Selection (400)

```json
{
  "success": false,
  "message": "One or more selected roles do not exist",
  "code": "INVALID_ROLE_SELECTION"
}
```

### Email Already Exists (409)

```json
{
  "success": false,
  "message": "Email already exists",
  "code": "EMAIL_ALREADY_EXISTS"
}
```

### Forbidden Role Assignment (403)

```json
{
  "success": false,
  "message": "SUPER_ADMIN role cannot be assigned via register",
  "code": "FORBIDDEN"
}
```

## Notes

- Registration is admin-controlled and is not a public signup flow
- Roles are database-driven
- Permissions are derived from the assigned roles
- Passwords are hashed before storage and never returned
