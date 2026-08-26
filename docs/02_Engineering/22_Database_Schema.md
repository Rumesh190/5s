
# MQMS Database Schema

Version: 1.0

Status: Approved

Database: PostgreSQL (Supabase)

---

# Purpose

This document defines the logical database design for the Manufacturing Quality Management System (MQMS).

It includes:

- Tables
- Relationships
- Primary Keys
- Foreign Keys
- Enums
- Constraints
- Indexes
- Audit Fields
- Soft Delete Strategy

The schema is designed for scalability, maintainability, and enterprise-grade performance.

---

# Database Standards

Primary Key

UUID

Naming Convention

snake_case

Timestamp Fields

created_at

updated_at

created_by

updated_by

Timezone

UTC

Soft Delete

deleted_at (Nullable)

---

# Entity Relationship Overview

```text
Regions
    │
    └── Plants
            │
            └── Departments
                    │
                    └── Production Lines

Roles
    │
    └── Users

Users
    │
    ├── Audits
    ├── Investigations
    ├── Notifications
    └── Audit History

Audits
    │
    ├── Five Why Investigation
    ├── Attachments
    ├── Audit History
    └── Notifications
```

---

# Master Tables

---

## regions

Purpose

Stores geographical regions.

Columns

| Column | Type | Constraints |
|---------|------|------------|
| id | UUID | PK |
| name | TEXT | Unique |
| code | TEXT | Unique |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

Relationship

One Region → Many Plants

---

## plants

Purpose

Manufacturing plants.

Columns

| Column | Type |
|---------|------|
| id | UUID |
| region_id | UUID FK → regions |
| name | TEXT |
| code | TEXT |
| city | TEXT |
| state | TEXT |
| country | TEXT |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

Relationship

One Plant → Many Departments

---

## departments

Columns

| Column | Type |
|---------|------|
| id | UUID |
| plant_id | UUID FK |
| name | TEXT |
| code | TEXT |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

Relationship

One Department → Many Production Lines

---

## production_lines

Columns

| Column | Type |
|---------|------|
| id | UUID |
| department_id | UUID FK |
| name | TEXT |
| code | TEXT |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

# User Management

---

## roles

Columns

| Column | Type |
|---------|------|
| id | UUID |
| name | TEXT |
| description | TEXT |
| created_at | TIMESTAMP |

---

## permissions

Columns

| Column | Type |
|---------|------|
| id | UUID |
| module | TEXT |
| action | TEXT |

Examples

Audit.Create

Audit.Edit

Audit.Delete

Report.View

User.Edit

---

## role_permissions

Columns

| Column | Type |
|---------|------|
| role_id | UUID FK |
| permission_id | UUID FK |

Composite Key

role_id + permission_id

---

## users

Columns

| Column | Type |
|---------|------|
| id | UUID |
| employee_id | TEXT |
| full_name | TEXT |
| email | TEXT |
| phone | TEXT |
| role_id | UUID FK |
| region_id | UUID FK |
| plant_id | UUID FK |
| department_id | UUID FK |
| status | user_status |
| last_login | TIMESTAMP |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

Relationship

One Role → Many Users

---

# Audit Module

---

## audits

Columns

| Column | Type |
|---------|------|
| id | UUID |
| audit_number | TEXT |
| title | TEXT |
| region_id | UUID |
| plant_id | UUID |
| department_id | UUID |
| production_line_id | UUID |
| category | TEXT |
| priority | priority |
| status | audit_status |
| description | TEXT |
| created_by | UUID FK |
| assigned_to | UUID FK |
| due_date | DATE |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

Indexes

audit_number

status

plant_id

assigned_to

---

## investigations

Purpose

Each audit has one investigation.

Columns

| Column | Type |
|---------|------|
| id | UUID |
| audit_id | UUID FK |
| investigator_id | UUID FK |
| root_cause | TEXT |
| status | investigation_status |
| started_at | TIMESTAMP |
| completed_at | TIMESTAMP |

Relationship

One Audit → One Investigation

