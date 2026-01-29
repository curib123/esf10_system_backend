# Assign Permissions to Role Endpoint

**PUT** `/api/roles/:id/permissions`

Assigns permissions to a role. Existing permissions are replaced.

## Authorization
- Requires authentication
- Requires roles: `SUPER_ADMIN`
- Requires permission: `role.assign-permissions`

## Request Body
```json
{
  "permissionIds": [1, 2, 3]
}
```

## Success Response (200)
```json
{
  "success": true,
  "message": "Permissions updated"
}
```

