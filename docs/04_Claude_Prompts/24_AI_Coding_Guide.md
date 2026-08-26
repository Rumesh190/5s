
# MQMS AI Coding Guide

Version: 1.0

Status: Approved

---

# Purpose

This document defines how AI coding assistants should develop the Manufacturing Quality Management System (MQMS).

It serves as the operating manual for AI-assisted software development.

Every AI coding session must follow the standards defined in this guide.

Supported AI Tools

- Claude Code
- Claude Design
- Cursor
- ChatGPT
- Gemini CLI
- GitHub Copilot

---

# AI Development Philosophy

The objective is to produce production-ready software.

AI should never generate demonstration code, placeholder architecture, or temporary implementations unless explicitly requested.

Every generated feature should be modular, reusable, type-safe, documented, and ready for deployment.

---

# AI Context Priority

Before generating any code, AI must read the project documentation in the following order.

Priority 1 (Always Required)

1. 18_Development_Guide.md
2. 04_Design_System.md
3. 19_Component_Library.md
4. 20_Frontend_Architecture.md

Priority 2 (Feature Context)

Relevant feature specification

Examples

05_Dashboard.md

06_Audit_List.md

07_Create_Audit.md

Priority 3 (Visual Context)

Corresponding Claude Design

Priority 4

21_API_Contracts.md

22_Database_Schema.md

---

# AI Responsibilities

AI must

- Understand the business requirement.
- Follow the approved design.
- Follow the Design System.
- Reuse existing components.
- Follow project architecture.
- Respect API contracts.
- Respect database schema.
- Generate maintainable code.

AI should never redesign approved workflows.

---

# Code Generation Workflow

Every feature should be generated using the following process.

Step 1

Read documentation.

↓

Step 2

Understand business logic.

↓

Step 3

Review design.

↓

Step 4

Identify reusable components.

↓

Step 5

Generate feature.

↓

Step 6

Validate output.

↓

Step 7

Refactor if required.

↓

Step 8

Return production-ready code.

---

# Output Quality Rules

Every generated feature must include

- TypeScript
- Responsive Layout
- Accessibility
- Loading States
- Empty States
- Error Handling
- Validation
- Comments where appropriate
- Clean folder structure

Never omit these requirements.

---

# Project Folder Structure

AI must always generate files inside the approved project architecture.

Example

src/

app/

components/

features/

services/

hooks/

types/

utils/

providers/

lib/

No files should be created outside the approved structure.

---

# Component Reuse Rules

Before creating a component

AI must check

- Does a shared component already exist?
- Can the component be extended?
- Can composition be used?

Avoid duplicate implementations.

Always prefer reusable components.

---

# Design Rules

AI must never invent new UI patterns.

Use

- Existing Buttons
- Existing Cards
- Existing Inputs
- Existing Tables
- Existing Dialogs
- Existing Drawers

Spacing

Typography

Colors

Icons

must always follow the approved Design System.

---

# Business Logic Rules

Business rules belong inside

Feature Services

Validation Schemas

Utility Functions

Never place business logic inside UI components.

---

# Data Layer Rules

UI Components

↓

Hooks

↓

Services

↓

Supabase

↓

Database

Components should never communicate directly with Supabase.

---

# State Management Rules

Server State

TanStack Query

Forms

React Hook Form

Validation

Zod

Local UI State

useState

Shared State

React Context

Avoid unnecessary global state.

---

# API Rules

Always follow

21_API_Contracts.md

Never invent request payloads.

Never invent response structures.

If an API contract is missing

Pause and request clarification.

---

# Database Rules

Always follow

22_Database_Schema.md

Never invent

- Tables
- Columns
- Relationships
- Enums

Use the documented schema only.

---

# Naming Rules

Files

kebab-case

Components

PascalCase

Variables

camelCase

Constants

UPPER_CASE

Hooks

useExample

Services

example-service.ts

---

# Error Handling

Every feature must include

Loading State

Error State

Empty State

Retry Action

Validation Messages

Toast Notifications

No silent failures.

---

# Forms

Every form must use

React Hook Form

+

Zod

Display inline validation.

Support keyboard navigation.

---

# Tables

Every table should support

Search

Sorting

Pagination

Filters

Loading

Empty State

Responsive scrolling

Reuse the shared DataTable component.

---

# Accessibility

Target

WCAG AA

Support

Keyboard Navigation

Focus Indicators

ARIA Labels

Semantic HTML

Screen Readers

---

# Performance Rules

Lazy load heavy modules.

Avoid unnecessary re-renders.

Memoize expensive calculations.

Use code splitting.

Optimize images.

---

# Security Rules

Never expose secrets.

Never hardcode credentials.

Validate user input.

Respect role permissions.

Escape user-generated content.

Use Supabase Row Level Security.

---

# Testing Expectations

Every generated feature should be testable.

Structure code to support

Unit Testing

Integration Testing

End-to-End Testing

Avoid tightly coupled implementations.

---

# Documentation Rules

If a feature introduces

- New Component
- New API
- New Database Table
- New Shared Utility

AI must recommend updating the relevant documentation.

Documentation should remain synchronized with implementation.

---

# Code Review Checklist

Before returning code, AI must verify

✓ Uses shared components

✓ Matches approved design

✓ Responsive

✓ Accessible

✓ Type-safe

✓ No duplicated logic

✓ Uses approved folder structure

✓ Uses approved naming conventions

✓ Handles loading

✓ Handles errors

✓ Handles empty states

✓ Uses proper validation

✓ Ready for production

---

# AI Collaboration Rules

Claude Design

Responsible for

- UI
- UX
- Layout
- Interaction

Claude Code / Cursor

Responsible for

- Implementation
- Architecture
- Business Logic
- Refactoring

ChatGPT

Responsible for

- Product Planning
- Documentation
- Architecture
- Code Reviews
- Debugging
- Technical Decisions

Each AI should perform the role it is best suited for.

---

# Prompt Template

Every development prompt should include

1. Objective
2. Relevant Documentation
3. Relevant Claude Design
4. Expected Deliverables
5. Constraints
6. Definition of Done

Example

Objective

Build the Dashboard feature.

Documentation

- 18_Development_Guide.md
- 04_Design_System.md
- 19_Component_Library.md
- 20_Frontend_Architecture.md
- 05_Dashboard.md
- 21_API_Contracts.md
- 22_Database_Schema.md

Visual Reference

Dashboard Claude Design

Deliverables

- Feature Module
- Components
- Hooks
- Services
- Types
- Validation
- Unit-ready code

---

# Definition of AI Success

AI development is considered successful when

✓ The generated code matches the approved design.

✓ Business rules are correctly implemented.

✓ Shared components are reused.

✓ Code follows project architecture.

✓ Documentation remains valid.

✓ Minimal manual refactoring is required.

✓ Code is production-ready.

---

# Project Vision

MQMS is an enterprise-grade Manufacturing Quality Management System.

Every implementation decision should support

- Scalability
- Maintainability
- Performance
- Accessibility
- Reusability
- Professional User Experience

AI should always optimize for long-term maintainability over short-term convenience.