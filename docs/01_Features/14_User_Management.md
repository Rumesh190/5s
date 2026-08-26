
# User Management

---

# Screen Overview

The User Management module allows System Administrators to manage all users within the Manufacturing Quality Management System (MQMS).

Administrators can create new users, assign roles, map users to plants and departments, activate or deactivate accounts, reset passwords, and manage user access across the organization.

This screen should provide a fast and intuitive experience for managing hundreds or thousands of users.

---

# Primary Users

- Super Administrator
- System Administrator
- HR Administrator (Optional)

---

# Screen Goals

- View all users
- Add new users
- Edit user details
- Assign roles
- Assign plants and departments
- Activate or deactivate users
- Reset passwords
- Search and filter users
- Export user data

---

# Navigation

Administration

→ User Management

---

# Page Header

## Title

User Management

## Subtitle

Manage users, roles, and organizational access.

---

# Header Actions

Primary

- Invite User

Secondary

- Import Users
- Export Users

---

# Search & Filters

Located below the page header.

## Search

Placeholder

Search by Name, Employee ID, or Email

---

## Filters

### Plant

Dropdown

Examples

- All Plants
- Chennai Plant
- Hosur Plant
- Bengaluru Plant
- Hyderabad Plant
- Coimbatore Plant

---

### Department

Dropdown

Examples

- Assembly
- Quality
- Welding
- Paint Shop
- Warehouse
- Maintenance

---

### Role

Dropdown

Examples

- Quality Engineer
- Quality Manager
- Plant Manager
- Auditor
- System Admin
- Super Admin

---

### Status

Dropdown

- Active
- Inactive
- Pending Invitation

---

# User Table

Display users in an enterprise data table.

## Columns

- Employee ID
- Name
- Email
- Plant
- Department
- Role
- Status
- Last Login
- Actions

---

## Sample Data

| Employee ID | Name | Plant | Department | Role | Status |
|--------------|------|--------|------------|------|--------|
| EMP1001 | Arun Kumar | Chennai Plant | Quality | Quality Engineer | Active |
| EMP1002 | Priya Nair | Hosur Plant | Assembly | Plant Manager | Active |
| EMP1003 | Rahul Sharma | Bengaluru Plant | Maintenance | Quality Manager | Active |
| EMP1004 | Sneha Iyer | Hyderabad Plant | Quality | Auditor | Pending |
| EMP1005 | Karthik Raj | Coimbatore Plant | Warehouse | Quality Engineer | Inactive |

---

# Row Actions

Each row should include an Actions menu.

Available actions

- View Profile
- Edit User
- Reset Password
- Disable User
- Activate User
- Delete User (Super Admin only)

---

# Invite User

Clicking "Invite User" opens a right-side drawer.

## Fields

### Personal Information

- Full Name
- Employee ID
- Email Address
- Mobile Number

---

### Organization

- Region
- Plant
- Department

Dependent Dropdowns

Region

↓

Plant

↓

Department

---

### Access

- Role
- Reporting Manager

---

### Account

- Status
- Send Invitation Email (Toggle)

---

### Buttons

- Cancel
- Send Invitation

---

# User Details Drawer

Clicking a user opens a details panel.

Display

## Personal Information

- Profile Picture
- Name
- Employee ID
- Email
- Phone

---

## Organization

- Region
- Plant
- Department
- Reporting Manager

---

## Access

- Role
- Permissions

---

## Activity

- Last Login
- Account Created
- Last Password Change

---

# Bulk Actions

Support multi-select.

Available actions

- Activate
- Deactivate
- Assign Role
- Export
- Delete

---

# Empty State

Illustration

Users Illustration

Title

No users found.

Message

Invite your first user to start collaborating.

Button

Invite User

---

# Loading State

Display skeleton rows.

---

# Error State

Title

Unable to load users.

Message

Please try again later.

Button

Retry

---

# Confirmation Dialogs

## Disable User

Title

Disable User?

Message

The user will no longer be able to access the application.

Buttons

- Cancel
- Disable

---

## Reset Password

Title

Reset Password?

Message

A password reset email will be sent to the user.

Buttons

- Cancel
- Send Email

---

# Validation

Required fields

- Name
- Employee ID
- Email
- Region
- Plant
- Department
- Role

Validation Rules

- Employee ID must be unique.
- Email must be unique.
- Plant depends on Region.
- Department depends on Plant.

---

# Responsive Behavior

Desktop

- Full-width table
- Right-side drawers
- Sticky table header

iPad Browser

- Responsive table
- Filters wrap into multiple rows
- Drawers remain full-height

---

# Accessibility

- WCAG AA
- Keyboard navigation
- Screen reader support
- Focus indicators
- Accessible forms
- Minimum 44px click targets

---

# Visual Design Guidelines

Maintain consistency with all approved MQMS screens.

Follow the established design language:

- Enterprise SaaS
- Minimal interface
- High information density
- Professional tables
- Rounded cards
- Soft shadows
- Semantic status badges
- Blue primary actions
- Tailwind CSS friendly
- shadcn/ui inspired

Do not redesign the application shell.

---

# Future Enhancements

- Azure AD / Microsoft Entra ID Integration
- Google Workspace SSO
- LDAP Authentication
- QR Code Login
- Multi-Factor Authentication (MFA)
- User Activity Logs
- Session Management
- Account Lockout Policies
- Team-based User Groups
- Bulk User Import via Excel