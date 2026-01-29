# Create Role Endpoint

**POST** `/api/roles`

Creates a new role.

## Authorization
- Requires authentication
- Requires roles: `SUPER_ADMIN`
- Requires permission: `role.create`

## Request Body
```json
{
  "name": "Registrar",
  "description": "Manages student records"
}
```

## Success Response (201)
```json
{
    "success": true,
    "data": {
        "id": 5,
        "name": "Registrar2",
        "description": "Manages student records",
        "createdAt": "2026-01-29T03:15:57.877Z",
        "updatedAt": "2026-01-29T03:15:57.877Z"
    }
}
```
