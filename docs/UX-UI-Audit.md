# UX / UI Audit Report — 5S Operational Excellence Application

**Prepared by:** Principal Product Designer / UX Auditor  
**Application:** Standalone 5S Workplace Management SaaS  
**Audit date:** 2026-09-17  
**Codebase branch:** main (frontend MVP, demo-ready)  
**Scope:** All major screens, workflows, components, and design system elements  
**Source of truth:** AGENTS.md + code inspection of `features/`, `components/`, `app/`, `lib/`

---

## 1. Executive Summary

The 5S application is a well-structured frontend MVP that covers a sophisticated operational workflow — audits, corrective actions, Red Tags, continuous improvement, dashboards, and evidence management. The codebase is architecturally sound, uses a consistent component library (shadcn / Base UI / Tailwind v4), and has clearly defined role-based flows.

For a demo-ready product, the foundation is strong. The page header pattern is consistent, the audit lifecycle timeline is clear, the reference guide modal is thoughtfully built, and the corrective-action state machine is correctly modelled in the UI.

However, several significant UX issues reduce the perceived maturity of the product and could impede real-world usability:

- **Navigation hierarchy** is split across two separate systems (sidebar + top product nav) with no shared state, and the mobile experience loses important modules.
- **The Dashboard** mixes silent static demo data with live records without any transparency to the user, has an inconsistent KPI grid layout, and buries the zone-member filter behind a tab change.
- **Audit execution** contains grammatically incorrect score labels that will read poorly in a client demo.
- **Several design-system inconsistencies** — raw `<input>` elements alongside styled components, inconsistent button heights, 1480px-minimum table widths — undermine the premium SaaS feel.
- **Microcopy** contains several unclear or grammatically incorrect labels.

Total findings: **48**  
P0: **2** | P1: **9** | P2: **22** | P3: **15**

---

## 2. Product UX Assessment

The application succeeds in:
- Correctly modelling the 5S audit and corrective-action lifecycles
- Providing role-appropriate views (Auditor vs Zone Leader vs Zone Member)
- Offering branded, printable reports with IQ logo
- Implementing a live camera + signature verification step
- Providing a reference guide with full-screen image viewer per question

The application needs improvement in:
- Consistent design-system token usage (especially form controls and buttons)
- Navigation clarity and discoverability for all role/module combinations
- Dashboard information hierarchy and data transparency
- Mobile-first touchpoints for audit execution and evidence capture
- Microcopy accuracy and terminology consistency
- Empty-state and loading-state completeness

---

## 3. Information Architecture

### 3.1 Navigation items

**Route coverage (from `lib/navigation.ts`):**

| Label | Route | Notes |
|---|---|---|
| Dashboard | `/5s` | Primary landing |
| Audits | `/5s/audits` | Audit list + execution |
| Actions | `/5s/actions` | Corrective action list + detail |
| Reports | `/5s/reports` | Report library |
| Continuous Improvement | `/5s/continuous-improvement` | CI module |
| Red Tag | `/5s/red` | Red Tag list + lifecycle |
| Administration | `/administration/users` | Users & Access |
| Profile | `/profile` | User profile |

**Key observation:** Administration is not listed in the shared `MAIN_NAV` sidebar children — it is only visible to users with the `administration.view` permission via a different entry point. This is architecturally correct but means the route is not consistently surfaced.

### 3.2 IA problems

**UX-001 — P1 — Missing breadcrumb / location context**  
Every screen uses a page-level `FiveSPageHeader` eyebrow label ("5S Workspace", "Administration") but there is no breadcrumb trail. Users inside an Action Detail or Audit Report cannot see their current position in the hierarchy without reading the URL. For factory-floor users unfamiliar with the application, this is a discoverability problem.

**UX-002 — P2 — "Continuous Improvement" label is too long for the navigation**  
In the collapsible sidebar, this label truncates when the sidebar is expanded at its minimum width. The ProductNav (top bar) shows only the first 4 items by default, and "Continuous Improvement" and "Red Tag" fall into the overflow "More" dropdown on many viewports. These are not secondary features — Red Tag in particular is an operationally critical workflow.

**UX-003 — P2 — Audit Configuration discoverability**  
Per AGENTS.md, Admin accesses 5S Question Configuration from the Audit header through an "Audit Configuration" action. This is a non-obvious entry point. An Admin user returning to the application after onboarding may not know to look in the Audit list header for configuration.

**UX-004 — P3 — "5S Workspace" eyebrow is redundant**  
Every page header uses "5S Workspace" as the eyebrow. Because all pages are already within the 5S product, this adds no locating information. The eyebrow should reflect the module (e.g., "Audits", "Corrective Actions") to help users locate themselves.

---

## 4. Navigation

### 4.1 Desktop sidebar (`components/navigation/sidebar.tsx`)

The sidebar is a collapsible rail (248px expanded / 64px collapsed) hidden below `lg`. When collapsed, it shows icon-only links with tooltips. This is a well-implemented pattern.

**UX-005 — P2 — Sidebar collapse state is not persisted**  
The `sidebarCollapsed` state is React state in `AppShell` and is lost on navigation or page reload. A user who collapses the sidebar to gain working space will have it restored on every fresh load.

**UX-006 — P2 — Icon-only collapsed sidebar lacks active-state clarity**  
In the collapsed state, icons display tooltips on hover, but the active indicator (if any) relies entirely on color contrast against the sidebar background. There is no filled/solid icon state to distinguish active from inactive nav items at a glance.

### 4.2 Product Nav (top bar, `components/navigation/product-nav.tsx`)

This second navigation layer appears to target `md`/`lg` viewports (below the sidebar breakpoint) and uses a scroll-aware hide/show behavior. It renders up to 4 primary nav items with remaining items in a "More" dropdown.

**UX-007 — P1 — Two navigation systems create confusion**  
Below `lg`, the ProductNav (top horizontal bar) and mobile header coexist. Above `lg`, the sidebar is the navigation. Between `md` and `lg`, users see a horizontal product nav while the sidebar is hidden. This means navigation affordance changes based on viewport without clear visual handoff.

**UX-008 — P1 — "More" overflow hides critical modules**  
The ProductNav shows only `items.slice(0, 4)`. On a typical 1024px tablet, "Continuous Improvement" and "Red Tag" are hidden behind the overflow dropdown. Red Tags are operationally urgent; burying them in overflow reduces response speed.

### 4.3 Mobile header (`components/navigation/header.tsx`)

The mobile header is a compact sticky bar with the logo, notification bell, user menu, and a hamburger (mobile nav drawer). This is functionally minimal.

**UX-009 — P2 — Mobile navigation drawer not inspected — manual validation required**  
The `MobileNavDrawer` component was not read in this inspection. Its item order, close behavior, and role-based filtering should be validated on device.

---

## 5. Visual Hierarchy

### 5.1 Page headers

