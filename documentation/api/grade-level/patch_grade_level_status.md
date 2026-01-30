Toggle Grade Level Status Endpoint

PATCH /api/grade-levels/toggle-status/:id

Activates or deactivates a grade level.

Authorization

Requires authentication

Requires permission: grade_level.update

URL Parameters

id (number, required) – Grade level ID

Success Response (200)
{
    "success": true,
    "message": "Grade level status updated successfully",
    "data": {
        "id": 1,
        "code": "G1",
        "name": "Grade One",
        "order": 2,
        "isActive": false,
        "createdAt": "2026-01-30T04:33:58.068Z",
        "updatedAt": "2026-01-30T08:03:38.830Z"
    }
}

🔒 Security Notes

Grade levels are never deleted

Inactive grade levels cannot be used for new enrollments

Existing records remain intact