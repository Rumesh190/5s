
# Administration

---

# Screen Overview

The Administration module is the central configuration hub of the Manufacturing Quality Management System (MQMS).

It allows System Administrators and Super Administrators to configure organizational master data used throughout the application.

All operational modules such as Audit Creation, Investigation, Reports, and User Management depend on the information configured here.

This screen should follow an enterprise SaaS pattern with a persistent left navigation and a dynamic content area.

---

# Primary Users

- Super Administrator
- System Administrator

---

# Screen Goals

- Configure organization hierarchy
- Manage manufacturing locations
- Configure audit master data
- Manage users and roles
- Configure notification rules
- Configure application preferences

---

# Navigation

Administration

---

# Page Header

## Title

Administration

## Subtitle

Manage system configuration and master data.

---

# Header Actions

Primary

- Save Changes

Secondary

- Import Master Data
- Export Configuration

---

# Layout

The page consists of two primary sections.

## Left Panel

Administration Navigation

## Right Panel

Selected Module Content

---

# Left Navigation

Display the following menu items.

1. Organization

2. Regions

3. Plants

4. Cities

5. Departments

6. Production Lines

7. Audit Types

8. Categories

9. Users

10. Roles & Permissions

11. Notification Rules

12. System Preferences

The selected menu item should remain highlighted.

---

# Default Landing Module

Organization

---

# Module 1

## Organization

Purpose

Configure company-level information.

Fields

- Organization Name
- Company Logo
- Headquarters
- Time Zone
- Currency
- Date Format
- Contact Email

Actions

- Edit
- Save

---

# Module 2

## Regions

Purpose

Manage business regions.

Example

South India

North India

East India

West India

Table Columns

- Region Name
- Description
- Plants
- Status
- Actions

Actions

- Add Region
- Edit
- Delete

---

# Module 3

## Plants

Purpose

Manage manufacturing plants.

Each Plant belongs to a Region.

Fields

- Plant Name
- Region
- City
- Plant Code
- Address
- Plant Manager
- Status

Example

| Plant | Region | City |
|--------|---------|------|
| Chennai Plant | South India | Chennai |
| Hosur Plant | South India | Hosur |
| Bengaluru Plant | South India | Bengaluru |
| Hyderabad Plant | South India | Hyderabad |
| Coimbatore Plant | South India | Coimbatore |

Actions

- Add Plant
- Edit
- Archive

---

# Module 4

## Cities

Purpose

Configure cities available for manufacturing plants.

Fields

- City
- State
- Region
- Number of Plants

Actions

- Add
- Edit
- Delete

---

# Module 5

## Departments

Purpose

Configure manufacturing departments.

Examples

- Assembly
- Quality
- Welding
- Paint Shop
- Warehouse
- Maintenance
- Logistics
- Packaging

Fields

- Department Name
- Plant
- Department Head
- Status

Actions

- Add
- Edit
- Delete

---

# Module 6

## Production Lines

Purpose

Configure manufacturing lines.

Production Lines belong to a Department.

Fields

- Line Name
- Plant
- Department
- Supervisor
- Status

Examples

- Assembly Line 1
- Assembly Line 2
- Welding Line A
- Paint Line
- Calibration Lab

Actions

- Add
- Edit
- Delete

---

# Module 7

## Audit Types

Purpose

Manage available audit templates.

Examples

- Process Audit
- Product Audit
- Supplier Audit
- Safety Audit
- Internal Audit

Fields

- Audit Type
- Description
- Active

Actions

- Add
- Edit
- Delete

---

# Module 8

## Categories

Purpose

Configure defect categories used during audits.

Examples

- Quality
- Safety
- Machine
- Material
- Process
- Environment
- Documentation

Fields

- Category Name
- Description
- Severity Default

Actions

- Add
- Edit
- Delete

---

# Module 9

## Users

Purpose

Manage application users.

Columns

- Employee ID
- Name
- Email
- Plant
- Department
- Role
- Status

Actions

- Add User
- Edit
- Disable Account
- Reset Password

Search

Search by

- Employee ID
- Name
- Email

Filters

- Plant
- Department
- Role

---

# Module 10

## Roles & Permissions

Purpose

Configure role-based access.

Roles

- Quality Engineer
- Quality Manager
- Plant Manager
- Auditor
- System Admin
- Super Admin

Permissions

- Dashboard
- Audit
- Investigation
- Reports
- Administration
- Users
- Settings

Permission Types

- View
- Create
- Edit
- Delete
- Export
- Approve

Display

Permission Matrix

---

# Module 11

## Notification Rules

Purpose

Manage application notifications.

Notification Types

- Email
- In-App
- Push Notification

Events

- Audit Assigned
- Investigation Started
- Investigation Completed
- Audit Closed
- SLA Reminder
- Escalation

Fields

- Notification Type
- Enabled
- Trigger
- Recipients

---

# Module 12

## System Preferences

Purpose

Configure application-wide settings.

Settings

- Default Language
- Time Zone
- Date Format
- Working Days
- Working Hours
- File Upload Size
- Allowed File Types

Security

- Password Policy
- Session Timeout
- MFA
- Login Attempts

---

# Search

Display global search for every module.

Placeholder

Search...

---

# Empty State

Illustration

Configuration Illustration

Message

No records available.

Create your first record.

Button

Add New

---

# Loading State

Use skeleton loaders.

---

# Error State

Title

Unable to load configuration.

Button

Retry

---

# Confirmation Dialog

Display before Delete.

Title

Delete Record?

Message

This action cannot be undone.

Buttons

- Cancel
- Delete

---

# Validation

Required fields display inline validation.

Duplicate records should not be allowed.

Hierarchy validation

Examples

Region must exist before creating Plant.

Plant must exist before creating Department.

Department must exist before creating Production Line.

---

# Responsive Behavior

Desktop

Two-column layout.

Left navigation remains fixed.

Right content scrolls independently.

iPad Browser

Navigation collapses into a slide-out panel.

Tables become horizontally scrollable.

---

# Accessibility

- WCAG AA
- Keyboard navigation
- Screen reader support
- Visible focus states
- Accessible forms
- Minimum 44px click targets

---

# Visual Design Guidelines

Follow the existing MQMS design language.

- Enterprise SaaS
- Minimal interface
- High information density
- Clean tables
- Consistent spacing
- Rounded cards
- Soft shadows
- Neutral color palette
- Blue primary actions
- Responsive layout

Maintain visual consistency with:

- Dashboard
- Audit List
- Create Audit
- Audit Details
- Five Why Investigation
- Reports Dashboard

Do not redesign the application shell.

---

# Future Enhancements

- Bulk Import via Excel
- Audit Template Builder
- Dynamic Custom Fields
- Multi-Organization Support
- Multi-Language Configuration
- Plant-specific Settings
- Approval Workflow Configuration
- API Key Management
- Integration Settings (ERP, SAP, MES)
- Audit Checklist Builder