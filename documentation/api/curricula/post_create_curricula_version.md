Create Curriculum Version Endpoint

POST /api/curricula/:curriculumId/versions

Creates a new version of a curriculum.

Authorization

Requires authentication

Requires permission: curriculum_version.create

Request Body
{
  "name": "K–12 2025–2026",
  "effectiveFrom": 2025
}

Request Body Fields

name (string, required) – Version name

effectiveFrom (number, required) – Starting year

Success Response (201)
{
    "success": true,
    "message": "Curriculum version created successfully",
    "data": {
        "id": 1,
        "curriculumId": 1,
        "name": "K–12 2025–2026",
        "effectiveFrom": 2025,
        "effectiveTo": null
    }
}

🔒 Security Notes

Only ONE active version per curriculum is allowed

Active version is defined as effectiveTo = null

Old versions are immutable