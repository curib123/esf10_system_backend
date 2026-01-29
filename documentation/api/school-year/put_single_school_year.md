Update School Year Endpoint

PUT /api/school-years/:id

Updates an existing school year record.

Authorization

Requires authentication

Requires permission: school_year.update

Path Parameters

id (number, required) – School year ID

Example:

/api/school-years/1

Request Body
{
  "year": "2025-2026"
}

Request Body Fields

year (string, optional) – Academic year label (YYYY-YYYY)

isActive (boolean, optional) – Activate or deactivate the school year

At least one field must be provided.

Success Response (200)
{
  "success": true,
  "data": {
    "id": 1,
    "year": "2025-2026",
    "isActive": false
  }
}

Error Responses
School Year Not Found (404)
{
  "success": false,
  "message": "School year not found"
}

Duplicate School Year (400)
{
  "success": false,
  "message": "Unique constraint failed on the fields: (`year`)"
}

Unauthorized (401)
{
  "success": false,
  "message": "Unauthorized"
}

🔒 Security & Business Rules

Only users with SUPER_ADMIN role can update school years

Updating year must maintain unique values

If isActive is set to true:

Any previously active school year is automatically deactivated

School years with enrollments can still be updated

Soft delete does not apply to school years

🧠 Notes

Use this endpoint to:

Rename a school year

Manually activate or deactivate a school year

Activation is usually handled via the dedicated Activate School Year endpoint

Enrollment logic always relies on the active school year