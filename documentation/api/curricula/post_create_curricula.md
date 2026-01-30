📘 Curriculum API Endpoints

This document describes all Curriculum and Curriculum Version endpoints, including authorization, request structure, responses, and security notes.

Create Curriculum Endpoint

POST /api/curricula

Creates a new curriculum (program name only).

Authorization

Requires authentication

Requires permission: curriculum.create

Request Body
{
  "name": "K–12 Basic Education"
}

Request Body Fields

name (string, required) – Curriculum name

Success Response (201)
{
  "success": true,
  "data": {
    "id": 1,
    "name": "K–12 Basic Education"
  }
}

🔒 Security Notes

Curriculum names must be unique by convention

Curriculum does not contain academic rules

Curriculum is immutable after creation