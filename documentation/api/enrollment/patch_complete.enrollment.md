# PATCH /api/enrollments/complete/:id

Mark an enrollment as completed.

## Authorization

- Requires authentication
- Requires permission: `enrollment.update`

## Path Parameters

| Name | Type | Required |
|---|---|---|
| `id` | number | Yes |

## Example Request

```text
PATCH /api/enrollments/complete/12
```

## Success Response (200)

```json
{
    "success": true,
    "message": "Enrollment completed successfully"
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

### Enrollment Not Found (404)

```json
{
  "success": false,
  "message": "Record not found",
  "code": "RECORD_NOT_FOUND"
}
```

## Notes

- The endpoint sets `status` to `COMPLETED`
- Completed enrollments should be treated as immutable by callers
