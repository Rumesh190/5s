
# Product Requirements Document (PRD)

**Project:** Manufacturing Quality Management System (MQMS)
**Version:** 1.0
**Status:** Draft
**Last Updated:** August 2026

---

# 1. Purpose

This document defines the functional and business requirements for the Manufacturing Quality Management System (MQMS).

It serves as the primary reference for designers, developers, testers, and stakeholders throughout the project lifecycle.

---

# 2. User Roles

## Quality Engineer

Responsibilities

- Create audits
- Edit assigned audits
- Perform 5 Why analysis
- Add corrective actions
- Upload evidence
- Close assigned audits

---

## Production Supervisor

Responsibilities

- Review audits
- Assign investigators
- Monitor progress
- Approve completed investigations

---

## Plant Manager

Responsibilities

- View all audits
- Monitor KPIs
- Review investigation outcomes
- Access reports

---

## Administrator

Responsibilities

- Manage users
- Configure system settings
- Manage departments
- Manage production lines

---

# 3. Core Modules

The MVP consists of the following modules:

1. Authentication
2. Dashboard
3. Audit Management
4. 5 Why Analysis
5. Corrective Actions
6. Attachments
7. Notifications

---

# 4. Application Navigation

Login

↓

Dashboard

↓

Audits

↓

Create Audit

↓

Audit Details

↓

5 Why Analysis

↓

Corrective Actions

↓

Close Audit

---

# 5. Functional Requirements

## Authentication

Users shall:

- Login using email and password
- Logout securely
- Reset forgotten passwords

---

## Dashboard

The dashboard shall display:

- Open Audits
- In Progress Audits
- Closed Audits
- Overdue Corrective Actions
- Recent Activity
- Quick Actions

---

## Audit List

Users shall be able to:

- Search audits
- Filter audits
- Sort audits
- View audit details
- Create a new audit

---

## Create Audit

Users shall be able to provide:

- Audit Title
- Plant
- Department
- Production Line
- Product Name
- Audit Date
- Description
- Severity
- Evidence
- Assigned Investigator

---

## Audit Details

The system shall display:

- Audit Summary
- Status
- Timeline
- Attachments
- Assigned Users
- Investigation Progress

---

## 5 Why Analysis

Users shall:

- Enter Problem Statement
- Record Why 1
- Record Why 2
- Record Why 3
- Record Why 4
- Record Why 5
- Record Final Root Cause

---

## Corrective Actions

Users shall:

- Add Action
- Assign Owner
- Set Due Date
- Update Status
- Mark Complete

---

# 6. Audit Status

The audit lifecycle is:

Draft

↓

Open

↓

In Progress

↓

Pending Review

↓

Closed

Users may reopen a Closed audit if authorized.

---

# 7. Business Rules

- Every audit must have one creator.
- Every audit must have one status.
- An audit cannot be closed without a completed 5 Why Analysis.
- Every corrective action must have an owner.
- Every corrective action must have a due date.
- Required fields must be completed before submission.
- All updates should be timestamped.

---

# 8. File Attachments

Users may upload:

- Images
- PDF files
- Word documents

Each attachment should be linked to the corresponding audit.

---

# 9. Notifications

Notify users when:

- An audit is assigned
- A corrective action is assigned
- A due date is approaching
- An audit is closed

---

# 10. Non-Functional Requirements

The application should be:

- Fast
- Responsive
- Secure
- Reliable
- Accessible
- Easy to maintain
- Optimized for desktop browsers
- Compatible with iPad browsers

---

# 11. Security Requirements

- Role-based access control
- Secure authentication
- Password encryption
- Session timeout
- Audit logging

---

# 12. Assumptions

- Users have internet access.
- Users have valid system accounts.
- All audit data is stored centrally.
- Attachments are securely stored.

---

# 13. Future Enhancements

Future releases may include:

- AI-assisted recommendations
- CAPA Management
- Inspection Checklists
- ERP Integration
- Analytics Dashboard
- Supplier Quality
- Mobile Applications