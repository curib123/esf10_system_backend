Get Student by ID Endpoint

GET /api/students/:id

Returns a single student record.

Authorization

Requires authentication

Requires permission: student.view

URL Parameters

id (number, required) – Student ID

Success Response (200)
{
    "success": true,
    "message": "Student fetched successfully",
    "data": {
        "id": 1,
        "lrn": "123456789012",
        "firstName": "Juan",
        "middleName": "Santos",
        "lastName": "Dela Cruz",
        "gender": "Male",
        "birthDate": "2012-05-14T00:00:00.000Z",
        "address": "Quezon City",
        "deletedAt": null,
        "createdAt": "2026-01-30T08:47:02.725Z",
        "updatedAt": "2026-01-30T08:47:02.725Z"
    }
}

Error Response (404)
{
  "success": false,
  "message": "Student not found"
}