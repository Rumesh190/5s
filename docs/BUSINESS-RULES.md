# 5S Business Rules

This document summarizes approved frontend-MVP behavior. Browser checks are not production authorization; a backend must enforce these rules using authenticated IDs and authoritative relationships.

## Audits

- An auditor cannot create an audit for their own primary zone.
- The live template has 39 questions: Sort 7, Set in Order 9, Shine 8, Standardize 7, Sustain 8.
- Scores are 0, 1, and 2. The store sums earned scores; unanswered values contribute zero.
- Persisted states are `Draft`, `In Progress`, and `Completed`; Review is derived at 100% question completion.
- Audit Completion Date retains the internal `dueDate` property and defaults to the local creation date.
- Completion of all required questions triggers Preview only on incomplete → complete transition. It does not submit.
- Final audit completion requires live Auditor photo and digital signature.
- Audit completion is independent from linked corrective-action completion.

## Corrective Actions

- `MyAction` is the canonical Action model.
- Canonical lifecycle: `Awaiting Assignment → Assigned → In Progress → Awaiting Review → Rework Required or Completed`.
- Legacy browser statuses `Pending Review` and `Pending Auditor Review` normalize to `Awaiting Review` during loading.
- Auditor records the finding and Proposed Action.
- Zone Leader reviews/edits the final Action Plan and assigns a configured Zone Member.
- Only the responsible Zone Member can start and submit work.
- Submission requires observation, corrective category, non-negative cost saving, and resolution evidence.
- Only the configured Zone Leader can return for rework or approve and close.
- Auditor cannot review or close corrective actions.
- Finding/Before evidence and resolution/After evidence remain separate.
- Workflow operations append role-attributed history and notifications.

## Red Tags

- Lifecycle: `Open → Assigned → In Progress → Awaiting Review → Rework Required or Closed`.
- Zone Leader owns plan, assignment, priority, due date, review, rework, and closure.
- Zone Member executes work and submits a closure photo plus comment.
- Closing requires plan, responsible member, closure evidence, member submission, and Zone Leader approval.
- Red Tag actions use the canonical Action store with `sourceModule: "Red Tag"`, `sourceId`, and reverse `actionId` linkage; duplicates are not created.
- Existing local records with missing lifecycle fields remain readable.

## Continuous Improvement

- States: `draft`, `submitted`, `approved`, `rejected`, `on_hold`, `in_progress`, `completed`.
- Configured Zone Members create proposals and select same-zone team members.
- Stored Zone Leader reviews with a required remark.
- Approved team members implement; completion requires action text, non-negative saving, and After evidence.

## Dashboard and exports

- NC Summary and Before/After filter by Zone and responsible Zone Member.
- Stable responsible-person ID is preferred; legacy name is fallback.
- Custom NC export applies active filters and exports only explicitly selected records.
- CSV export remains unbranded because the format does not support the visual report header.

## Reports

- Audit, Action, Red Tag, Continuous Improvement, and printable Before/After reports use the shared IQ-branded report header.
- Browser Print/Save PDF is the current PDF implementation.
- Share uses Web Share when available and clipboard fallback.
- Reports are live client views, not immutable snapshots.

## Priority due dates

| Priority | Default offset |
|---|---:|
| Critical | Same day |
| High | +1 day |
| Medium | +2 days |
| Low | +3 days |

These are calendar-day frontend defaults pending backend policy for holidays/timezones.

## Evidence and persistence

- Uploaded images are validated and compressed to data URLs.
- Browser storage can reach quota; storage failures must not silently claim success.
- Public reference/demo images are not user uploads.
- IDs should define relationships; names exist for display and compatibility.

## Backend decisions still required

- NA scoring denominator and aggregate-score policy.
- Immutable report/snapshot and retention rules.
- Evidence storage, access, file policy, and retention.
- Overdue derivation/scheduling.
- Template/record versioning and concurrency.
- Deletion, reopening, and completed-record revision policies.
- Working-day/holiday due-date rules.
