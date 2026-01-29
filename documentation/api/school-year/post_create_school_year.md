Create School Year Endpoint

POST /api/school-years

Creates a new school year record. The school year can later be activated to allow enrollments.

Authorization

Requires authentication

Requires permission: school_year.create

Request Body
{
  "year": "2025-2026"
}

Request Body Fields

year (string, required) – Academic year label (format: YYYY-YYYY)

isActive (boolean, optional) – Whether to immediately activate the school year

Defaults to false if not provided

Success Response (201)
{
  "success": true,
  "data": {
    "id": 1,
    "year": "2025-2026",
    "isActive": false
  }
}

Error Responses
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

Only users with SUPER_ADMIN role can create school years

The year value must be unique

If isActive is set to true:

Any previously active school year is automatically deactivated

School years must exist before enrollment is allowed

Deleting a school year is blocked if active enrollments exist

🧠 Notes

Creating a school year does not automatically allow enrollment

Enrollment is only allowed when a school year is active

Recommended format for year is always:

YYYY-YYYY