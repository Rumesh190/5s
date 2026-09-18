<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This project uses Next.js 16.3.0. Before changing framework-sensitive code, read the relevant guide under `node_modules/next/dist/docs/`. APIs and conventions may differ from older Next.js versions.

<!-- END:nextjs-agent-rules -->

# 5S Product — AI Engineering Guide

## 1. Product

Standalone 5S workplace-management application for garment/apparel manufacturing. It covers audits, non-conformances, corrective actions, Red Tags, continuous improvements, dashboards, evidence, notifications, administration, and reports.

## 2. Current Stage

- Frontend MVP, demo-ready.
- No backend, database, object storage, or real identity provider is connected.
- Workflow authorization and persistence are browser-side, not production security boundaries.
- Preserve approved behavior; do not redesign or start backend work without an explicit requirement.

## 3. Stack

- Next.js `16.3.0`, React/React DOM `19.2.8`, TypeScript `^5`.
- Tailwind CSS `^4`, shadcn `^4.16.1`, Base UI `^1.7.0`.
- React Hook Form `^7.84.0`, Zod `^4.4.3`.
- Recharts `^3.10.1`, Lucide React `^1.28.0`.
- Vitest `^4.1.11`, ESLint `^9`.

## 4. Commands

```bash
npm install
npm run dev
npm test
npx tsc --noEmit
npm run lint
npm run build
npm start
```

Run targeted tests during development, then full checks before handoff.

## 5. Important Routes

- `/5s` — Dashboard.
- `/5s/audits` and compatibility route `/5s/listing` — audits.
- `/5s/audits/[auditId]/report` — audit report.
- `/5s/actions`, `/5s/actions/[actionId]`, `/5s/actions/[actionId]/report`.
- `/5s/red`, `/5s/red/create`, `/5s/red/[tagId]`, `/5s/red/[tagId]/print`.
- `/5s/continuous-improvement` plus `/new`, `/[improvementId]`, and `/report`.
- `/5s/reports` — report library and sharing.
- `/administration/users` — local demo administration.
- `/5s/audits/configuration` — Admin-only 5S question configuration; the old Settings URL redirects here.
- `/profile` — placeholder profile screen.

## 6. Architecture

- `app/`: thin App Router entries and global print/theme CSS.
- `features/five-s/`: product UI and feature-local types/data.
- `lib/five-s/`: audit persistence and reusable domain rules.
- `lib/actions/action-store.ts`: canonical corrective-action store/state machine.
- `lib/browser-storage.ts`: browser-persistence boundary and demo reset.
- `components/`: shared shell, auth, preferences, and UI primitives.
- `tests/`: business-rule and characterization coverage.
- `public/5s/references/garment/`: 39 reference images.
- `public/branding/iq-logo.png`: official report logo; do not alter.
- `docs/`: human/product/backend handover context.

Avoid broad folder moves. Prefer small modules and existing `@/` aliases.

## 7. Canonical Data Sources

- Audit type/template/store: `features/five-s/types/five-s.ts`, `features/five-s/data/five-s-data.ts`, `lib/five-s/audit-store.ts`.
- Active question definitions: `features/five-s/question-configuration/{types,data,store}.ts`; the default seed is the canonical 39-question template.
- Corrective Action type/fixtures/store: `features/five-s/types/my-actions.ts`, `features/five-s/data/my-actions-data.ts`, `lib/actions/action-store.ts`.
- Zones, leaders, members, priorities: `lib/five-s/configuration.ts`.
- Red Tag: `features/five-s/red-tag/{types,store,data}.ts`.
- Continuous Improvement: `features/five-s/continuous-improvement/{types,store,data}.ts`.
- Admin users/roles: `features/five-s/administration/`.
- Demo personas: `lib/current-user.ts`.
- Notifications: `lib/notifications/notification-store.ts`.

There is one corrective-action model: `MyAction`. Do not reintroduce `FiveSAction` or another action store.

## 8. Persistence

- Operational state uses module snapshots and `localStorage` behind stores.
- New feature UI must not access `localStorage` for domain data. Use a store/service and `lib/browser-storage.ts`.
- Evidence/signatures are compressed data URLs; public demo images use paths.
- Stores normalize legacy records defensively. Preserve compatibility as types evolve.
- Replaceable boundary: UI → feature store/service → browser storage today; API repository later.

Demo reset utility:

