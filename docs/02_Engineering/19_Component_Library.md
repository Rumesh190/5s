
# MQMS Component Library

Version: 1.0

Status: Approved

---

# Purpose

The Component Library defines every reusable UI component used throughout the Manufacturing Quality Management System (MQMS).

The goal is to ensure consistency, reusability, maintainability, and faster development.

Developers should always reuse existing components before creating new ones.

---

# Component Categories

1. Layout Components
2. Navigation Components
3. Form Components
4. Data Display Components
5. Feedback Components
6. Overlay Components
7. Charts & Analytics
8. Utility Components

---

# 1. Layout Components

---

## App Layout

### Purpose

Provides the primary application layout.

### Includes

- Sidebar
- Header
- Content Area
- Breadcrumb

### Used In

Every authenticated screen.

---

## Page Header

### Purpose

Provides a consistent page title and actions.

### Includes

- Page Title
- Subtitle
- Primary Action
- Secondary Actions

### Used In

Dashboard

Audit List

Reports

Administration

Users

Roles

Notifications

---

## Section Header

### Purpose

Separates logical sections within a page.

### Includes

- Title
- Description (Optional)
- Action Button (Optional)

---

# 2. Navigation Components

---

## Sidebar

### Purpose

Primary application navigation.

### Features

- Collapsible
- Active State
- Nested Navigation
- Icons
- User Section

### Used In

Entire application.

---

## Header

### Purpose

Top application bar.

### Includes

- Breadcrumb
- Notifications
- Search (Future)
- User Profile Menu

---

## Breadcrumb

### Purpose

Displays navigation hierarchy.

Example

Dashboard

>

Audits

>

Audit Details

---

## User Menu

### Purpose

Displays logged-in user actions.

### Actions

- My Profile
- Settings
- Logout

---

# 3. Form Components

---

## Button

### Variants

- Primary
- Secondary
- Ghost
- Danger

### Sizes

- Small
- Medium
- Large

### States

- Default
- Hover
- Focus
- Disabled
- Loading

### Used In

Entire application.

---

## Text Input

### Purpose

Standard text input.

### Supports

- Label
- Placeholder
- Helper Text
- Error Message

---

## Search Input

### Features

- Search Icon
- Clear Button

---

## Textarea

### Used For

Descriptions

Audit Notes

Observations

---

## Select Dropdown

### Supports

- Single Select
- Search
- Disabled
- Placeholder

---

## Multi Select

### Used For

Assign Users

Plants

Departments

Recipients

---

## Date Picker

### Used In

Create Audit

Reports

Filters

---

## Checkbox

### Used For

Bulk Selection

Permissions

Options

---

## Radio Group

### Used For

Single Choice

---

## Toggle Switch

### Used For

Notifications

Settings

Feature Flags

---

## File Upload

### Supports

- Drag & Drop
- Click Upload
- Preview
- Remove File

Used In

Audit Evidence

Attachments

---

# 4. Data Display Components

---

## Card

### Purpose

Reusable content container.

### Variants

- Default
- KPI
- Summary
- Information

---

## KPI Card

### Includes

- Icon
- Metric
- Trend
- Description

### Used In

Dashboard

Reports

---

## Data Table

### Features

- Sorting
- Search
- Filters
- Pagination
- Row Selection
- Sticky Header
- Export

### Used In

Audit List

Users

Roles

Reports

---

## Badge

### Variants

- Success
- Warning
- Error
- Info
- Neutral

### Used For

Status

Priority

Severity

---

## Avatar

### Supports

- Image
- Initials
- Status Indicator

---

## Timeline

### Used In

Audit History

Investigation History

Activity Log

---

## Progress Indicator

### Variants

- Progress Bar
- Circular Progress

---

# 5. Feedback Components

---

## Toast Notification

### Types

- Success
- Error
- Warning
- Information

---

## Alert

### Variants

- Info
- Success
- Warning
- Error

---

## Empty State

### Includes

- Illustration
- Title
- Description
- Action Button

---

## Loading Skeleton

### Used For

- Cards
- Tables
- Forms
- Charts

---

## Error State

### Includes

- Icon
- Title
- Description
- Retry Button

---

# 6. Overlay Components

---

## Modal Dialog

### Used For

- Delete Confirmation
- Reset Password
- Logout
- Confirmation

---

## Drawer

### Position

Right Side

### Used For

- Create Audit
- Edit User
- Invite User
- Role Details

---

## Popover

### Used For

Quick Actions

Help

Hints

---

## Tooltip

### Used For

Additional Information

---

# 7. Charts & Analytics

---

## Bar Chart

Used In

Reports

Dashboard

---

## Line Chart

Used In

Reports

---

## Pie Chart

Used In

Reports

---

## Donut Chart

Used In

Dashboard

---

## Area Chart

Used In

Analytics

---

# 8. Utility Components

---

## Tabs

Used In

Profile

Reports

Administration

---

## Accordion

Used In

Notification Rules

FAQs

---

## Pagination

### Features

- Previous
- Next
- Page Numbers
- Page Size

---

## Filter Panel

### Supports

- Multi Filter
- Date Range
- Reset
- Apply

---

## Search Bar

### Supports

- Instant Search
- Clear Button

---

## Status Chip

### Used For

Quick Status Indicators

---

## Stepper

### Used In

Future Multi-step Forms

---

# Component Usage Rules

Before creating a new component:

- Check if a reusable component already exists.
- Extend existing components instead of duplicating them.
- Keep components focused on a single responsibility.
- Prefer composition over inheritance.
- Avoid page-specific styling inside shared components.

---

# Accessibility Requirements

Every component must support:

- Keyboard Navigation
- Visible Focus State
- ARIA Labels
- Screen Reader Compatibility
- WCAG AA Compliance
- Minimum 44px Click Target (Interactive Components)

---

# Folder Structure

```text
src/

components/

layout/

navigation/

forms/

data-display/

feedback/

overlays/

charts/

utility/
```

---

# Naming Convention

Use PascalCase.

Examples

AppLayout

PageHeader

AuditCard

DataTable

NotificationDrawer

StatusBadge

SearchInput

DatePickerField

---

# Development Rules

- Components must be reusable.
- Avoid duplicate implementations.
- Keep styling centralized.
- Use TypeScript interfaces for props.
- Follow the MQMS Design System.
- Prefer shadcn/ui as the base for all components.
- Extend components instead of replacing them.

---

# Future Components

The following components may be added in future releases:

- Kanban Board
- Calendar
- Command Palette
- Rich Text Editor
- PDF Viewer
- Image Annotation
- QR Code Scanner
- Signature Pad
- AI Assistant Panel
- Real-time Activity Feed