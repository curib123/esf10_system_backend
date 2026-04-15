# GET /api/teachers/my-students

Fetch enrollments for sections advised by the currently authenticated user.

## Authorization

- Requires authentication
- Requires permission: `grades.view`

## Query Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `page` | number | No | Page number, default `1` |
| `limit` | number | No | Items per page, default `20`, maximum `50` |
| `schoolYearId` | number | No | Filter by school year. Defaults to the active school year |
| `gradeLevelId` | number | No | Filter by grade level |
| `sectionId` | number | No | Filter by section |
| `status` | string | No | `ACTIVE`, `COMPLETED`, or `IMPORTED`. Default `ACTIVE` |
| `q` | string | No | Search by LRN, student first name, last name, or section name |

## Example Requests

```text
GET /api/teachers/my-students
GET /api/teachers/my-students?page=1&limit=10
GET /api/teachers/my-students?q=Juan
GET /api/teachers/my-students?gradeLevelId=1
```

## Success Response (200)

```json
{
    "success": true,
    "message": "Advised students fetched successfully",
    "data": [
        {
            "id": 1,
            "studentId": 1,
            "schoolYearId": 1,
            "curriculumVersionId": 1,
            "gradeLevelId": 1,
            "sectionId": 1,
            "status": "ACTIVE",
            "deletedAt": null,
            "createdAt": "2026-01-30T10:27:56.389Z",
            "student": {
                "id": 1,
                "lrn": "123456789010",
                "firstName": "Juan",
                "lastName": "Dela Cruz"
            },
            "gradeLevel": {
                "id": 1,
                "code": "G3",
                "name": "Grade 3"
            },
            "section": {
                "id": 1,
                "name": "B"
            },
            "schoolYear": {
                "id": 1,
                "year": "2025-2026"
            }
        }
    ],
    "count": 1,
    "page": 1,
    "limit": 20
}
```

## Error Responses

### No Active School Year (400)

```json
{
  "success": false,
  "message": "No active school year found",
  "code": "NO_ACTIVE_SCHOOL_YEAR"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Forbidden: insufficient permissions"
}
```

## Notes

- Results are always scoped to sections where the logged-in user is the adviser
- This is a good entry point for grading screens because the returned `enrollment.id` can be used in grade endpoints