```ts
import { resetStandaloneFiveSDemo } from "@/lib/browser-storage";
resetStandaloneFiveSDemo(); // clears domain keys and reloads
```

Do not expose it as a prominent production-looking button.

## 9. Roles

- Auditor: creates/executes audits, records NCs, authors Proposed Actions, verifies and signs audits.
- Zone Leader: edits Action Plans, assigns members, reviews/reworks/closes Actions and Red Tags.
- Zone Member: executes assigned work and supplies evidence/comments.
- Admin: manages local demo users and permissions.

Use stable IDs where available; names are display values and legacy fallbacks.

### MVP session policy

- Authentication sessions are runtime/in-memory only; refresh or reload requires login.
- Ten continuous minutes in a hidden tab expires the session, using timestamps and the Page Visibility API.
- Ten minutes without meaningful interaction in a visible tab also expires the session; warn approximately one minute before this active-inactivity timeout.
- Logout and session expiry clear authentication state only. Persisted domain records and UI preferences remain intact.
- Protected routes require an active session in addition to their existing role authorization.
- This is frontend MVP behavior and must later be replaced by secure server-backed authentication and session management.

## 10. Critical Business Rules

- **AUDITOR DOES NOT REVIEW OR CLOSE CORRECTIVE ACTIONS.**
- **ZONE LEADER REVIEWS AND CLOSES CORRECTIVE ACTIONS.**
- Audit completion and corrective-action completion are independent.
- Proposed Action and final Action Plan are distinct.
- Do not duplicate Actions for the same `sourceModule` + `sourceId`.

## 11. Audit Lifecycle

- Persisted: `Draft`, `In Progress`, `Completed`; Review is a derived UI stage.
- The default template has 39 questions (7 Sort, 9 Set in Order, 8 Shine, 7 Standardize, 8 Sustain).
- 5S sections are system-defined and immutable. Only Admin can manage questions inside those sections.
- Admin may add, edit, deactivate/delete and reorder questions.
- 5S Question Configuration belongs to the Audit module. Admin accesses it from the Audit header through the Audit Configuration action beside Refresh; it is not a general Settings feature.
- Audit creation snapshots the active question configuration so later configuration changes never alter historical audits.
- One garment-industry GOOD PRACTICE reference image per question.
- Audit Completion Date uses legacy-compatible `dueDate` and defaults to local creation date.
- Auto-preview triggers only on incomplete → all-required-answered; never auto-submit.
- Final completion requires live Auditor photo and digital signature.

## 12. Corrective Action Lifecycle

`Awaiting Assignment → Assigned → In Progress → Awaiting Review → Rework Required or Completed`

- Auditor records finding and Proposed Action.
- Zone Leader edits final Action Plan and assigns a configured member.
- Responsible member starts, adds After evidence/resolution data, and submits.
- Zone Leader returns with a required remark or approves/closes.
- Canonical review status is `Awaiting Review`; legacy review names normalize at persistence boundaries.
- Before/finding and After/resolution evidence remain separate.
- After capture shows “Match the Before Photo” guidance and Before reference.
- Action Category supports the predefined list plus “Other”; Other requires a record-specific custom category, and displays/reports show that custom value without adding it to global options.

## 13. Red Tag Lifecycle

`Raised → In Progress → Awaiting Review → Rework Required or Closed`

- Zone Leader defines/reviews the Action Plan and directly selects the Responsible Zone Member, due date, priority, and instructions in the same operation.
- There is no separate assignment step after Responsible Zone Member selection; selecting the member is the assignment and immediately opens member execution.
- Zone Member executes, captures evidence, comments, and submits.
- Zone Leader returns or closes; Auditor is not the closer.
- Rework retains the same Responsible Zone Member and does not return to assignment.
- Closure requires plan, member, evidence, submission, and leader approval.
- Red Tags create/reuse one canonical Action using `sourceModule: "Red Tag"`, `sourceId`, and reverse `actionId`.

## 14. Dashboard Rules

- NC Summary and Before/After share Zone → responsible Zone Member filtering.
- Match members by `responsiblePersonId`, then legacy name fallback.
- NC export applies dashboard filters and explicit record selection; export only selected IDs.
- Some headline/trend presentation uses `MVP_DASHBOARD_DATA`; record tables use live stores.

## 15. Reports