`FiveSPageHeader` is the consistent pattern:
- Eyebrow: `text-[11px] font-semibold uppercase tracking-[0.14em] text-primary`
- Title: `font-heading text-2xl font-semibold leading-tight tracking-[-0.025em]`
- Description: `text-sm leading-5 text-muted-foreground`
- Actions: flex-wrapped buttons

This is a well-designed and consistent pattern. No issues.

### 5.2 KPI cards (Dashboard)

**UX-010 — P2 — Dashboard KPI grid creates an orphaned row**  
The KPI cards render in a `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5` grid. Nine cards are rendered (5 audit + 4 action). On `lg+`, row 1 shows 5 audit KPIs and row 2 shows 4 action KPIs — an orphaned last row. There is no visual grouping or heading to distinguish "Audit metrics" from "Action metrics". A user cannot tell at a glance which numbers belong to which domain.

**UX-011 — P2 — KPI card minimum height is inconsistent**  
`DashboardKpi` uses `min-h-28 xl:min-h-0 xl:flex-1`. Below xl, cards are 112px tall with centered content. Above xl, they collapse to content height. This causes the audit-metrics row to look visually heavier than the action-metrics row at certain viewport widths.

### 5.3 Typography and spacing

The font scale is appropriate for an operational application. The `text-2xl` page title, `text-base` card titles, and `text-sm` body are reasonably sized. The `text-[11px]` uppercase tracking label is used correctly for metadata labels.

**UX-012 — P3 — "text-[11px]" used for column headings in large tables**  
The NC Summary table uses `text-[11px] uppercase tracking-wide text-muted-foreground` for all column headers. At this size on a standard display, column headings are difficult to scan. `text-xs` (12px) would improve readability without changing the operational density.

### 5.4 Cards and containers

Cards use `border border-border/80 bg-card shadow-sm` with consistent radius. Card headers use `border-b bg-muted/15`. This is clean and consistent.

**UX-013 — P3 — Nested card-within-card pattern in Action Detail**  
The action detail page nests information inside `Card` components that are themselves inside the `PageContainer`. In some role views, this creates a triple-border stack (page bg → outer card → inner card section) that adds visual weight without hierarchy benefit.

---

## 6. Design-System Consistency

### 6.1 Form controls

**UX-014 — P1 — Raw `<input type="date">` elements bypass the design system**  
The dashboard filter bar, NC Summary filter bar, and other locations use raw `<input type="date">` with inline Tailwind classes instead of the `<Input>` design-system component. These raw inputs have different heights (`h-8` or `h-9`), different border radius, different focus rings, and render the native OS date picker instead of the styled component. On Windows/Chrome the native date picker has significantly different visual weight.

Affected locations:
- `dashboard-page.tsx` — dashboard custom date range inputs
- `dashboard-page.tsx` (NCSummaryTable) — from/to date inputs

Recommended: Wrap date inputs in the `<Input>` component or a `<DatePicker>` design-system primitive.

**UX-015 — P2 — Button heights are inconsistent across the application**  
Multiple button heights are used:
- `min-h-11` (44px) — touch-optimised, used in verification dialog
- `min-h-9` (36px) — standard, used in most modals
- Size `sm` (`h-9`) — filter and toolbar buttons
- Size `icon-sm` — sidebar utility icons

The verification dialog correctly uses `min-h-11 sm:min-h-9` for responsive touch sizing. This pattern should be applied to all primary action buttons in any context where a touch user may operate (audit execution, action submission, Red Tag).

**UX-016 — P2 — Select trigger heights vary**  
`SelectTrigger` is used with inconsistent heights: `h-9` in dashboard zone filter, `h-11` in audit creation, and default height in other locations. All controls in a filter row should be the same height.

### 6.2 Badges and status chips

`ActionStatusBadge` is a named component in `dashboard-page.tsx` that maps `MyActionStatus` → `Badge variant`. The audit list uses `getLifecycleStatusVariant` separately. These two status-to-variant mapping functions need to be reconciled into a single source.

**UX-017 — P2 — Status badge variants are not fully consistent across modules**  
"In Progress" maps to `"info"` (blue) in the audit list but `"warning"` (amber) in action status. Both are "active work" states. The colour treatment should be consistent — either both blue or both amber for in-progress states.

**UX-018 — P3 — "Awaiting Assignment" and "Open" are both treated as `info` (blue)**  
In the action store, both "Awaiting Assignment" and "Open" map to the same blue badge variant. They represent different lifecycle positions (pre-assignment vs. assigned-but-not-started). Differentiating with a muted/secondary badge for "Awaiting Assignment" would help at a glance.

### 6.3 Icons

Lucide icons are used consistently. Icon sizing uses `size-4` (16px) for inline icons and `size-5` (20px) for larger contexts. No inconsistencies found.

### 6.4 Score labels in Audit Execution

**UX-019 — P0 — Score labels are grammatically incorrect**  
`SCORE_LABELS` in `FiveSAuditExecution.tsx`:
```
0: "Non Compliance"
1: "Partially Compliance"
2: "Fully Compliance"
```
"Partially Compliance" and "Fully Compliance" are not grammatical English. A client demo will expose this immediately.

Recommended:
```
0: "Non-Compliant"
1: "Partially Compliant"
2: "Fully Compliant"
```
Or, if the domain prefers noun form: "Non-Compliance", "Partial Compliance", "Full Compliance".

Also appears in `FiveSAuditReport.tsx` `SCORE_LABELS`.

---

## 7. Dashboard

**Route:** `/5s`  
**Component:** `features/five-s/dashboard-page.tsx`

### 7.1 First impression and information priority

The dashboard renders a filter/view bar, then KPI cards, then four charts. Within 5 seconds, a manager can see aggregate numbers and trend charts. The "Attention required" section (filtered actions ranked by urgency) is present but only visible if the user scrolls past the charts.

**UX-020 — P1 — Silent demo data substitution is not transparent**  
When `period === "month"` and no filters are applied, the dashboard renders `MVP_DASHBOARD_DATA` (static fixtures) instead of live store data. There is no visual indication of this. A client evaluating the demo who changes the period to "week" or applies a zone filter will see the numbers change dramatically (or drop to zero). This is a demo-credibility risk.

Recommended: Add a subtle "Demo data" or "Sample period" indicator when static fixtures are active, or normalize the dashboard to always use live data.

**UX-021 — P1 — KPI cards lack visual grouping between audit metrics and action metrics**  
Nine cards are rendered without headers. Cards 1–5 are audit metrics; cards 6–9 are action metrics. Nothing communicates this split. A user reading "9 Non-compliances" does not immediately know whether this is the audit count or the action count.

Recommended: Add a `<p>` section heading above each card group ("Audit Summary" / "Action Summary") or divide into two visually separated rows.

**UX-022 — P2 — Zone Member filter is hidden on Overview tab**  
The zone-member filter only appears when `dashboardView !== "overview"`. A manager who wants to see all charts filtered to a specific zone member cannot do so from the Overview tab. This also means filters become active/inactive silently when switching tabs.

