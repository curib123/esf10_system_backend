# 📘 Get Grades by Enrollment API

Fetch all grades for a specific enrollment with DepEd descriptors and remarks.

This endpoint is **read-only** and returns enriched grade data including descriptors and passing status.

---

## 🎯 Intended Use

- Display student grades in grading forms
- Show quarterly progress with descriptors
- Build grade summary views
- Populate editable grade tables for advisers

---

## Endpoint

```
GET /api/grades/enrollment/:enrollmentId
```

---

## Authorization

- Requires authentication
- **Section adviser** → allowed
- **Users with `grades.view` permission** → allowed
- **Other users** → forbidden

---

## Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| enrollmentId | number | Yes | Enrollment ID |

---

## Example Request

```
GET /api/grades/enrollment/12
```

---

## Success Response (200)

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "enrollmentId": 1,
            "subjectId": 1,
            "period": "Q1",
            "value": 96,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 1,
                "code": "FIL",
                "name": "Filipino"
            },
            "roundedValue": 96,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 2,
            "enrollmentId": 1,
            "subjectId": 1,
            "period": "Q2",
            "value": 96,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 1,
                "code": "FIL",
                "name": "Filipino"
            },
            "roundedValue": 96,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 3,
            "enrollmentId": 1,
            "subjectId": 1,
            "period": "Q3",
            "value": 97,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 1,
                "code": "FIL",
                "name": "Filipino"
            },
            "roundedValue": 97,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 4,
            "enrollmentId": 1,
            "subjectId": 1,
            "period": "Q4",
            "value": 99,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 1,
                "code": "FIL",
                "name": "Filipino"
            },
            "roundedValue": 99,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 5,
            "enrollmentId": 1,
            "subjectId": 1,
            "period": "FINAL",
            "value": 97,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 1,
                "code": "FIL",
                "name": "Filipino"
            },
            "roundedValue": 97,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": "PASSED",
            "isPassing": true
        },
        {
            "id": 6,
            "enrollmentId": 1,
            "subjectId": 2,
            "period": "Q1",
            "value": 95,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 2,
                "code": "ENG",
                "name": "English"
            },
            "roundedValue": 95,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 7,
            "enrollmentId": 1,
            "subjectId": 2,
            "period": "Q2",
            "value": 95,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 2,
                "code": "ENG",
                "name": "English"
            },
            "roundedValue": 95,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 8,
            "enrollmentId": 1,
            "subjectId": 2,
            "period": "Q3",
            "value": 92,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 2,
                "code": "ENG",
                "name": "English"
            },
            "roundedValue": 92,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 9,
            "enrollmentId": 1,
            "subjectId": 2,
            "period": "Q4",
            "value": 95,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 2,
                "code": "ENG",
                "name": "English"
            },
            "roundedValue": 95,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 10,
            "enrollmentId": 1,
            "subjectId": 2,
            "period": "FINAL",
            "value": 94,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 2,
                "code": "ENG",
                "name": "English"
            },
            "roundedValue": 94,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": "PASSED",
            "isPassing": true
        },
        {
            "id": 11,
            "enrollmentId": 1,
            "subjectId": 3,
            "period": "Q1",
            "value": 93,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 3,
                "code": "MATH",
                "name": "Mathematics"
            },
            "roundedValue": 93,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 12,
            "enrollmentId": 1,
            "subjectId": 3,
            "period": "Q2",
            "value": 93,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 3,
                "code": "MATH",
                "name": "Mathematics"
            },
            "roundedValue": 93,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 13,
            "enrollmentId": 1,
            "subjectId": 3,
            "period": "Q3",
            "value": 95,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 3,
                "code": "MATH",
                "name": "Mathematics"
            },
            "roundedValue": 95,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 14,
            "enrollmentId": 1,
            "subjectId": 3,
            "period": "Q4",
            "value": 99,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 3,
                "code": "MATH",
                "name": "Mathematics"
            },
            "roundedValue": 99,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 15,
            "enrollmentId": 1,
            "subjectId": 3,
            "period": "FINAL",
            "value": 95,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 3,
                "code": "MATH",
                "name": "Mathematics"
            },
            "roundedValue": 95,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": "PASSED",
            "isPassing": true
        },
        {
            "id": 16,
            "enrollmentId": 1,
            "subjectId": 4,
            "period": "Q1",
            "value": 99,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 4,
                "code": "SCI",
                "name": "Science"
            },
            "roundedValue": 99,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 17,
            "enrollmentId": 1,
            "subjectId": 4,
            "period": "Q2",
            "value": 95,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 4,
                "code": "SCI",
                "name": "Science"
            },
            "roundedValue": 95,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 18,
            "enrollmentId": 1,
            "subjectId": 4,
            "period": "Q3",
            "value": 99,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 4,
                "code": "SCI",
                "name": "Science"
            },
            "roundedValue": 99,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 19,
            "enrollmentId": 1,
            "subjectId": 4,
            "period": "Q4",
            "value": 94,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 4,
                "code": "SCI",
                "name": "Science"
            },
            "roundedValue": 94,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 20,
            "enrollmentId": 1,
            "subjectId": 4,
            "period": "FINAL",
            "value": 97,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 4,
                "code": "SCI",
                "name": "Science"
            },
            "roundedValue": 97,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": "PASSED",
            "isPassing": true
        },
        {
            "id": 21,
            "enrollmentId": 1,
            "subjectId": 5,
            "period": "Q1",
            "value": 96,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 5,
                "code": "AP",
                "name": "Araling Panlipunan"
            },
            "roundedValue": 96,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 22,
            "enrollmentId": 1,
            "subjectId": 5,
            "period": "Q2",
            "value": 96,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 5,
                "code": "AP",
                "name": "Araling Panlipunan"
            },
            "roundedValue": 96,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 23,
            "enrollmentId": 1,
            "subjectId": 5,
            "period": "Q3",
            "value": 92,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 5,
                "code": "AP",
                "name": "Araling Panlipunan"
            },
            "roundedValue": 92,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 24,
            "enrollmentId": 1,
            "subjectId": 5,
            "period": "Q4",
            "value": 96,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 5,
                "code": "AP",
                "name": "Araling Panlipunan"
            },
            "roundedValue": 96,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 25,
            "enrollmentId": 1,
            "subjectId": 5,
            "period": "FINAL",
            "value": 95,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 5,
                "code": "AP",
                "name": "Araling Panlipunan"
            },
            "roundedValue": 95,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": "PASSED",
            "isPassing": true
        },
        {
            "id": 26,
            "enrollmentId": 1,
            "subjectId": 6,
            "period": "Q1",
            "value": 94,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 6,
                "code": "ESP",
                "name": "Edukasyon sa Pagpapakatao"
            },
            "roundedValue": 94,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 27,
            "enrollmentId": 1,
            "subjectId": 6,
            "period": "Q2",
            "value": 97,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 6,
                "code": "ESP",
                "name": "Edukasyon sa Pagpapakatao"
            },
            "roundedValue": 97,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 28,
            "enrollmentId": 1,
            "subjectId": 6,
            "period": "Q3",
            "value": 98,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 6,
                "code": "ESP",
                "name": "Edukasyon sa Pagpapakatao"
            },
            "roundedValue": 98,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 29,
            "enrollmentId": 1,
            "subjectId": 6,
            "period": "Q4",
            "value": 99,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 6,
                "code": "ESP",
                "name": "Edukasyon sa Pagpapakatao"
            },
            "roundedValue": 99,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 30,
            "enrollmentId": 1,
            "subjectId": 6,
            "period": "FINAL",
            "value": 97,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 6,
                "code": "ESP",
                "name": "Edukasyon sa Pagpapakatao"
            },
            "roundedValue": 97,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": "PASSED",
            "isPassing": true
        },
        {
            "id": 31,
            "enrollmentId": 1,
            "subjectId": 7,
            "period": "Q1",
            "value": 97,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 7,
                "code": "TLE",
                "name": "Technology and Livelihood Education"
            },
            "roundedValue": 97,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 32,
            "enrollmentId": 1,
            "subjectId": 7,
            "period": "Q2",
            "value": 94,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 7,
                "code": "TLE",
                "name": "Technology and Livelihood Education"
            },
            "roundedValue": 94,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 33,
            "enrollmentId": 1,
            "subjectId": 7,
            "period": "Q3",
            "value": 98,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 7,
                "code": "TLE",
                "name": "Technology and Livelihood Education"
            },
            "roundedValue": 98,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 34,
            "enrollmentId": 1,
            "subjectId": 7,
            "period": "Q4",
            "value": 94,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 7,
                "code": "TLE",
                "name": "Technology and Livelihood Education"
            },
            "roundedValue": 94,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 35,
            "enrollmentId": 1,
            "subjectId": 7,
            "period": "FINAL",
            "value": 96,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 7,
                "code": "TLE",
                "name": "Technology and Livelihood Education"
            },
            "roundedValue": 96,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": "PASSED",
            "isPassing": true
        },
        {
            "id": 36,
            "enrollmentId": 1,
            "subjectId": 8,
            "period": "Q1",
            "value": 95,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 8,
                "code": "MAPEH",
                "name": "MAPEH (Music, Arts, PE, Health)"
            },
            "roundedValue": 95,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 37,
            "enrollmentId": 1,
            "subjectId": 8,
            "period": "Q2",
            "value": 95,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 8,
                "code": "MAPEH",
                "name": "MAPEH (Music, Arts, PE, Health)"
            },
            "roundedValue": 95,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 38,
            "enrollmentId": 1,
            "subjectId": 8,
            "period": "Q3",
            "value": 99,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 8,
                "code": "MAPEH",
                "name": "MAPEH (Music, Arts, PE, Health)"
            },
            "roundedValue": 99,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 39,
            "enrollmentId": 1,
            "subjectId": 8,
            "period": "Q4",
            "value": 97,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 8,
                "code": "MAPEH",
                "name": "MAPEH (Music, Arts, PE, Health)"
            },
            "roundedValue": 97,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": null,
            "isPassing": true
        },
        {
            "id": 40,
            "enrollmentId": 1,
            "subjectId": 8,
            "period": "FINAL",
            "value": 97,
            "source": "SYSTEM",
            "createdAt": "2026-02-02T05:03:17.228Z",
            "updatedAt": "2026-02-02T05:03:17.228Z",
            "subject": {
                "id": 8,
                "code": "MAPEH",
                "name": "MAPEH (Music, Arts, PE, Health)"
            },
            "roundedValue": 97,
            "descriptor": {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            "remarks": "PASSED",
            "isPassing": true
        }
    ]
}
```

---

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | number | Grade record ID |
| enrollmentId | number | Associated enrollment ID |
| subjectId | number | Associated subject ID |
| period | string | Grading period (Q1, Q2, Q3, Q4, FINAL) |
| value | number | Raw grade value |
| source | string | Grade source (SYSTEM, IMPORTED) |
| subject | object | Subject details |
| roundedValue | number | Grade rounded to nearest whole number |
| descriptor | object | DepEd grade descriptor |
| remarks | string | PASSED or FAILED (only for FINAL grades) |
| isPassing | boolean | Whether grade meets passing threshold |

---

## Error Responses

### Enrollment Not Found (404)

```json
{
  "success": false,
  "message": "Enrollment not found",
  "code": "ENROLLMENT_NOT_FOUND"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "You do not have permission to access these grades",
  "code": "FORBIDDEN"
}
```

---

## 🔒 Business Rules

- Grades are ordered by subject, then by period
- FINAL grades include remarks (PASSED/FAILED)
- Quarterly grades do not include remarks
- Passing threshold is 75
- Descriptors follow DepEd Order No. 8, s. 2015

---

## 🧠 Notes

- This endpoint returns all periods including FINAL
- Use `roundedValue` for display purposes
- `remarks` is null for quarterly grades
- FINAL grades are auto-computed when all quarters exist
