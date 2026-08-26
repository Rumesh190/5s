---
title: Data Model
module: Core Application
version: 1.0
status: Draft
owner: Product Team
---

# Data Model

## Purpose

This document defines the core business entities, their attributes, and relationships within the Manufacturing Quality Management System (MQMS).

The Data Model serves as the foundation for:

- Database Design
- Backend API Development
- Frontend Data Structures
- Business Logic
- Reporting
- Future Integrations

This document is independent of any database technology.

---

# Entity Relationship Overview

```
User
 │
 │ Creates
 ▼
Audit
 │
 │ Has One
 ▼
Investigation
 │
 ├──────────────┐
 │              │
 │ Has Many     │ Has Many
 ▼              ▼
Attachment   Activity Log
```

---

# Entity: User

## Description

Represents a person who can access the system.

---

### Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | Yes | Unique user identifier |
| employeeId | String | Yes | Employee number |
| fullName | String | Yes | User full name |
| email | String | Yes | Login email |
| password | String | Yes | Encrypted password |
| role | Enum | Yes | User role |
| department | String | Yes | Department name |
| plant | String | Yes | Manufacturing plant |
| isActive | Boolean | Yes | Active user status |
| createdAt | DateTime | Yes | Created timestamp |
| updatedAt | DateTime | Yes | Last updated timestamp |

---

# Entity: Audit

## Description

Represents a manufacturing quality issue reported by a user.

---

### Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | Yes | Unique audit identifier |
| auditNumber | String | Yes | Human-readable audit number |
| title | String | Yes | Audit title |
| problemStatement | Text | Yes | Reported issue |
| plant | String | Yes | Manufacturing plant |
| department | String | Yes | Department |
| productionLine | String | Yes | Production line |
| productName | String | No | Product or part |
| severity | Enum | Yes | Severity level |
| status | Enum | Yes | Audit status |
| reportedBy | UUID | Yes | User who created the audit |
| assignedTo | UUID | No | Assigned investigator |
| auditDate | Date | Yes | Date of occurrence |
| createdAt | DateTime | Yes | Created timestamp |
| updatedAt | DateTime | Yes | Last updated timestamp |

---

# Entity: Investigation

## Description

Represents the root cause investigation associated with an audit.

Each audit has exactly one investigation.

---

### Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | Yes | Investigation identifier |
| auditId | UUID | Yes | Related audit |
| why1 | Text | Yes | First Why answer |
| why2 | Text | Yes | Second Why answer |
| why3 | Text | Yes | Third Why answer |
| why4 | Text | Yes | Fourth Why answer |
| why5 | Text | Yes | Fifth Why answer |
| rootCause | Text | Yes | Final root cause |
| rootCauseCategory | String | No | Classification |
| correctiveAction | Text | Yes | Corrective action |
| actionOwner | UUID | Yes | Responsible user |
| targetCompletionDate | Date | Yes | Expected completion |
| investigationSummary | Text | No | Summary notes |
| completedAt | DateTime | No | Completion timestamp |
| createdAt | DateTime | Yes | Created timestamp |
| updatedAt | DateTime | Yes | Updated timestamp |

---

# Entity: Attachment

## Description

Stores supporting files related to an audit.

---

### Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | Yes | Attachment ID |
| auditId | UUID | Yes | Related audit |
| fileName | String | Yes | Original filename |
| fileType | String | Yes | MIME type |
| fileSize | Number | Yes | Size in bytes |
| uploadedBy | UUID | Yes | User ID |
| uploadedAt | DateTime | Yes | Upload timestamp |

---

# Entity: Activity Log

## Description

Maintains a history of important events performed within an audit.

This entity supports traceability and auditing.

---

### Fields

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | Yes | Activity identifier |
| auditId | UUID | Yes | Related audit |
| action | String | Yes | Action performed |
| description | Text | Yes | Event description |
| performedBy | UUID | Yes | User who performed action |
| createdAt | DateTime | Yes | Event timestamp |

---

# Enumerations

## Audit Status

- Draft
- Open
- Investigation In Progress
- Investigation Completed
- Closed

---

## Severity

- Low
- Medium
- High
- Critical

---

## User Roles

- Quality Engineer
- Production Supervisor
- Plant Manager
- Administrator

---

# Entity Relationships

## User → Audit

Relationship

One User

↓

Many Audits

A user may create multiple audits.

Each audit has one reporter.

---

## Audit → Investigation

Relationship

One Audit

↓

One Investigation

Every audit has exactly one investigation.

Every investigation belongs to exactly one audit.

---

## Audit → Attachment

Relationship

One Audit

↓

Many Attachments

Attachments are optional.

---

## Audit → Activity Log

Relationship

One Audit

↓

Many Activity Logs

Every significant action should generate an activity record.

---

# Business Constraints

## Audit

- Audit Number must be unique.
- Problem Statement is mandatory.
- Audit Status cannot skip lifecycle stages.
- Closed audits are read-only.

---

## Investigation

- One investigation per audit.
- Five Why answers are mandatory.
- Root Cause is mandatory.
- Corrective Action is mandatory.
- Investigation cannot be completed until all required fields are populated.

---

## Attachments

- Multiple attachments allowed.
- Supported formats are configurable.
- Files remain associated with the audit permanently.

---

# Future Entities (Not Included in MVP)

The following entities are planned for future releases:

- Department
- Plant
- Production Line
- Audit Category
- Notification
- Comment
- Approval
- Report
- User Session
- Audit Template
- Investigation Template

---

# Data Ownership

| Entity | Owner |
|---------|-------|
| User | System |
| Audit | Quality Engineer |
| Investigation | Assigned Investigator |
| Attachment | Audit Team |
| Activity Log | System |

---

# Data Retention

- Audit records are retained indefinitely.
- Activity Logs cannot be deleted.
- Attachments remain linked to audits.
- Closed audits remain available for reporting.

---

# Version History

| Version | Date | Description |
|----------|------|-------------|
| 1.0 | 2026-08-03 | Initial data model for MVP |