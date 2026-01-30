Activate School Year API

Activate a specific school year and automatically deactivate any previously active school year.

Endpoint
PATCH /api/school-years/:id/activate

Authorization

Requires authentication

Requires permission: school-year.update

Restricted to SUPER_ADMIN users (business rule)

Path Parameters
Name	Type	Required	Description
id	number	Yes	School year ID to activate
Example
/api/school-years/1/activate

Request Body

🚫 None

This endpoint performs a state change only.

What This Endpoint Does

When called:

Sets isActive = true for the specified school year

Automatically sets isActive = false for any other school year

Ensures only one school year is active at a time

Success Response (200)
{
    "success": true,
    "data": {
        "id": 1,
        "year": "2025-2026",
        "isActive": true
    }
}

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

Forbidden (403)
{
  "success": false,
  "message": "You do not have permission to activate school years"
}

🔒 Security & Business Rules

Only users with SUPER_ADMIN role can activate school years

Only one school year may be active at a time

Previously active school year is automatically deactivated

School years with enrollments can still be activated

Soft delete does not apply to school years

🧠 Notes

This endpoint is the preferred way to activate a school year

Enrollment logic always depends on the active school year

Avoid manually toggling isActive via update unless necessary