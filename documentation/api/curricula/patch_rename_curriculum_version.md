Rename Curriculum Version Endpoint

PATCH /api/curricula/versions/:versionId

Renames a curriculum version (display name only).

Authorization

Requires authentication

Requires permission: curriculum_version.rename

Request Body
{
  "name": "K–12 SY 2025–2026"
}

Request Body Fields

name (string, required) – New version display name

{
    "success": true,
    "message": "Curriculum version renamed successfully",
    "data": {
        "id": 1,
        "curriculumId": 1,
        "name": "K–12 SY 2025–2026",
        "effectiveFrom": 2025,
        "effectiveTo": null
    }
}

🔒 Security Notes

Display name only

Renaming is blocked once enrollments exist

Academic rules remain unchanged