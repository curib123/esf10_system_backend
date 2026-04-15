# PUT /api/users/:id

Update an active user. Any field in the request body is optional, but at least one field must be provided.

## Authorization

- Requires authentication
- Requires the admin role configured by `RBAC_ADMIN_ROLE` (default: `SUPER_ADMIN`)
- Requires permission: `user.update`

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | number | Positive integer user ID |

## Request Body

```json
{
  "email": "john.doe@esf10.local",
  "fullName": "John Doe",
  "password": "NewStrongPassword123",
  "isActive": true,
  "roleIds": [2, 3]
}
```

## Validation

- `email` must be valid if provided
- `password` must be strong if provided
- `fullName` must not be blank if provided
- `roleIds` must contain positive integer role IDs if provided
- The body must contain at least one field

## Success Response (200)

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 4,
    "email": "john.doe@esf10.local",
    "fullName": "John Doe",
    "isActive": true,
    "createdAt": "2026-01-29T04:00:48.407Z"
  }
}
```

## Error Responses

### Invalid Body (400)

```json
{
  "success": false,
  "message": "Invalid body",
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

### Duplicate Email (409)

```json
{
  "success": false,
  "message": "Resource already exists",
  "code": "UNIQUE_CONSTRAINT"
}
```

## Notes

- Passwords are hashed before storage
- Passwords are never returned
- Roles are replaced only when `roleIds` is provided
