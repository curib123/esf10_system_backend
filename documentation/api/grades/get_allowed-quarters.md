# 📘 Get Allowed Grading Periods API

Fetch the list of grading periods allowed by the system.

This endpoint is primarily used to populate **grading dropdowns** in the frontend and to enforce **business rules** around which grading periods are editable.

---

## 🎯 Intended Use

- Grading form dropdowns (Q1–Q4)
- Prevent manual editing of FINAL grades
- Single source of truth for grading periods
- Future-proof support for grading locks or semester-based grading

---

## Endpoint

GET /api/grades/periods


---

## Authorization

- Requires authentication
- Requires permission: `grades.view`

---

## What This Endpoint Does

- Returns all **editable grading periods**
- Explicitly identifies the **FINAL** grading period
- Indicates whether FINAL grades are editable
- Centralizes grading period rules in the backend

---

## Success Response (200)

```json
{
  "success": true,
  "message": "Allowed grading periods fetched successfully",
  "data": {
    "editable": ["Q1", "Q2", "Q3", "Q4"],
    "final": "FINAL",
    "finalEditable": false
  }
}
Response Fields
Field	Type	Description
editable	string[]	List of grading periods that can be manually encoded
final	string	The final grading period identifier
finalEditable	boolean	Indicates if FINAL grades can be edited manually
🔒 Business Rules
Only periods listed in editable may be encoded manually

FINAL grades are system-computed

FINAL grades cannot be edited manually

Backend enforces all grading period validation

🧠 Notes
Frontend must not hardcode grading periods

Use this endpoint to dynamically build dropdowns

FINAL grading is typically calculated from Q1–Q4

This endpoint ensures consistency across all grading screens