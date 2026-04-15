# Create / Update Grades API

Create or update grades for an enrollment. The endpoint uses upsert logic and automatically computes `FINAL` grades once all four quarters are complete.

## Endpoint

```text
POST /api/grades/enrollment/:enrollmentId
```

Also supports:

```text
PUT /api/grades/enrollment/:enrollmentId
```

## Authorization

- Requires authentication
- Only the assigned section adviser can encode grades

## Path Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| `enrollmentId` | number | Yes | Positive integer enrollment ID |

## Request Body

```json
{
  "grades": [
    {
      "subjectId": 1,
      "period": "Q1",
      "value": 88
    },
    {
      "subjectId": 1,
      "period": "Q2",
      "value": 90
    },
    {
      "subjectId": 2,
      "period": "Q1",
      "value": 85
    }
  ]
}
```

## Validation

- `enrollmentId` must be a positive integer
- `grades` must be a non-empty array
- Each grade must include `subjectId`, `period`, and `value`
- Allowed periods are `Q1`, `Q2`, `Q3`, and `Q4`
- `value` must be between `0` and `100`

## Success Response (200)

```json
{
  "success": true,
  "message": "Grades saved successfully. Final grades auto-computed."
}
```

## Error Responses

### Validation Error (400)

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

### Not Section Adviser (403)

```json
{
  "success": false,
  "message": "Only the section adviser can perform this action",
  "code": "NOT_SECTION_ADVISER"
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

### Duplicate Subject and Period (409)

```json
{
  "success": false,
  "message": "Duplicate subject and grading period detected",
  "code": "DUPLICATE_SUBJECT_PERIOD"
}
```

### Final Not Editable (409)

```json
{
  "success": false,
  "message": "Final grades are auto-computed and cannot be edited",
  "code": "FINAL_NOT_EDITABLE"
}
```

## Notes

- `FINAL` cannot be submitted manually
- Subjects must belong to the enrollment's curriculum version and grade level
- The save is atomic: either all submitted grades are written or none are
