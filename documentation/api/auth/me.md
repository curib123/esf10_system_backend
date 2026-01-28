# GET /api/auth/me

Get current authenticated user.

## Headers
```
Authorization: Bearer <JWT_TOKEN>
```

## Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Juan Dela Cruz",
    "roles": ["USER"],
    "isActive": true
  }
}
```
