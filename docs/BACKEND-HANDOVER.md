# 5S Backend Integration Handover

## Product status

The 5S frontend MVP is complete. It is a Next.js application whose operational workflows currently run in the browser:

- Domain data comes from fixtures, module-level in-memory stores, and `localStorage`.
- Authentication is demo-only (`admin` / `admin`) and persona selection is client-side.
- Uploaded evidence is currently represented by compressed base64 data URLs; demo and reference images use public asset paths.
- Audit, Action, Continuous Improvement, and Red Tag reports are rendered client-side and printed or saved through the browser.
- 45 Vitest characterization tests protect the current template, scoring, lifecycle, permission, route, date, and workflow behavior.

The backend integration must replace browser authority and persistence without rebuilding the working frontend.

## Main modules

| Module | Current purpose | Main routes |
|---|---|---|
| Dashboard | Audit/action KPIs, trends, non-compliance and before/after summaries | `/5s` |
| Audits | Create, execute, save, complete, sign, and report 5S audits | `/5s/audits`, `/5s/listing`, `/5s/audits/[auditId]/report` |
| Actions | Assign and close corrective actions raised from audit findings | `/5s/actions`, `/5s/actions/[actionId]`, `/5s/actions/[actionId]/report` |
| Continuous Improvement | Submit, review, implement, complete, and report improvements | `/5s/continuous-improvement` and nested create/detail/report routes |
| Red Tag | Create, view, print, and track printed Red Tags | `/5s/red` and nested create/detail/print routes |
| Reports | Search and present audit/action/CI results; browser print/PDF | `/5s/reports` and module report routes |
| Notifications | Recipient-filtered workflow notifications and read state | Shared header UI |

## Current architecture

```text
CURRENT

Frontend UI
    ↓
Client Stores
    ↓
localStorage / Fixtures

TARGET

Frontend UI
    ↓
Backend API
    ↓
Database + File Storage
```

## Integration principle

Do not rebuild or redesign the frontend. Integrate backend capability incrementally while preserving the current:

- UI and responsive behavior
- Routes and navigation
- User-visible workflows and lifecycle behavior
- Reports and evidence-upload experience
- Permissions from the user's perspective

Move authoritative authentication, authorization, validation, persistence, identifiers, timestamps, history, files, and notification generation to the backend.

## Primary integration points

| File | Current responsibility | What must become server-side |
|---|---|---|
| `lib/five-s/audit-store.ts` | Audit fixtures, memory/localStorage persistence, numbering, calculations, CRUD and completion | Durable audits/responses, numbering, validation, authorization, transitions, concurrency |
| `lib/actions/action-store.ts` | Actions, assignment/review transitions, history and notification triggers | Authoritative action state machine, actor checks, history, timestamps and notifications |
| `features/five-s/continuous-improvement/store.ts` | CI persistence, visibility, permissions and transitions | Durable proposals, authorization, workflow transitions, timeline and notifications |
| `features/five-s/red-tag/store.ts` | Red Tag numbering, creation and printed history | Durable records, atomic numbering, authorization and approved lifecycle operations |
| `lib/notifications/notification-store.ts` | Local notifications and read/unread state | Server-generated notifications, recipients and durable read state |
| `components/auth/auth-provider.tsx` | Demo credential check and local session flag | Real authentication and session lifecycle |
| `lib/current-user.ts` | Demo personas and client-selected identity | Authenticated current-user claims |
| `lib/five-s/configuration.ts` | Static zones, leaders, members, categories and due-date defaults | Authoritative organization/membership data and approved configurable policy |
| `lib/evidence-images.ts` | Browser file validation, compression and data URL generation | Durable upload acceptance, server validation, metadata and authorized access |

Client-side image preprocessing may remain as an upload optimization; it must not replace backend validation.

## Recommended backend sequence

1. Authentication and server sessions.
2. Users, plants, zones, leaders, and memberships.
3. File/evidence storage and authorized access.
4. Audit templates, audits, responses, signing, and completion.
5. Corrective Actions and their authoritative transitions.
6. Continuous Improvement workflow.
7. Current Red Tag create/view/print behavior; add lifecycle only after decisions are approved.
8. Server-generated notifications and read state.
9. Reports and dashboard queries/snapshots.
10. Remove production workflow dependency on fixtures and `localStorage` module by module.

## Testing

Run the existing safety checks with:

```bash
npm test
npx tsc --noEmit
npm run lint
```

There are currently 45 passing characterization tests. Backend integration must keep them passing unless an approved product decision intentionally changes the characterized behavior and its expected tests.

## Critical warning

Never trust the following values or decisions from the browser:

- Actor IDs or actor names
- Roles or permissions
- Zone leadership or membership
- Workflow status transitions
- Created, reviewed, submitted, or completed timestamps
- Audit numbering
- Red Tag numbering
- Notification recipients

The backend must derive or validate all of them from the authenticated user and authoritative records.
