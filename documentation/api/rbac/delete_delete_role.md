# Delete Role Endpoint

**DELETE** `/api/roles/:id`

Deletes a role.

## Authorization
- Requires authentication
- Requires roles: `SUPER_ADMIN`
- Requires permission: `role.delete`

## Success Response (200)
```json
{
  "success": true,
  "message": "Role deleted"
}
```

