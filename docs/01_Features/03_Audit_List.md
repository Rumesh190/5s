---
title: Audit List
module: Audit Management
screen: Audit List
version: 1.0
status: Draft
owner: Product Team
---

# Audit List

## Purpose

The Audit List is the primary workspace for managing all quality audits within the Manufacturing Quality Management System (MQMS).

It enables users to search, filter, sort, and access audits efficiently. The screen should prioritize discoverability, productivity, and quick navigation to audit details.

---

## Primary Users

- Quality Engineer
- Production Supervisor
- Plant Manager
- Administrator

---

## Entry Points

Users can access this screen from:

- Dashboard
- Sidebar Navigation
- Create Audit Success Redirect
- Notification Links (Future)

---

## Exit Points

Users can navigate to:

- Create Audit
- Audit Details
- Dashboard
- Settings

---

## User Goals

Users want to:

- Find an audit quickly.
- Resume ongoing investigations.
- Track audit status.
- Filter audits based on priority or status.
- Create new audits.
- Review recently updated audits.

---

## Business Goals

The Audit List should:

- Centralize audit management.
- Improve visibility across investigations.
- Reduce time spent searching for audits.
- Support efficient investigation workflows.
- Provide a scalable interface as audit volume grows.

---

## Layout

Desktop-first layout.

--------------------------------------------------------

Sidebar Navigation

|

Top Header

--------------------------------------------------------

Toolbar

--------------------------------------------------------

Filter Bar

--------------------------------------------------------

Audit Table

--------------------------------------------------------

Pagination

--------------------------------------------------------

The layout should maximize visible data while maintaining readability.

---

## Sections

### 1. Header

Contains:

- Page Title
- Total Audit Count
- Create Audit Button

---

### 2. Toolbar

Provides quick actions.

Components:

- Search Bar
- Refresh Button
- Create Audit Button

Future:

- Export
- Bulk Actions

---

### 3. Filter Bar

Users should be able to filter audits by:

- Status
- Severity
- Department
- Plant
- Assigned To
- Date Range

Future:

- Tags
- Saved Filters

---

### 4. Audit Table

Displays all audit records.

Recommended Columns:

- Audit ID
- Title
- Plant
- Department
- Severity
- Status
- Assigned To
- Created Date
- Last Updated

Optional Future Columns:

- Production Line
- Product
- Root Cause
- Due Date

---

### 5. Pagination

Display:

- Current Page
- Total Records
- Rows Per Page
- Next / Previous Navigation

---

## Components

Required Components

- Data Table
- Search Input
- Filter Dropdowns
- Date Picker
- Primary Button
- Secondary Button
- Status Badges
- Pagination
- Empty State
- Toast Notifications

Future Components

- Bulk Selection
- Saved Views
- Export Menu

---

## Primary Actions

- Create Audit
- Open Audit Details
- Search Audits
- Apply Filters

---

## Secondary Actions

- Refresh List
- Clear Filters

Future:

- Export Data
- Duplicate Audit
- Archive Audit

---

## Row Actions

Each audit row should support:

- Open Audit
- View Details

Future:

- Edit
- Duplicate
- Archive
- Delete (Administrator Only)

---

## Validation Rules

Search

- Search should match:
  - Audit ID
  - Title
  - Department

Filters

- Multiple filters can be combined.
- Filters remain active until cleared.

Sorting

Users should be able to sort by:

- Created Date
- Updated Date
- Status
- Severity

---

## Empty State

If no audits exist:

Display:

"No audits found."

Primary Action:

Create New Audit

If filters return no results:

Display:

"No audits match the selected filters."

Secondary Action:

Clear Filters

---

## Loading State

Use skeleton loaders for:

- Table rows
- Header count

Avoid blocking the entire page.

---

## Error State

Possible Errors:

- Unable to load audits
- Network failure
- Server unavailable

Display:

- Friendly message
- Retry button

---

## Success State

Examples:

- Audit created successfully.
- Audit updated successfully.
- Filters applied successfully.

Display confirmation using toast notifications.

---

## Permissions

### Quality Engineer

- View assigned audits
- Create audits
- View audit details

### Production Supervisor

- View department audits
- Monitor investigations

### Plant Manager

- View all audits

### Administrator

- Full access

---

## Responsive Behaviour

Primary Platform

Desktop

Secondary Platform

iPad Browser

Behaviour

- Responsive toolbar
- Horizontally scrollable table if required
- Sticky table header
- Large touch-friendly controls
- Sidebar collapses on smaller screens

---

## Accessibility

The screen should support:

- Keyboard navigation
- Screen reader compatibility
- Accessible table headers
- Visible focus indicators
- WCAG AA contrast
- Touch-friendly filter controls

---

## UX Notes

The Audit List is expected to be the most frequently used screen in the application.

The interface should prioritize:

- Speed
- Readability
- Efficient filtering
- Quick navigation

Avoid unnecessary visual clutter.

The Create Audit button should remain easily discoverable.

Status badges should be immediately recognizable.

Search and filters should require minimal interaction.

---

## Future Enhancements

- Bulk Update
- Bulk Assignment
- Saved Filters
- Export to Excel
- Export PDF
- Custom Views
- Pin Important Audits
- Infinite Scrolling
- Column Customization
- AI-powered Search

---

## Design References

Visual Inspiration

- Linear Issues
- Jira Issue List
- GitHub Issues
- Notion Database
- Airtable Grid

The Audit List should resemble a modern enterprise workspace rather than a traditional spreadsheet.

The experience should support high-volume audit management while remaining simple and intuitive.