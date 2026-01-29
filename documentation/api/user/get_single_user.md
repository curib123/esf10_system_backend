# Get User by ID

Retrieve a single user along with their assigned roles.

---

## Endpoint

GET /api/users/{id}


---

## Description

Fetches a user by ID.  
The response includes basic user information and the roles assigned to the user.

---

## Authentication

✅ **Required**

- Authorization Header: `Bearer <JWT_TOKEN>`

---

## Path Parameters

| Parameter | Type   | Required | Description       |
|----------|--------|----------|-------------------|
| id       | number | ✅ Yes   | User ID to fetch  |

---

## Example Request

```http
GET /api/users/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Success Response
Status Code: 200 OK

{
    "success": true,
    "data": {
        "id": 1,
        "email": "admin@esf10.local",
        "fullName": "System Admin",
        "isActive": true,
        "createdAt": "2026-01-29T04:00:48.407Z",
        "roles": [
            {
                "role": {
                    "id": 1,
                    "name": "SUPER_ADMIN",
                    "description": "Full system access",
                    "createdAt": "2026-01-29T03:58:51.673Z",
                    "updatedAt": "2026-01-29T03:58:51.673Z"
                }
            }
        ]
    }
}

Response Fields
User Object
Field	Type	Description
id	number	User ID
email	string	User email
fullName	string	Full name
isActive	boolean	Account status
createdAt	string	ISO timestamp of creation
roles	array	Assigned roles
Role Object
Field	Type	Description
id	number	Role ID
name	string	Role name
description	string	Role description
createdAt	string	Role creation date
updatedAt	string	Role last update date
Error Responses
Unauthorized
Status Code: 401 Unauthorized

{
  "message": "Unauthorized"
}
User Not Found
Status Code: 404 Not Found

{
  "success": false,
  "message": "User not found"
}
Notes
Roles are returned as a relation array (roles → role)

Passwords are never included in responses

This endpoint is typically restricted to ADMIN / SUPER_ADMIN