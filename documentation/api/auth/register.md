# POST /api/auth/register

Create a new user account and assign a role from the system roles table.

---

## Request Body

```json
{
  "email": "user@example.com",
  "password": "StrongPass123",
  "fullName": "Juan Dela Cruz",
  "roleId": 2
}
Fields
Field	Type	Required	Description
email	string	✅	Valid email address
password	string	✅	Strong password
fullName	string	✅	User full name
roleId	number	✅	Role ID selected from /api/roles
Validation Rules
email

must be a valid email format

password

minimum 8 characters

must include:

1 uppercase letter

1 lowercase letter

1 number

fullName

required

roleId

must reference an existing role in the Role table

Success Response — 201 Created
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGVzIjpbIlNVUEVSX0FETUlOIl0sInBlcm1pc3Npb25zIjpbInVzZXIuY3JlYXRlIiwidXNlci51cGRhdGUiLCJ1c2VyLmRlYWN0aXZhdGUiLCJ1c2VyLmFzc2lnbl9yb2xlIiwicm9sZS5jcmVhdGUiLCJyb2xlLnVwZGF0ZSIsInJvbGUuZGVsZXRlIiwicGVybWlzc2lvbi5hc3NpZ24iLCJzdHVkZW50LmNyZWF0ZSIsInN0dWRlbnQudXBkYXRlIiwic3R1ZGVudC52aWV3Iiwic3R1ZGVudC5zZWFyY2giLCJzdHVkZW50LmFyY2hpdmUiLCJlbnJvbGxtZW50LmNyZWF0ZSIsImVucm9sbG1lbnQudXBkYXRlIiwiZW5yb2xsbWVudC52aWV3IiwiZW5yb2xsbWVudC5jb21wbGV0ZSIsImVucm9sbG1lbnQuaW1wb3J0IiwiY3VycmljdWx1bS5jcmVhdGUiLCJjdXJyaWN1bHVtLnVwZGF0ZSIsImN1cnJpY3VsdW0udmlldyIsImN1cnJpY3VsdW0ubG9jayIsImN1cnJpY3VsdW1fdmVyc2lvbi5jcmVhdGUiLCJjdXJyaWN1bHVtX3ZlcnNpb24udXBkYXRlIiwiY3VycmljdWx1bV92ZXJzaW9uLnZpZXciLCJjdXJyaWN1bHVtX3ZlcnNpb24ubG9jayIsInN1YmplY3QuY3JlYXRlIiwic3ViamVjdC51cGRhdGUiLCJzdWJqZWN0LnZpZXciLCJzdWJqZWN0LmxvY2siLCJncmFkZXMuZW5jb2RlIiwiZ3JhZGVzLnVwZGF0ZSIsImdyYWRlcy52aWV3IiwiZ3JhZGVzLmltcG9ydCIsImdyYWRlcy5sb2NrIiwiZ3JhZGVzLnVubG9jayIsImRvY3VtZW50LnVwbG9hZCIsImRvY3VtZW50LnZpZXciLCJkb2N1bWVudC5kZWxldGUiLCJzZjEwLmdlbmVyYXRlIiwic2YxMC52aWV3Iiwic2YxMC5leHBvcnQiLCJyZXBvcnQudmlldyIsInJlcG9ydC5leHBvcnQiLCJzeXN0ZW0udmlldyIsInN5c3RlbS51cGRhdGUiLCJzY2hvb2xfeWVhci5jcmVhdGUiLCJzY2hvb2xfeWVhci5hY3RpdmF0ZSIsInNjaG9vbF95ZWFyLmNsb3NlIiwiYXVkaXQudmlldyIsImF1ZGl0LmV4cG9ydCJdLCJpYXQiOjE3Njk2MjE4NzEsImV4cCI6MTc2OTcwODI3MX0.jD5vax9C7xWjRwCIJB5JpnYh8gjW13FQbzVFlF5xPlU",
        "user": {
            "id": 6,
            "email": "user1@example.com",
            "fullName": "Juan Dela Cruz",
            "role": "SUPER_ADMIN",
            "permissions": [
                "user.create",
                "user.update",
                "user.deactivate",
                "user.assign_role",
                "role.create",
                "role.update",
                "role.delete",
                "permission.assign",
                "student.create",
                "student.update",
                "student.view",
                "student.search",
                "student.archive",
                "enrollment.create",
                "enrollment.update",
                "enrollment.view",
                "enrollment.complete",
                "enrollment.import",
                "curriculum.create",
                "curriculum.update",
                "curriculum.view",
                "curriculum.lock",
                "curriculum_version.create",
                "curriculum_version.update",
                "curriculum_version.view",
                "curriculum_version.lock",
                "subject.create",
                "subject.update",
                "subject.view",
                "subject.lock",
                "grades.encode",
                "grades.update",
                "grades.view",
                "grades.import",
                "grades.lock",
                "grades.unlock",
                "document.upload",
                "document.view",
                "document.delete",
                "sf10.generate",
                "sf10.view",
                "sf10.export",
                "report.view",
                "report.export",
                "system.view",
                "system.update",
                "school_year.create",
                "school_year.activate",
                "school_year.close",
                "audit.view",
                "audit.export"
            ],
            "isActive": true
        }
    }
}
Error Responses
Status	Message
400	Email already exists
400	Invalid email format
400	Weak password
400	Role does not exist
400	Missing required fields
500	Internal server error
Notes
Roles are database-driven (no hardcoded roles)

Permissions are inherited from role

Passwords are hashed using bcrypt

JWT token includes:

userId

roles

permissions

Token expiry: 1 day