- Shared header: `features/five-s/components/ReportHeader.tsx`.
- IQ logo stays top-left on Audit, Action, CI, Red Tag, and printable Before/After reports.
- Report sharing sends the generated PDF `File` through native Web Share where file sharing is supported. Unsupported environments download the same PDF; browser-local URLs are never presented as shareable report links.
- NC Summary is CSV-only; do not force image branding into CSV.
- Reports render live client data, not immutable snapshots.

## 16. Demo Data

- Audit fixtures: `features/five-s/data/five-s-data.ts`.
- Action fixtures: `features/five-s/data/my-actions-data.ts`.
- Dashboard fixtures: `features/five-s/data/mvp-dashboard-data.ts`.
- Red Tag/CI fixtures: each feature’s `data.ts`, separate from stores.
- Admin seeds derive from canonical zone configuration.
- Keep useful multi-status demo records; never bury fixtures in UI components.

## 17. Backend Migration Boundary

Replace stores incrementally behind existing operations: authentication; organization/users; evidence storage; Audit API; canonical Action API/state machine; Red Tag/CI APIs; notifications/reports/dashboard.

The backend must own authorization, IDs, timestamps, transitions, evidence access, concurrency, numbering, and notifications. Never trust browser-supplied actors or roles.

## 18. Coding Rules

- Inspect current implementation before editing.
- Reuse canonical models/stores/rules; avoid duplicates.
- Preserve legacy browser-data compatibility.
- Keep UI changes scoped; do not casually change approved workflows.
- Do not hardcode people when configuration exists.
- Use IDs for relationships and names only for display/fallback.
- New domain UI must not call `localStorage` directly.
- Store ISO timestamps; format at presentation time.
- Use `toLocalInputDate` for local calendar-date inputs.
- Preserve unrelated dirty-worktree changes.
- Run tests, TypeScript, lint, and build after meaningful work.

### Camera capture semantics

- Any user-facing “Take Photo”, “Capture Photo”, or “Retake” action must open/resume a real camera session; it must never open a generic file or gallery picker.
- Operational workplace evidence prefers the rear camera with `facingMode: { ideal: "environment" }`. Final auditor verification prefers the front camera with `facingMode: { ideal: "user" }`.
- If a workflow intentionally supports existing files, keep that as a separate, explicitly labelled Upload action.
- Reuse the shared operational camera dialog where its capture/review flow fits. Preserve specialized Before/After comparison and auditor-verification experiences.
- Every live-camera flow must show initialization and actionable error states, prevent duplicate streams, support capture/retake/use as applicable, and stop every media track on close, cancel, acceptance, replacement, navigation, and unmount.

### Browser evidence storage

- Never persist unbounded, full-resolution photo/evidence base64 payloads inside domain `localStorage` records. All newly captured photos must pass through the shared image-normalization layer first.
- Browser-storage failures must be propagated to the UI and must never be treated as successful domain writes; preserve the last valid in-memory and persisted state on failure.

## 19. AI Workflow

1. Read this file completely.
2. Read only relevant files.
3. Search targeted symbols before broad scans.
4. Reuse existing architecture.
5. Do not rediscover documented rules unless code contradicts this file.
6. If code conflicts with this file, report it before changing business behavior.
7. Keep changes scoped.
8. Run targeted tests first.
9. Run full tests/build before finishing when appropriate.
10. Update this file only when architecture or approved rules change.

## 20. Known Technical Debt

- Browser stores are synchronous module singletons, not async repositories.
- Identity, authorization, IDs, timestamps, numbering, and notifications remain client-authoritative.
- Data-URL evidence can exceed browser quota.
- Historic audit fixtures differ from the current 39-question template.
- `/5s/listing` is a compatibility alias.
- Dashboard mixes deterministic presentation fixtures with live record sections.
- Reports are browser-print views, not immutable server documents.
- Some date formatting/literal English remains feature-local.
- ESLint has expected `<img>` warnings for data URLs and print evidence.

## 21. Backend Readiness Checklist

- Preserve store operations while swapping persistence.
- Add authenticated IDs/server authorization first.
- Version templates and mutable records.
- Use atomic identifiers/sequences.
- Move evidence to authorized object storage.
- Enforce Action/Red Tag state machines server-side.
- Generate immutable history/notifications server-side.
- Define report snapshot, retention, and export policies.
- Retire fixtures only after API-backed demo/test seeds exist.
