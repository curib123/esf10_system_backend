# GET /api/enrollments/:id/subjects

Return the subjects that belong to an enrollment's curriculum version and grade level.

## Authorization

- Requires authentication
- Allowed for the section adviser assigned to the enrollment
- Also allowed for users with permission: `grades.view`

## Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `id` | number | Yes | Positive integer enrollment ID |

## Example Request

```text
GET /api/enrollments/12/subjects
```

## Success Response (200)

```json
{
  "success": true,
  "message": "Subjects fetched successfully",
  "data": [
    {
      "id": 1,
      "code": "MATH",
      "name": "Mathematics"
    },
    {
      "id": 2,
      "code": "ENG",
      "name": "English"
    }
  ]
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
  "message": "Enrollment not found",
  "code": "ENROLLMENT_NOT_FOUND"
}
```

### Enrollment Not Active (409)

```json
{
  "success": false,
  "message": "Enrollment is not active",
  "code": "ENROLLMENT_NOT_ACTIVE"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "code": "FORBIDDEN"
}
```

## Notes

- Subjects are filtered by both `curriculumVersionId` and `gradeLevelId`
- This endpoint does not return any grade data
