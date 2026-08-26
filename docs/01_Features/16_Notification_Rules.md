
# Notification Rules

---

# Screen Overview

The Notification Rules module enables System Administrators to configure how notifications are generated, delivered, and escalated across the Manufacturing Quality Management System (MQMS).

Administrators can define which events trigger notifications, who receives them, the delivery channel, escalation rules, reminder schedules, and digest preferences.

The notification engine supports Email and In-App notifications, with future support for SMS, Microsoft Teams, and Slack.

---

# Primary Users

- Super Administrator
- System Administrator

---

# Screen Goals

- Configure notification events
- Enable or disable notification channels
- Configure escalation workflows
- Manage reminder schedules
- Configure daily and weekly digests
- Preview notification templates

---

# Navigation

Administration

→ Notification Rules

---

# Page Header

## Title

Notification Rules

## Subtitle

Configure system notifications, reminders, and escalation workflows.

---

# Header Actions

Primary

- Save Changes

Secondary

- Test Notification
- Reset to Default

---

# Layout

Two-column layout.

## Left Panel

Notification Categories

## Right Panel

Notification Configuration

---

# Left Navigation

Display the following categories.

- Audit Notifications
- Investigation Notifications
- User Notifications
- Escalation Rules
- Reminder Rules
- Scheduled Reports
- Email Templates
- System Notifications

Highlight the selected category.

Default selection:

Audit Notifications

---

# Category 1

## Audit Notifications

Purpose

Configure notifications related to audit lifecycle events.

Events

- Audit Created
- Audit Assigned
- Audit Updated
- Audit Completed
- Audit Closed
- Audit Reopened

Each event should display:

- Event Name
- Enabled Toggle
- Notification Channels
- Recipients

---

# Notification Channels

Supported Channels

- Email
- In-App Notification

Future (Disabled)

- SMS
- Microsoft Teams
- Slack

---

# Recipient Options

Selectable Recipients

- Audit Owner
- Assigned Engineer
- Reporting Manager
- Plant Manager
- Quality Manager
- System Administrator

---

# Category 2

## Investigation Notifications

Events

- Investigation Started
- Why Analysis Submitted
- Root Cause Identified
- Investigation Completed
- Investigation Reopened

Configure

- Channel
- Recipients
- Enable/Disable

---

# Category 3

## User Notifications

Events

- User Invited
- Password Reset
- Account Activated
- Account Disabled
- Login Failure
- Password Changed

---

# Category 4

## Escalation Rules

Purpose

Automatically escalate overdue audits.

Example Workflow

Audit Due

↓

24 Hours Overdue

↓

Notify Audit Owner

↓

48 Hours Overdue

↓

Notify Reporting Manager

↓

72 Hours Overdue

↓

Notify Plant Manager

↓

96 Hours Overdue

↓

Notify Quality Head

Each escalation level should be configurable.

Fields

- Delay
- Recipient
- Notification Channel

---

# Category 5

## Reminder Rules

Configure automatic reminders.

Examples

Audit Due Tomorrow

Investigation Pending

Corrective Action Due

Verification Pending

Reminder Schedule

- 24 Hours Before
- On Due Date
- 24 Hours After
- Every 2 Days Until Closed

---

# Category 6

## Scheduled Reports

Automatically send reports.

Frequency

- Daily
- Weekly
- Monthly

Recipients

- Plant Manager
- Quality Manager
- Factory Head
- Leadership Team

Report Types

- Audit Summary
- Open Audits
- Overdue Audits
- Root Cause Analysis
- Plant Performance

---

# Category 7

## Email Templates

Display notification templates.

Templates

- Audit Assigned
- Audit Completed
- Investigation Started
- Investigation Completed
- Password Reset
- Welcome Email

Each template includes

- Subject
- Preview
- Edit

---

# Category 8

## System Notifications

Configure application announcements.

Examples

- Maintenance Notice
- System Update
- Downtime Alert
- New Feature Release

Visibility

- All Users
- Managers
- Administrators

---

# Search

Search notifications by

- Event Name
- Recipient
- Category

---

# Global Filters

Status

- Enabled
- Disabled

Channel

- Email
- In-App

---

# Notification Preview

Selecting an event should display a preview panel.

Display

Subject

Recipients

Message Preview

Notification Channel

---

# Test Notification

Button

Send Test Notification

Allows administrator to verify configuration.

---

# Empty State

Illustration

Notification Illustration

Title

No notification rules configured.

Message

Enable notification events to keep users informed.

Button

Create Rule

---

# Loading State

Display skeleton loaders.

---

# Error State

Title

Unable to load notification settings.

Button

Retry

---

# Validation

Rules

- At least one notification channel must be enabled.
- Every enabled rule must have at least one recipient.
- Escalation intervals cannot overlap.
- Duplicate rules are not allowed.

---

# Responsive Behavior

Desktop

- Two-panel layout
- Sticky category navigation
- Scrollable configuration panel

iPad Browser

- Navigation becomes collapsible.
- Configuration cards stack vertically.

---

# Accessibility

- WCAG AA
- Keyboard navigation
- Screen reader support
- Focus indicators
- Accessible toggle switches
- Minimum 44px touch targets

---

# Visual Design Guidelines

Maintain consistency with all approved MQMS screens.

Design Language

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

- Microsoft Teams Integration
- Slack Integration
- SMS Notifications
- WhatsApp Notifications
- Mobile Push Notifications
- Custom Notification Templates
- Rule Builder with Conditions
- Quiet Hours
- Time Zone Based Notifications
- AI-Based Smart Notification Recommendations