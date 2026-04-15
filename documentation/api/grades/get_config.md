# Get Grading Configuration API

Fetch grading configuration used by the frontend and grading services.

## Intended Use

- Populate grading period dropdowns
- Render descriptor legends
- Enforce editable periods on the client
- Read quarter weights used for final grade computation

## Endpoint

```text
GET /api/grades/config
```

Alias:

```text
GET /api/grades/allowed-quarters
```

## Authorization

Requires authentication

## Success Response (200)

```json
{
    "success": true,
    "message": "Grading configuration fetched successfully",
    "data": {
        "editable": [
            "Q1",
            "Q2",
            "Q3",
            "Q4"
        ],
        "final": "FINAL",
        "finalEditable": false,
        "passingGrade": 75,
        "weights": {
            "Q1": 0.25,
            "Q2": 0.25,
            "Q3": 0.25,
            "Q4": 0.25
        },
        "descriptors": [
            {
                "min": 90,
                "max": 100,
                "descriptor": "Outstanding",
                "code": "O"
            },
            {
                "min": 85,
                "max": 89,
                "descriptor": "Very Satisfactory",
                "code": "VS"
            },
            {
                "min": 80,
                "max": 84,
                "descriptor": "Satisfactory",
                "code": "S"
            },
            {
                "min": 75,
                "max": 79,
                "descriptor": "Fairly Satisfactory",
                "code": "FS"
            },
            {
                "min": 0,
                "max": 74,
                "descriptor": "Did Not Meet Expectations",
                "code": "DNME"
            }
        ]
    }
}
```

## Notes

- `FINAL` is system-computed and not manually editable
- Quarter weights can be overridden by `SystemSetting`
- This endpoint is the frontend source of truth for grading metadata
