# POST /api/enrollments/create

Create a new enrollment.

## Authorization

- Requires authentication
- Requires permission: `enrollment.create`

## Request Body

| Field | Type | Required | Description |
|---|---|---|---|
| `studentId` | number | Yes | Existing active student ID |
| `schoolYearId` | number | Yes | Must refer to an active school year |
| `curriculumVersionId` | number | Yes | Must refer to an active curriculum version |
| `gradeLevelId` | number | Yes | Must refer to an active grade level |
| `sectionId` | number | No | Must belong to the selected grade level and school year |

## Example Request

```json
{
  "studentId": 1,
  "schoolYearId": 1,
  "curriculumVersionId": 1,
  "gradeLevelId": 1,
  "sectionId": 1
}
```

## Success Response (201)

```json
{
    "success": true,
    "message": "Enrollment created successfully",
    "data": {
        "id": 1,
        "studentId": 1,
        "schoolYearId": 1,
        "curriculumVersionId": 1,
        "gradeLevelId": 1,
        "sectionId": 1,
        "status": "ACTIVE",
        "deletedAt": null,
        "createdAt": "2026-01-30T10:27:56.389Z"
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

### Student Not Found (404)

```json
{
  "success": false,
  "message": "Student not found",
  "code": "STUDENT_NOT_FOUND"
}
```

### School Year Not Active (400)

```json
{
  "success": false,
  "message": "School year is not active",
  "code": "SCHOOL_YEAR_NOT_ACTIVE"
}
```

### Curriculum Version Not Active (400)

```json
{
  "success": false,
  "message": "Curriculum version is not active",
  "code": "CURRICULUM_VERSION_NOT_ACTIVE"
}
```

### Grade Level Not Active (400)

```json
{
  "success": false,
  "message": "Grade level is not active",
  "code": "GRADE_LEVEL_NOT_ACTIVE"
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
