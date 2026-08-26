
# Roles & Permissions

---

# Screen Overview

The Roles & Permissions module enables System Administrators to define role-based access control (RBAC) across the Manufacturing Quality Management System (MQMS).

Administrators can create custom roles, assign permissions by module, and control user access to every major feature of the application.

The system should support predefined roles as well as future custom roles.

---

# Primary Users

- Super Administrator
- System Administrator

---

# Screen Goals

- View all roles
- Create new roles
- Edit existing roles
- Configure module-level permissions
- Duplicate roles
- Assign users to roles
- Activate or deactivate roles

---

# Navigation

Administration

→ Roles & Permissions

---

# Page Header

## Title

Roles & Permissions

## Subtitle

Manage user roles and application access.

---

# Header Actions

Primary

- Create Role

Secondary

- Import Roles
- Export Roles

---

# Layout

Two-panel layout.

## Left Panel

Roles List

## Right Panel

Role Details & Permissions

---

# Left Panel

Display all available roles.

Examples

- Super Administrator
- System Administrator
- Plant Manager
- Quality Manager
- Quality Engineer
- Auditor
- Read Only

Display

- Role Name
- Number of Users
- Status

Selected role remains highlighted.

---

# Right Panel

Display selected role details.

---

## Section 1

### Role Information

Fields

- Role Name
- Description
- Status

Display

Created By

Created Date

Last Updated

---

## Section 2

### Assigned Users

Display

- Total Users
- View Assigned Users

Optional action

Manage Assignments

---

## Section 3

### Module Permissions

Permissions should be grouped by application module.

Each module is displayed as an expandable card.

---

### Dashboard

Permissions

- View Dashboard

---

### Audit Management

Permissions

- View Audits
- Create Audit
- Edit Audit
- Delete Audit
- Assign Audit
- Close Audit

---

### Five Why Investigation

Permissions

- View Investigation
- Start Investigation
- Edit Investigation
- Submit Investigation
- Reopen Investigation

---

### Reports

Permissions

- View Reports
- Export Reports
- Schedule Reports

---

### Administration

Permissions

- View Administration
- Manage Master Data
- Configure Organization

---

### User Management

Permissions

- View Users
- Create Users
- Edit Users
- Disable Users
- Delete Users
- Reset Password

---

### Notification Rules

Permissions

- View
- Edit

---

### System Preferences

Permissions

- View
- Edit

---

# Permission Controls

Each permission uses a toggle switch.

Example

Dashboard

☑ View Dashboard

Audit Management

☑ View

☑ Create

☑ Edit

☐ Delete

☑ Assign

☑ Close

---

# Create Role

Clicking "Create Role" opens a right-side drawer.

Fields

- Role Name
- Description
- Copy Permissions From (Optional)
- Status

Buttons

- Cancel
- Create Role

---

# Duplicate Role

Users can duplicate an existing role.

Example

Quality Engineer

↓

Duplicate

↓

Senior Quality Engineer

---

# Search

Search roles by

- Role Name
- Description

---

# Filters

Status

- Active
- Inactive

---

# Empty State

Illustration

Roles Illustration

Title

No roles found.

Message

Create your first role to manage application access.

Button

Create Role

---

# Loading State

Use skeleton loaders.

---

# Error State

Title

Unable to load roles.

Button

Retry

---

# Confirmation Dialogs

Delete Role

Title

Delete Role?

Message

Users assigned to this role must be reassigned before deletion.

Buttons

- Cancel
- Delete

---

# Validation

Required

- Role Name

Validation Rules

- Role Name must be unique.
- At least one permission must be selected.
- Super Administrator role cannot be deleted.

---

# Responsive Behavior

Desktop

- Two-panel layout
- Expandable permission cards
- Sticky role list

iPad Browser

- Left panel collapses into a drawer
- Permission cards stack vertically

---

# Accessibility

- WCAG AA
- Keyboard navigation
- Screen reader support
- Focus indicators
- Accessible toggles
- Minimum 44px touch targets

---

# Visual Design Guidelines

Maintain consistency with all approved MQMS screens.

Follow the existing design language.

- Enterprise SaaS
- Minimal interface
- High information density
- Rounded cards
- Soft shadows
- Blue primary actions
- Semantic status indicators
- Tailwind CSS friendly
- shadcn/ui inspired

Do not redesign the application shell.

---

# Future Enhancements

- Custom permission groups
- Field-level permissions
- Approval workflows
- Temporary role assignments
- Permission audit logs
- Role templates
- Time-bound access
- Plant-specific permissions
- Department-level permissions
- Integration with Azure AD / Microsoft Entra ID