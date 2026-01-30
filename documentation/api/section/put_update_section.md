Update Section Endpoint

PUT /api/sections/update/:id

Updates section details such as name or adviser.

Authorization

Requires authentication

Requires permission: section.update

Path Parameters

id (number, required) – Section ID

Request Body
{
  "name": "B",
  "adviserId": 15
}

Request Body Fields

name (string, optional) – New section name

adviserId (number, optional) – New adviser (use null to remove)

Success Response (200)
{
    "success": true,
    "message": "Section updated successfully",
    "data": {
        "id": 1,
        "name": "B",
        "gradeLevelId": 1,
        "schoolYearId": 1,
        "adviserId": 1,
        "createdAt": "2026-01-30T10:07:54.151Z",
        "updatedAt": "2026-01-30T10:16:12.627Z"
    }
}
🔒 Security Notes

Changing grade level or school year is not allowed

Adviser reassignment is allowed at any time