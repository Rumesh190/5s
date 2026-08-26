---
title: Investigation
module: Audit Management
screen: Investigation
version: 1.0
status: Draft
owner: Product Team
---

# Investigation

## Purpose

The Investigation screen is the core workspace where users perform a structured root cause analysis using the Five Why methodology.

The objective is to guide users from the initial problem statement to identifying the root cause and defining corrective actions before completing the investigation.

The experience should feel like a guided workflow rather than a traditional form.

---

## Primary Users

- Quality Engineer
- Production Supervisor

Review Only

- Plant Manager
- Administrator

---

## Entry Points

Users access this screen from:

Audit Details

↓

Investigation Tab

---

## Exit Points

Users can navigate to:

- Overview
- Attachments
- Activity Log

After completing the investigation:

→ Close Audit

---

## User Goals

Users want to:

- Understand the reported issue.
- Identify the true root cause.
- Record supporting evidence.
- Define corrective actions.
- Complete the investigation.

---

## Business Goals

The system should:

- Standardize investigations.
- Improve root cause quality.
- Capture institutional knowledge.
- Reduce recurring manufacturing defects.
- Maintain complete investigation records.

---

# Investigation Workflow

```
Problem Statement

↓

Why 1

↓

Why 2

↓

Why 3

↓

Why 4

↓

Why 5

↓

Root Cause

↓

Corrective Action

↓

Assign Owner

↓

Target Completion Date

↓

Complete Investigation
```

The workflow should always communicate the user's current position within the investigation.

---

# Layout

```
---------------------------------------------------------

Investigation Progress

---------------------------------------------------------

Problem Statement

---------------------------------------------------------

Five Why Timeline

---------------------------------------------------------

Root Cause

---------------------------------------------------------

Corrective Action

---------------------------------------------------------

Footer Actions

Save Draft

Save Investigation

Complete Investigation

---------------------------------------------------------
```

---

# Sections

## 1. Investigation Progress

Display:

- Progress Percentage
- Current Step
- Investigation Status

---

## 2. Problem Statement

Display the issue captured during Audit Creation.

Fields

- Problem Statement (Read Only)
- Plant
- Department
- Production Line
- Severity
- Audit Status

Purpose

Provide investigation context.

---

## 3. Five Why Analysis

### Why 1

Question

Why did this problem occur?

Fields

- Answer *
- Supporting Notes
- Evidence Attachment (Optional)

---

### Why 2

Question

Why did the previous cause happen?

Fields

- Answer *
- Supporting Notes
- Evidence

---

### Why 3

Question

Why did that happen?

Fields

- Answer *
- Supporting Notes
- Evidence

---

### Why 4

Question

Why did that happen?

Fields

- Answer *
- Supporting Notes
- Evidence

---

### Why 5

Question

Why is this the fundamental cause?

Fields

- Answer *
- Supporting Notes
- Evidence

Each Why should build upon the previous answer.

---

## 4. Root Cause

Purpose

Document the final conclusion of the investigation.

Fields

- Root Cause *
- Root Cause Category
- Investigation Summary

Root Cause cannot be edited after the audit is closed.

---

## 5. Corrective Action

Purpose

Capture actions required to eliminate or reduce the identified root cause.

Fields

- Corrective Action Description *
- Action Owner *
- Target Completion Date *
- Priority
- Additional Notes

Future

- Multiple corrective actions
- Action checklist
- Effectiveness verification

---

## Components

Required Components

- Progress Indicator
- Vertical Timeline
- Accordion Sections
- Text Areas
- Date Picker
- User Selector
- File Upload
- Primary Button
- Secondary Button
- Status Badge
- Toast Notifications

---

## Primary Actions

- Save Investigation
- Complete Investigation

---

## Secondary Actions

- Save Draft
- Cancel
- Return to Overview

---

## Validation Rules

Problem Statement

Must exist before investigation begins.

Five Why

- Every Why requires an answer.
- Users cannot skip Why steps.
- Why sections unlock sequentially.

Root Cause

Mandatory.

Corrective Action

Mandatory before investigation completion.

Owner and Target Date are required.

The investigation cannot be completed unless:

- Five Why Analysis completed
- Root Cause recorded
- Corrective Action completed

---

## Empty State

If investigation has not started:

Display

"No investigation has been started."

Primary Action

Start Investigation

---

## Loading State

Display loading indicators while:

- Saving responses
- Uploading files
- Loading investigation history

Avoid blocking the full page.

---

## Error State

Possible Errors

- Unable to save investigation
- Attachment upload failed
- Network unavailable

Display

- Friendly explanation
- Retry button

---

## Success State

Examples

- Investigation saved successfully.
- Root Cause recorded.
- Investigation completed.

Display toast notifications.

---

## Permissions

### Quality Engineer

- Create
- Edit
- Save Draft

---

### Production Supervisor

- Review
- Edit
- Complete Investigation

---

### Plant Manager

- View Only

---

### Administrator

- Full Access

---

## Responsive Behaviour

Primary Platform

Desktop

Secondary Platform

iPad Browser

Behaviour

- Timeline stacks vertically.
- Accordions remain touch-friendly.
- Inputs resize automatically.
- Attachments display in responsive cards.

---

## Accessibility

Support:

- Keyboard navigation
- Screen readers
- Proper labels
- Focus management
- WCAG AA compliance

---

## UX Notes

This screen is the primary investigation workspace.

The interface should guide users naturally from understanding the problem to identifying the root cause and defining corrective actions.

Only one Why section should be expanded at a time.

Completed steps should remain visible but collapsed.

Provide clear progress throughout the investigation.

Encourage concise, evidence-based responses rather than lengthy narratives.

---

## Future Enhancements

- AI-assisted Why suggestions
- AI-generated Root Cause recommendations
- Historical investigation search
- Similar issue recommendations
- Investigation templates
- Comments and mentions
- Approval workflow
- Digital signatures
- Version history
- Effectiveness verification for corrective actions

---

## Design References

Visual Inspiration

- Linear Issue Details
- Jira Issue Workflow
- Notion Toggle Blocks
- Miro Process Flow

The screen should feel like a guided investigation rather than a long form.

Users should always understand:

- Where they are
- What has been completed
- What remains
- What action is expected next