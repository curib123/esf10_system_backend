# POST /api/auth/login

Authenticate user and return JWT.

## Request Body
```json
{
  "email": "admin@esf10.local",
  "password": "admin123"
}
```

## Success Response (200)
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVzIjpbIlNVUEVSX0FETUlOIl0sImlhdCI6MTc2OTYyMDgwOCwiZXhwIjoxNzY5NzA3MjA4fQ.APVGi_C88iNkMxjaToaze0h9DgQoXEOZwdhEhUbI68c",
        "user": {
            "id": 1,
            "email": "admin@esf10.local",
            "fullName": "System Admin",
            "roles": [
                "SUPER_ADMIN"
            ]
        }
    }
}
```
