# POST /api/auth/register

Create a new user account.

## Request Body
```json
{
  "email": "user@example.com",
  "password": "StrongPass123",
  "fullName": "Juan Dela Cruz"
}
```

## Validation
- Valid email
- Password: 8+ chars, uppercase, lowercase, number
- fullName required

## Success Response (201)
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Juan Dela Cruz",
      "isActive": true
    }
  }
}
```
