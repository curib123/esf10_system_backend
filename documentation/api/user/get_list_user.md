# GET /api/users

Retrieve a paginated list of active users.

## Authorization

- Requires authentication
- Requires the admin role configured by `RBAC_ADMIN_ROLE` (default: `SUPER_ADMIN`)
- Requires permission: `user.view`

## Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `page` | number | Page number, minimum `1`, default `1` |
| `limit` | number | Page size, minimum `1`, maximum `100`, default `10` |
| `search` | string | Search by email or full name |
| `isActive` | string | `true` or `false` |
| `sortBy` | string | `createdAt`, `email`, `fullName`, or `isActive` |
| `sortOrder` | string | `asc` or `desc` |

## Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 4,
      "email": "viewer@esf10.local",
      "fullName": "Viewer User",
      "isActive": true,
      "createdAt": "2026-01-29T04:00:56.870Z",
      "roles": [
        {
          "role": {
            "id": 4,
            "name": "VIEWER"
          }
        }
      ]
    },
    {
      "id": 3,
      "email": "teacher@esf10.local",
      "fullName": "Teacher User",
      "isActive": true,
      "createdAt": "2026-01-29T04:00:54.601Z",
      "roles": [
        {
          "role": {
            "id": 3,
            "name": "TEACHER"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  }
}
```

## Error Responses

### Invalid Query (400)

```json
{
  "success": false,
  "message": "Invalid query",
  "code": "VALIDATION_ERROR"
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Forbidden: insufficient role"
}
```

## Notes

- Soft-deleted users are excluded
- Passwords are never included in responses
- Sorting is limited to approved fields only
