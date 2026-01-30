Get Students Endpoint

GET /api/students

Returns a paginated list of students with search and filters.
Optimized for thousands of records.

Authorization

Requires authentication

Requires permission: student.view

Query Parameters
Name	Type	Description
page	number	Page number (default: 1)
limit	number	Items per page (default: 20, max: 50)
q	string	Search by LRN, first name, or last name
gender	string	Filter by gender
archived	boolean	Include archived students
Example Requests
GET /api/students?page=1&limit=20&q=Juan
GET /api/students?gender=Male
GET /api/students?archived=true

Success Response (200)
{
    "success": true,
    "message": "Students fetched successfully",
    "data": [
        {
            "id": 1,
            "lrn": "123456789012",
            "firstName": "Juan",
            "middleName": "Santos",
            "lastName": "Dela Cruz",
            "gender": "Male",
            "birthDate": "2012-05-14T00:00:00.000Z"
        },
        {
            "id": 3,
            "lrn": "123456789010",
            "firstName": "Juan",
            "middleName": "Santos",
            "lastName": "Dela Cruz",
            "gender": "Male",
            "birthDate": "2012-05-14T00:00:00.000Z"
        }
    ],
    "count": 2,
    "page": 1,
    "limit": 20
}

🔒 Performance Notes

Uses indexed fields only

No heavy joins

Deterministic ordering (lastName, firstName)

Designed for large datasets