
---
title: Claude Design Prompt Library
module: Design
version: 1.0
status: Draft
owner: Product Team
---

# Claude Design Prompt Library

## Purpose

This document contains reusable prompts for Claude Design.

The objective is to ensure every generated screen follows the same design principles, business rules, and user experience.

Each prompt assumes the relevant project documentation has been attached.

---

# Global Design Prompt

Use this prompt before designing any screen.

```
You are a Senior Product Designer with expertise in enterprise SaaS products for manufacturing and quality management.

Your task is to design production-ready interfaces for the Manufacturing Quality Management System (MQMS).

Before designing, carefully read the attached documentation.

Project Context

Product Requirements

User Flows

Information Architecture

Design System

Business Rules

Data Model

User Roles

Relevant Screen Specification

Design Requirements

• Desktop-first
• iPad browser responsive
• Modern enterprise SaaS
• Minimal visual noise
• Fast data entry
• Accessibility (WCAG AA)
• shadcn/ui inspired components
• Tailwind CSS friendly
• Clean spacing using an 8px grid
• Professional manufacturing software aesthetic

Important Rules

• Do NOT invent new features.
• Do NOT change business logic.
• Follow the provided documentation exactly.
• Use only the components required for the screen.
• Explain important UX decisions after the design.
```

---

# Login Screen Prompt

Attach

- 01_Login.md

Prompt

```
Design the Login screen.

Objectives

- Simple
- Professional
- Trustworthy

Include

- Company Logo
- Welcome message
- Email
- Password
- Show Password
- Forgot Password
- Login Button

Desktop-first.

Avoid unnecessary graphics.

The design should feel similar to Linear, Notion, or Atlassian products.
```

---

# Dashboard Prompt

Attach

- 02_Dashboard.md

Prompt

```
Design the Dashboard.

The Dashboard should help users quickly understand:

- Audit Status
- Recent Activity
- Assigned Work
- Pending Investigations

Use cards for KPIs.

Use tables for audit lists.

Use status badges.

Do not overload the dashboard.

Prioritize information hierarchy.
```

---

# Audit List Prompt

Attach

- 03_Audit_List.md

Prompt

```
Design the Audit List screen.

Requirements

- Large searchable table
- Filters
- Status badges
- Severity badges
- Pagination
- Create Audit button

The table should support future scalability.

Design for quality engineers who manage many audits daily.
```

---

# Create Audit Prompt

Attach

- 04_Create_Audit.md

Prompt

```
Design the Create Audit screen.

Focus on fast data entry.

Group related fields.

Required sections

- Audit Information
- Location
- Problem Statement
- Severity
- Attachments

Use progressive disclosure where appropriate.

Reduce cognitive load.

Prevent user mistakes.
```

---

# Audit Details Prompt

Attach

- 05_Audit_Details.md

Prompt

```
Design the Audit Details workspace.

Tabs

- Overview
- Investigation
- Attachments
- Activity Log

The Overview should provide enough information before users begin the investigation.

Navigation should be intuitive.

Maintain consistency with the Dashboard.
```

---

# Investigation Prompt

Attach

- 06_Investigation.md

Prompt

```
Design the Investigation screen.

The interface should guide users through a structured Five Why analysis.

Workflow

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

Complete Investigation

Design this as a guided workflow.

Only one Why section should be expanded at a time.

Use a progress indicator.

Encourage concise answers.

Avoid long overwhelming forms.
```

---

# Settings Prompt

Attach

- 07_Settings.md

Prompt

```
Design the Settings screen.

Include

- My Profile
- Change Password
- About

The design should be simple and familiar.

Focus on usability rather than visual complexity.

Avoid unnecessary settings.

Keep consistency with the rest of the application.
```

---

# Design Review Prompt

Use this after Claude generates a screen.

```
Review this UI as a Principal Product Designer.

Evaluate

- Information Architecture
- Visual Hierarchy
- UX
- Accessibility
- Component Consistency
- Spacing
- Alignment
- Data Density
- Enterprise Usability
- Manufacturing Workflow

Identify

- Strengths

- Weaknesses

- UX Problems

- Missing States

- Edge Cases

Provide actionable recommendations.

Do not redesign the screen unless necessary.
```

---

# Design Improvement Prompt

Use after receiving review feedback.

```
Improve the current design using the review comments.

Do not change the business logic.

Maintain consistency with the existing Design System.

Improve

- Layout
- Hierarchy
- Spacing
- Components
- Interactions
- Responsiveness

Keep the design production-ready.
```

---

# Design Freeze Checklist

Before approving any screen, verify the following:

□ Matches Screen Specification

□ Matches Business Rules

□ Matches User Flows

□ Uses Design System

□ Accessible (WCAG AA)

□ Desktop Optimized

□ iPad Responsive

□ Empty States Included

□ Loading States Included

□ Error States Included

□ Success States Included

□ Validation States Included

□ Components Reusable

□ Ready for Development

Only after every item is complete should the screen be marked as approved.

---

# Design Workflow

Follow this process for every screen.

```
Read Documentation

↓

Generate UI

↓

Review

↓

Improve

↓

Client Review

↓

Revise

↓

Approve

↓

Freeze

↓

Begin Next Screen
```

Never design multiple screens simultaneously.

Complete and approve one screen before moving to the next.

---

# Prompt Usage Guide

| Stage | Prompt |
|--------|--------|
| Initial Design | Global Design Prompt + Screen Prompt |
| UX Review | Design Review Prompt |
| Iteration | Design Improvement Prompt |
| Final Validation | Design Freeze Checklist |

Following this process ensures consistency across the application and reduces rework during development.