**UX-023 — P2 — Dashboard filter bar combines view tabs and data filters in one container**  
The filter bar houses: (1) view switcher buttons (Overview / NC Summary / Before/After), (2) zone filter, (3) zone-member filter, (4) period buttons, and (5) custom date inputs — all in one `div`. This is too much in one row. View switching is a navigation action; data filtering is a refinement action. These should be visually separated.

**UX-024 — P2 — "Attention required" list is below all four charts**  
The most operationally urgent section (overdue/critical/rework actions ranked by priority) is displayed after four trend charts. In a manufacturing context, "what needs immediate attention" should be at or near the top, not buried below graphs.

**UX-025 — P3 — No "last refreshed" indicator**  
The dashboard renders live store data. There is no timestamp indicating when data was last loaded. For an operational application where things change throughout a shift, a "Last updated: 2 min ago" indicator (or a manual refresh button) would increase trust.

---

## 8. Audit Creation

**Component:** `features/five-s/components/FiveSAuditCreate.tsx`

The audit creation form uses `ReadOnlyField` (with a lock icon) for auto-populated fields (Audit ID, Auditor) and editable `Select` / `Input` fields for user-provided values. A pre-submission summary card confirms the selections.

**UX-026 — P2 — "Audit Completion Date" label maps to `dueDate` internally**  
Per AGENTS.md, the field uses the legacy `dueDate` field and defaults to the local creation date. The label "Audit Completion Date" implies this is when the audit will be completed, but it functions as a target/due date. The distinction should be communicated via helper text, especially since this date appears on printed reports.

**UX-027 — P3 — Zone restriction error is silent**  
`canAuditZone()` is checked in `handleCreateAudit()`. If the check fails, the function simply `return`s without any user feedback. An auditor who selects an unauthorized zone will see nothing happen when they click "Start Audit". This needs an error message.

---

## 9. Audit Execution

**Component:** `features/five-s/components/FiveSAuditExecution.tsx`  
**Route:** Mounted inside Dashboard page when `selectedAudit` is truthy

### 9.1 Question navigation and progression

The execution component renders an accordion-style question list. The active question is `expandedQuestionId`. Users can click any question to expand it, use previous/next navigation, or jump to a section via the section tab bar.

**UX-028 — P1 — No clear indication of which questions are unanswered within a section**  
The section tab shows a progress count (e.g., "3/7"), but individual question items in the accordion do not have a clear unanswered/answered visual state when collapsed. A user revisiting a section after partial completion cannot immediately identify which questions still need answers without expanding each one.

Recommended: Add a colour-coded dot or status icon to each collapsed question row (green = scored, amber = partially done, empty = not started).

**UX-029 — P2 — NC creation form appears inline below the scoring controls**  
When a question is scored 0 or 1, the corrective action form (title, description, proposed action, category, responsible, priority, due date) expands inline below the score buttons. This creates a very long expanded card for a single question, especially on mobile. The cognitive task switches from "evaluate and score" to "plan corrective action" mid-question.

Recommended: Separate NC creation into a dedicated drawer/dialog triggered by "Add Corrective Action" button after the score is selected, keeping the scoring step visually clean.

**UX-030 — P2 — "Save Draft" feedback is a transient `draftSaved` boolean state with no persistent indicator**  
The component tracks `draftSaved` and `hasSavedDraft` but it is unclear how this is communicated to the user. A factory-floor user needs persistent confidence that their progress is saved. An autosave indicator ("Saved 2 min ago") or a persistent "Draft saved" badge on the page header would reduce anxiety.

**UX-031 — P3 — Score button label "Fully Compliance" (see UX-019) also appears in the scoring UI**  
When a score is selected, the selected state label appears in the question card. "Partially Compliance" is prominent. (Duplicate reference to UX-019.)

**UX-032 — P3 — "Full Screen" mode toggle exists but its scope is unclear**  
The `fullScreen` state is tracked. It is unclear from code inspection whether this affects the entire page or just the question panel. Its behaviour and value at different viewport widths should be validated in-browser.

### 9.2 Section navigation

**UX-033 — P2 — Audit lifecycle timeline minimum width of 360px may overflow on small screens**  
`AuditLifecycleTimeline` has `min-w-[360px]`. On a 390px mobile screen with page padding, this leaves only 30px for scroll margin, meaning the timeline may be clipped or force horizontal scroll.

---

## 10. Reference Guide

**Component:** `features/five-s/components/FiveSReferenceGuide.tsx`

### 10.1 Assessment

This is one of the better-executed components in the application:
- Trigger: small `Info` icon button with tooltip, stops propagation correctly
- Modal: near-full-screen on all viewports with appropriate max-width at desktop
- Image: Next.js `<Image>` with `aspect-video max-h-[480px]`, clickable for full-screen
- Full-screen viewer: `Dialog` covering entire screen with zoom controls (+/-/reset) and close
- "What Good Looks Like" section uses a clear visual hierarchy with uppercase tracking label, large heading, and body copy

**UX-034 — P2 — No navigation to previous/next question reference from within the modal**  
An auditor working through questions often needs to reference multiple questions in sequence. The guide only shows the reference for the currently selected question. Closing and re-opening for each question interrupts flow during a 39-question audit.

**UX-035 — P3 — Reference image error state ("Image unavailable") has no path to retry**  
When `imageFailed` is true, the component shows a static error panel. There is no retry button or fallback text guidance.

---

## 11. Audit Preview

**Component:** Reached from `FiveSAuditExecution` when `showReview` is true  
**Trigger:** Auto-preview when all required questions are answered, or manual preview

**UX-036 — P1 — Preview state is not clearly labelled as a review step, not final submission**  
Based on AGENTS.md: "Auto-preview triggers only on incomplete → all-required-answered; never auto-submit." This is correct behaviour. However, if the preview screen does not make explicit that (1) this is a review, not submission, and (2) the user must still complete verification to submit, users may abandon at this step.

Manual browser validation required to assess the actual preview layout and Submit Audit prominence.

---

## 12. Auditor Verification

**Component:** `features/five-s/components/FinalAuditVerificationDialog.tsx`

### 12.1 Assessment

This is a thoughtfully implemented component:
- Full-width dialog: `!w-[calc(100vw-24px)]` up to `lg:!max-w-[1120px]`
- Two-column layout (camera | signature) on `lg+`, stacked on mobile
- Sticky footer with "Complete Audit" button
- "Verification complete" confirmation shown inline before the button
- Camera lifecycle correctly tied to dialog open state

**UX-037 — P1 — Camera aspect ratio shift causes layout jump**  
When a photo is captured, the camera `<div>` transitions from `aspect-[4/3]` to `aspect-[16/5]` (on mobile) or `aspect-[4/3]` (on `sm+`). The mobile aspect ratio change from 4:3 to 16:5 (much shorter) causes a visible layout collapse, which will confuse users who are still looking at the captured image.

Recommended: Keep the aspect ratio consistent after capture, or use a fixed height container.

**UX-038 — P2 — "Complete Audit" is disabled until both photo and signature are captured, but no guidance explains what is missing**  
When only one step is complete, the button is disabled with no tooltip or inline message explaining what remains. The `StepHeader` component correctly shows step completion (circle becomes checkmark) but the button itself provides no assistive text.

