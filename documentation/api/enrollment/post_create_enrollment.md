3️⃣ Create Enrollment
POST /api/enrollments/create

Create a new enrollment.

Authorization

Requires authentication

Requires permission: enrollment.create

Request Body
Field	Type	Required	Description
studentId	number	Yes	Student ID
schoolYearId	number	Yes	Must be an active school year
curriculumVersionId	number	Yes	Must be active (effectiveTo = null)
gradeLevelId	number	Yes	Must be active
sectionId	number	No	Must belong to the selected grade level & school year
Example Request
{
  "studentId": 1,
  "schoolYearId": 1,
  "curriculumVersionId": 1,
  "gradeLevelId": 1,
  "sectionId": 1
}

Success Response
{
    "success": true,
    "message": "Enrollment created successfully",
    "data": {
        "id": 1,
        "studentId": 1,
        "schoolYearId": 1,
        "curriculumVersionId": 1,
        "gradeLevelId": 1,
        "sectionId": 1,
        "status": "ACTIVE",
        "deletedAt": null,
        "createdAt": "2026-01-30T10:27:56.389Z"
    }
}
Possible Errors
Error Code	Meaning
SCHOOL_YEAR_NOT_ACTIVE	School year is not active
CURRICULUM_VERSION_NOT_ACTIVE	Curriculum version is not active
GRADE_LEVEL_NOT_ACTIVE	Grade level is not active
INVALID_SECTION	Section does not belong to grade level & school year