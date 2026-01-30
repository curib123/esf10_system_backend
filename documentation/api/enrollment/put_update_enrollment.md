4️⃣ Update Enrollment
PUT /api/enrollments/update/:id

Update an existing enrollment (limited fields only).

Authorization

Requires authentication

Requires permission: enrollment.update

Path Parameters
Name	Type	Required
id	number	Yes
Request Body
Field	Type	Required	Description
sectionId	number	No	New section (validated)

⚠️ Changing gradeLevelId, schoolYearId, or curriculumVersionId is not allowed.

Example Request
{
  "sectionId": 8
}

Success Response
{
  "success": true,
  "message": "Enrollment updated successfully",
  "data": {
    "id": 12
  }
}

Possible Errors
Error Code	Meaning
INVALID_SECTION	Section does not match grade level & school year