# GET /api/auth/me

Get current authenticated user.

## Headers
```
Authorization: Bearer <JWT_TOKEN>
```

## Success Response (200)
```json
{
    "success": true,
    "data": {
        "id": 1,
        "email": "admin@esf10.local",
        "fullName": "System Admin",
        "isActive": true,
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
        ],
        "createdAt": "2026-01-28T16:50:20.441Z"
    }
}
```
