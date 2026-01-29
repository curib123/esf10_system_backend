# Get All Users

Retrieves a paginated list of all users in the system.

## Endpoint

`GET /api/users`

## Description

This endpoint returns a list of users with their profile information, role assignments, and account status. The response includes pagination metadata to help navigate through large datasets.

## Response Format

The API returns a JSON object with the following structure:

### Success Response (200 OK)

``` json
{
    "success": true,
    "data": [
        {
            "id": 4,
            "email": "viewer@esf10.local",
            "fullName": "Viewer User",
            "isActive": true,
            "createdAt": "2026-01-29T04:00:56.870Z",
            "roles": [
                {
                    "role": {
                        "id": 4,
                        "name": "VIEWER"
                    }
                }
            ]
        },
        {
            "id": 3,
            "email": "teacher@esf10.local",
            "fullName": "Teacher User",
            "isActive": true,
            "createdAt": "2026-01-29T04:00:54.601Z",
            "roles": [
                {
                    "role": {
                        "id": 3,
                        "name": "TEACHER"
                    }
                }
            ]
        },
        {
            "id": 2,
            "email": "registrar@esf10.local",
            "fullName": "Registrar User",
            "isActive": true,
            "createdAt": "2026-01-29T04:00:51.947Z",
            "roles": [
                {
                    "role": {
                        "id": 2,
                        "name": "REGISTRAR"
                    }
                }
            ]
        },
        {
            "id": 1,
            "email": "admin@esf10.local",
            "fullName": "System Admin",
            "isActive": true,
            "createdAt": "2026-01-29T04:00:48.407Z",
            "roles": [
                {
                    "role": {
                        "id": 1,
                        "name": "SUPER_ADMIN"
                    }
                }
            ]
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 4,
        "totalPages": 1
    }
}

 ```

## Response Fields

### Root Level

- `success` (boolean): Indicates whether the request was successful
    
- `data` (array): Array of user objects
    
- `pagination` (object): Pagination metadata
    

### User Object

- `id` (integer): Unique identifier for the user
    
- `email` (string): User's email address
    
- `fullName` (string): User's full name
    
- `isActive` (boolean): Whether the user account is active
    
- `createdAt` (string): ISO 8601 timestamp of when the user was created
    
- `roles` (array): Array of role assignments for the user
    - `role` (object): Role details
        - `id` (integer): Unique identifier for the role
            
        - `name` (string): Role name (e.g., SUPER_ADMIN, REGISTRAR, TEACHER, VIEWER)
            

### Pagination Object

- `page` (integer): Current page number
    
- `limit` (integer): Number of items per page
    
- `total` (integer): Total number of users in the system
    
- `totalPages` (integer): Total number of pages available
    

## Query Parameters

The endpoint supports pagination through query parameters:

- `page` (optional): Page number to retrieve (default: 1)
    
- `limit` (optional): Number of users per page (default: 10)
    

## Authentication

This endpoint requires authentication. Ensure you have a valid authentication token in your request headers.

## Example Use Cases

- Retrieve all users for administrative purposes
    
- Display user lists in management interfaces
    
- Export user data for reporting
    
- Verify user accounts and their role assignments