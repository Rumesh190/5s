

# Design System

**Project:** Manufacturing Quality Management System (MQMS)

Version: 1.0

Status: Draft

---

# Purpose

This document defines the visual language, reusable components, spacing, typography, colors, and interaction patterns used throughout the application.

The objective is to ensure every screen feels like part of the same product.

---

# Design Philosophy

The interface should feel:

• Modern

• Clean

• Professional

• Enterprise-ready

• Minimal

• Functional

The design should reduce cognitive load and allow users to complete tasks quickly.

---

# Inspiration

Visual direction should take inspiration from:

- Linear
- Notion
- Atlassian Jira
- Monday.com
- Stripe Dashboard
- GitHub

Avoid:

- Heavy SAP-style interfaces
- Dense forms
- Bright gradients
- Decorative graphics
- Excessive animations

---

# Layout

Desktop-first

Responsive for iPad browser

Maximum content width

1440px

Content padding

32px

Card spacing

24px

Section spacing

32px

Grid

12-column responsive grid

---

# Border Radius

Cards

12px

Buttons

10px

Inputs

10px

Dialogs

16px

Tables

8px

---

# Elevation

Use subtle shadows only.

Avoid heavy floating effects.

Cards should feel lightweight.

---

# Typography

Primary Font

Inter

Fallback

System UI

Font Scale

Page Title

32px

Section Heading

24px

Card Heading

18px

Body

14–16px

Caption

12px

---

# Color Palette

Primary

Blue

Used for:

- Primary buttons
- Active navigation
- Links

Success

Green

Used for:

- Completed actions
- Success states

Warning

Amber

Used for:

- Pending review
- Upcoming due dates

Danger

Red

Used for:

- Overdue
- Errors
- Critical severity

Neutral

Gray

Used for:

- Backgrounds
- Borders
- Secondary text

---

# Buttons

Primary

Filled

Used for primary actions.

Examples

Create Audit

Save

Submit

---

Secondary

Outlined

Examples

Cancel

Back

Edit

---

Tertiary

Text only

Examples

View Details

Download

Learn More

---

# Inputs

Standard Input

Textarea

Dropdown

Date Picker

Search

File Upload

Checkbox

Radio Button

Toggle

---

# Tables

Every data table should support:

- Sorting
- Search
- Filters
- Pagination
- Row selection

Tables should remain clean and readable.

---

# Cards

Used for:

- Dashboard KPIs
- Summary information
- Quick actions

Cards should never contain excessive information.

---

# Status Badges

Standardized badge styles.

Statuses include:

Draft

Open

In Progress

Pending Review

Closed

Overdue

Completed

Cancelled

---

# Forms

Split long forms into logical sections.

Avoid more than 8–10 visible fields per section.

Group related information together.

Required fields should be clearly indicated.

---

# Navigation

Sidebar

Collapsed state supported

Persistent across pages

Header

Page title

Breadcrumbs

Notifications

Profile Menu

---

# Icons

Use a single icon library throughout the application.

Recommended

Lucide Icons

Icons should support recognition, not decoration.

---

# Empty States

Every screen should include:

Meaningful illustration or icon

Short explanation

Primary action

Example

"No audits found."

Button

Create Audit

---

# Loading States

Use skeleton loaders.

Avoid full-page spinners whenever possible.

---

# Error States

Provide:

Clear explanation

Suggested action

Retry where applicable

---

# Notifications

Use toast notifications for:

Save Success

Delete Success

Assignment Complete

Error Messages

Avoid modal dialogs for simple confirmations.

---

# Modals

Use only when necessary.

Examples

Delete Confirmation

Discard Changes

Assign User

---

# Accessibility

Minimum contrast ratio

WCAG AA

Keyboard navigation supported

Visible focus states

Clear error messaging

Readable font sizes

---

# Responsive Behaviour

Desktop

Primary experience

iPad

Optimized for touch

Navigation remains sidebar-based

Large touch targets

No mobile-specific layouts in MVP

---

# Reusable Components

Buttons

Cards

Tables

Badges

Inputs

Dropdowns

Dialogs

Sidebar

Header

Tabs

Timeline

File Upload

Search

Filter

Pagination

Stepper

Toast

Avatar

Status Chip

Progress Indicator

Breadcrumb
