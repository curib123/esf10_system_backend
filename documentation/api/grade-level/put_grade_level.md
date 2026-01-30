Update Grade Level Endpoint

PUT /api/grade-levels/:id

Updates a grade level.

Authorization

Requires authentication

Requires permission: grade_level.update

URL Parameters

id (number, required) – Grade level ID

Request Body
{
  "name": "Grade One",
  "order": 2,
  "isActive": true
}

Request Body Fields

code (string, optional) – Grade code

name (string, optional) – Grade name

order (number, optional) – Display order

isActive (boolean, optional) – Active status

Success Response (200)
{
    "success": true,
    "message": "Grade level updated successfully",
    "data": {
        "id": 1,
        "code": "G1",
        "name": "Grade One",
        "order": 2,
        "isActive": true,
        "createdAt": "2026-01-30T04:33:58.068Z",
        "updatedAt": "2026-01-30T05:15:42.130Z"
    }
}
🔒 Security Notes

Updating code must still respect uniqueness

Grade levels with enrollments should not be reordered casually