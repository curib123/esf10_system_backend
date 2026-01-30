Create Student Endpoint

POST /api/students/create

Creates a new student record.

Authorization

Requires authentication

Requires permission: student.create

Request Body
{
  "lrn": "123456789012",
  "firstName": "Juan",
  "middleName": "Santos",
  "lastName": "Dela Cruz",
  "gender": "Male",
  "birthDate": "2012-05-14",
  "address": "Quezon City"
}

Request Body Fields

lrn (string, required) – Learner Reference Number (unique)

firstName (string, required) – First name

middleName (string, optional) – Middle name

lastName (string, required) – Last name

gender (string, required) – Gender

birthDate (string, required) – Date of birth (YYYY-MM-DD)

address (string, required) – Home address

Success Response (201)
{
    "success": true,
    "message": "Student created successfully",
    "data": {
        "id": 3,
        "lrn": "123456789010",
        "firstName": "Juan",
        "middleName": "Santos",
        "lastName": "Dela Cruz",
        "gender": "Male",
        "birthDate": "2012-05-14T00:00:00.000Z",
        "address": "Quezon City",
        "deletedAt": null,
        "createdAt": "2026-01-30T08:48:34.190Z",
        "updatedAt": "2026-01-30T08:48:34.190Z"
    }
}

Error Response (409)
{
  "success": false,
  "message": "LRN already exists"
}

🔒 Security Notes

LRN must be unique

Students are never hard-deleted

Archived students remain in the database