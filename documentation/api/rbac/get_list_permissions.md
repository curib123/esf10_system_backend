# List Permissions Endpoint

**GET** `/api/permissions`

Returns all permissions.

## Authorization
- Requires authentication
- Requires roles: `SUPER_ADMIN`
- Requires permission: `permission.view`

## Success Response (200)
```json
{
    "success": true,
    "data": [
        {
            "id": 53,
            "code": "audit.export",
            "description": "AUDIT EXPORT",
            "createdAt": "2026-01-29T03:01:39.044Z",
            "updatedAt": "2026-01-29T03:01:39.044Z"
        },
        {
            "id": 52,
            "code": "audit.view",
            "description": "AUDIT VIEW",
            "createdAt": "2026-01-29T03:01:37.380Z",
            "updatedAt": "2026-01-29T03:01:37.380Z"
        },
        {
            "id": 21,
            "code": "curriculum.create",
            "description": "CURRICULUM CREATE",
            "createdAt": "2026-01-29T03:00:52.469Z",
            "updatedAt": "2026-01-29T03:00:52.469Z"
        },
        {
            "id": 24,
            "code": "curriculum.lock",
            "description": "CURRICULUM LOCK",
            "createdAt": "2026-01-29T03:00:57.401Z",
            "updatedAt": "2026-01-29T03:00:57.401Z"
        },
        {
            "id": 22,
            "code": "curriculum.update",
            "description": "CURRICULUM UPDATE",
            "createdAt": "2026-01-29T03:00:53.639Z",
            "updatedAt": "2026-01-29T03:00:53.639Z"
        },
        {
            "id": 23,
            "code": "curriculum.view",
            "description": "CURRICULUM VIEW",
            "createdAt": "2026-01-29T03:00:55.972Z",
            "updatedAt": "2026-01-29T03:00:55.972Z"
        },
        {
            "id": 25,
            "code": "curriculum_version.create",
            "description": "CURRICULUM_VERSION CREATE",
            "createdAt": "2026-01-29T03:00:59.240Z",
            "updatedAt": "2026-01-29T03:00:59.240Z"
        },
        {
            "id": 28,
            "code": "curriculum_version.lock",
            "description": "CURRICULUM_VERSION LOCK",
            "createdAt": "2026-01-29T03:01:03.490Z",
            "updatedAt": "2026-01-29T03:01:03.490Z"
        },
        {
            "id": 26,
            "code": "curriculum_version.update",
            "description": "CURRICULUM_VERSION UPDATE",
            "createdAt": "2026-01-29T03:01:00.804Z",
            "updatedAt": "2026-01-29T03:01:00.804Z"
        },
        {
            "id": 27,
            "code": "curriculum_version.view",
            "description": "CURRICULUM_VERSION VIEW",
            "createdAt": "2026-01-29T03:01:01.982Z",
            "updatedAt": "2026-01-29T03:01:01.982Z"
        },
        {
            "id": 41,
            "code": "document.delete",
            "description": "DOCUMENT DELETE",
            "createdAt": "2026-01-29T03:01:21.495Z",
            "updatedAt": "2026-01-29T03:01:21.495Z"
        },
        {
            "id": 39,
            "code": "document.upload",
            "description": "DOCUMENT UPLOAD",
            "createdAt": "2026-01-29T03:01:19.161Z",
            "updatedAt": "2026-01-29T03:01:19.161Z"
        },
        {
            "id": 40,
            "code": "document.view",
            "description": "DOCUMENT VIEW",
            "createdAt": "2026-01-29T03:01:20.329Z",
            "updatedAt": "2026-01-29T03:01:20.329Z"
        },
        {
            "id": 19,
            "code": "enrollment.complete",
            "description": "ENROLLMENT COMPLETE",
            "createdAt": "2026-01-29T03:00:49.822Z",
            "updatedAt": "2026-01-29T03:00:49.822Z"
        },
        {
            "id": 16,
            "code": "enrollment.create",
            "description": "ENROLLMENT CREATE",
            "createdAt": "2026-01-29T03:00:45.968Z",
            "updatedAt": "2026-01-29T03:00:45.968Z"
        },
        {
            "id": 20,
            "code": "enrollment.import",
            "description": "ENROLLMENT IMPORT",
            "createdAt": "2026-01-29T03:00:51.304Z",
            "updatedAt": "2026-01-29T03:00:51.304Z"
        },
        {
            "id": 17,
            "code": "enrollment.update",
            "description": "ENROLLMENT UPDATE",
            "createdAt": "2026-01-29T03:00:47.133Z",
            "updatedAt": "2026-01-29T03:00:47.133Z"
        },
        {
            "id": 18,
            "code": "enrollment.view",
            "description": "ENROLLMENT VIEW",
            "createdAt": "2026-01-29T03:00:48.311Z",
            "updatedAt": "2026-01-29T03:00:48.311Z"
        },
        {
            "id": 33,
            "code": "grades.encode",
            "description": "GRADES ENCODE",
            "createdAt": "2026-01-29T03:01:10.755Z",
            "updatedAt": "2026-01-29T03:01:10.755Z"
        },
        {
            "id": 36,
            "code": "grades.import",
            "description": "GRADES IMPORT",
            "createdAt": "2026-01-29T03:01:15.653Z",
            "updatedAt": "2026-01-29T03:01:15.653Z"
        },
        {
            "id": 37,
            "code": "grades.lock",
            "description": "GRADES LOCK",
            "createdAt": "2026-01-29T03:01:16.835Z",
            "updatedAt": "2026-01-29T03:01:16.835Z"
        },
        {
            "id": 38,
            "code": "grades.unlock",
            "description": "GRADES UNLOCK",
            "createdAt": "2026-01-29T03:01:17.997Z",
            "updatedAt": "2026-01-29T03:01:17.997Z"
        },
        {
            "id": 34,
            "code": "grades.update",
            "description": "GRADES UPDATE",
            "createdAt": "2026-01-29T03:01:12.665Z",
            "updatedAt": "2026-01-29T03:01:12.665Z"
        },
        {
            "id": 35,
            "code": "grades.view",
            "description": "GRADES VIEW",
            "createdAt": "2026-01-29T03:01:14.075Z",
            "updatedAt": "2026-01-29T03:01:14.075Z"
        },
        {
            "id": 10,
            "code": "permission.view",
            "description": "PERMISSION VIEW",
            "createdAt": "2026-01-29T03:00:38.094Z",
            "updatedAt": "2026-01-29T03:00:38.094Z"
        },
        {
            "id": 46,
            "code": "report.export",
            "description": "REPORT EXPORT",
            "createdAt": "2026-01-29T03:01:28.401Z",
            "updatedAt": "2026-01-29T03:01:28.401Z"
        },
        {
            "id": 45,
            "code": "report.view",
            "description": "REPORT VIEW",
            "createdAt": "2026-01-29T03:01:27.199Z",
            "updatedAt": "2026-01-29T03:01:27.199Z"
        },
        {
            "id": 9,
            "code": "role.assign-permissions",
            "description": "ROLE ASSIGN PERMISSIONS",
            "createdAt": "2026-01-29T03:00:36.921Z",
            "updatedAt": "2026-01-29T03:00:36.921Z"
        },
        {
            "id": 5,
            "code": "role.create",
            "description": "ROLE CREATE",
            "createdAt": "2026-01-29T03:00:31.232Z",
            "updatedAt": "2026-01-29T03:00:31.232Z"
        },
        {
            "id": 8,
            "code": "role.delete",
            "description": "ROLE DELETE",
            "createdAt": "2026-01-29T03:00:35.735Z",
            "updatedAt": "2026-01-29T03:00:35.735Z"
        },
        {
            "id": 7,
            "code": "role.update",
            "description": "ROLE UPDATE",
            "createdAt": "2026-01-29T03:00:34.558Z",
            "updatedAt": "2026-01-29T03:00:34.558Z"
        },
        {
            "id": 6,
            "code": "role.view",
            "description": "ROLE VIEW",
            "createdAt": "2026-01-29T03:00:33.071Z",
            "updatedAt": "2026-01-29T03:00:33.071Z"
        },
        {
            "id": 50,
            "code": "school_year.activate",
            "description": "SCHOOL_YEAR ACTIVATE",
            "createdAt": "2026-01-29T03:01:34.714Z",
            "updatedAt": "2026-01-29T03:01:34.714Z"
        },
        {
            "id": 51,
            "code": "school_year.close",
            "description": "SCHOOL_YEAR CLOSE",
            "createdAt": "2026-01-29T03:01:35.878Z",
            "updatedAt": "2026-01-29T03:01:35.878Z"
        },
        {
            "id": 49,
            "code": "school_year.create",
            "description": "SCHOOL_YEAR CREATE",
            "createdAt": "2026-01-29T03:01:33.214Z",
            "updatedAt": "2026-01-29T03:01:33.214Z"
        },
        {
            "id": 44,
            "code": "sf10.export",
            "description": "SF10 EXPORT",
            "createdAt": "2026-01-29T03:01:25.702Z",
            "updatedAt": "2026-01-29T03:01:25.702Z"
        },
        {
            "id": 42,
            "code": "sf10.generate",
            "description": "SF10 GENERATE",
            "createdAt": "2026-01-29T03:01:22.717Z",
            "updatedAt": "2026-01-29T03:01:22.717Z"
        },
        {
            "id": 43,
            "code": "sf10.view",
            "description": "SF10 VIEW",
            "createdAt": "2026-01-29T03:01:23.879Z",
            "updatedAt": "2026-01-29T03:01:23.879Z"
        },
        {
            "id": 15,
            "code": "student.archive",
            "description": "STUDENT ARCHIVE",
            "createdAt": "2026-01-29T03:00:44.462Z",
            "updatedAt": "2026-01-29T03:00:44.462Z"
        },
        {
            "id": 11,
            "code": "student.create",
            "description": "STUDENT CREATE",
            "createdAt": "2026-01-29T03:00:39.264Z",
            "updatedAt": "2026-01-29T03:00:39.264Z"
        },
        {
            "id": 14,
            "code": "student.search",
            "description": "STUDENT SEARCH",
            "createdAt": "2026-01-29T03:00:43.303Z",
            "updatedAt": "2026-01-29T03:00:43.303Z"
        },
        {
            "id": 12,
            "code": "student.update",
            "description": "STUDENT UPDATE",
            "createdAt": "2026-01-29T03:00:40.441Z",
            "updatedAt": "2026-01-29T03:00:40.441Z"
        },
        {
            "id": 13,
            "code": "student.view",
            "description": "STUDENT VIEW",
            "createdAt": "2026-01-29T03:00:41.832Z",
            "updatedAt": "2026-01-29T03:00:41.832Z"
        },
        {
            "id": 29,
            "code": "subject.create",
            "description": "SUBJECT CREATE",
            "createdAt": "2026-01-29T03:01:05.171Z",
            "updatedAt": "2026-01-29T03:01:05.171Z"
        },
        {
            "id": 32,
            "code": "subject.lock",
            "description": "SUBJECT LOCK",
            "createdAt": "2026-01-29T03:01:09.549Z",
            "updatedAt": "2026-01-29T03:01:09.549Z"
        },
        {
            "id": 30,
            "code": "subject.update",
            "description": "SUBJECT UPDATE",
            "createdAt": "2026-01-29T03:01:06.710Z",
            "updatedAt": "2026-01-29T03:01:06.710Z"
        },
        {
            "id": 31,
            "code": "subject.view",
            "description": "SUBJECT VIEW",
            "createdAt": "2026-01-29T03:01:07.938Z",
            "updatedAt": "2026-01-29T03:01:07.938Z"
        },
        {
            "id": 48,
            "code": "system.update",
            "description": "SYSTEM UPDATE",
            "createdAt": "2026-01-29T03:01:31.661Z",
            "updatedAt": "2026-01-29T03:01:31.661Z"
        },
        {
            "id": 47,
            "code": "system.view",
            "description": "SYSTEM VIEW",
            "createdAt": "2026-01-29T03:01:30.459Z",
            "updatedAt": "2026-01-29T03:01:30.459Z"
        },
        {
            "id": 4,
            "code": "user.assign-role",
            "description": "USER ASSIGN ROLE",
            "createdAt": "2026-01-29T03:00:30.025Z",
            "updatedAt": "2026-01-29T03:00:30.025Z"
        },
        {
            "id": 1,
            "code": "user.create",
            "description": "USER CREATE",
            "createdAt": "2026-01-29T03:00:24.744Z",
            "updatedAt": "2026-01-29T03:00:24.744Z"
        },
        {
            "id": 3,
            "code": "user.deactivate",
            "description": "USER DEACTIVATE",
            "createdAt": "2026-01-29T03:00:28.515Z",
            "updatedAt": "2026-01-29T03:00:28.515Z"
        },
        {
            "id": 2,
            "code": "user.update",
            "description": "USER UPDATE",
            "createdAt": "2026-01-29T03:00:26.981Z",
            "updatedAt": "2026-01-29T03:00:26.981Z"
        }
    ]
}
```

