---
title: Audit Details
module: Audit Management
screen: Audit Details
version: 1.0
status: Draft
owner: Product Team
---

# Audit Details

## Purpose

The Audit Details screen serves as the central workspace for managing a quality investigation.

It provides complete visibility into an audit, including its current status, investigation progress, root cause analysis, corrective actions, attachments, and activity history.

This screen should enable users to complete an investigation without navigating between multiple pages.

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
- Audit List
- Notifications (Future)
- Search Results (Future)

---

## Exit Points

Users can navigate to:

- Dashboard
- Audit List
- Settings

---

## User Goals

Users want to:

- Understand the current state of an audit.
- Continue the investigation.
- Complete the 5 Why analysis.
- Assign corrective actions.
- Review supporting evidence.
- Track investigation history.
- Close the audit.

---

## Business Goals

The system should:

- Centralize all audit information.
- Improve investigation efficiency.
- Increase traceability.
- Maintain a complete audit history.
- Reduce unnecessary navigation.

---

# Layout

Desktop-first workspace.

```
---------------------------------------------------------
Sidebar

|

Header
---------------------------------------------------------

Audit Summary Card

---------------------------------------------------------

Tabs

Overview | 5 Why Analysis | Corrective Actions | Attachments | Activity Log

---------------------------------------------------------

Selected Tab Content

---------------------------------------------------------
```

The selected tab should remain active until changed by the user.

---

# Header

Display:

- Audit ID
- Audit Title
- Current Status Badge
- Severity Badge
- Last Updated
- Action Menu

---

# Summary Card

Displays key information.

Fields:

- Plant
- Department
- Production Line
- Product
- Reported By
- Assigned Investigator
- Created Date
- Audit Date
- Progress Indicator

---

# Navigation Tabs

The workspace contains five primary tabs.

## 1. Overview

Purpose

Provide a summary of the investigation.

Sections

- Audit Summary
- Investigation Status
- Assigned Users
- Key Dates
- Description
- Immediate Actions

Primary Actions

- Edit Audit
- Change Status

---

## 2. 5 Why Analysis

Purpose

Guide users through identifying the root cause.

Displays

- Problem Statement
- Why 1
- Why 2
- Why 3
- Why 4
- Why 5
- Root Cause

Primary Action

Continue Investigation

---

## 3. Corrective Actions

Purpose

Track corrective actions resulting from the investigation.

Displays

- Action List
- Owner
- Due Date
- Priority
- Status
- Completion Progress

Primary Action

Add Corrective Action

---

## 4. Attachments

Purpose

Manage supporting evidence.

Displays

- Images
- Documents
- PDFs

Actions

- Upload
- Download
- Preview
- Delete (Authorized Users)

---

## 5. Activity Log

Purpose

Display the complete audit timeline.

Events include:

- Audit Created
- Status Changed
- User Assigned
- Investigation Updated
- Corrective Action Added
- Attachment Uploaded
- Audit Closed

Newest events appear first.

---

## Components

Required Components

- Header
- Summary Card
- Tabs
- Status Badge
- Progress Indicator
- Timeline
- File Upload
- Data Table
- Primary Button
- Secondary Button
- Overflow Menu
- Toast Notifications

---

## Primary Actions

- Continue Investigation
- Add Corrective Action
- Upload Attachment
- Close Audit

---

## Secondary Actions

- Edit Audit
- Save Changes
- Download Attachments

Future

- Duplicate Audit
- Export Audit
- Print Investigation

---

## Validation Rules

Audit cannot be closed unless:

- Problem Statement completed.
- Root Cause identified.
- Required corrective actions created.
- Mandatory fields completed.

System should warn users before leaving with unsaved changes.

---

## Empty State

### Attachments

"No files uploaded."

Action

Upload Attachment

---

### Corrective Actions

"No corrective actions added."

Action

Add Corrective Action

---

### Activity Log

"No activity recorded."

---

## Loading State

Display skeleton loaders for:

- Summary Card
- Tabs
- Tables
- Timeline

Do not block the entire workspace during partial updates.

---

## Error State

Possible Errors

- Failed to load audit
- Failed to save changes
- Attachment upload failed
- Network unavailable

Provide:

- Friendly error message
- Retry action

---

## Success State

Examples

- Audit updated successfully.
- Attachment uploaded.
- Investigation saved.
- Corrective action added.
- Audit closed.

Display toast notifications.

---

## Permissions

### Quality Engineer

- Edit assigned audits
- Complete 5 Why
- Upload attachments
- Create corrective actions

---

### Production Supervisor

- Review investigations
- Approve findings
- Close audit

---

### Plant Manager

- View all audit information

---

### Administrator

- Full access

---

## Responsive Behaviour

Primary Platform

Desktop

Secondary Platform

iPad Browser

Behaviour

- Sidebar collapses on smaller screens.
- Tabs become horizontally scrollable if required.
- Summary card stacks vertically.
- Tables support horizontal scrolling.
- Buttons remain touch-friendly.

---

## Accessibility

Support:

- Keyboard navigation
- Screen readers
- Visible focus indicators
- Accessible tab navigation
- WCAG AA contrast
- Descriptive button labels

---

## UX Notes

This screen is the primary workspace of the application.

The interface should help users stay focused on completing investigations rather than navigating the system.

Information should be grouped logically.

Frequently used actions should remain highly visible.

Avoid unnecessary scrolling.

Use progressive disclosure where appropriate.

Changes should save quickly and provide immediate feedback.

---

## Future Enhancements

- Comments
- User Mentions
- Approval Workflow
- Digital Signatures
- Audit Version History
- Related Audits
- AI Investigation Assistant
- ERP Links
- Risk Assessment

---

## Design References

Visual Inspiration

- Linear Issue Details
- GitHub Issue View
- Jira Issue View
- Notion Page Layout

The screen should feel like a professional investigation workspace rather than a traditional data-entry form.

Users should always understand:

- Current status
- Remaining work
- Investigation progress
- Next recommended action