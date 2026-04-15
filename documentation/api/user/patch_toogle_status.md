# PATCH /api/users/:id/toggle-status

Toggle a user's `isActive` flag.

## Authorization

- Requires authentication
- Requires the admin role configured by `RBAC_ADMIN_ROLE` (default: `SUPER_ADMIN`)
- Requires permission: `user.update`

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | number | Positive integer user ID |

## Success Response (200)

```json
{
  "success": true,
  "message": "User activated",
  "data": {
    "id": 1,
    "email": "admin@esf10.local",
    "fullName": "System Admin",
    "isActive": true
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
  "message": "User not found",
  "code": "USER_NOT_FOUND"
}
```

## Notes

- Soft-deleted users are treated as not found
- Passwords are never included in responses
