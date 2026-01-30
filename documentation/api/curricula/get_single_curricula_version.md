Get Curriculum Versions Endpoint

GET /api/curricula/:curriculumId/versions

Returns all versions of a curriculum.

Authorization

Requires authentication

Requires permission: curriculum_version.read

Success Response (200)
{
    "success": true,
    "message": "Curriculum versions retrieved successfully",
    "data": [
        {
            "id": 1,
            "curriculumId": 1,
            "name": "K–12 2025–2026",
            "effectiveFrom": 2025,
            "effectiveTo": null
        }
    ]
}

🔒 Security Notes

Versions are ordered by effectiveFrom DESC

Historical versions are preserved permanently

No pagination by design (expected small dataset)