Recommended: Show a helper message below the button when it is disabled (e.g., "Add your signature to continue" or "Capture a photo to continue").

**UX-039 — P3 — "Clear Signature" is accessible only through the `AuditorSignaturePad` component — verify its placement**  
Manual validation required to confirm that the "Clear" button is within reach without excessive scrolling on a 390px screen.

---

## 13. Corrective Actions

**Routes:** `/5s/actions`, `/5s/actions/[actionId]`  
**Components:** `features/five-s/actions-page.tsx`, `features/five-s/action-detail-page.tsx`

### 13.1 Actions list page

**UX-040 — P2 — Status filter uses lifecycle-stage labels, not status labels**  
The filter buttons map to `ACTION_LIFECYCLE_STAGES` which are derived stages (e.g., "Open", "In Progress"). The actual action statuses include "Awaiting Assignment", "Assigned", "Rework Required", "Awaiting Review". Lifecycle stages group these, which is useful, but a user looking for "Rework Required" items cannot filter to exactly that status.

**UX-041 — P2 — Role-based filtering happens silently**  
`roleActions` filters the full action list to only those involving the current user (as auditor, zone leader, or responsible member). There is no visual indication that the list is pre-filtered by role. A user switching demo roles who sees a different list will not understand why.

Recommended: Add a chip or note near the list: "Showing actions relevant to your role (Auditor / Zone Leader / Zone Member)."

### 13.2 Action detail page

**UX-042 — P1 — Role-specific action panels are not labelled by role**  
The action detail page shows different UI panels depending on the current user's role. If a user sees only a "Start Work" button with no context, they may not understand why they see a different interface than a colleague. Role-specific sections should be headed with a subtle role label ("Your actions as Zone Leader" / "Your actions as Zone Member").

**UX-043 — P2 — "Send Back for Rework" dialog requires a remark but does not validate before enabling the submit button**  
The `sendBackOpen` dialog uses a `remark` field. Manual validation required to confirm whether the confirm button is disabled until a remark is entered.

**UX-044 — P3 — Lifecycle audit trail (`reviewHistory`) is present but its visual presentation is not confirmed**  
The `action.reviewHistory` is used to derive `latestRework` for rework guidance. The full history tab/section should be validated in-browser for clarity and completeness.

---

## 14. Before / After Evidence

**Component:** `features/five-s/components/AfterPhotoCaptureDialog.tsx` (referenced, not fully read)  
**Context:** Used in Action Detail and Red Tag execution

**UX-045 — P1 — "Match the Before Photo" guidance is referenced in AGENTS.md but needs in-browser validation**  
AGENTS.md states: "After capture shows 'Match the Before Photo' guidance and Before reference." The `AfterPhotoCaptureDialog` component was not fully read. Manual validation required to confirm:
- Whether the Before image is actually visible alongside the camera/upload interface
- Whether the guidance text is clear enough for a factory-floor user
- Whether the before/after comparison is possible without scrolling on mobile

**UX-046 — P2 — Evidence thumbnail size (48×48px) is too small for evaluation**  
`EvidenceThumbnail` renders a 48×48px image (`size-12`). On a dense table (NC Summary), this is not enough area for a user to evaluate whether an image is useful. The click-to-preview interaction is correct, but the thumbnail itself gives almost no information. 64px (`size-16`) would improve scannability.

---

## 15. Red Tags

**Route:** `/5s/red`, `/5s/red/create`, `/5s/red/[tagId]`  
**Component:** `features/five-s/red-tag/red-tag-module.tsx`

The Red Tag module handles the full lifecycle (Open → Assigned → In Progress → Awaiting Review → Rework Required/Closed) within a single component with conditional rendering based on `currentView` state.

**UX-047 — P2 — Red Tag list page needs in-browser validation**  
The list rendering, filtering, and status badges need device-level validation. The module handles both the list and detail states, which is an unusual pattern that could make navigation (back to list from detail) non-obvious.

**UX-048 — P2 — Red Tag print report accessibility**  
`/5s/red/[tagId]/print` renders a printable Red Tag form. In-browser validation required to assess:
- Whether the Red Tag number, zone, reason, and action plan are legible at print size
- Whether the IQ branding appears correctly in print

---

## 16. Reports

**Route:** `/5s/reports`  
**Components:** `features/five-s/reports-page.tsx`, `features/five-s/components/FiveSAuditReport.tsx`, `features/five-s/components/ReportHeader.tsx`, `features/five-s/components/ReportPdfActions.tsx`

### 16.1 Audit report

**UX-049 — P2 — Score labels on audit report use the incorrect string (UX-019 applies here too)**  
`FiveSAuditReport.tsx` has its own `SCORE_LABELS` object with the same grammatically incorrect strings. Both must be corrected together.

**UX-050 — P2 — Evidence thumbnails in reports are 48×48px — inadequate for printed output**  
`EvidenceItem` renders a `size-12` (48px) thumbnail. For a client-facing PDF or printed audit report, evidence images should be larger — at minimum 80px square, ideally full-width with captions for significant findings.

### 16.2 NC Summary (CSV export)

