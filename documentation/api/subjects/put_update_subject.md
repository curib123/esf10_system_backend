Update Subject Endpoint

PUT /api/subjects/:id

Updates an existing subject.

Authorization

Requires authentication

Requires permission: subject.update

URL Parameters

id (number, required) – Subject ID

Request Body
{
  "name": "Advanced Mathematics",
  "code": "ADV-MATH"
}

Request Body Fields

code (string, optional) – Subject code

name (string, optional) – Subject name

Success Response (200)
{
    "success": true,
    "message": "Subject updated successfully",
    "data": {
        "id": 4,
        "curriculumVersionId": 1,
        "gradeLevelId": 1,
        "code": "ADV-MATH",
        "name": "Advanced Mathematics"
    }
}

🔒 Security Notes

Updating subject code must still respect uniqueness constraints

Subjects linked to grades should not be renamed casually

Editing may be restricted once curriculum version is locked