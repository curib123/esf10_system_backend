2️⃣ Get Enrollment by ID
GET /api/enrollments/:id

Fetch a single enrollment by ID.

Authorization

Requires authentication

Requires permission: enrollment.view

Path Parameters
Name	Type	Required	Description
id	number	Yes	Enrollment ID
Example Request
GET /api/enrollments/12

Success Response
{
  "success": true,
  "message": "Enrollment fetched successfully",
  "data": {
    "id": 12,
    "status": "ACTIVE"
  }
}

Error Response (Not Found)
{
  "success": false,
  "message": "Enrollment not found"
}