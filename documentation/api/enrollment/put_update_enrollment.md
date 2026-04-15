# PUT /api/enrollments/update/:id

Update an enrollment. The current implementation only allows changing `sectionId`.

## Authorization

- Requires authentication
- Requires permission: `enrollment.update`

## Path Parameters

| Name | Type | Required |
|---|---|---|
| `id` | number | Yes |

## Request Body

```json
{
  "sectionId": 8
}
```

## Validation

- `id` must be a positive integer
- `sectionId` is required and must be a positive integer

## Success Response (200)

```json
{
  "success": true,
  "message": "Enrollment updated successfully",
  "data": {
    "id": 12,
    "studentId": 4,
    "schoolYearId": 1,
    "curriculumVersionId": 1,
    "gradeLevelId": 3,
    "sectionId": 8,
    "status": "ACTIVE",
    "deletedAt": null,
    "createdAt": "2026-01-30T10:27:56.389Z",
    "updatedAt": "2026-01-30T11:05:00.000Z"
  }
}
```

## Error Responses

### Invalid Body or Params (400)

```json
{
  "success": false,
  "message": "Invalid body",
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

### Invalid Section (400)

```json
{
  "success": false,
  "message": "Invalid section for the selected grade level and school year",
  "code": "INVALID_SECTION"
}
```

## Notes

- Changing `gradeLevelId`, `schoolYearId`, or `curriculumVersionId` is not supported by this endpoint
