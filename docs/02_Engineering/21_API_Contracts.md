
# MQMS API Contracts

Version: 1.0

Status: Approved

---

# Purpose

This document defines the API contracts for the Manufacturing Quality Management System (MQMS).

The objective is to standardize communication between the frontend and backend.

Each contract defines:

- Business Operation
- HTTP Method
- Route
- Authentication
- Request
- Response
- Validation
- Error Responses
- Database Tables

---

# API Standards

Base URL

/api/v1

Authentication

Supabase JWT

Content Type

application/json

Response Format

JSON

Date Format

ISO 8601

Example

2026-08-04T10:45:30Z

---

# Standard Response Format

Success

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

---

# Authentication APIs

## Login

POST

/api/v1/auth/login

### Request

```json
{
  "email": "user@example.com",
  "password": "********"
}
```

### Response

```json
{
  "success": true,
  "token": "jwt_token",
  "user": {}
}
```

Validation

- Email required
- Password required

Tables

- auth.users

---

## Logout

POST

/api/v1/auth/logout

Authentication

Required

Response

```json
{
  "success": true
}
```

---

# Dashboard APIs

## Get Dashboard

GET

/api/v1/dashboard

Authentication

Required

Response

```json
{
  "kpis": {},
  "charts": {},
  "recentAudits": []
}
```

Tables

- audits
- investigations

---

# Audit APIs

## Get Audit List

GET

/api/v1/audits

Query Parameters

- page
- limit
- search
- plant
- department
- status

Response

```json
{
  "items": [],
  "total": 120,
  "page": 1
}
```

---

## Create Audit

POST

/api/v1/audits

Request

```json
{
  "title": "",
  "region": "",
  "plant": "",
  "department": "",
  "line": "",
  "category": "",
  "description": "",
  "priority": ""
}
```

Validation

- Required fields
- Valid plant
- Valid department

Tables

- audits

---

## Get Audit Details

GET

/api/v1/audits/{id}

Response

```json
{
  "audit": {},
  "attachments": [],
  "timeline": []
}
```

---

## Update Audit

PATCH

/api/v1/audits/{id}

Authentication

Required

---

## Delete Audit

DELETE

/api/v1/audits/{id}

Authorization

Super Admin

---

# Five Why APIs

## Start Investigation

POST

/api/v1/investigations

Request

```json
{
  "auditId": "",
  "owner": ""
}
```

Tables

- investigations

---

## Save Five Why

POST

/api/v1/investigations/{id}/five-whys

Request

```json
{
  "why1": "",
  "why2": "",
  "why3": "",
  "why4": "",
  "why5": "",
  "rootCause": ""
}
```

Validation

- Audit must exist
- Five Why required

Tables

- investigations

---

## Get Investigation

GET

/api/v1/investigations/{id}

---

# Report APIs

## Dashboard Reports

GET

/api/v1/reports/dashboard

---

## Export Report

POST

/api/v1/reports/export

Request

```json
{
  "type": "pdf",
  "filters": {}
}
```

---

# User APIs

## Get Users

GET

/api/v1/users

Supports

- Search
- Filter
- Pagination

---

## Create User

POST

/api/v1/users

Request

```json
{
  "name": "",
  "email": "",
  "employeeId": "",
  "roleId": "",
  "plantId": "",
  "departmentId": ""
}
```

Validation

- Email unique
- Employee ID unique

Tables

- users

---

## Update User

PATCH

/api/v1/users/{id}

---

## Disable User

PATCH

/api/v1/users/{id}/disable

---

# Role APIs

## Get Roles

GET

/api/v1/roles

---

## Create Role

POST

/api/v1/roles

---

## Update Role Permissions

PATCH

/api/v1/roles/{id}/permissions

Request

```json
{
  "permissions": []
}
```

---

# Notification APIs

## Get Notification Rules

GET

/api/v1/notifications

---

## Update Notification Rules

PATCH

/api/v1/notifications/{id}

---

## Send Test Notification

POST

/api/v1/notifications/test

---

# Profile APIs

## Get Profile

GET

/api/v1/profile

---

## Update Profile

PATCH

/api/v1/profile

---

## Change Password

POST

/api/v1/profile/change-password

---

# Upload APIs

## Upload Attachment

POST

/api/v1/uploads

Supports

- Images
- PDF
- Documents

Storage

Supabase Storage

---

# Lookup APIs

## Regions

GET

/api/v1/master/regions

---

## Plants

GET

/api/v1/master/plants

Query

regionId

---

## Departments

GET

/api/v1/master/departments

Query

plantId

---

## Production Lines

GET

/api/v1/master/production-lines

Query

departmentId

---

# Common Error Codes

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

422

Validation Error

500

Internal Server Error

---

# Authorization Matrix

| Module | View | Create | Edit | Delete |
|---------|------|--------|------|--------|
| Dashboard | All Users | — | — | — |
| Audits | Authorized Users | Quality Team | Owner | Admin |
| Five Why | Assigned Users | Assigned Users | Assigned Users | Admin |
| Reports | Managers | — | — | — |
| Users | Admin | Admin | Admin | Super Admin |
| Roles | Admin | Admin | Admin | Super Admin |

---

# API Design Principles

- RESTful naming conventions
- Versioned endpoints
- JWT authentication
- Standard response structure
- Input validation with Zod
- Consistent error responses
- Pagination for collections
- Filtering and sorting support
- Audit logging for critical operations
- Role-based authorization

---

# Future APIs

- AI Root Cause Suggestions
- AI Audit Summary
- Real-time Notifications
- WebSocket Events
- QR Code Scanner
- OCR Document Upload
- Mobile APIs
- Public Vendor APIs