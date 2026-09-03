# 5S Business Rules

This document separates behavior confirmed in the current frontend from decisions that the backend must not infer. “Current” describes the MVP; it does not make the browser an authoritative security boundary.

## Current confirmed behavior

### Audits

- An auditor cannot create an audit for their own primary zone.
- The active audit-list template contains 39 questions: Sort 7, Set in Order 9, Shine 8, Standardize 7, Sustain 8.
- Live questions use a maximum score of 2, giving a current live maximum of 78.
- Scores 0, 1, and 2 display as Non Compliance, Partially Compliance, and Fully Compliance.
- Store score is the sum of question scores; `null` and runtime `undefined` contribute zero.
- A question with status `NA` contributes no earned score but currently remains in maximum score.
- Store completion counts questions whose status is not `Not Started`, then rounds the percentage.
- Persisted audit statuses are `Draft`, `In Progress`, and `Completed`.
- Display lifecycle is `Draft → In Progress → Review → Completed`; Review is currently derived at 100% completion.
- Audit completion requires an auditor signature.
- Audit evidence is attached to individual questions.
- Audit reports combine an audit with actions linked by stable audit ID or legacy title/source fallbacks.

### Actions

- Actions originate from 5S audit findings.
- Audit Action Category and Corrective Action Category are separate fields and separate lists.
- Persisted statuses are `Awaiting Assignment`, `Assigned`, `Open`, `In Progress`, `Overdue`, `Pending Review`, `Pending Auditor Review`, `Awaiting Review`, `Rework Required`, and `Completed`.
- The current display lifecycle is `Assigned → In Progress → Submitted for Review → Under Review → Closed`.
- Only the configured zone leader can assign an `Awaiting Assignment` action to a configured member of that zone.
- Only the responsible person can start an action in `Assigned`, `Open`, or `Rework Required`.
- Submission requires the responsible person, an allowed source status, a non-empty observation, a Corrective Action Category, resolution evidence, and a finite non-negative cost saving.
- Submission changes status to `Pending Auditor Review`.
- The creator/auditor can send a reviewed action back with a required remark, producing `Rework Required`.
- The responsible person can resubmit a rework action.
- The creator/auditor can close a reviewed action, producing `Completed`.
- Before/finding evidence and after/resolution evidence are stored separately.
- Workflow operations append activity and review history.

### Continuous Improvement

- Persisted statuses are `draft`, `submitted`, `approved`, `rejected`, `on_hold`, `in_progress`, and `completed`.
- The current creation flow creates a `submitted` record directly.
- Only a configured zone member can create a proposal.
- Selected team members must belong to the proposer’s zone; the proposer is included automatically.
- Only the stored zone leader can review a submitted or eligible on-hold proposal.
- Review decisions are Approve, Reject, or On Hold and require a remark.
- An already on-hold proposal cannot be placed on hold again.
- Only an approved team member can start implementation.
- Completion requires an in-progress proposal, an implementation team member, non-empty action text, finite non-negative actual saving, and at least one after-evidence item.
- Proposal, review, start, and completion add timeline events and relevant notifications.

### Red Tag

- New Red Tags receive a zone-based number and status `Open`.
- A Red Tag records item, quantity, section, reason, remarks, required action, responsible person, target date, creator, optional issue image, and history.
- Current implemented mutations are create and mark printed.
- Printing adds one printed-history event; repeated printing does not add duplicate printed events.
- Types mention `In Progress`, `Resolved`, and `Closed`, but the corresponding transitions are not implemented.

### Priority due dates

The current frontend default is:

| Priority | Due-date offset |
|---|---:|
| Critical | 0 days |
| High | +1 day |
| Medium | +2 days |
| Low | +3 days |

### Permissions

- Current permissions are based on client-side user IDs, names, primary zone, configured zone leader/member lists, action responsibility, action creator/auditor, and CI team membership.
- Reports and detail pages also apply frontend visibility checks where implemented.
- The backend must independently authorize every read and mutation using authenticated identity and authoritative relationships.

### Evidence

- Browser-selected images are validated and compressed to JPEG data URLs before storage.
- Audit evidence uses `dataUrl`; Action, CI, and Red Tag evidence uses URL-like fields that currently contain data URLs or public paths.
- Action and CI reports distinguish before and after evidence.
- Resolution evidence is mandatory for Action submission and CI completion.
- Public demo/reference images are not user uploads.

### Reports

- Audit, Action, Continuous Improvement, and Red Tag output is generated client-side.
- Print/Save PDF uses the browser print facility.
- Reports read live client-store data rather than an immutable server snapshot.

# Backend business decisions required

Every item below is **DO NOT ASSUME — PRODUCT DECISION REQUIRED**.

1. **NA denominator behavior:** Should `NA` questions be removed from maximum score or continue to reduce the attainable percentage?
2. **Non-compliance definition:** Is non-compliance determined by score, `actionRequired`, or both?
3. **Review persistence:** Should audit Review remain a derived display stage or become a persisted workflow status?
4. **Maximum-score configuration:** Is `maxScore: 2` permanent, template-specific, or configurable by question/version?
5. **Aggregate scoring:** Should dashboard/report aggregates use total earned ÷ total maximum, or the mean of per-audit percentages?
6. **Overdue handling:** Is `Overdue` stored, generated by a scheduled process, or derived dynamically from status and due date?
7. **Red Tag lifecycle:** Who can start, resolve, verify, reopen, and close a Red Tag, and what fields/evidence are required?
8. **Dynamic ID encoding:** Must all dynamic route identifiers be encoded consistently, and what identifier character set is permitted?
9. **Critical due date:** Is same-day due date for Critical actions intentional, including weekends, holidays, and timezone cutoffs?
10. **Record deletion:** Which records may be deleted, by whom, at which statuses, and should deletion be soft or permanent?
11. **Completed-record changes:** Can completed Audits, Actions, Improvements, or Red Tags be edited or reopened, and how is revision history preserved?
12. **Action reviewer authorization:** Must the original auditor review, or can another auditor, zone leader, administrator, or delegated reviewer act?
13. **Legacy creator/auditor migration:** How should actions without stable creator/auditor IDs be assigned and authorized?
14. **Cost-saving semantics:** Are savings estimated, annualized, realized, approved, taxable/currency-specific, or subject to financial verification?
15. **Report immutability:** Are formal reports live views or immutable snapshots tied to a completion/version event?
16. **Evidence retention and access:** Define retention, deletion, legal hold, download authorization, accepted formats, maximum size, and malware handling.
17. **Audit template versioning:** Must every audit retain a versioned copy of exact question wording, guidance, scoring, and reference material?

Until each decision is approved, backend implementation should preserve characterized frontend behavior without generalizing it into a permanent rule.
