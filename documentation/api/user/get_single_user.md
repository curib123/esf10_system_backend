# GET /api/users/:id

Retrieve one active user together with assigned roles.

## Authorization

- Requires authentication
- Requires the admin role configured by `RBAC_ADMIN_ROLE` (default: `SUPER_ADMIN`)
- Requires permission: `user.view`

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | number | Positive integer user ID |

## Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@esf10.local",
    "fullName": "System Admin",
    "isActive": true,
    "createdAt": "2026-01-29T04:00:48.407Z",
    "roles": [
      {
        "role": {
          "id": 1,
          "name": "SUPER_ADMIN",
          "description": "Full system access",
          "createdAt": "2026-01-29T03:58:51.673Z",
          "updatedAt": "2026-01-29T03:58:51.673Z"
        }
      }
    ]
  }
}
```

## Error Responses

### Invalid Params (400)

```json
{
  "success": false,
  "message": "Invalid params",
  "code": "VALIDATION_ERROR"
}
```

### User Not Found (404)

```json
{
  "success": false,
  "message": "User not found"
}
```

## Notes

- Soft-deleted users are excluded
- Passwords are never returned
