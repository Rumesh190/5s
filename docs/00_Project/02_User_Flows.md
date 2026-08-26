

# User Flows

**Project:** Manufacturing Quality Management System (MQMS)
**Version:** 1.0
**Status:** Draft

---

# Purpose

This document defines the primary user journeys through the application.

The flows represent the expected user interactions for the MVP and are based on current assumptions. They should be validated with stakeholders during the discovery phase.

---

# Primary Flow

Login

↓

Dashboard

↓

Audit List

↓

Create New Audit
OR

Open Existing Audit

↓

Audit Details

↓

5 Why Analysis

↓

Corrective Actions

↓

Review

↓

Close Audit

---

# Flow 1 — Login

Actor

User

Steps

1. Open application
2. Enter credentials
3. Authenticate
4. Redirect to Dashboard

Outcome

User successfully accesses the system.

---

# Flow 2 — View Dashboard

Actor

User

Steps

1. View KPIs
2. View recent audits
3. View assigned audits
4. Select an audit or create a new one

Outcome

User chooses their next task.

---

# Flow 3 — Create Audit

Actor

Quality Engineer / Operator

Steps

1. Click "New Audit"
2. Enter basic information
3. Enter issue details
4. Upload attachments (optional)
5. Save audit

Outcome

A new audit is created.

---

# Flow 4 — Open Existing Audit

Actor

User

Steps

1. Open Audit List
2. Search or filter audits
3. Select an audit
4. View audit details

Outcome

User continues an existing investigation.

---

# Flow 5 — Perform 5 Why Analysis

Actor

Quality Engineer

Steps

1. Review issue details
2. Enter problem statement
3. Complete Why 1
4. Complete Why 2
5. Complete Why 3
6. Complete Why 4
7. Complete Why 5
8. Record root cause

Outcome

Investigation is completed.

---

# Flow 6 — Add Corrective Actions

Actor

Quality Engineer

Steps

1. Add corrective action
2. Assign owner
3. Set due date
4. Save action

Outcome

Corrective actions are assigned.

---

# Flow 7 — Review & Close Audit

Actor

Supervisor

Steps

1. Review investigation
2. Review corrective actions
3. Verify completeness
4. Close audit

Outcome

Audit is marked as Closed.

---

# Alternate Flow — Save as Draft

At any stage before completion:

User

↓

Save Draft

↓

Continue later

Outcome

Audit remains editable.

---

# Alternate Flow — Reopen Audit

Authorized user

↓

Open Closed Audit

↓

Reopen

↓

Continue investigation

Outcome

Audit returns to In Progress.

---

# Error Flow

Authentication Failure

↓

Display error message

↓

Retry login

---

# Validation Flow

Required fields missing

↓

Highlight missing fields

↓

Prevent submission

↓

Allow user to complete required information