📄 API RESPONSE
Example Request
GET /api/enrollments/:id/subjects

Success (200)
{
  "success": true,
  "message": "Subjects fetched successfully",
  "data": [
    {
      "id": 1,
      "code": "MATH",
      "name": "Mathematics"
    },
    {
      "id": 2,
      "code": "ENG",
      "name": "English"
    }
  ]
}

🔒 Business Rules Enforced

✔ Subjects are curriculum-version aware
✔ Grade level enforced
✔ Adviser ownership respected
✔ Admin oversight allowed
✔ No grade data leaked
✔ UI-friendly ordering