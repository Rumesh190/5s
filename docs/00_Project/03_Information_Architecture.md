

# Information Architecture (IA)

**Project:** Manufacturing Quality Management System (MQMS)  
**Version:** 1.0  
**Status:** Draft

---

# Purpose

This document defines the application's navigation structure, page hierarchy, and relationships between modules.

The goal is to create a navigation system that is simple, scalable, and familiar to manufacturing users.

---

# Navigation Strategy

The application uses a persistent left sidebar for primary navigation and a top header for contextual actions.

## Sidebar Navigation

```
Dashboard

Audits

Settings
```

> **MVP Note:** Reports and Administration are intentionally excluded from the first release.

---

# Top Header

The header remains consistent across all pages.

Components:

- Page Title
- Breadcrumb (where applicable)
- Search (future enhancement)
- Notifications
- User Profile Menu

---

# Page Hierarchy

```
Login

↓

Dashboard

↓

Audits
    │
    ├── Audit List
    │
    ├── Create Audit
    │
    └── Audit Details
            │
            ├── Overview
            ├── 5 Why Analysis
            ├── Corrective Actions
            ├── Attachments
            └── Activity Log

↓

Settings
```

---

# Module Details

## Login

Purpose

Authenticate users before granting access.

Navigation

Redirect to Dashboard after successful login.

---

## Dashboard

Purpose

Provide a summary of ongoing audit activity.

Contains

- KPI Cards
- Recent Audits
- My Assigned Audits
- Quick Actions
- Recent Activity

Primary Actions

- Create Audit
- View Audit List

---

## Audit List

Purpose

Central workspace for managing all audits.

Contains

- Search
- Filters
- Audit Table
- Status Indicators
- Pagination

Primary Actions

- Open Audit
- Create Audit

---

## Create Audit

Purpose

Capture a new quality investigation.

Suggested Layout

Step 1 — Basic Information

↓

Step 2 — Issue Details

↓

Step 3 — Attachments

↓

Create Audit

---

## Audit Details

Acts as the workspace for a single investigation.

Navigation Tabs

Overview

5 Why Analysis

Corrective Actions

Attachments

Activity Log

---

### Overview

Displays

- Audit Summary
- Status
- Assigned Users
- Key Dates
- Investigation Progress

---

### 5 Why Analysis

Displays

- Problem Statement
- Why 1
- Why 2
- Why 3
- Why 4
- Why 5
- Root Cause

---

### Corrective Actions

Displays

- Action List
- Owner
- Due Date
- Status

---

### Attachments

Displays

- Images
- PDFs
- Documents

---

### Activity Log

Displays

A chronological history of:

- Audit creation
- Status changes
- Assignments
- Comments
- Attachments
- Audit closure

---

## Settings

For MVP

- User Profile
- Change Password

Future

- User Management
- Roles
- Departments
- Production Lines
- Plants

---

# Navigation Rules

Users should never lose context while navigating.

Every page should provide:

- Clear page title
- Breadcrumb when applicable
- Visible current location
- Easy navigation back to the Audit List

---

# Design Guidelines

The application should emphasize:

- Simple navigation
- Minimal menu depth
- Clear hierarchy
- Consistent layouts
- Reusable page patterns

Navigation should remain stable as future modules are added.

---

# Future Expansion

The IA is designed to support future modules without restructuring the application.

Potential future additions:

Dashboard

Audits

CAPA

NCR

Inspections

Reports

Administration

Settings