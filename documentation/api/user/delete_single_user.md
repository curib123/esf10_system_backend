# DELETE /api/users/:id

Soft-delete a user by setting `deletedAt` and forcing `isActive` to `false`.

## Authorization

- Requires authentication
- Requires the admin role configured by `RBAC_ADMIN_ROLE` (default: `SUPER_ADMIN`)
- Requires permission: `user.delete`

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | number | Positive integer user ID |

## Success Response (200)

```json
{
  "success": true,
  "message": "User deleted",
  "data": {
    "id": 1,
    "email": "admin@esf10.local",
    "deletedAt": "2026-04-15T12:00:00.000Z"
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
  "message": "Record not found",
  "code": "RECORD_NOT_FOUND"
}
```

## Notes

- This is a soft delete, not a hard delete
- Deleted users are hidden from the user listing and auth lookups