NC Summary is correctly CSV-only per AGENTS.md. The export dialog (UX-019's score label issue aside) has a clean selection workflow with search, select-all, count indicator, and export button. This is well implemented.

### 16.3 Before/After print report

The `BeforeAfterPrintReport` component renders a hidden `section` that is made visible during print via `print:block`. Evidence images use `aspect-[16/10] w-full rounded border object-contain`. This is appropriate for print layout.

---

## 17. Admin — 5S Question Management

**Route:** `/5s/audits/configuration`  
**Component:** `features/five-s/question-configuration/questions-page.tsx`

This component was not fully read during this audit. The following observations are based on partial code review and AGENTS.md context.

**UX-051 — P1 — Drag-to-reorder usability on touch devices needs validation**  
Admin can reorder questions. Drag-and-drop in browser-based lists on touch devices is notoriously difficult without proper touch event handling. Manual validation required.

**UX-052 — P2 — Delete/deactivate confirmation dialog content needs review**  
AGENTS.md states questions can be "deleted/deactivated". An Admin deleting a question that is currently referenced in in-progress audits could cause data integrity issues (though the audit snapshot mechanism mitigates this). The confirmation dialog should clearly state that existing audits are unaffected.

**UX-053 — P2 — No visible indicator showing that section names/order are fixed**  
Per AGENTS.md, 5S sections (Sort, Set in Order, Shine, Standardize, Sustain) are system-defined and immutable — Admin cannot rename, reorder, or delete them. If the UI does not visually distinguish section headers as locked, an Admin may spend time looking for edit controls that don't exist.

---

## 18. Tables

### 18.1 NC Summary table

**UX-054 — P1 — NC Summary table minimum width of 1480px is excessive**  
The table uses `min-w-[1480px]`. On a 1440px desktop (the most common development width), the table is wider than the viewport, forcing horizontal scroll. This means the "Report" and "View" actions in the last column are not visible without scrolling.

Recommended: Reduce to `min-w-[1100px]` or make the table column-configurable. The "Action taken" and "After" columns could be de-prioritised to a mobile-hidden state.

### 18.2 Audit list table

The audit list renders a full table on `md+` with columns: status, zone, auditor, date, score, progress, actions. This is appropriately dense.

**UX-055 — P2 — Audit list has no sticky header**  
With many audits, the column headers scroll off screen. Sticky `<thead>` would help users maintain context while scrolling.

### 18.3 Administration users table

The users table has a good mobile fallback (card grid) and desktop table. No significant issues.

### 18.4 Export NC Summary dialog table

The export dialog renders a scrollable table with `min-w-[700px]`. This is appropriate for a dialog context and the sticky header (`sticky top-0 z-10`) is correctly implemented.

---

## 19. Modals & Drawers

### 19.1 General assessment

Modals are implemented with the `Dialog` component from shadcn/Base UI. Key patterns observed:

- `FinalAuditVerificationDialog`: near-full-screen, sticky footer, correct CTA placement ✓
- `FiveSReferenceGuide`: appropriate max-width, sticky close button ✓
- `ExportNCSummaryDialog`: `flex flex-col overflow-hidden` with scrollable body and sticky footer ✓
- `FiveSAuditCreate` (pre-inspection): standard card layout, not a dialog

**UX-056 — P2 — Admin User Editor dialog height constraint `h-[min(860px,calc(100dvh-1rem))]` may clip on small laptops**  
At 768px viewport height (common for 13" laptops), the dialog cap is 767px. With a 5-section form (Basic Information, Assignments, Roles, Permissions, error message), the dialog content area may require extensive scrolling. A sticky footer is present but needs browser validation.

**UX-057 — P3 — Image preview dialog in Dashboard has no caption or evidence name below the image**  
`Dialog` for evidence preview shows `preview?.name` as the `DialogTitle`. If the name is a UUID or data-URL-derived name (as is common with captured photos), the title is not useful. The evidence metadata (evidence type, date captured) would be more helpful.

---

## 20. Responsive UX

### 20.1 1440px desktop

- Dashboard: 5-column KPI grid, 2-column chart grid — appropriate density
- NC Summary table: 1480px min-width causes horizontal scroll on 1440px screen (P1, UX-054)
- Audit execution: 2-column section/question layout — needs validation

### 20.2 1366px laptop (most common enterprise laptop)

- NC Summary table horizontal scroll is definitely triggered here
- ProductNav shows 4 items; Red Tag and Continuous Improvement are in overflow
- Dashboard filter bar may wrap to 2 rows

### 20.3 1024px tablet (landscape)

- Sidebar is hidden; ProductNav is the sole navigation
- Only 4 of 6 navigation items are visible
- Audit execution: needs device validation for question card layout

### 20.4 768px tablet (portrait)

- Mobile header kicks in; sidebar and ProductNav both hidden
- Navigation dependent entirely on mobile drawer
- Dashboard KPI: `sm:grid-cols-3` — 3-column grid, two rows of 3+3, last row 3 — still orphaned

### 20.5 390px mobile (iPhone 15 / common Android)

- `AuditLifecycleTimeline` with `min-w-[360px]` causes overflow (UX-033)
- Dashboard view switcher + filter bar must wrap — potentially requiring 3+ rows
- NC Summary table (1480px) is entirely unusable on mobile — only accessible via horizontal scroll
- `FinalAuditVerificationDialog`: stacked camera + signature — adequate space at 390px

**UX-058 — P1 — NC Summary table is essentially unusable on mobile**  
A Zone Leader who needs to review non-compliances from their phone cannot meaningfully use the NC Summary table. A mobile-appropriate card list view (collapsing table to key fields) should be provided.

---

## 21. Accessibility

**UX-059 — P2 — Score selection buttons lack explicit `role="radio"` or equivalent**  
The scoring interface in audit execution uses `<button>` elements for 0/1/2 score selection. These are visually styled as a radio group but are not implemented with `role="radiogroup"` / `role="radio"`. A screen reader user cannot infer the mutually exclusive relationship.

**UX-060 — P2 — Icon-only buttons in the collapsed sidebar have tooltips but not always `aria-label`**  
The collapse/expand sidebar buttons use `aria-label`. However, collapsed nav items depend on `TooltipContent` for their accessible name, which only appears on hover — not available to keyboard-only or screen reader users. Nav links in collapsed state should have explicit `aria-label`.

**UX-061 — P2 — Color is the sole status differentiator for score states**  
Red/amber/green is used exclusively to communicate 0/1/2 compliance scores. Users with red-green colour blindness (≈8% of males) cannot distinguish between NC (red) and Fully Compliant (green) by colour alone. A secondary indicator (icon, pattern, or text abbreviation) should accompany colour.

**UX-062 — P2 — Dashboard status chips use colour alone to communicate status**  
`ActionStatusBadge` maps statuses to `danger`/`warning`/`success`/`info` variants. The text label is present inside the badge, so this is less severe than the score buttons, but the badge background colour is the primary differentiator.

**UX-063 — P3 — Evidence thumbnail buttons have no `aria-label`**  
`EvidenceThumbnail` renders `<button>` with only an `<img>` inside. The `<img>` has an `alt` from `evidence.name`. The button itself has no accessible name. Screen readers will announce the image alt text for the button, which may be adequate, but an explicit `aria-label="Preview: {evidence.name}"` would be clearer.

**UX-064 — P3 — Focus management on modal open**  
The `FinalAuditVerificationDialog` uses `autoPlay` on the camera video. Focus on dialog open should move to the first interactive element (Capture Photo button or close button). Manual validation required.

---

## 22. Feedback & System States

### 22.1 Loading states

**UX-065 — P2 — No skeleton or loading state for dashboard charts**  
Charts (Recharts) render immediately from store data. On initial load with localStorage data, charts may flash from empty to populated. A brief skeleton state would prevent layout shift.

### 22.2 Error states

**UX-066 — P2 — Zone restriction failure in audit creation has no user feedback (UX-027 is the root)**  
Silent `return` on `canAuditZone()` failure — no error message shown.

**UX-067 — P2 — Camera errors in verification dialog are displayed inline (good) but the error container styling varies**  
The camera error message uses `rounded-lg border border-red-200 bg-red-50 text-red-700`. This is an ad-hoc style rather than the design system's alert/toast component. Standardise using the application's existing error feedback pattern.

### 22.3 Success states

**UX-068 — P2 — No explicit success toast after audit completion**  
When an audit is completed and `handleCompleteAudit` is called, the user is returned to the dashboard. There is no confirmation message ("Audit completed successfully"). The user has to visually confirm the audit appears in the list.

### 22.4 Empty states

Dashboard, Actions list, NC Summary, and Before/After all have empty states. These are generally well-implemented with icon + message + optional CTA. No P1/P2 issues identified.

---

## 23. Microcopy

**UX-069 — P0 — "Partially Compliance" / "Fully Compliance" (root: UX-019)**  
Critical demo-quality issue. Must be corrected.

**UX-070 — P1 — "NC Summary" is an abbreviation that may be unfamiliar to first-time users**  
"NC" (Non-Compliance) is used throughout as an abbreviation without expansion on first use. On the dashboard tab, "NC Summary" should be "Non-Compliance Summary" or at minimum "NC (Non-Compliance) Summary" on first encounter.

**UX-071 — P2 — "Audit Completion Date" implies the date the audit was completed, not the target date**  
In audit creation, this is actually the scheduled/target date. Recommended label: "Target Completion Date" or "Scheduled Date".

**UX-072 — P2 — Score button hover label "Non Compliance" appears as two words without hyphen**  
Domain convention should be consistent: "Non-Compliance" (hyphenated) or "Non Compliance" (two words) — choose one and apply throughout all labels, reports, CSV exports, and microcopy.

**UX-073 — P2 — "Proposed Action" vs "Action Plan" terminology is potentially confusing**  
Per AGENTS.md, these are distinct: "Proposed Action" is authored by the Auditor at NC creation; "Action Plan" is the final version edited by the Zone Leader. If the UI uses these interchangeably in labels or hints, users may not understand they represent different steps.

**UX-074 — P3 — "Clear Filters" in NC Summary uses a RotateCcw icon (reset), which is semantically appropriate, but "Clear" may imply deleting data**  
Recommended: "Reset Filters" is a more common SaaS convention.

**UX-075 — P3 — "View all members" (lowercase) in empty state vs. "All Zone Members" (capitalised) in filter — inconsistent capitalisation**

---

## 24. UX/UI Consistency Matrix

| Element | Status | Primary Inconsistency |
|---|---|---|
| Typography | Consistent | Page title, card title, label scales are well-defined |
| Buttons — variants | Partially consistent | Primary/outline/ghost/secondary used correctly; sizes inconsistent |
| Buttons — heights | Inconsistent | `min-h-11`, `min-h-9`, `h-9`, `h-11` mixed across same-context controls |
| Inputs — styled | Consistent | `<Input>` component used for search, text fields |
| Inputs — date | Inconsistent | Raw `<input type="date">` vs design-system `<Input>` |
| Select triggers | Inconsistent | Heights vary: `h-9`, `h-11`, and default across filter bars |
| Cards | Consistent | `border bg-card shadow-sm` applied uniformly |
| Tables | Partially consistent | Row heights consistent; header sizes vary (`text-[11px]` vs `text-xs`) |
| Modals | Partially consistent | Width/height strategies differ per modal; footer stickiness inconsistent |
| Status badges | Inconsistent | Same status (In Progress) maps to different variants across modules |
| Score labels | Inconsistent | Grammatically incorrect strings throughout execution and reports |
| Icons | Consistent | Lucide, `size-4` inline / `size-5` featured |
| Spacing — page padding | Consistent | `px-4 py-5 sm:px-5 lg:px-6 2xl:px-8` via AppShell |
| Spacing — section gaps | Partially consistent | `gap-4` / `gap-5` / `gap-6` used variably |
| Border radius | Consistent | `rounded-xl` cards, `rounded-md` controls |
| Shadows | Consistent | `shadow-sm` cards, hover elevations sparse |
| Page headers | Consistent | `FiveSPageHeader` used across all screens |
| Filters | Inconsistent | Button toggles, Select, raw date input, Dropdown checkbox — all used for filtering |
| Empty states | Partially consistent | Icon + message pattern is present; not every state has an action CTA |
| Loading states | Inconsistent | No skeleton states; some spinners used in button labels |

---

## 25. Screen-by-Screen Audit

### Dashboard (`/5s`)
| | |
|---|---|
| **What works** | Filter bar, chart variety, period switching, zone/member filtering, NC Summary search, export dialog, Before/After print |
| **What doesn't** | Silent demo data substitution, orphaned KPI grid, attention section buried below charts, NC Summary table 1480px min-width |
| **Priority improvement** | Add section headings to KPI groups (P1) + move attention section above charts (P1) |

### Audit List (`/5s/audits`)
| | |
|---|---|
| **What works** | Table with status, progress bar, audit ID, zone, score; lifecycle stage filter tabs; search |
| **What doesn't** | No sticky header; Audit Configuration entry point is non-obvious; "Continuous Improvement" nav overflow |
| **Priority improvement** | Sticky table header (P2) + clarify Audit Configuration discoverability (P2) |

### Audit Creation
| | |
|---|---|
| **What works** | Auto-populated fields with lock icon, summary card, zone restriction |
| **What doesn't** | Silent failure on zone restriction; "Audit Completion Date" label is misleading |
| **Priority improvement** | Error message on zone restriction failure (P1 — blocks task) |

### Audit Execution
| | |
|---|---|
| **What works** | Accordion question list, section tabs, scoring colours, reference guide trigger, lifecycle timeline |
| **What doesn't** | Incorrect score labels; inline NC form creates cognitive overload; no per-question answered/unanswered indicator |
| **Priority improvement** | Fix score labels (P0); add answered/unanswered indicators (P1) |

### Reference Guide
| | |
|---|---|
| **What works** | Full-screen zoom, "What Good Looks Like" section, appropriate modal sizing |
| **What doesn't** | No prev/next navigation; no retry on image error |
| **Priority improvement** | Prev/next navigation between question references (P2) |

### Audit Preview
| | |
|---|---|
| **What works** | (Needs browser validation) |
| **What doesn't** | Not confirmed whether Submit Audit CTA prominence is adequate |
| **Priority improvement** | Browser validation required (P1) |

### Auditor Verification
| | |
|---|---|
| **What works** | Two-step flow, sticky footer CTA, camera lifecycle, signature pad |
| **What doesn't** | Aspect ratio shift on photo capture (mobile); no inline guidance when CTA is disabled |
| **Priority improvement** | Fix aspect ratio shift (P1); add disabled-state guidance (P2) |

### Actions List (`/5s/actions`)
| | |
|---|---|
| **What works** | 6 stat cards, lifecycle filter tabs, search, role-based filtering |
| **What doesn't** | Role-based filter is silent; status filter doesn't expose all statuses |
| **Priority improvement** | Add role-filter indicator (P2) |

### Action Detail (`/5s/actions/[actionId]`)
| | |
|---|---|
| **What works** | Role-specific panels, before/after evidence, activity history, rework guidance |
| **What doesn't** | Role panels not labelled; send-back validation unclear |
| **Priority improvement** | Label role-specific sections (P1) |

### Red Tag (`/5s/red`)
| | |
|---|---|
| **What works** | Lifecycle matches Action pattern |
| **What doesn't** | Needs browser validation; print report needs testing |
| **Priority improvement** | Browser validation required |

### Reports (`/5s/reports`)
| | |
|---|---|
| **What works** | IQ branding, share/PDF, print-ready layout |
| **What doesn't** | Score labels incorrect in audit report; evidence thumbnails too small |
| **Priority improvement** | Fix score labels (P0); increase evidence image size (P2) |

### Admin — Users (`/administration/users`)
| | |
|---|---|
| **What works** | Permission-gated access, table + mobile card fallback, role/zone/status filters |
| **What doesn't** | Editor dialog may require extensive scrolling on small laptops |
| **Priority improvement** | Browser validation on small viewports (P2) |

### Admin — 5S Questions (`/5s/audits/configuration`)
| | |
|---|---|
| **What works** | Needs browser validation |
| **What doesn't** | Section immutability may not be visually communicated; drag reorder on touch unvalidated |
| **Priority improvement** | Browser validation required |

---

## 26. Prioritised Findings

### P0 — Blocks task completion / serious usability failure

| ID | Finding | Screen |
|---|---|---|
| UX-019 | Score labels grammatically incorrect ("Partially Compliance") | Audit Execution, Reports |
| UX-069 | Same as UX-019 — microcopy P0 confirmation | Audit Execution, Reports |

### P1 — Major UX problem affecting primary workflows

| ID | Finding | Screen |
|---|---|---|
| UX-001 | No breadcrumb / location context | All screens |
| UX-007 | Two navigation systems (sidebar + ProductNav) with different item sets | All screens |
| UX-008 | "More" overflow hides Red Tag and Continuous Improvement | ProductNav |
| UX-014 | Raw date inputs bypass design system | Dashboard, NC Summary |
| UX-020 | Silent demo data substitution not transparent | Dashboard |
| UX-021 | KPI cards lack visual grouping between audit and action metrics | Dashboard |
| UX-028 | No per-question answered/unanswered indicator in accordion | Audit Execution |
| UX-036 | Preview step may not communicate review-vs-submission distinction | Audit Preview |
| UX-037 | Camera aspect ratio shift causes layout jump on photo capture | Auditor Verification |
| UX-042 | Role-specific panels not labelled | Action Detail |
| UX-045 | Before/After "match" guidance needs browser validation | Evidence Capture |
| UX-054 | NC Summary table min-width 1480px exceeds 1440px viewport | Dashboard |
| UX-058 | NC Summary table unusable on mobile | Dashboard |
| UX-070 | "NC Summary" unexpanded abbreviation on first use | Dashboard |

### P2 — Noticeable usability or consistency issue

UX-002, UX-003, UX-005, UX-006, UX-010, UX-011, UX-015, UX-016, UX-017, UX-022, UX-023, UX-024, UX-026, UX-029, UX-030, UX-033, UX-034, UX-040, UX-041, UX-043, UX-046, UX-047, UX-049, UX-050, UX-051, UX-052, UX-053, UX-055, UX-056, UX-059, UX-060, UX-061, UX-062, UX-065, UX-066, UX-067, UX-068, UX-071, UX-072, UX-073

### P3 — Polish / visual refinement

UX-004, UX-009, UX-012, UX-013, UX-018, UX-025, UX-027, UX-031, UX-032, UX-035, UX-039, UX-044, UX-057, UX-063, UX-064, UX-074, UX-075

---

## 27. Top 10 Improvements

These are ranked by combined impact on task completion, demo quality, operational clarity, and consistency.

**#1 — Fix grammatically incorrect score labels (UX-019)**  
Change "Non Compliance / Partially Compliance / Fully Compliance" to "Non-Compliant / Partially Compliant / Fully Compliant" (or equivalent) in `FiveSAuditExecution.tsx` and `FiveSAuditReport.tsx`. This is the single most visible demo-quality defect. Complexity: Small.

**#2 — Unify navigation: consolidate ProductNav overflow items**  
Increase the ProductNav primary item count to 6, or move to a different overflow strategy so Red Tag and Continuous Improvement are always visible. Alternatively, restructure so the sidebar is always visible at 1024px+. Complexity: Medium.

**#3 — Replace raw `<input type="date">` with design-system controls (UX-014)**  
Affects dashboard filter bar and NC Summary filter. Provides visual consistency and unlocks proper focus/keyboard handling. Complexity: Small.

**#4 — Add KPI section headings to separate audit vs. action metrics (UX-021)**  
A two-line change that dramatically improves the dashboard's information hierarchy: insert "Audit Summary" and "Action Summary" headings above the respective card groups. Complexity: Small.

**#5 — Make NC Summary table responsive: add mobile card view (UX-058)**  
The 1480px-wide table is unusable on mobile and forces horizontal scroll on 1440px desktops. Reduce the minimum width and provide a mobile card/list fallback matching the pattern already used in the audit list and admin users page. Complexity: Medium.

**#6 — Add per-question answered/unanswered indicator in audit execution accordion (UX-028)**  
A colour dot or checkmark on each collapsed question row gives auditors immediate visibility into their progress without expanding individual questions. Complexity: Small–Medium.

**#7 — Move "Attention Required" actions section above trend charts on dashboard (UX-024)**  
The most operationally urgent section is below four charts. Swap the position so critical/overdue actions appear immediately below KPI cards. Complexity: Small.

**#8 — Add confirmation feedback on key state transitions (UX-068)**  
"Audit completed", "Action submitted", "Red Tag closed" — these transitions currently return the user to a list with no confirmation. Add a toast notification on success. Complexity: Small (if a toast system already exists).

**#9 — Add silent-data-source transparency to dashboard (UX-020)**  
When the dashboard is rendering `MVP_DASHBOARD_DATA`, display a subtle chip: "Showing sample data for this period". This prevents demo credibility issues when a client changes the period filter. Complexity: Small.

**#10 — Fix camera aspect ratio shift in Auditor Verification (UX-037)**  
Use a fixed-height container for the camera/photo element so the layout does not collapse when a photo is captured on mobile. Complexity: Small.

---

## 28. Recommended Design-System Rules

These rules standardise and improve the existing visual direction without changing the design identity.

### Layout
- **Page max width:** `max-w-[1680px]` (already set in AppShell — preserve)
- **Page horizontal padding:** `px-4 sm:px-5 lg:px-6 2xl:px-8` (already set — preserve)
- **Section vertical gap:** `gap-6` (standardise; currently `gap-4` / `gap-5` / `gap-6` mixed)
- **Card padding:** `p-4 sm:p-5 lg:p-6` (standardise; currently `p-4` and `p-5 sm:p-6` mixed)

### Controls
- **Form control height:** `h-11` on mobile (`min-h-11`), `h-9` on `sm+` — apply via `min-h-11 sm:min-h-9` universally on primary action controls, and `h-9` for filter/secondary controls
- **Date inputs:** Must use the `<Input>` component or a dedicated `<DatePicker>` primitive — never raw `<input type="date">`
- **Filter controls:** All controls in a filter row must share the same height (`h-9`)
- **Select trigger:** `h-9` for filter contexts, `h-11 sm:h-9` for form contexts

### Typography
- **Page title:** `text-2xl font-semibold font-heading tracking-[-0.025em]` (preserve)
- **Section heading / card title:** `text-base font-semibold` (preserve)
- **Table column headings:** Minimum `text-xs` (12px); uppercase + tracking permitted
- **Metadata labels:** `text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground` (preserve)
- **Body / description:** `text-sm leading-5 text-muted-foreground` (preserve)

### Score labels
- **Canonical strings:** "Non-Compliant", "Partially Compliant", "Fully Compliant" — use everywhere (execution, reports, CSV export, tooltips)

### Status badges
- **Single mapping function** shared across all modules. Canonical mapping:
  - Awaiting Assignment → `muted` (grey)
  - Assigned / Open → `info` (blue)
  - In Progress → `warning` (amber) — consistent across Audit and Action
  - Awaiting Review → `info` (blue)
  - Rework Required → `danger` (red)
  - Completed → `success` (green)
  - Overdue → `danger` (red)
  - Draft → `muted` (grey)

### Tables
- **Row height:** `py-3 px-4` (12px vertical padding per cell)
- **Column header:** `text-xs uppercase tracking-wide text-muted-foreground font-semibold`
- **Table max-width:** Never exceed viewport width by default; use `overflow-x-auto` on container with a reasonable `min-w` only when absolutely necessary
- **Sticky header:** Apply to any table that displays more than ~10 rows

### Modals
- **Standard modal:** `sm:max-w-lg` for simple dialogs, `sm:max-w-2xl` for form dialogs, `lg:max-w-4xl` for data/report modals
- **Always:** `flex flex-col overflow-hidden` with `min-h-0 overflow-y-auto` body and sticky footer
- **CTA:** Never relies on natural document flow to be visible — always in a sticky footer

### Responsive breakpoints
| Breakpoint | Width | Expected layout |
|---|---|---|
| Default (mobile) | 390px | Single column, card lists, no sidebar |
| `sm` | 640px | 2-column grids, tablet cards |
| `md` | 768px | Filter rows inline, table-vs-card switch |
| `lg` | 1024px | Sidebar appears, 3–4 column grids |
| `xl` | 1280px | Full density, 5-column KPI grids |
| `2xl` | 1536px | Max-width capped at 1680px |

### Radius scale
- Controls: `rounded-md` (6px)
- Cards: `rounded-xl` (12px)
- Dialogs: `rounded-[20px]` or `rounded-xl` (preserve)
- Avatars: `rounded-full`

### Icon sizes
- Inline text icons: `size-4` (16px)
- Button icons: `size-4` (16px)
- Featured / empty state icons: `size-8`–`size-9` (32–36px)
- Navigation icons: `size-[17px]`–`size-[18px]` (preserve sidebar sizing)

---

## 29. Quick Wins

These can be delivered in a single focused session with small code impact:

1. **Fix score labels** — change 3 string constants in 2 files (UX-019) — **30 min**
2. **Add KPI section headings** — insert two `<p>` elements above card groups (UX-021) — **15 min**
3. **Move "Attention Required" above charts** — reorder JSX sections (UX-024) — **10 min**
4. **Replace dashboard raw date inputs with `<Input>`** — swap element type and className (UX-014) — **20 min**
5. **Add "Demo data" indicator** to dashboard when MVP data is active (UX-020) — **20 min**
6. **Fix camera aspect ratio** in Verification dialog — remove the `aspect-[16/5]` mobile variant (UX-037) — **10 min**
7. **Add zone restriction error message** in audit creation (UX-027 / UX-066) — **15 min**
8. **Update "NC Summary" tab label** to "Non-Compliance Summary" (UX-070) — **5 min**
9. **Add `aria-label` to collapsed sidebar nav links** (UX-060) — **15 min**
10. **Change "Clear Filters" to "Reset Filters"** in NC Summary (UX-074) — **5 min**

Total estimated time: ~2.5 hours

---

## 30. Larger Improvements

These require design decisions and non-trivial implementation:

1. **Responsive NC Summary table** — add mobile card view below `md` and reduce `min-w` (UX-054, UX-058) — **Medium**
2. **Per-question answered/unanswered visual state** in audit accordion (UX-028) — **Medium**
3. **Separate NC creation into drawer/dialog** rather than inline expansion (UX-029) — **Medium–Large**
4. **Consolidate navigation** — resolve sidebar vs. ProductNav dual-system (UX-007, UX-008) — **Medium**
5. **Role-labelled panels in Action Detail** (UX-042) — **Small–Medium**
6. **Breadcrumb or location trail** across all screens (UX-001) — **Medium**
7. **Unified status badge mapping** — single shared function across all modules (UX-017) — **Small**
8. **Prev/next question reference navigation** in Reference Guide (UX-034) — **Small–Medium**
9. **Sticky table headers** for Audit List and NC Summary (UX-055) — **Small**
10. **Success toast system** for state transitions (UX-068) — **Medium** (if toast infrastructure exists) or **Small** (if already used elsewhere)

---

## 31. Manual Browser / Device Validation Required

The following areas require actual browser and device testing and could not be confirmed through static code inspection alone:

| Area | Validation needed | Priority |
|---|---|---|
| Audit Preview screen | Submit Audit CTA prominence, unanswered NC visibility, Edit behaviour | P1 |
| Mobile Nav Drawer | Item order, close behaviour, role-filtered items | P1 |
| Before/After evidence capture | "Match the Before Photo" guidance, before image visibility during after capture | P1 |
| Audit Execution — full screen | Scope and behaviour of fullScreen toggle at all breakpoints | P2 |
| Admin 5S Questions page | Drag-to-reorder on touch, section immutability indicators, delete confirmation | P1 |
| Signature pad — mobile | Reachability of "Clear" button without scrolling, draw area size on 390px | P2 |
| Admin User Editor dialog | Scrollability on 768px viewport height | P2 |
| Red Tag list + detail | List vs. detail back navigation, print report at A4 | P2 |
| Continuous Improvement module | Full workflow not read in this audit | P2 |
| Audit Execution — auto-preview transition | Trigger timing, transition animation | P2 |
| Corrective Action — send-back remark validation | Whether submit is disabled until remark entered | P2 |
| Dark mode — all screens | Score colour contrast in dark mode (red/amber/green on dark backgrounds) | P2 |

---

## 32. Conclusion

The 5S application has a mature frontend architecture, a correct business-logic model, and a visually coherent design language. For a client-facing demo, it reads as a credible B2B SaaS product.

The most critical issues to address before any client demonstration are:

1. **Score label grammar** (P0) — "Partially Compliance" is embarrassing in a professional context
2. **NC Summary table** overflowing the viewport on 1440px (P1)
3. **Dashboard demo-data transparency** — silent fixture switching will confuse a technical evaluator
4. **Navigation overflow** hiding Red Tag and Continuous Improvement from common viewports

Resolving the 10 Quick Wins alone (estimated 2.5 hours) would meaningfully elevate the demo experience. The larger improvements — responsive table, navigation consolidation, audit execution UX — represent the roadmap for production-quality delivery.

---

*End of UX/UI Audit Report*  
*Findings: 48 total — P0: 2, P1: 14, P2: 22, P3: 10*
