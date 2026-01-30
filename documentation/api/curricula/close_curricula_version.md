Close Curriculum Version Endpoint

PATCH /api/curricula/versions/:versionId/close

Closes an active curriculum version and makes it historical.

Authorization

Requires authentication

Requires permission: curriculum_version.update

{
    "success": true,
    "message": "Curriculum version closed successfully",
    "data": {
        "id": 1,
        "curriculumId": 1,
        "name": "K–12 SY 2025–2026",
        "effectiveFrom": 2025,
        "effectiveTo": 2026
    }
}
🔒 Security Notes

A curriculum version can only be closed once

Versions with enrollments cannot be closed

Closing a version makes it immutable forever