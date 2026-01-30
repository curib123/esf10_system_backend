Archive Student Endpoint

PATCH /api/students/archive/:id

Archives (soft-deletes) a student.

Authorization

Requires authentication

Requires permission: student.archive

URL Parameters

id (number, required) – Student ID

Success Response (200)
{
    "success": true,
    "message": "Student archived successfully"
}
🔒 Security Notes

Students are never permanently deleted

Archived students cannot be enrolled

Historical records remain intact