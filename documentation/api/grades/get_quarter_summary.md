# Get Quarter Summary API

Fetch class-level statistics for a subject and quarter.

## Endpoint

```text
GET /api/grades/summary
```

## Authorization

- Requires authentication
- Only the section adviser may access the summary

## Query Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `sectionId` | number | Yes | Positive integer section ID |
| `subjectId` | number | Yes | Positive integer subject ID |
| `period` | string | Yes | `Q1`, `Q2`, `Q3`, or `Q4` |

## Example Request

```text
GET /api/grades/summary?sectionId=1&subjectId=5&period=Q1
```

## Success Response (200)

```json
{
  "success": true,
  "data": {
    "totalStudents": 35,
    "gradedStudents": 35,
    "average": 84,
    "highest": 98,
    "lowest": 72,
    "passingCount": 32,
    "failingCount": 3,
    "passingRate": 91
  }
}
```

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "message": "Invalid query",
  "code": "VALIDATION_ERROR"
}
```

### Section Not Found (404)

```json
{
  "success": false,
  "message": "Section not found",
  "code": "SECTION_NOT_FOUND"
}
```

### Not Section Adviser (403)

```json
{
  "success": false,
  "message": "Only the section adviser can perform this action",
  "code": "NOT_SECTION_ADVISER"
}
```

## Notes

- Only active enrollments in the section are included
- `FINAL` is not accepted for this endpoint
- `passingRate` is returned as a rounded whole-number percentage
