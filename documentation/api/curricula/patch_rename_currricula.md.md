Rename Curriculum Endpoint

PATCH /api/curricula/:curriculumId

Renames an existing curriculum (label only).

Authorization

Requires authentication

Requires permission: curriculum.update

Request Body
{
  "name": "K–12 Basic Education Program"
}

Request Body Fields

name (string, required) – New curriculum name

Success Response (200)
{
    "success": true,
    "message": "Curriculum renamed successfully",
    "data": {
        "id": 1,
        "name": "K–12 Basic Education Program"
    }
}

🔒 Security Notes

This updates the label only

No academic rules are affected

Safe to rename at any time