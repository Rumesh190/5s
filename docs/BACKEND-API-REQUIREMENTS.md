# 5S Backend API Requirements

This document describes required backend capabilities, not a transport, framework, language, database, or hosting technology. Operation names are conceptual contracts and may be exposed through any approved architecture.

## Authentication

```text
login(credentials)
logout()
getSession()
refreshSession()             // if the selected session model requires it
getCurrentUser()
```

Capabilities: secure credential validation, session issuance/revocation, expiry, authenticated identity, and protection of every non-public operation.

## Users

```text
listUsers(filters, pagination)
getUser(userId)
getCurrentUserPermissions()
```

Return stable IDs and authoritative role/membership information. Display names must not be used as authorization identifiers.

## Plants and zones

```text
listPlants()
getPlant(plantId)
listZones(plantId)
getZone(zoneId)
getZoneLeader(zoneId)
listZoneMembers(zoneId)
```

The backend must validate that users, leaders, members, audits, actions, improvements, and Red Tags belong to compatible plants/zones.

## Audits

```text
listAuditTemplates()
getAuditTemplate(templateId, version)
listAudits(filters, pagination)
getAudit(auditId)
createAudit(input)
updateAuditMetadata(auditId, input)
saveAuditResponses(auditId, responses, version)
saveAuditDraft(auditId, input, version)
signAudit(auditId, signature)
completeAudit(auditId, version)
deleteAudit(auditId)         // only if deletion policy approves it
getAuditReportData(auditId)
```

Required behavior:

- Atomic, collision-free audit identifier generation.
- Preservation of the exact template/version used by an audit.
- Server-side scoring/completion using approved rules.
- Audit-zone and completion authorization.
- Validation of question, response, evidence, signature, and action relationships.
- Concurrency/version checks so one client cannot silently overwrite another.

## Actions

```text
listActions(filters, pagination)
getAction(actionId)
createActionFromAuditQuestion(auditId, questionId, input)
assignAction(actionId, memberId, version)
startAction(actionId, version)
saveActionResolution(actionId, input, version)
submitActionForReview(actionId, input, version)
sendActionBack(actionId, remark, version)
resubmitActionForReview(actionId, input, version)
closeAction(actionId, version)
getActionHistory(actionId)
getActionReportData(actionId)
```

The backend must enforce the authoritative state machine, derive the actor from the session, validate zone membership/responsibility/reviewer authority, record immutable history, and generate workflow notifications.

## Continuous Improvement

```text
listImprovements(filters, pagination)
getImprovement(improvementId)
createImprovement(input)
reviewImprovement(improvementId, decision, remark, version)
startImprovement(improvementId, version)
completeImprovement(improvementId, actionTaken, actualSaving, version)
getImprovementTimeline(improvementId)
getImprovementReportData(improvementId)
```

Enforce same-zone team selection, zone-member creation, zone-leader review, approved-team implementation, completion requirements, event history, and notifications.

## Red Tag

Current required operations:

```text
listRedTags(filters, pagination)
getRedTag(redTagId)
createRedTag(input)
markRedTagPrinted(redTagId)
getRedTagPrintData(redTagId)
```

The backend must generate Red Tag numbers atomically and prevent duplicate printed events. Do not add start/resolve/close APIs until the Red Tag lifecycle is approved.

Potential future operations requiring product decisions:

```text
startRedTag(redTagId)
resolveRedTag(redTagId)
closeRedTag(redTagId)
reopenRedTag(redTagId)
```

## Notifications

```text
listNotifications(filters, pagination)
getUnreadNotificationCount()
markNotificationRead(notificationId)
markAllNotificationsRead()
```

Workflow notification creation and recipient selection should be internal backend behavior, not a client-authorized general-purpose operation.

## Files and evidence

```text
initiateEvidenceUpload(parentType, parentId, purpose, metadata)
completeEvidenceUpload(uploadId, metadata)
getEvidenceMetadata(evidenceId)
getAuthorizedEvidenceUrl(evidenceId)
deleteEvidence(evidenceId)  // subject to retention and workflow policy
```

Evidence purposes currently include:

- Audit question evidence
- Action finding/before evidence
- Action resolution/after evidence
- CI proposal/before evidence
- CI completion/after evidence
- Red Tag issue image
- Auditor signature

The backend must validate file type/size/count, parent access, upload completion, and evidence purpose. Storage access must be authorized; a browser-supplied URL is not proof of ownership.

## Reports

```text
getAuditReportData(auditId)
getActionReportData(actionId)
getImprovementReportData(improvementId)
getRedTagPrintData(redTagId)
exportReport(reportType, entityId, format)
```

The current frontend can continue rendering and printing reports from authorized report data. If immutable or formal server-generated documents are required, that is an additional approved capability.

## Dashboard

```text
getDashboardSummary(filters)
getAuditTrends(filters)
getZoneScores(filters)
getActionStatusSummary(filters)
getNonComplianceSummary(filters, pagination)
getBeforeAfterSummary(filters, pagination)
exportNonCompliance(filters, format)
```

Aggregations must use an approved scoring rule and enforce the caller’s data scope.

## Profile

The current page is a placeholder. Anticipated capabilities are:

```text
getProfile()
updateProfile(input)
changePassword(input)
getPreferences()
updatePreferences(input)
```

Do not implement fields or rules beyond an approved profile requirement.

## Cross-cutting backend responsibilities

### Authentication and authorization

- Authenticate every protected request.
- Derive actor identity from the session.
- Enforce resource, plant, zone, role, membership, ownership, responsibility, and reviewer access.
- Apply authorization to files and reports as well as entity endpoints.

### Validation

- Validate identifiers, relationships, required fields, value ranges, status preconditions, evidence requirements, dates, and currency values.
- Do not trust client-calculated scores, completion, statuses, timestamps, actors, numbering, or notification recipients.

### Workflow transitions

- Accept domain commands rather than arbitrary status changes.
- Validate the current state and permitted transition atomically.
- Return the authoritative updated entity and version.

### Concurrency

- Prevent lost updates and duplicate transitions through version checks, transactions, idempotency, or equivalent approved controls.
- Make identifier generation atomic.

### Timestamps and identifiers

- Generate workflow timestamps server-side using a documented timezone/UTC policy.
- Generate collision-free internal IDs and approved human-readable sequence numbers.

### History and audit events

- Record authenticated actor, operation, timestamp, prior/new state where required, and remarks.
- Protect workflow history from client rewriting.

### Notification generation

- Determine recipients from authoritative relationships.
- Generate notifications only after successful workflow changes, using a reliable transactional or post-transaction mechanism.

### File authorization

- Store evidence outside ordinary entity payloads.
- Authorize upload, preview, download, and deletion.
- Apply approved retention, content validation, and security policies.
