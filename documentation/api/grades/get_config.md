# 📘 Get Grading Configuration API

Fetch the grading system configuration including allowed periods, weights, and DepEd descriptors.

This endpoint provides a **single source of truth** for all grading-related configurations used across the frontend.

---

## 🎯 Intended Use

- Populate grading period dropdowns (Q1–Q4)
- Display DepEd grade descriptors in report cards
- Enforce business rules for editable periods
- Retrieve quarter weight configurations
- Build dynamic grading forms

---

## Endpoint

```
GET /api/grades/config
```

**Alias:** `GET /api/grades/allowed-quarters`

---

## Authorization

- Requires authentication

---

## Success Response (200)

```json
{
  "success": true,
  "message": "Grading configuration fetched successfully",
  "data": {
    "editable": ["Q1", "Q2", "Q3", "Q4"],
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
      { "min": 90, "max": 100, "descriptor": "Outstanding", "code": "O" },
      { "min": 85, "max": 89, "descriptor": "Very Satisfactory", "code": "VS" },
      { "min": 80, "max": 84, "descriptor": "Satisfactory", "code": "S" },
      { "min": 75, "max": 79, "descriptor": "Fairly Satisfactory", "code": "FS" },
      { "min": 0, "max": 74, "descriptor": "Did Not Meet Expectations", "code": "DNME" }
    ]
  }
}
```

---

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| editable | string[] | Grading periods that can be manually encoded |
| final | string | The final grading period identifier |
| finalEditable | boolean | Whether FINAL grades can be edited manually |
| passingGrade | number | Minimum passing grade (DepEd standard: 75) |
| weights | object | Quarter weight distribution for final grade computation |
| descriptors | array | DepEd grade descriptors with ranges and codes |

---

## Descriptor Fields

| Field | Type | Description |
|-------|------|-------------|
| min | number | Minimum grade for this descriptor |
| max | number | Maximum grade for this descriptor |
| descriptor | string | Full descriptor text |
| code | string | Short code (O, VS, S, FS, DNME) |

---

## DepEd Grade Scale Reference

Based on **DepEd Order No. 8, s. 2015**:

| Grade Range | Descriptor | Code |
|-------------|------------|------|
| 90 - 100 | Outstanding | O |
| 85 - 89 | Very Satisfactory | VS |
| 80 - 84 | Satisfactory | S |
| 75 - 79 | Fairly Satisfactory | FS |
| 0 - 74 | Did Not Meet Expectations | DNME |

---

## 🔒 Business Rules

- Only periods listed in `editable` may be encoded manually
- FINAL grades are system-computed and cannot be edited
- Passing grade threshold is **75**
- Quarter weights can be configured via SystemSetting table
- Default weights are equal (25% each quarter)

---

## 🧠 Notes

- Frontend must not hardcode grading periods or descriptors
- Use this endpoint to dynamically build all grading UI components
- Weights can be customized per school requirements
- Descriptors follow official DepEd standards
