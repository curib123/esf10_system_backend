Get School Year by ID Endpoint

GET /api/school-years/:id

Retrieves a specific school year by its ID.

Authorization

Requires authentication


Requires permission: school_year.view

Path Parameters

id (number, required) – School year ID

Example:

/api/school-years/1

Success Response (200)
{
  "success": true,
  "data": {
    "id": 1,
    "year": "2025-2026",
    "isActive": false
  }
}

Response Fields

id (number) – School year ID

year (string) – Academic year label (YYYY-YYYY)

isActive (boolean) – Indicates whether the school year is currently active

Error Responses
School Year Not Found (404)
{
  "success": false,
  "message": "School year not found"
}

Unauthorized (401)
{
  "success": false,
  "message": "Unauthorized"
}

🔒 Security & Business Rules


This endpoint returns exactly one school year record

Soft deletion does not apply to school years

Historical school years remain accessible

🧠 Notes

Use this endpoint to:

View school year details

Pre-fill edit forms

Validate school year existence before updates

For enrollment operations, always use the active school year instead of querying by ID