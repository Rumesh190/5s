---
title: Business Rules
module: Core Application
version: 1.0
status: Draft
owner: Product Team
---

# Business Rules

## Purpose

This document defines the business rules governing the Manufacturing Quality Management System (MQMS).

These rules ensure consistent system behavior across the application and act as the primary reference for Product, Design, Development, and Quality Assurance teams.

Business rules describe **how the application should behave**, independent of the user interface or implementation technology.

---

# Audit Lifecycle

Every audit progresses through a predefined lifecycle.

```
Draft

↓

Open

↓

Investigation In Progress

↓

Investigation Completed

↓

Closed
```

Once an audit reaches the **Closed** state, it becomes read-only.

---

# Audit Rules

## BR-001

Every audit must have a unique Audit ID.

---

## BR-002

Every audit must have exactly one reporter.

---

## BR-003

Every audit belongs to one plant.

---

## BR-004

Every audit belongs to one department.

---

## BR-005

Every audit must have one severity level.

---

## BR-006

Every audit must contain one problem statement.

---

## BR-007

Every audit can have only one active investigation.

---

## BR-008

Every audit records the creation date and creator.

---

## BR-009

Audit creation automatically changes the status to **Open**.

---

## BR-010

Audit information cannot be deleted after creation.

Future versions may support archival.

---

# Investigation Rules

## BR-011

An investigation can begin only after an audit has been created.

---

## BR-012

The investigation follows the Five Why methodology.

---

## BR-013

The Five Why questions must be completed sequentially.

Users cannot skip Why steps.

---

## BR-014

Each Why requires an answer before the next Why becomes available.

---

## BR-015

Every investigation must identify one root cause.

---

## BR-016

Root Cause is mandatory before completing the investigation.

---

## BR-017

Every investigation must include at least one corrective action.

---

## BR-018

An investigation can be saved as a draft at any point.

---

## BR-019

An investigation may be edited until the audit is closed.

---

## BR-020

Completed investigations become read-only after audit closure.

---

# Corrective Action Rules

## BR-021

Every investigation must define at least one corrective action.

---

## BR-022

Every corrective action must include:

- Description
- Owner
- Target Completion Date

---

## BR-023

Corrective actions must be assigned to a valid system user.

---

## BR-024

Corrective actions cannot exist without an investigation.

---

## BR-025

Corrective actions remain editable until the audit is closed.

---

# Attachment Rules

## BR-026

Attachments are optional.

---

## BR-027

Multiple attachments may be uploaded.

---

## BR-028

Supported file types are configured by the system administrator.

Initial supported types:

- JPG
- PNG
- PDF
- DOCX

---

## BR-029

Every uploaded attachment records:

- Uploaded By
- Upload Date
- File Name

---

## BR-030

Attachments remain associated with the audit permanently.

---

# User Rules

## BR-031

Only authenticated users may access the application.

---

## BR-032

Every user belongs to one role.

Examples:

- Quality Engineer
- Production Supervisor
- Plant Manager
- Administrator

---

## BR-033

Every user belongs to one plant.

---

## BR-034

Users can edit only information they are authorized to manage.

---

## BR-035

Administrators have unrestricted system access.

---

# Permission Rules

## Quality Engineer

May:

- Create Audit
- Edit Assigned Investigation
- Upload Attachments
- Complete Five Why Analysis

Cannot:

- Delete Audits
- Manage Users

---

## Production Supervisor

May:

- Review Investigations
- Edit Investigations
- Close Audits

---

## Plant Manager

May:

- View All Audits
- Monitor Investigation Progress

Cannot:

- Modify Investigations

---

## Administrator

Has unrestricted access to all application features.

---

# Status Transition Rules

The application enforces the following transitions.

```
Draft

↓

Open

↓

Investigation In Progress

↓

Investigation Completed

↓

Closed
```

Reverse transitions are not permitted.

Example

Closed

↓

Open

❌ Not Allowed

---

# Audit Completion Rules

An audit cannot be closed unless:

- Problem Statement exists
- Five Why completed
- Root Cause documented
- Corrective Action completed
- Mandatory fields completed

---

# Validation Rules

Mandatory fields must be completed before saving.

Validation occurs:

- During data entry
- Before submission
- Before investigation completion
- Before audit closure

Validation messages should clearly explain the issue.

---

# Search Rules

Users can search audits by:

- Audit ID
- Title
- Department

Future

- Product
- Root Cause
- Assigned User

---

# Data Integrity Rules

The system must preserve investigation history.

Every audit records:

- Created By
- Created Date
- Last Modified By
- Last Modified Date

System-generated values cannot be edited manually.

---

# Security Rules

Only authenticated users may access application data.

Passwords must comply with organizational password policies.

User sessions expire after a configurable period of inactivity.

Future versions may support:

- Multi-Factor Authentication (MFA)
- Single Sign-On (SSO)

---

# Audit Trail Rules

The system records important events including:

- Audit Created
- Investigation Started
- Investigation Updated
- Root Cause Recorded
- Corrective Action Updated
- Attachment Uploaded
- Audit Closed

Audit history cannot be modified by users.

---

# Notifications (Future)

The application may notify users when:

- Audit assigned
- Investigation overdue
- Corrective action overdue
- Audit completed
- Attachment uploaded

Notification channels:

- In-App
- Email

---

# Assumptions

- One audit represents one manufacturing issue.
- One audit contains one investigation.
- Every investigation follows the Five Why methodology.
- Every investigation results in one or more corrective actions.
- Internet connectivity is available during normal operation.
- Desktop is the primary platform.
- iPad browser is the secondary platform.

---

# Out of Scope (MVP)

The following features are excluded from Version 1.

- Multi-language support
- Offline mode
- AI-generated investigations
- Approval workflow
- Digital signatures
- ERP integration
- QR code scanning
- Barcode scanning
- Report builder
- Analytics dashboard
- User management
- Role management
- Plant administration
- Department administration
- Audit templates
- Investigation templates
- Bulk audit operations

---

# Business Rule Version History

| Version | Date | Description |
|----------|------|-------------|
| 1.0 | 2026-08-03 | Initial business rules for MVP |