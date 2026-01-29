Get School Years Endpoint

GET /api/school-years

Retrieves a list of all school years, including enrollment counts per school year.

Authorization

Requires authentication

Requires permission: school_year.view

Request Parameters

None

Success Response (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "year": "2025-2026",
      "isActive": false,
      "_count": {
        "enrollments": 0
      }
    }
  ]
}

Response Fields

id (number) – School year ID

year (string) – Academic year label (YYYY-YYYY)

isActive (boolean) – Indicates if the school year is currently active

_count.enrollments (number) – Number of non-deleted enrollments linked to the school year

Error Responses
Unauthorized (401)
{
  "success": false,
  "message": "Unauthorized"
}

🔒 Security & Business Rules

Only users with SUPER_ADMIN role can access this endpoint

Enrollment count excludes soft-deleted enrollments

This endpoint is typically used for:

Admin dashboards

School year management screens

Enrollment statistics

🧠 Notes

Results are ordered by year (descending) by default

This endpoint does not return deleted data

Exactly one school year should be active at any time