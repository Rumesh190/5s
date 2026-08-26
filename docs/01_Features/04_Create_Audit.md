---
title: Create Audit
module: Audit Management
screen: Create Audit
version: 1.0
status: Draft
owner: Product Team
---

# Create Audit

## Purpose

The Create Audit screen allows users to initiate a new quality investigation by capturing essential information about a manufacturing issue.

The experience should be structured as a guided multi-step wizard that minimizes user effort, validates information progressively, and ensures all required details are captured before creating the audit.

---

## Primary Users

- Quality Engineer
- Production Supervisor

---

## Entry Points

Users can access this screen from:

- Dashboard → Create Audit
- Audit List → Create Audit
- Quick Actions

---

## Exit Points

After successful creation:

→ Audit Details

Users may also:

→ Cancel and return to Audit List

→ Save as Draft

---

## User Goals

Users want to:

- Quickly report a quality issue.
- Capture sufficient information for investigation.
- Attach supporting evidence.
- Save progress if the investigation cannot be completed immediately.

---

## Business Goals

The system should:

- Standardize audit creation.
- Ensure required information is captured.
- Reduce incomplete investigations.
- Create a consistent starting point for the 5 Why process.

---

# Wizard Overview

The wizard consists of three steps.

```
Step 1

Basic Information

↓

Step 2

Issue Details

↓

Step 3

Review & Attachments

↓

Create Audit
```

A progress indicator should remain visible throughout the process.

---

# Step 1 – Basic Information

## Purpose

Capture high-level information about the audit.

### Fields

- Audit Title *
- Plant *
- Department *
- Production Line *
- Product / Part Name
- Audit Date *
- Severity *
- Category *
- Reported By (Auto-filled)
- Assigned Investigator

### Components

- Text Input
- Dropdown
- Date Picker
- Searchable User Selector

### Primary Action

Next

### Secondary Action

Cancel

---

# Step 2 – Issue Details

## Purpose

Capture detailed information about the issue.

### Fields

- Problem Description *
- Observation
- Location
- Quantity Affected
- Immediate Action Taken
- Additional Notes

### Components

- Text Area
- Number Input
- Dropdown

### Primary Action

Next

### Secondary Action

Previous

---

# Step 3 – Review & Attachments

## Purpose

Allow users to verify information and upload supporting evidence before creating the audit.

### Sections

Audit Summary

Attachments

Confirmation

### Attachments

Supported Formats

- JPG
- PNG
- PDF
- DOCX

Users may upload multiple files.

Maximum file size should be configurable by the administrator.

### Confirmation

Display all captured information for review before submission.

---

## Components

Required Components

- Stepper
- Form Inputs
- Dropdowns
- Date Picker
- File Upload
- Summary Card
- Primary Button
- Secondary Button
- Toast Notification

---

## Primary Actions

- Next
- Previous
- Create Audit

---

## Secondary Actions

- Save as Draft
- Cancel

---

## Validation Rules

Step 1

Required

- Audit Title
- Plant
- Department
- Production Line
- Audit Date
- Severity
- Category

Step 2

Required

- Problem Description

Step 3

Users cannot create the audit until all required fields have been completed.

Validation errors should appear inline.

---

## Empty State

Not Applicable

---

## Loading State

When creating the audit:

- Disable all buttons
- Show loading state on Create Audit button
- Prevent duplicate submissions

---

## Error State

Possible Errors

- Required field missing
- Invalid input
- File upload failed
- Server unavailable

Display user-friendly messages and allow retry where applicable.

---

## Success State

After successful creation:

Display toast notification:

"Audit created successfully."

Automatically redirect to:

Audit Details

---

## Permissions

### Quality Engineer

- Create Audit

### Production Supervisor

- Create Audit

### Plant Manager

- View Only

### Administrator

- Full Access

---

## Responsive Behaviour

Primary Platform

Desktop

Secondary Platform

iPad Browser

Behaviour

- Wizard remains centered.
- Stepper remains visible.
- Forms resize responsively.
- Large touch-friendly controls.
- File upload supports drag-and-drop on desktop and file picker on iPad.

---

## Accessibility

The screen should support:

- Keyboard navigation
- Screen readers
- Proper form labels
- Accessible validation messages
- WCAG AA contrast
- Focus management between steps

---

## UX Notes

The Create Audit process should feel lightweight and approachable.

Avoid displaying all fields on one page.

Use progressive disclosure by revealing information step by step.

Auto-save draft functionality is recommended for future versions.

Display required fields clearly.

Minimize typing by using dropdowns and searchable selectors where appropriate.

---

## Future Enhancements

- Auto-save Draft
- Duplicate Existing Audit
- Barcode / QR Code Scanner
- Voice-to-Text Notes
- Camera Capture
- AI-assisted Field Suggestions
- ERP Integration
- Offline Draft Creation

---

## Design References

Visual Inspiration

- Linear Issue Creation
- Jira Create Issue
- Notion Page Creation
- Stripe Multi-step Forms

The interface should feel structured, lightweight, and focused.

The user should always know:

- Where they are
- What remains
- What happens next

Completing an audit should require as few clicks as possible while maintaining data quality.