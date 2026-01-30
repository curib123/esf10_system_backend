Delete Section Endpoint

DELETE /api/sections/delete/:id

Deletes a section only if it has no enrollments.

Authorization

Requires authentication

Requires permission: section.delete

Path Parameters

id (number, required) – Section ID

Success Response (200)
{
  "success": true,
  "message": "Section deleted successfully"
}

Error Response (400)
{
  "success": false,
  "message": "Cannot delete section with enrolled students"
}

🔒 Security Notes

Sections with enrollments cannot be deleted

This protects enrollment, grades, and audit integrity