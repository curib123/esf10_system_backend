# Update Role Endpoint

**PUT** `/api/roles/:id`

Updates an existing role.

## Authorization
- Requires authentication
- Requires roles: `SUPER_ADMIN`
- Requires permission: `role.update`

## Request Body
```json
{
  "description": "Updated role description"
}
```

## Success Response (200)
```json
{
    "success": true,
    "data": {
        "id": 4,
        "name": "VIEWER",
        "description": "Manages student records",
        "createdAt": "2026-01-29T03:01:45.964Z",
        "updatedAt": "2026-01-29T03:01:45.964Z"
    }
}
```

