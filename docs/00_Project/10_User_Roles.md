---
title: User Roles & Permissions
module: Security & Access Control
version: 1.0
status: Draft
owner: Product Team
---

# User Roles & Permissions

## Purpose

This document defines the user roles and access permissions within the Manufacturing Quality Management System (MQMS).

It acts as the single source of truth for authorization across the application.

These permissions guide:

- UI visibility
- Navigation
- API authorization
- Business logic
- Future role-based access control (RBAC)

---

# User Roles

The MVP supports four roles.

| Role | Description |
|------|-------------|
| Quality Engineer | Creates audits and performs investigations |
| Production Supervisor | Reviews investigations and closes audits |
| Plant Manager | Monitors audit progress and reports |
| Administrator | Full system access |

---

# Role Responsibilities

## Quality Engineer

Primary Responsibilities

- Report manufacturing issues
- Create new audits
- Conduct investigations
- Complete Five Why analysis
- Upload supporting evidence
- Define corrective actions

---

## Production Supervisor

Primary Responsibilities

- Review investigations
- Validate root causes
- Monitor corrective actions
- Close completed audits

---

## Plant Manager

Primary Responsibilities

- Monitor quality performance
- Review audit history
- Track investigation progress
- View reports and dashboards

---

## Administrator

Primary Responsibilities

- Manage the application
- Configure users
- Maintain system settings
- Access all modules

---

# Module Permissions

| Module | Quality Engineer | Production Supervisor | Plant Manager | Administrator |
|---------|------------------|-----------------------|---------------|---------------|
| Login | ✅ | ✅ | ✅ | ✅ |
| Dashboard | View | View | View | View |
| Audit List | View | View | View | View |
| Create Audit | Create | Create | No | Create |
| Audit Details | View/Edit Assigned | View/Edit | View Only | Full Access |
| Investigation | Create/Edit Assigned | Review/Edit | View Only | Full Access |
| Attachments | Upload/View | Upload/View | View | Full Access |
| Activity Log | View | View | View | View |
| Settings | Edit Own | Edit Own | Edit Own | Edit Own |

---

# Audit Permissions

## Quality Engineer

Can:

- Create Audit
- View Own Audits
- Edit Assigned Audits
- Perform Investigation
- Save Investigation Draft
- Upload Attachments

Cannot:

- Delete Audit
- Close Audit
- Manage Users

---

## Production Supervisor

Can:

- View All Audits
- Edit Investigations
- Update Corrective Actions
- Close Audit

Cannot:

- Delete Audit
- Manage Users

---

## Plant Manager

Can:

- View All Audits
- View Investigation
- View Attachments
- Monitor Status

Cannot:

- Edit Investigation
- Create Audit
- Close Audit
- Delete Audit

---

## Administrator

Can:

- Create Audit
- Edit Audit
- Delete Audit
- Close Audit
- Manage Users
- View All Data
- Configure System

---

# Investigation Permissions

| Action | Engineer | Supervisor | Manager | Admin |
|--------|----------|------------|----------|--------|
| Start Investigation | ✅ | ✅ | ❌ | ✅ |
| Edit Investigation | Assigned Only | ✅ | ❌ | ✅ |
| Complete Investigation | Assigned Only | ✅ | ❌ | ✅ |
| View Investigation | ✅ | ✅ | ✅ | ✅ |

---

# Attachment Permissions

| Action | Engineer | Supervisor | Manager | Admin |
|--------|----------|------------|----------|--------|
| Upload | ✅ | ✅ | ❌ | ✅ |
| Download | ✅ | ✅ | ✅ | ✅ |
| Delete | Own Uploads | ✅ | ❌ | ✅ |

---

# Dashboard Permissions

All users can access the dashboard.

Displayed information may vary depending on the user's role.

Example

Quality Engineer

- Assigned Audits
- Recent Activity
- Investigation Progress

Production Supervisor

- Team Audits
- Pending Reviews
- Overdue Investigations

Plant Manager

- Overall Audit Status
- Plant Performance
- Department Summary

Administrator

- System Overview
- User Statistics
- Application Health

---

# Settings Permissions

All users can:

- View Profile
- Update Profile
- Change Password

Users cannot:

- Change their role
- Change their department
- Change their plant

These fields are managed by the Administrator.

---

# Permission Rules

## PR-001

Users must be authenticated before accessing the application.

---

## PR-002

Every authenticated user must have exactly one assigned role.

---

## PR-003

Permissions are determined by the assigned role.

---

## PR-004

Users may only edit records they are authorized to manage.

---

## PR-005

Closed audits are read-only for all roles except Administrator.

---

## PR-006

Unauthorized actions must return an Access Denied message.

---

## PR-007

The UI should hide actions the user is not permitted to perform.

Example

If a user cannot close an audit, the "Close Audit" button should not be displayed.

---

# Future Roles

The following roles may be introduced in future releases.

- Quality Manager
- Safety Officer
- Maintenance Engineer
- Production Operator
- External Auditor
- Corporate Administrator

---

# Future Permission Enhancements

The application may support:

- Custom Roles
- Permission Groups
- Department-level Permissions
- Plant-level Permissions
- Approval Hierarchies
- Temporary Access
- Role Delegation
- Audit Assignment Rules

---

# Access Control Principles

The application follows the principle of **Least Privilege**.

Users should receive only the permissions necessary to perform their responsibilities.

Sensitive actions such as deleting records or managing users should be restricted to Administrators.

---

# Version History

| Version | Date | Description |
|----------|------|-------------|
| 1.0 | 2026-08-03 | Initial user roles and permissions for MVP |