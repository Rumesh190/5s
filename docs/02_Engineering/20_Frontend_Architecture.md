
# MQMS Frontend Architecture

Version: 1.0

Status: Approved

---

# Purpose

This document defines the frontend architecture for the Manufacturing Quality Management System (MQMS).

It provides standards for project structure, routing, feature organization, state management, services, reusable components, and development practices.

Every frontend developer and AI coding assistant must follow this architecture.

---

# Technology Stack

## Framework

Next.js 15+

App Router

---

## Language

TypeScript

Strict Mode Enabled

---

## Styling

Tailwind CSS

shadcn/ui

---

## Forms

React Hook Form

Zod

---

## Data Fetching

TanStack Query

---

## Charts

Recharts

---

## Authentication

Supabase Auth

---

## Database

Supabase PostgreSQL

---

# Architecture Philosophy

MQMS follows a Feature-Based Architecture.

Each business feature owns its components, hooks, services, validation, and types.

Shared functionality belongs in shared folders.

Goals

- Scalability
- Maintainability
- Reusability
- Clear ownership
- Minimal coupling

---

# Folder Structure

```text
src/

├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── providers/
├── services/
├── types/
├── utils/
├── constants/
├── styles/
└── middleware/
```

---

# App Directory

Responsible for routing.

```text
app/

layout.tsx

page.tsx

login/

dashboard/

audits/

reports/

administration/

profile/

api/
```

Each route should remain lightweight.

Business logic belongs inside features.

---

# Features Directory

Every business module lives inside features.

```text
features/

dashboard/

audits/

investigation/

reports/

administration/

users/

roles/

notifications/

profile/
```

Each feature owns everything related to itself.

---

Example

```text
features/

audits/

components/

hooks/

services/

types/

validation/

constants/

index.ts
```

---

# Shared Components

Reusable UI components.

```text
components/

layout/

navigation/

forms/

tables/

cards/

charts/

feedback/

dialogs/

drawers/

icons/
```

Examples

Button

Card

DataTable

PageHeader

StatusBadge

SearchInput

---

# Providers

Application-wide providers.

```text
providers/

query-provider.tsx

theme-provider.tsx

auth-provider.tsx
```

---

# Services

Shared services.

```text
services/

supabase.ts

api-client.ts

storage.ts

logger.ts
```

Business services belong inside features.

Example

```text
features/audits/services/audit-service.ts
```

---

# Hooks

Reusable hooks.

```text
hooks/

use-debounce.ts

use-local-storage.ts

use-media-query.ts

use-pagination.ts
```

Feature-specific hooks remain inside their feature folder.

---

# Types

Shared TypeScript interfaces.

```text
types/

api.ts

auth.ts

common.ts

audit.ts

user.ts
```

---

# Utilities

Helper functions.

```text
utils/

format-date.ts

format-number.ts

download-file.ts

validators.ts
```

Utilities must remain pure.

---

# Constants

Application constants.

```text
constants/

routes.ts

roles.ts

status.ts

permissions.ts

theme.ts
```

---

# Styling

```text
styles/

globals.css

tailwind.css
```

Avoid page-specific CSS.

Always use Tailwind utilities.

---

# Routing Structure

```text
/

login

/dashboard

/audits

/audits/create

/audits/[id]

/reports

/administration

/administration/users

/administration/roles

/administration/notifications

/profile
```

Use nested routing wherever appropriate.

---

# Component Hierarchy

Application

↓

Layout

↓

Feature Page

↓

Feature Components

↓

Shared Components

Example

Dashboard Page

↓

Dashboard KPI Cards

↓

KPI Card Component

↓

Button Component

---

# State Management

Server State

TanStack Query

Client State

React Context

Component State

useState

Form State

React Hook Form

Avoid unnecessary global state.

---

# Data Flow

```text
Page

↓

Feature Component

↓

Service

↓

Supabase

↓

Database
```

UI components should never communicate directly with Supabase.

---

# API Layer

Every feature owns its API service.

Example

```text
features/reports/services/report-service.ts
```

Responsibilities

- Fetch Data
- Update Data
- Delete Data
- Error Handling

---

# Validation

Validation belongs inside each feature.

```text
features/

audits/

validation/

create-audit-schema.ts
```

Always use Zod.

---

# Authentication Flow

Login

↓

Supabase Auth

↓

Session

↓

Protected Route

↓

Application

Unauthorized users redirect to Login.

---

# Error Handling

Every page should support

- Loading
- Error
- Empty
- Success

Never expose backend errors directly.

---

# File Naming

Pages

dashboard-page.tsx

Components

audit-card.tsx

Hooks

use-audit.ts

Services

audit-service.ts

Schemas

create-audit-schema.ts

---

# Import Rules

Prefer absolute imports.

Example

```ts
import { Button } from "@/components/forms/button";
```

Avoid long relative paths.

---

# Environment Variables

Use

```text
.env.local
```

Examples

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

Never commit secrets.

---

# Performance

Use

- Lazy Loading
- Dynamic Imports
- Memoization
- Image Optimization
- Code Splitting

Avoid unnecessary renders.

---

# Accessibility

Every page must support

- Keyboard Navigation
- Focus Indicators
- Screen Readers
- Semantic HTML
- WCAG AA

---

# Logging

Development

Console logging allowed.

Production

Structured logging only.

---

# Testing Structure

```text
tests/

unit/

integration/

e2e/
```

Recommended

Vitest

Playwright

---

# Build Pipeline

Developer

↓

Git

↓

GitHub

↓

Vercel

↓

Production

---

# Coding Standards

- Strict TypeScript
- No `any`
- Prefer interfaces
- Keep functions small
- Reuse components
- Avoid duplicate logic
- Follow the Design System
- Follow the Component Library

---

# AI Development Rules

Every AI-generated feature must

- Follow this architecture
- Use shared components
- Follow feature-based structure
- Use TypeScript
- Use Tailwind CSS
- Use shadcn/ui
- Use React Hook Form
- Use Zod
- Use TanStack Query
- Be accessible
- Be responsive

Do not generate files outside this structure.

---

# Definition of Done

A frontend feature is complete only if

✓ Matches approved design

✓ Uses shared components

✓ Responsive

✓ Accessible

✓ Type-safe

✓ Validation complete

✓ Error handling complete

✓ Loading state implemented

✓ Empty state implemented

✓ Integrated with services

✓ Ready for production

---

# Future Enhancements

- Internationalization (i18n)
- Offline Support
- PWA
- Dark Mode
- Feature Flags
- Analytics Integration
- Real-time Updates
- AI Assistant Integration