# POST /api/auth/login

Authenticate an active, non-deleted user and return a JWT plus the user's derived roles and permissions.

## Authorization

Public endpoint

## Request Body

```json
{
  "email": "admin@esf10.local",
  "password": "admin123"
}
```

## Validation

- `email` must be a valid email address
- `password` is required

## Success Response (200)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@esf10.local",
      "fullName": "System Admin",
      "roles": [
        "SUPER_ADMIN"
      ],
      "permissions": [
        "user.create",
        "user.update",
        "grades.view"
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
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "path": "email",
      "message": "A valid email address is required"
    }
  ]
}
```

### Invalid Credentials (401)

```json
{
  "success": false,
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

## Notes

- JWT expiry is 1 day
- Roles and permissions are derived from the database at login time
- Password hashes are never returned
