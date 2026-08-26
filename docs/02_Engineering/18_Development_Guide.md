
# MQMS Development Guide

Version: 1.0

Status: Approved

---

# Purpose

This document defines the engineering standards, architecture, coding guidelines, and development principles for the Manufacturing Quality Management System (MQMS).

Every AI coding assistant (Claude Code, Cursor, ChatGPT, Gemini CLI) and every developer working on this project must follow this guide.

This document is the single source of truth for application development.

---

# Technology Stack

## Frontend

- Next.js 15+ (App Router)
- React 19+
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Table
- TanStack Query
- Recharts
- Lucide React Icons

---

## Backend

- Supabase

Modules

- Authentication
- PostgreSQL Database
- Storage
- Row Level Security
- Realtime (Future)

---

## Deployment

- Vercel

---

# Architecture Principles

The application follows Feature-Based Architecture.

Features must remain independent.

Every feature owns:

- Pages
- Components
- Hooks
- Services
- Types
- Validation

Shared components belong in the shared components directory.

---

# Folder Structure

```text
src/

app/

components/

features/

hooks/

lib/

services/

types/

utils/

styles/

constants/
```

---

## Features Structure

Example

```text
features/

dashboard/

components/

hooks/

services/

types/

dashboard-page.tsx

dashboard-schema.ts

dashboard-api.ts
```

Every feature should follow this structure.

---

# Naming Conventions

## Files

Use kebab-case.

Examples

create-audit-form.tsx

audit-details-card.tsx

notification-settings.tsx

---

## Components

Use PascalCase.

Example

AuditCard

DashboardHeader

CreateAuditForm

NotificationPanel

---

## Variables

Use camelCase.

Example

auditStatus

selectedPlant

currentUser

---

## Constants

Use UPPER_CASE.

Example

MAX_FILE_SIZE

DEFAULT_PAGE_SIZE

SUPPORTED_FILE_TYPES

---

# Component Principles

Components must follow the Single Responsibility Principle.

Each component should perform one task only.

Avoid components larger than approximately 300 lines.

Split large components into smaller reusable components.

---

# UI Library

Use shadcn/ui wherever possible.

Approved Components

- Button
- Card
- Input
- Select
- Dialog
- Drawer
- Sheet
- Table
- Badge
- Tabs
- Accordion
- Tooltip
- Popover
- Toast
- Alert Dialog

Avoid creating custom components if an equivalent exists.

---

# Styling Standards

Use Tailwind CSS only.

Avoid custom CSS whenever possible.

Do not use inline styles.

Use utility classes.

Maintain consistent spacing.

Spacing Scale

- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64

Use rounded corners consistently.

Shadow usage should remain subtle.

---

# Typography

Use one font family throughout the application.

Typography hierarchy

Page Title

Section Title

Card Title

Body

Caption

Do not hardcode font sizes.

Use Tailwind typography utilities.

---

# Color Guidelines

Primary

Blue

Success

Green

Warning

Orange

Error

Red

Neutral

Gray

Colors must be centralized using Tailwind theme tokens.

Never hardcode hex values inside components.

---

# Icons

Use Lucide React Icons only.

Keep icon sizes consistent.

16px

20px

24px

Avoid mixing icon libraries.

---

# Forms

All forms must use

React Hook Form

+

Zod Validation

Validation should occur

- Client Side
- Server Side

Display inline validation errors.

Never use browser default validation.

---

# Tables

Use TanStack Table.

Tables must support

- Search
- Sorting
- Filtering
- Pagination
- Empty State
- Loading State

Sticky headers preferred.

---

# Charts

Use Recharts.

Approved Charts

- Line Chart
- Bar Chart
- Donut Chart
- Pie Chart
- Area Chart

Charts should be responsive.

---

# State Management

Server State

TanStack Query

Client State

React Context

Local State

useState

Avoid unnecessary global state.

---

# API Layer

Never call Supabase directly from UI components.

Always use

services/

Example

features/audits/services/audit-service.ts

Components communicate only with services.

---

# Authentication

Use Supabase Authentication.

Protected routes

Dashboard

Audits

Reports

Administration

Profile

Unauthenticated users should always redirect to Login.

---

# Error Handling

Display user-friendly error messages.

Never expose raw backend errors.

Log unexpected errors.

Provide retry actions where appropriate.

---

# Loading States

Every page must have

- Skeleton Loader
- Button Loading State
- Table Loading State

Never display blank pages.

---

# Empty States

Every table and list must support

No Data

No Search Results

First-Time User

Empty states should include

- Illustration
- Title
- Description
- Primary Action

---

# Notifications

Use Toast notifications.

Examples

Success

Error

Warning

Information

Do not use browser alerts.

---

# Accessibility

Target WCAG AA.

Support

- Keyboard navigation
- Focus indicators
- Screen readers
- Semantic HTML
- Accessible forms
- Accessible tables

---

# Performance

Lazy load heavy modules.

Use dynamic imports where appropriate.

Optimize images.

Avoid unnecessary re-renders.

Memoize expensive calculations.

---

# Security

Never expose secrets.

Use environment variables.

Validate all user input.

Use Row Level Security in Supabase.

Protect API routes.

Escape user-generated content.

---

# Code Quality

TypeScript Strict Mode enabled.

No use of "any".

Prefer interfaces for object shapes.

Functions should remain focused and reusable.

Avoid duplicate logic.

Extract reusable utilities.

---

# Logging

Development

Console logging allowed.

Production

Use structured logging.

Never leave debug logs in production.

---

# Testing Strategy

Unit Tests

Component Tests

Integration Tests

End-to-End Tests

Future

Playwright

Vitest

---

# Git Workflow

Main Branch

Production

Develop Branch

Integration

Feature Branches

feature/dashboard

feature/create-audit

feature/reports

Use Pull Requests.

Squash merge before merging into develop.

---

# Commit Convention

Examples

feat: add dashboard KPI cards

fix: resolve audit filtering issue

refactor: split audit table component

docs: update API contract

style: improve spacing

---

# Code Review Checklist

Before merging

- Builds successfully
- No TypeScript errors
- No ESLint warnings
- Responsive
- Accessible
- Reusable
- No duplicate code
- Uses shared components
- Matches design specifications

---

# AI Development Rules

Every AI-generated code must

- Follow this Development Guide
- Reuse existing components
- Follow folder structure
- Follow naming conventions
- Use TypeScript
- Use Tailwind CSS
- Use shadcn/ui
- Use React Hook Form
- Use Zod
- Be responsive
- Be accessible
- Avoid code duplication
- Keep components modular
- Follow feature-based architecture

Never generate placeholder architecture.

Always produce production-ready code.

---

# Definition of Done

A feature is complete only if

✓ UI matches approved design

✓ Responsive

✓ Accessible

✓ Connected to services

✓ Type-safe

✓ Validation implemented

✓ Error handling complete

✓ Loading state implemented

✓ Empty state implemented

✓ Documentation updated

✓ Ready for production

---

# Project Vision

MQMS is designed as a modern enterprise SaaS platform for manufacturing quality management.

The application should prioritize:

- Simplicity
- Scalability
- Performance
- Accessibility
- Maintainability
- Reusability
- Professional user experience

Every implementation decision should support these principles.