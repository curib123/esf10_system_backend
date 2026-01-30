5️⃣ Complete Enrollment
PATCH /api/enrollments/complete/:id

Mark an enrollment as completed.

Authorization

Requires authentication

Requires permission: enrollment.update

Path Parameters
Name	Type	Required
id	number	Yes
Example Request
PATCH /api/enrollments/complete/12

Success Response
{
    "success": true,
    "message": "Enrollment completed successfully"
}
Notes

Completed enrollments should be treated as immutable

Status is set to COMPLETED