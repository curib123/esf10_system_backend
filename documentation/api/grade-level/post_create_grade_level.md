Create Grade Level Endpoint

POST /api/grade-levels/

Creates a new grade level.

Authorization

Requires authentication

Requires permission: grade_level.create

Request Body
{
  "code": "G1",
  "name": "Grade 1",
  "order": 1
}

Request Body Fields

code (string, required) – Unique grade code (e.g. G1, SHS-11)

name (string, required) – Grade level name

order (number, required) – Display order (ascending)

Success Response (201)
{
    "success": true,
    "message": "Grade level created successfully",
    "data": {
        "id": 3,
        "code": "G3",
        "name": "Grade 3",
        "order": 3,
        "isActive": true,
        "createdAt": "2026-01-30T04:38:26.452Z",
        "updatedAt": "2026-01-30T04:38:26.452Z"
    }
}
🔒 Security Notes

code must be unique

Grade levels cannot be deleted

Newly created grade levels are active by default