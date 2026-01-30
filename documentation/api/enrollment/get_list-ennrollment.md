1️⃣ Get All Enrollments
GET /api/enrollments

Fetch a paginated list of enrollments with filters and search.

Authorization

Requires authentication

Requires permission: enrollment.view

Query Parameters
Name	Type	Required	Description
page	number	No	Page number (default: 1)
limit	number	No	Items per page (default: 20, max: 50)
schoolYearId	number	No	Filter by school year
gradeLevelId	number	No	Filter by grade level
status	string	No	ACTIVE, COMPLETED, IMPORTED
sectionId	number	No	Filter by section
q	string	No	Search by LRN, student name, or section name
Example Request
GET /api/enrollments?page=1&gradeLevelId=3&sectionId=5&q=Juan

Success Response
{
  "success": true,
  "message": "Enrollments fetched successfully",
  "data": [],
  "count": 0,
  "page": 1,
  "limit": 20
}