---

## five_whys

Purpose

Stores answers for Five Why Analysis.

Columns

| Column | Type |
|---------|------|
| id | UUID |
| investigation_id | UUID FK |
| why_1 | TEXT |
| why_2 | TEXT |
| why_3 | TEXT |
| why_4 | TEXT |
| why_5 | TEXT |
| root_cause | TEXT |
| created_at | TIMESTAMP |

Relationship

One Investigation → One Five Why Record

---

## audit_attachments

Columns

| Column | Type |
|---------|------|
| id | UUID |
| audit_id | UUID FK |
| file_name | TEXT |
| file_url | TEXT |
| file_type | TEXT |
| uploaded_by | UUID FK |
| uploaded_at | TIMESTAMP |

Storage

Supabase Storage Bucket

---

## audit_history

Purpose

Tracks every action performed on an audit.

Columns

| Column | Type |
|---------|------|
| id | UUID |
| audit_id | UUID FK |
| action | TEXT |
| description | TEXT |
| user_id | UUID FK |
| created_at | TIMESTAMP |

Examples

Audit Created

Audit Assigned

Investigation Started

Root Cause Updated

Audit Closed

---

# Notification Module

---

## notifications

Columns

| Column | Type |
|---------|------|
| id | UUID |
| user_id | UUID FK |
| title | TEXT |
| message | TEXT |
| type | notification_type |
| is_read | BOOLEAN |
| created_at | TIMESTAMP |

---

## notification_rules

Columns

| Column | Type |
|---------|------|
| id | UUID |
| event_name | TEXT |
| email_enabled | BOOLEAN |
| in_app_enabled | BOOLEAN |
| created_at | TIMESTAMP |

---

# Enums

---

## audit_status

- Draft
- Open
- In Progress
- Under Review
- Closed

---

## priority

- Low
- Medium
- High
- Critical

---

## investigation_status

- Pending
- In Progress
- Completed

---

## user_status

- Active
- Inactive
- Suspended

---

## notification_type

- Success
- Warning
- Error
- Information

---

# Foreign Key Relationships

Regions → Plants

Plants → Departments

Departments → Production Lines

Roles → Users

Users → Audits

Users → Investigations

Audits → Investigations

Investigations → Five Whys

Audits → Attachments

Audits → History

Users → Notifications

Roles → Role Permissions

Permissions → Role Permissions

---

# Index Strategy

Indexes should be created for:

- audit_number
- employee_id
- email
- plant_id
- department_id
- assigned_to
- status
- due_date
- investigation_id
- created_at

---

# Audit Fields

Every transactional table should include:

- created_at
- updated_at
- created_by
- updated_by

Optional

- deleted_at

---

# Row Level Security (RLS)

Enable RLS for all transactional tables.

Suggested rules:

- Users can only access records they are authorized to view.
- Managers can view audits within their assigned plants.
- Administrators have full access.
- Super Admin bypasses all restrictions.

---

# Storage Buckets

Create the following Supabase Storage buckets:

audit-attachments

profile-images

report-exports

Future

training-documents

---

# Seed Data

Initial seed records should include:

Regions

- North
- South
- East
- West

Sample Plants

- Chennai Plant
- Bengaluru Plant
- Hyderabad Plant
- Coimbatore Plant

Roles

- Super Admin
- Admin
- Quality Manager
- Quality Engineer
- Plant Manager
- Auditor

Default Notification Rules

Default Permissions

---

# Future Database Enhancements

- Corrective Actions
- Preventive Actions (CAPA)
- AI Root Cause Suggestions
- AI Recommendations
- OCR Document Processing
- Equipment Master
- Supplier Audits
- Customer Complaints
- Multi-Tenant Support
- Audit Templates
- Workflow Engine

---

# Database Design Principles

- UUID primary keys
- Foreign key constraints
- Normalize master data
- Avoid duplicate information
- Soft delete where appropriate
- Index frequently queried columns
- Enforce referential integrity
- Secure data using RLS
- Design for scalability