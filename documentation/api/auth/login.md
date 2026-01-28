# POST /api/auth/login

Authenticate user and return JWT.

## Request Body
```json
{
  "email": "user@example.com",
  "password": "StrongPass123"
}
```

## Success Response (200)
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Juan Dela Cruz",
      "roles": ["USER"]
    }
  }
}
```
