Update Student Endpoint

PUT /api/students/update/:id

Updates an existing student record.

Authorization

Requires authentication

Requires permission: student.update

URL Parameters

id (number, required) – Student ID

Request Body
{
  "address": "Makati City",
  "gender": "Female"
}

Request Body Fields

Any student field (optional)

Only provided fields will be updated

Success Response (200)
{
    "success": true,
    "message": "Student updated successfully",
    "data": {
        "id": 1,
        "lrn": "123456789012",
        "firstName": "Juan",
        "middleName": "Santos",
        "lastName": "Dela Cruz",
        "gender": "Female",
        "birthDate": "2012-05-14T00:00:00.000Z",
        "address": "Makati City",
        "deletedAt": null,
        "createdAt": "2026-01-30T08:47:02.725Z",
        "updatedAt": "2026-01-30T08:54:00.759Z"
    }
}
🔒 Security Notes

LRN uniqueness is enforced

Updating archived students should be restricted (recommended)