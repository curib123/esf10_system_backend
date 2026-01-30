Create Section Endpoint

POST /api/sections/create

Creates a new section for a specific grade level and school year.

Authorization

Requires authentication

Requires permission: section.create

Request Body
{
  "name": "A",
  "gradeLevelId": 4,
  "schoolYearId": 3,
  "adviserId": 12
}

Request Body Fields

name (string, required) – Section name or label (e.g. A, B, Rose, STEM-1)

gradeLevelId (number, required) – Grade level ID

schoolYearId (number, required) – School year ID

adviserId (number, optional) – User ID of the section adviser

Success Response (201)
{
  "success": true,
  "message": "Section created successfully",
  "data": {
    "id": 7,
    "name": "A",
    "gradeLevelId": 4,
    "schoolYearId": 3,
    "adviserId": 12,
    "createdAt": "2026-01-30T08:00:00.000Z",
    "updatedAt": "2026-01-30T08:00:00.000Z"
  }
}

Error Response (409)
{
  "success": false,
  "message": "Section already exists for this grade level and school year"
}

🔒 Security & Rules

Section name must be unique per grade level and school year

Adviser is optional and can be assigned later

Sections are reused per school year, not globally