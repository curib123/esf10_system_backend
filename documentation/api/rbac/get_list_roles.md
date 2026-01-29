# List Roles Endpoint

**GET** `/api/roles`

Returns all roles with assigned permissions.

## Authorization

- Requires authentication
- Requires roles: `SUPER_ADMIN`
- Requires permission: `role.view`

## Success Response (200)
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "SUPER_ADMIN",
            "description": "Full system access",
            "createdAt": "2026-01-29T03:01:40.577Z",
            "updatedAt": "2026-01-29T03:01:40.577Z",
            "permissions": [
                {
                    "roleId": 1,
                    "permissionId": 1,
                    "assignedAt": "2026-01-29T03:01:47.461Z",
                    "permission": {
                        "id": 1,
                        "code": "user.create",
                        "description": "USER CREATE",
                        "createdAt": "2026-01-29T03:00:24.744Z",
                        "updatedAt": "2026-01-29T03:00:24.744Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 2,
                    "assignedAt": "2026-01-29T03:01:49.656Z",
                    "permission": {
                        "id": 2,
                        "code": "user.update",
                        "description": "USER UPDATE",
                        "createdAt": "2026-01-29T03:00:26.981Z",
                        "updatedAt": "2026-01-29T03:00:26.981Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 3,
                    "assignedAt": "2026-01-29T03:01:50.853Z",
                    "permission": {
                        "id": 3,
                        "code": "user.deactivate",
                        "description": "USER DEACTIVATE",
                        "createdAt": "2026-01-29T03:00:28.515Z",
                        "updatedAt": "2026-01-29T03:00:28.515Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 4,
                    "assignedAt": "2026-01-29T03:01:52.386Z",
                    "permission": {
                        "id": 4,
                        "code": "user.assign-role",
                        "description": "USER ASSIGN ROLE",
                        "createdAt": "2026-01-29T03:00:30.025Z",
                        "updatedAt": "2026-01-29T03:00:30.025Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 5,
                    "assignedAt": "2026-01-29T03:01:53.547Z",
                    "permission": {
                        "id": 5,
                        "code": "role.create",
                        "description": "ROLE CREATE",
                        "createdAt": "2026-01-29T03:00:31.232Z",
                        "updatedAt": "2026-01-29T03:00:31.232Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 6,
                    "assignedAt": "2026-01-29T03:01:55.032Z",
                    "permission": {
                        "id": 6,
                        "code": "role.view",
                        "description": "ROLE VIEW",
                        "createdAt": "2026-01-29T03:00:33.071Z",
                        "updatedAt": "2026-01-29T03:00:33.071Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 7,
                    "assignedAt": "2026-01-29T03:01:56.226Z",
                    "permission": {
                        "id": 7,
                        "code": "role.update",
                        "description": "ROLE UPDATE",
                        "createdAt": "2026-01-29T03:00:34.558Z",
                        "updatedAt": "2026-01-29T03:00:34.558Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 8,
                    "assignedAt": "2026-01-29T03:01:57.734Z",
                    "permission": {
                        "id": 8,
                        "code": "role.delete",
                        "description": "ROLE DELETE",
                        "createdAt": "2026-01-29T03:00:35.735Z",
                        "updatedAt": "2026-01-29T03:00:35.735Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 9,
                    "assignedAt": "2026-01-29T03:02:00.151Z",
                    "permission": {
                        "id": 9,
                        "code": "role.assign-permissions",
                        "description": "ROLE ASSIGN PERMISSIONS",
                        "createdAt": "2026-01-29T03:00:36.921Z",
                        "updatedAt": "2026-01-29T03:00:36.921Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 10,
                    "assignedAt": "2026-01-29T03:02:01.848Z",
                    "permission": {
                        "id": 10,
                        "code": "permission.view",
                        "description": "PERMISSION VIEW",
                        "createdAt": "2026-01-29T03:00:38.094Z",
                        "updatedAt": "2026-01-29T03:00:38.094Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 11,
                    "assignedAt": "2026-01-29T03:02:03.329Z",
                    "permission": {
                        "id": 11,
                        "code": "student.create",
                        "description": "STUDENT CREATE",
                        "createdAt": "2026-01-29T03:00:39.264Z",
                        "updatedAt": "2026-01-29T03:00:39.264Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 12,
                    "assignedAt": "2026-01-29T03:02:04.472Z",
                    "permission": {
                        "id": 12,
                        "code": "student.update",
                        "description": "STUDENT UPDATE",
                        "createdAt": "2026-01-29T03:00:40.441Z",
                        "updatedAt": "2026-01-29T03:00:40.441Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 13,
                    "assignedAt": "2026-01-29T03:02:05.933Z",
                    "permission": {
                        "id": 13,
                        "code": "student.view",
                        "description": "STUDENT VIEW",
                        "createdAt": "2026-01-29T03:00:41.832Z",
                        "updatedAt": "2026-01-29T03:00:41.832Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 14,
                    "assignedAt": "2026-01-29T03:02:07.077Z",
                    "permission": {
                        "id": 14,
                        "code": "student.search",
                        "description": "STUDENT SEARCH",
                        "createdAt": "2026-01-29T03:00:43.303Z",
                        "updatedAt": "2026-01-29T03:00:43.303Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 15,
                    "assignedAt": "2026-01-29T03:02:08.219Z",
                    "permission": {
                        "id": 15,
                        "code": "student.archive",
                        "description": "STUDENT ARCHIVE",
                        "createdAt": "2026-01-29T03:00:44.462Z",
                        "updatedAt": "2026-01-29T03:00:44.462Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 16,
                    "assignedAt": "2026-01-29T03:02:09.363Z",
                    "permission": {
                        "id": 16,
                        "code": "enrollment.create",
                        "description": "ENROLLMENT CREATE",
                        "createdAt": "2026-01-29T03:00:45.968Z",
                        "updatedAt": "2026-01-29T03:00:45.968Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 17,
                    "assignedAt": "2026-01-29T03:02:10.817Z",
                    "permission": {
                        "id": 17,
                        "code": "enrollment.update",
                        "description": "ENROLLMENT UPDATE",
                        "createdAt": "2026-01-29T03:00:47.133Z",
                        "updatedAt": "2026-01-29T03:00:47.133Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 18,
                    "assignedAt": "2026-01-29T03:02:12.584Z",
                    "permission": {
                        "id": 18,
                        "code": "enrollment.view",
                        "description": "ENROLLMENT VIEW",
                        "createdAt": "2026-01-29T03:00:48.311Z",
                        "updatedAt": "2026-01-29T03:00:48.311Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 19,
                    "assignedAt": "2026-01-29T03:02:14.032Z",
                    "permission": {
                        "id": 19,
                        "code": "enrollment.complete",
                        "description": "ENROLLMENT COMPLETE",
                        "createdAt": "2026-01-29T03:00:49.822Z",
                        "updatedAt": "2026-01-29T03:00:49.822Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 20,
                    "assignedAt": "2026-01-29T03:02:15.178Z",
                    "permission": {
                        "id": 20,
                        "code": "enrollment.import",
                        "description": "ENROLLMENT IMPORT",
                        "createdAt": "2026-01-29T03:00:51.304Z",
                        "updatedAt": "2026-01-29T03:00:51.304Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 21,
                    "assignedAt": "2026-01-29T03:02:16.322Z",
                    "permission": {
                        "id": 21,
                        "code": "curriculum.create",
                        "description": "CURRICULUM CREATE",
                        "createdAt": "2026-01-29T03:00:52.469Z",
                        "updatedAt": "2026-01-29T03:00:52.469Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 22,
                    "assignedAt": "2026-01-29T03:02:17.711Z",
                    "permission": {
                        "id": 22,
                        "code": "curriculum.update",
                        "description": "CURRICULUM UPDATE",
                        "createdAt": "2026-01-29T03:00:53.639Z",
                        "updatedAt": "2026-01-29T03:00:53.639Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 23,
                    "assignedAt": "2026-01-29T03:02:19.210Z",
                    "permission": {
                        "id": 23,
                        "code": "curriculum.view",
                        "description": "CURRICULUM VIEW",
                        "createdAt": "2026-01-29T03:00:55.972Z",
                        "updatedAt": "2026-01-29T03:00:55.972Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 24,
                    "assignedAt": "2026-01-29T03:02:20.375Z",
                    "permission": {
                        "id": 24,
                        "code": "curriculum.lock",
                        "description": "CURRICULUM LOCK",
                        "createdAt": "2026-01-29T03:00:57.401Z",
                        "updatedAt": "2026-01-29T03:00:57.401Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 25,
                    "assignedAt": "2026-01-29T03:02:21.544Z",
                    "permission": {
                        "id": 25,
                        "code": "curriculum_version.create",
                        "description": "CURRICULUM_VERSION CREATE",
                        "createdAt": "2026-01-29T03:00:59.240Z",
                        "updatedAt": "2026-01-29T03:00:59.240Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 26,
                    "assignedAt": "2026-01-29T03:02:22.768Z",
                    "permission": {
                        "id": 26,
                        "code": "curriculum_version.update",
                        "description": "CURRICULUM_VERSION UPDATE",
                        "createdAt": "2026-01-29T03:01:00.804Z",
                        "updatedAt": "2026-01-29T03:01:00.804Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 27,
                    "assignedAt": "2026-01-29T03:02:23.928Z",
                    "permission": {
                        "id": 27,
                        "code": "curriculum_version.view",
                        "description": "CURRICULUM_VERSION VIEW",
                        "createdAt": "2026-01-29T03:01:01.982Z",
                        "updatedAt": "2026-01-29T03:01:01.982Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 28,
                    "assignedAt": "2026-01-29T03:02:25.097Z",
                    "permission": {
                        "id": 28,
                        "code": "curriculum_version.lock",
                        "description": "CURRICULUM_VERSION LOCK",
                        "createdAt": "2026-01-29T03:01:03.490Z",
                        "updatedAt": "2026-01-29T03:01:03.490Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 29,
                    "assignedAt": "2026-01-29T03:02:26.262Z",
                    "permission": {
                        "id": 29,
                        "code": "subject.create",
                        "description": "SUBJECT CREATE",
                        "createdAt": "2026-01-29T03:01:05.171Z",
                        "updatedAt": "2026-01-29T03:01:05.171Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 30,
                    "assignedAt": "2026-01-29T03:02:27.433Z",
                    "permission": {
                        "id": 30,
                        "code": "subject.update",
                        "description": "SUBJECT UPDATE",
                        "createdAt": "2026-01-29T03:01:06.710Z",
                        "updatedAt": "2026-01-29T03:01:06.710Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 31,
                    "assignedAt": "2026-01-29T03:02:28.604Z",
                    "permission": {
                        "id": 31,
                        "code": "subject.view",
                        "description": "SUBJECT VIEW",
                        "createdAt": "2026-01-29T03:01:07.938Z",
                        "updatedAt": "2026-01-29T03:01:07.938Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 32,
                    "assignedAt": "2026-01-29T03:02:29.783Z",
                    "permission": {
                        "id": 32,
                        "code": "subject.lock",
                        "description": "SUBJECT LOCK",
                        "createdAt": "2026-01-29T03:01:09.549Z",
                        "updatedAt": "2026-01-29T03:01:09.549Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 33,
                    "assignedAt": "2026-01-29T03:02:31.323Z",
                    "permission": {
                        "id": 33,
                        "code": "grades.encode",
                        "description": "GRADES ENCODE",
                        "createdAt": "2026-01-29T03:01:10.755Z",
                        "updatedAt": "2026-01-29T03:01:10.755Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 34,
                    "assignedAt": "2026-01-29T03:02:32.920Z",
                    "permission": {
                        "id": 34,
                        "code": "grades.update",
                        "description": "GRADES UPDATE",
                        "createdAt": "2026-01-29T03:01:12.665Z",
                        "updatedAt": "2026-01-29T03:01:12.665Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 35,
                    "assignedAt": "2026-01-29T03:02:34.319Z",
                    "permission": {
                        "id": 35,
                        "code": "grades.view",
                        "description": "GRADES VIEW",
                        "createdAt": "2026-01-29T03:01:14.075Z",
                        "updatedAt": "2026-01-29T03:01:14.075Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 36,
                    "assignedAt": "2026-01-29T03:02:35.488Z",
                    "permission": {
                        "id": 36,
                        "code": "grades.import",
                        "description": "GRADES IMPORT",
                        "createdAt": "2026-01-29T03:01:15.653Z",
                        "updatedAt": "2026-01-29T03:01:15.653Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 37,
                    "assignedAt": "2026-01-29T03:02:36.650Z",
                    "permission": {
                        "id": 37,
                        "code": "grades.lock",
                        "description": "GRADES LOCK",
                        "createdAt": "2026-01-29T03:01:16.835Z",
                        "updatedAt": "2026-01-29T03:01:16.835Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 38,
                    "assignedAt": "2026-01-29T03:02:37.817Z",
                    "permission": {
                        "id": 38,
                        "code": "grades.unlock",
                        "description": "GRADES UNLOCK",
                        "createdAt": "2026-01-29T03:01:17.997Z",
                        "updatedAt": "2026-01-29T03:01:17.997Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 39,
                    "assignedAt": "2026-01-29T03:02:39.458Z",
                    "permission": {
                        "id": 39,
                        "code": "document.upload",
                        "description": "DOCUMENT UPLOAD",
                        "createdAt": "2026-01-29T03:01:19.161Z",
                        "updatedAt": "2026-01-29T03:01:19.161Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 40,
                    "assignedAt": "2026-01-29T03:02:40.625Z",
                    "permission": {
                        "id": 40,
                        "code": "document.view",
                        "description": "DOCUMENT VIEW",
                        "createdAt": "2026-01-29T03:01:20.329Z",
                        "updatedAt": "2026-01-29T03:01:20.329Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 41,
                    "assignedAt": "2026-01-29T03:02:41.792Z",
                    "permission": {
                        "id": 41,
                        "code": "document.delete",
                        "description": "DOCUMENT DELETE",
                        "createdAt": "2026-01-29T03:01:21.495Z",
                        "updatedAt": "2026-01-29T03:01:21.495Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 42,
                    "assignedAt": "2026-01-29T03:02:42.968Z",
                    "permission": {
                        "id": 42,
                        "code": "sf10.generate",
                        "description": "SF10 GENERATE",
                        "createdAt": "2026-01-29T03:01:22.717Z",
                        "updatedAt": "2026-01-29T03:01:22.717Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 43,
                    "assignedAt": "2026-01-29T03:02:44.163Z",
                    "permission": {
                        "id": 43,
                        "code": "sf10.view",
                        "description": "SF10 VIEW",
                        "createdAt": "2026-01-29T03:01:23.879Z",
                        "updatedAt": "2026-01-29T03:01:23.879Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 44,
                    "assignedAt": "2026-01-29T03:02:45.710Z",
                    "permission": {
                        "id": 44,
                        "code": "sf10.export",
                        "description": "SF10 EXPORT",
                        "createdAt": "2026-01-29T03:01:25.702Z",
                        "updatedAt": "2026-01-29T03:01:25.702Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 45,
                    "assignedAt": "2026-01-29T03:02:46.878Z",
                    "permission": {
                        "id": 45,
                        "code": "report.view",
                        "description": "REPORT VIEW",
                        "createdAt": "2026-01-29T03:01:27.199Z",
                        "updatedAt": "2026-01-29T03:01:27.199Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 46,
                    "assignedAt": "2026-01-29T03:02:48.036Z",
                    "permission": {
                        "id": 46,
                        "code": "report.export",
                        "description": "REPORT EXPORT",
                        "createdAt": "2026-01-29T03:01:28.401Z",
                        "updatedAt": "2026-01-29T03:01:28.401Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 47,
                    "assignedAt": "2026-01-29T03:02:49.208Z",
                    "permission": {
                        "id": 47,
                        "code": "system.view",
                        "description": "SYSTEM VIEW",
                        "createdAt": "2026-01-29T03:01:30.459Z",
                        "updatedAt": "2026-01-29T03:01:30.459Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 48,
                    "assignedAt": "2026-01-29T03:02:51.307Z",
                    "permission": {
                        "id": 48,
                        "code": "system.update",
                        "description": "SYSTEM UPDATE",
                        "createdAt": "2026-01-29T03:01:31.661Z",
                        "updatedAt": "2026-01-29T03:01:31.661Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 49,
                    "assignedAt": "2026-01-29T03:02:52.472Z",
                    "permission": {
                        "id": 49,
                        "code": "school_year.create",
                        "description": "SCHOOL_YEAR CREATE",
                        "createdAt": "2026-01-29T03:01:33.214Z",
                        "updatedAt": "2026-01-29T03:01:33.214Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 50,
                    "assignedAt": "2026-01-29T03:02:53.653Z",
                    "permission": {
                        "id": 50,
                        "code": "school_year.activate",
                        "description": "SCHOOL_YEAR ACTIVATE",
                        "createdAt": "2026-01-29T03:01:34.714Z",
                        "updatedAt": "2026-01-29T03:01:34.714Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 51,
                    "assignedAt": "2026-01-29T03:02:55.249Z",
                    "permission": {
                        "id": 51,
                        "code": "school_year.close",
                        "description": "SCHOOL_YEAR CLOSE",
                        "createdAt": "2026-01-29T03:01:35.878Z",
                        "updatedAt": "2026-01-29T03:01:35.878Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 52,
                    "assignedAt": "2026-01-29T03:02:56.840Z",
                    "permission": {
                        "id": 52,
                        "code": "audit.view",
                        "description": "AUDIT VIEW",
                        "createdAt": "2026-01-29T03:01:37.380Z",
                        "updatedAt": "2026-01-29T03:01:37.380Z"
                    }
                },
                {
                    "roleId": 1,
                    "permissionId": 53,
                    "assignedAt": "2026-01-29T03:02:58.343Z",
                    "permission": {
                        "id": 53,
                        "code": "audit.export",
                        "description": "AUDIT EXPORT",
                        "createdAt": "2026-01-29T03:01:39.044Z",
                        "updatedAt": "2026-01-29T03:01:39.044Z"
                    }
                }
            ]
        },
        {
            "id": 2,
            "name": "REGISTRAR",
            "description": "Student, enrollment, and SF10 management",
            "createdAt": "2026-01-29T03:01:43.405Z",
            "updatedAt": "2026-01-29T03:01:43.405Z",
            "permissions": [
                {
                    "roleId": 2,
                    "permissionId": 11,
                    "assignedAt": "2026-01-29T03:02:59.979Z",
                    "permission": {
                        "id": 11,
                        "code": "student.create",
                        "description": "STUDENT CREATE",
                        "createdAt": "2026-01-29T03:00:39.264Z",
                        "updatedAt": "2026-01-29T03:00:39.264Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 12,
                    "assignedAt": "2026-01-29T03:03:01.150Z",
                    "permission": {
                        "id": 12,
                        "code": "student.update",
                        "description": "STUDENT UPDATE",
                        "createdAt": "2026-01-29T03:00:40.441Z",
                        "updatedAt": "2026-01-29T03:00:40.441Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 13,
                    "assignedAt": "2026-01-29T03:03:02.314Z",
                    "permission": {
                        "id": 13,
                        "code": "student.view",
                        "description": "STUDENT VIEW",
                        "createdAt": "2026-01-29T03:00:41.832Z",
                        "updatedAt": "2026-01-29T03:00:41.832Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 14,
                    "assignedAt": "2026-01-29T03:03:03.859Z",
                    "permission": {
                        "id": 14,
                        "code": "student.search",
                        "description": "STUDENT SEARCH",
                        "createdAt": "2026-01-29T03:00:43.303Z",
                        "updatedAt": "2026-01-29T03:00:43.303Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 15,
                    "assignedAt": "2026-01-29T03:03:05.031Z",
                    "permission": {
                        "id": 15,
                        "code": "student.archive",
                        "description": "STUDENT ARCHIVE",
                        "createdAt": "2026-01-29T03:00:44.462Z",
                        "updatedAt": "2026-01-29T03:00:44.462Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 16,
                    "assignedAt": "2026-01-29T03:03:06.423Z",
                    "permission": {
                        "id": 16,
                        "code": "enrollment.create",
                        "description": "ENROLLMENT CREATE",
                        "createdAt": "2026-01-29T03:00:45.968Z",
                        "updatedAt": "2026-01-29T03:00:45.968Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 17,
                    "assignedAt": "2026-01-29T03:03:07.587Z",
                    "permission": {
                        "id": 17,
                        "code": "enrollment.update",
                        "description": "ENROLLMENT UPDATE",
                        "createdAt": "2026-01-29T03:00:47.133Z",
                        "updatedAt": "2026-01-29T03:00:47.133Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 18,
                    "assignedAt": "2026-01-29T03:03:08.751Z",
                    "permission": {
                        "id": 18,
                        "code": "enrollment.view",
                        "description": "ENROLLMENT VIEW",
                        "createdAt": "2026-01-29T03:00:48.311Z",
                        "updatedAt": "2026-01-29T03:00:48.311Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 19,
                    "assignedAt": "2026-01-29T03:03:09.918Z",
                    "permission": {
                        "id": 19,
                        "code": "enrollment.complete",
                        "description": "ENROLLMENT COMPLETE",
                        "createdAt": "2026-01-29T03:00:49.822Z",
                        "updatedAt": "2026-01-29T03:00:49.822Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 20,
                    "assignedAt": "2026-01-29T03:03:11.125Z",
                    "permission": {
                        "id": 20,
                        "code": "enrollment.import",
                        "description": "ENROLLMENT IMPORT",
                        "createdAt": "2026-01-29T03:00:51.304Z",
                        "updatedAt": "2026-01-29T03:00:51.304Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 39,
                    "assignedAt": "2026-01-29T03:03:12.627Z",
                    "permission": {
                        "id": 39,
                        "code": "document.upload",
                        "description": "DOCUMENT UPLOAD",
                        "createdAt": "2026-01-29T03:01:19.161Z",
                        "updatedAt": "2026-01-29T03:01:19.161Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 40,
                    "assignedAt": "2026-01-29T03:03:13.799Z",
                    "permission": {
                        "id": 40,
                        "code": "document.view",
                        "description": "DOCUMENT VIEW",
                        "createdAt": "2026-01-29T03:01:20.329Z",
                        "updatedAt": "2026-01-29T03:01:20.329Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 42,
                    "assignedAt": "2026-01-29T03:03:15.273Z",
                    "permission": {
                        "id": 42,
                        "code": "sf10.generate",
                        "description": "SF10 GENERATE",
                        "createdAt": "2026-01-29T03:01:22.717Z",
                        "updatedAt": "2026-01-29T03:01:22.717Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 43,
                    "assignedAt": "2026-01-29T03:03:16.748Z",
                    "permission": {
                        "id": 43,
                        "code": "sf10.view",
                        "description": "SF10 VIEW",
                        "createdAt": "2026-01-29T03:01:23.879Z",
                        "updatedAt": "2026-01-29T03:01:23.879Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 44,
                    "assignedAt": "2026-01-29T03:03:17.917Z",
                    "permission": {
                        "id": 44,
                        "code": "sf10.export",
                        "description": "SF10 EXPORT",
                        "createdAt": "2026-01-29T03:01:25.702Z",
                        "updatedAt": "2026-01-29T03:01:25.702Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 45,
                    "assignedAt": "2026-01-29T03:03:19.083Z",
                    "permission": {
                        "id": 45,
                        "code": "report.view",
                        "description": "REPORT VIEW",
                        "createdAt": "2026-01-29T03:01:27.199Z",
                        "updatedAt": "2026-01-29T03:01:27.199Z"
                    }
                },
                {
                    "roleId": 2,
                    "permissionId": 46,
                    "assignedAt": "2026-01-29T03:03:20.246Z",
                    "permission": {
                        "id": 46,
                        "code": "report.export",
                        "description": "REPORT EXPORT",
                        "createdAt": "2026-01-29T03:01:28.401Z",
                        "updatedAt": "2026-01-29T03:01:28.401Z"
                    }
                }
            ]
        },
        {
            "id": 3,
            "name": "TEACHER",
            "description": "Grade encoding only",
            "createdAt": "2026-01-29T03:01:44.568Z",
            "updatedAt": "2026-01-29T03:01:44.568Z",
            "permissions": [
                {
                    "roleId": 3,
                    "permissionId": 33,
                    "assignedAt": "2026-01-29T03:03:22.422Z",
                    "permission": {
                        "id": 33,
                        "code": "grades.encode",
                        "description": "GRADES ENCODE",
                        "createdAt": "2026-01-29T03:01:10.755Z",
                        "updatedAt": "2026-01-29T03:01:10.755Z"
                    }
                },
                {
                    "roleId": 3,
                    "permissionId": 34,
                    "assignedAt": "2026-01-29T03:03:23.596Z",
                    "permission": {
                        "id": 34,
                        "code": "grades.update",
                        "description": "GRADES UPDATE",
                        "createdAt": "2026-01-29T03:01:12.665Z",
                        "updatedAt": "2026-01-29T03:01:12.665Z"
                    }
                },
                {
                    "roleId": 3,
                    "permissionId": 35,
                    "assignedAt": "2026-01-29T03:03:25.282Z",
                    "permission": {
                        "id": 35,
                        "code": "grades.view",
                        "description": "GRADES VIEW",
                        "createdAt": "2026-01-29T03:01:14.075Z",
                        "updatedAt": "2026-01-29T03:01:14.075Z"
                    }
                }
            ]
        },
        {
            "id": 4,
            "name": "VIEWER",
            "description": "Read-only access",
            "createdAt": "2026-01-29T03:01:45.964Z",
            "updatedAt": "2026-01-29T03:01:45.964Z",
            "permissions": [
                {
                    "roleId": 4,
                    "permissionId": 13,
                    "assignedAt": "2026-01-29T03:03:27.854Z",
                    "permission": {
                        "id": 13,
                        "code": "student.view",
                        "description": "STUDENT VIEW",
                        "createdAt": "2026-01-29T03:00:41.832Z",
                        "updatedAt": "2026-01-29T03:00:41.832Z"
                    }
                },
                {
                    "roleId": 4,
                    "permissionId": 14,
                    "assignedAt": "2026-01-29T03:03:29.045Z",
                    "permission": {
                        "id": 14,
                        "code": "student.search",
                        "description": "STUDENT SEARCH",
                        "createdAt": "2026-01-29T03:00:43.303Z",
                        "updatedAt": "2026-01-29T03:00:43.303Z"
                    }
                },
                {
                    "roleId": 4,
                    "permissionId": 18,
                    "assignedAt": "2026-01-29T03:03:30.547Z",
                    "permission": {
                        "id": 18,
                        "code": "enrollment.view",
                        "description": "ENROLLMENT VIEW",
                        "createdAt": "2026-01-29T03:00:48.311Z",
                        "updatedAt": "2026-01-29T03:00:48.311Z"
                    }
                },
                {
                    "roleId": 4,
                    "permissionId": 35,
                    "assignedAt": "2026-01-29T03:03:32.722Z",
                    "permission": {
                        "id": 35,
                        "code": "grades.view",
                        "description": "GRADES VIEW",
                        "createdAt": "2026-01-29T03:01:14.075Z",
                        "updatedAt": "2026-01-29T03:01:14.075Z"
                    }
                },
                {
                    "roleId": 4,
                    "permissionId": 43,
                    "assignedAt": "2026-01-29T03:03:34.212Z",
                    "permission": {
                        "id": 43,
                        "code": "sf10.view",
                        "description": "SF10 VIEW",
                        "createdAt": "2026-01-29T03:01:23.879Z",
                        "updatedAt": "2026-01-29T03:01:23.879Z"
                    }
                },
                {
                    "roleId": 4,
                    "permissionId": 45,
                    "assignedAt": "2026-01-29T03:03:35.378Z",
                    "permission": {
                        "id": 45,
                        "code": "report.view",
                        "description": "REPORT VIEW",
                        "createdAt": "2026-01-29T03:01:27.199Z",
                        "updatedAt": "2026-01-29T03:01:27.199Z"
                    }
                }
            ]
        }
    ]
}
```
