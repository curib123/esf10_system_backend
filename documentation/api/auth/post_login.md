# POST /api/auth/login

Authenticate user and return JWT.

## Request Body
```json
{
  "email": "admin@esf10.local",
  "password": "admin123"
}
```

## Success Response (200)
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVzIjpbIlNVUEVSX0FETUlOIl0sInBlcm1pc3Npb25zIjpbInVzZXIuY3JlYXRlIiwidXNlci51cGRhdGUiLCJ1c2VyLmRlYWN0aXZhdGUiLCJ1c2VyLmFzc2lnbl9yb2xlIiwicm9sZS5jcmVhdGUiLCJyb2xlLnVwZGF0ZSIsInJvbGUuZGVsZXRlIiwicGVybWlzc2lvbi5hc3NpZ24iLCJzdHVkZW50LmNyZWF0ZSIsInN0dWRlbnQudXBkYXRlIiwic3R1ZGVudC52aWV3Iiwic3R1ZGVudC5zZWFyY2giLCJzdHVkZW50LmFyY2hpdmUiLCJlbnJvbGxtZW50LmNyZWF0ZSIsImVucm9sbG1lbnQudXBkYXRlIiwiZW5yb2xsbWVudC52aWV3IiwiZW5yb2xsbWVudC5jb21wbGV0ZSIsImVucm9sbG1lbnQuaW1wb3J0IiwiY3VycmljdWx1bS5jcmVhdGUiLCJjdXJyaWN1bHVtLnVwZGF0ZSIsImN1cnJpY3VsdW0udmlldyIsImN1cnJpY3VsdW0ubG9jayIsImN1cnJpY3VsdW1fdmVyc2lvbi5jcmVhdGUiLCJjdXJyaWN1bHVtX3ZlcnNpb24udXBkYXRlIiwiY3VycmljdWx1bV92ZXJzaW9uLnZpZXciLCJjdXJyaWN1bHVtX3ZlcnNpb24ubG9jayIsInN1YmplY3QuY3JlYXRlIiwic3ViamVjdC51cGRhdGUiLCJzdWJqZWN0LnZpZXciLCJzdWJqZWN0LmxvY2siLCJncmFkZXMuZW5jb2RlIiwiZ3JhZGVzLnVwZGF0ZSIsImdyYWRlcy52aWV3IiwiZ3JhZGVzLmltcG9ydCIsImdyYWRlcy5sb2NrIiwiZ3JhZGVzLnVubG9jayIsImRvY3VtZW50LnVwbG9hZCIsImRvY3VtZW50LnZpZXciLCJkb2N1bWVudC5kZWxldGUiLCJzZjEwLmdlbmVyYXRlIiwic2YxMC52aWV3Iiwic2YxMC5leHBvcnQiLCJyZXBvcnQudmlldyIsInJlcG9ydC5leHBvcnQiLCJzeXN0ZW0udmlldyIsInN5c3RlbS51cGRhdGUiLCJzY2hvb2xfeWVhci5jcmVhdGUiLCJzY2hvb2xfeWVhci5hY3RpdmF0ZSIsInNjaG9vbF95ZWFyLmNsb3NlIiwiYXVkaXQudmlldyIsImF1ZGl0LmV4cG9ydCJdLCJpYXQiOjE3Njk2MjE5ODMsImV4cCI6MTc2OTcwODM4M30.5NIiqh-2g07cXkSxjWC5kNsi0_WjN78F-a3nUWm0x4k",
        "user": {
            "id": 1,
            "email": "admin@esf10.local",
            "fullName": "System Admin",
            "roles": [
                "SUPER_ADMIN"
            ],
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
            ]
        }
    }
}
```
