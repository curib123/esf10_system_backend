Create Subject Endpoint

POST /api/subjects

Creates a new subject for a specific curriculum version and grade level.

Authorization

Requires authentication

Requires permission: subject.create

Request Body
{
  "curriculumVersionId": 1,
  "gradeLevelId": 2,
  "code": "MATH",
  "name": "Mathematics"
}

Request Body Fields

curriculumVersionId (number, required) – Curriculum version ID

gradeLevelId (number, required) – Grade level ID

code (string, required) – Subject code (unique per grade level and curriculum version)

name (string, required) – Subject name

Success Response (201)
{
    "success": true,
    "message": "Subject created successfully",
    "data": {
        "id": 6,
        "curriculumVersionId": 1,
        "gradeLevelId": 1,
        "code": "MATHs",
        "name": "Mathematicss"
    }
}
Error Response (409)
{
  "success": false,
  "message": "Subject code already exists for this grade level and curriculum version"
}

🔒 Security Notes

Subject codes must be unique per grade level + curriculum version

Subjects cannot be deleted

Subjects are immutable once curriculum version is locked