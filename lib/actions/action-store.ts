"use client";

import { useSyncExternalStore } from "react";

import {
  MY_ACTIONS,
} from "@/features/five-s/data/my-actions-data";

import type {
  MyAction,
  MyActionActivity,
  MyActionStatus,
} from "@/features/five-s/types/my-actions";
import { createNotification } from "@/lib/notifications/notification-store";
import { getFiveSZoneConfiguration } from "@/lib/five-s/configuration";
import { readStorageJson, readStorageString, removeStorage, safeSetStorage, safeSetStorageString } from "@/lib/browser-storage";

export interface ActionActor {
  id: string;
  name: string;
}

type CreateActionInput = Omit<
  MyAction,
  "id" | "createdAt" | "completedAt" | "evidence"
>;

type ActionEvidence =
  MyAction["evidence"][number];

const STORAGE_KEY =
  "standalone-5s-actions";
const DEMO_FIXTURE_VERSION_KEY = "standalone-5s-action-fixture-version";
const DEMO_FIXTURE_VERSION = "canonical-zone-a-dashboard-v3";

let hasLoadedFromStorage = false;

let actions: MyAction[] = MY_ACTIONS.map(normalizeEvidence);

const listeners =
  new Set<() => void>();

/* =========================================================
   STORAGE
   ========================================================= */

function loadFromStorage() {
  if (
    hasLoadedFromStorage ||
    typeof window === "undefined"
  ) {
    return;
  }

  hasLoadedFromStorage = true;

  try {
    const stored = readStorageJson<MyAction[]>(STORAGE_KEY);

    if (!stored) {
      actions = MY_ACTIONS.map(normalizeEvidence);

      saveToStorage();

      return;
    }

    if (Array.isArray(stored)) {
      let storedActions = stored;
      const fixtureVersion = readStorageString(DEMO_FIXTURE_VERSION_KEY);
      if (fixtureVersion !== DEMO_FIXTURE_VERSION) {
        const canonicalDemo = MY_ACTIONS.find((action) => action.id === "ACT-ZA-001");
        if (canonicalDemo) {
          storedActions = [canonicalDemo, ...storedActions.filter((action) => ![canonicalDemo.id, "ACT-ZD-001"].includes(action.id))];
        }
        safeSetStorageString(DEMO_FIXTURE_VERSION_KEY, DEMO_FIXTURE_VERSION);
      }
      const storedIds = new Set(storedActions.map((action) => action.id));
      const missingSeedActions = MY_ACTIONS.filter((action) => !storedIds.has(action.id));
      actions = [...missingSeedActions, ...storedActions].map(normalizeEvidence);
    }
  } catch (error) {
    console.error(
      "Failed to load actions from localStorage:",
      error
    );

    actions = MY_ACTIONS.map(normalizeEvidence);
  }
}

function saveToStorage() {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  return safeSetStorage(STORAGE_KEY, actions);
}

/** Preserve legacy arrays while making evidence purpose explicit. */
function normalizeEvidence(action: MyAction): MyAction {
  const zone = getFiveSZoneConfiguration(action.area);
  return {
    ...action,
    status: normalizeLegacyActionStatus(action.status as string),
    zoneLeaderId: action.zoneLeaderId ?? zone?.leaderId,
    zoneLeaderName: action.zoneLeaderName ?? zone?.leader,
    issueEvidence: (action.issueEvidence ?? []).map((evidence) => ({
      ...evidence,
      actionId: evidence.actionId ?? action.id,
      evidenceType: "finding",
    })),
    evidence: (action.evidence ?? []).map((evidence) => ({
      ...evidence,
      actionId: evidence.actionId ?? action.id,
      evidenceType: "resolution",
    })),
  };
}

/** Translate historical browser records without mutating storage eagerly. */
export function normalizeLegacyActionStatus(status: string): MyActionStatus {
  return status === "Pending Review" || status === "Pending Auditor Review"
    ? "Awaiting Review"
    : status as MyActionStatus;
}

/* =========================================================
   STORE
   ========================================================= */

function emitChange() {
  saveToStorage();

  listeners.forEach(
    (listener) => listener()
  );
}

function subscribe(
  listener: () => void
) {
  loadFromStorage();

  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  loadFromStorage();

  return actions;
}

function getServerSnapshot() {
  return MY_ACTIONS;
}

/**
 * Shared 5S action store.
 *
 * Frontend-only MVP store with
 * localStorage persistence.
 */
export function useActionStore() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}

/**
 * Return all current actions.
 */
export function getActions():
  MyAction[] {
  loadFromStorage();

  return actions;
}

/**
 * Find an action by ID.
 */
export function getActionById(
  actionId: string
): MyAction | undefined {
  loadFromStorage();

  return actions.find(
    (action) =>
      action.id === actionId
  );
}

/**
 * Create a new action.
 */
export function createAction(
  input: CreateActionInput
): MyAction {
  loadFromStorage();
  const actionId = `ACT-${Date.now()}`;

  const action: MyAction = {
    ...input,

    id: actionId,

    createdAt: new Date()
      .toISOString()
      .slice(0, 10),

    issueEvidence: (input.issueEvidence ?? []).map((evidence) => ({
      ...evidence,
      actionId,
      evidenceType: "finding",
    })),
    evidence: [],

    activityHistory: input.activityHistory ?? (() => {
      const auditor = {
        id: input.createdByUserId ?? input.auditor ?? "legacy-auditor",
        name: input.createdByName ?? input.auditor ?? "Auditor",
      };
      return [
        createActivity("created", auditor, undefined, "Auditor"),
        createActivity("proposed", auditor, input.proposedAction, "Auditor"),
      ];
    })(),
  };

  actions = [
    action,
    ...actions,
  ];

  emitChange();

  if (action.status === "Awaiting Assignment" && action.zoneLeaderId) {
    createNotification({ recipientUserId: action.zoneLeaderId, title: "New Action Requires Assignment", message: `${action.title} · Raised by: ${action.createdByName ?? action.auditor ?? "Auditor"} · Audit: ${action.sourceTitle} · Zone: ${action.area} · Priority: ${action.priority}`, href: `/5s/actions/${encodeURIComponent(action.id)}` });
  } else if (action.responsiblePersonId) {
    createNotification({
      recipientUserId: action.responsiblePersonId,
      title: "New action assigned",
      message: `${action.title} · Assigned by: ${action.createdByName ?? action.auditor ?? "Auditor"} · Audit: ${action.sourceTitle} · Zone: ${action.area} · Priority: ${action.priority} · Due: ${action.dueDate}`,
      href: `/5s/actions/${encodeURIComponent(action.id)}`,
    });
  }

  return action;
}

export function assignActionToZoneMember(
  actionId: string,
  actor: ActionActor,
  input: { memberId: string; actionPlan: string }
) {
  const action = getActionById(actionId);
  const zone = action ? getFiveSZoneConfiguration(action.area) : undefined;
  const member = zone?.members.find((item) => item.id === input.memberId);
  const actionPlan = input.actionPlan.trim();
  if (!action || action.status !== "Awaiting Assignment" || !zone || zone.leaderId !== actor.id || !member || !actionPlan) return undefined;
  const assignedAt = new Date().toISOString();
  const originalPlan = (action.proposedAction ?? action.actionPlan ?? action.description).trim();
  const planWasEdited = actionPlan !== originalPlan;
  const updated = updateAction(actionId, {
    status: "Assigned",
    assignedTo: member.name,
    responsiblePersonId: member.id,
    responsiblePersonName: member.name,
    assignedByUserId: actor.id,
    assignedByName: actor.name,
    assignedAt,
    actionPlan,
    actionPlanEditedByUserId: planWasEdited ? actor.id : undefined,
    actionPlanEditedByName: planWasEdited ? actor.name : undefined,
    actionPlanEditedAt: planWasEdited ? assignedAt : undefined,
    activityHistory: appendActivity(action, createActivity("assigned", actor, `Assigned to ${member.name}`, "Zone Leader")),
  });
  if (updated) createNotification({ recipientUserId: member.id, title: "New Action Assigned", message: `${action.title} · Assigned by: ${actor.name} · Raised by: ${action.createdByName ?? action.auditor ?? "Auditor"} · Zone: ${action.area} · Priority: ${action.priority} · Due: ${action.dueDate}`, href: `/5s/actions/${encodeURIComponent(action.id)}` });
  return updated;
}

function createActivity(
  type: MyActionActivity["type"],
  actor: ActionActor,
  remark?: string,
  actorRole?: MyActionActivity["actorRole"]
): MyActionActivity {
  return {
    id: `ACTIVITY-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    actorId: actor.id,
    actorName: actor.name,
    actorRole,
    createdAt: new Date().toISOString(),
    remark,
  };
}

function responsibleId(action: MyAction) {
  return action.responsiblePersonId ?? action.assignedTo;
}

function isResponsible(action: MyAction, actor: ActionActor) {
  return action.responsiblePersonId
    ? action.responsiblePersonId === actor.id
    : action.assignedTo === actor.name;
}

function isZoneLeader(action: MyAction, actor: ActionActor) {
  const zone = getFiveSZoneConfiguration(action.area);
  if (zone) return zone.leaderId === actor.id;
  if (action.zoneLeaderId) return action.zoneLeaderId === actor.id;
  return Boolean(action.zoneLeaderName && action.zoneLeaderName === actor.name);
}

function appendActivity(action: MyAction, activity: MyActionActivity) {
  return [...(action.activityHistory ?? []), activity];
}

export function startAssignedAction(actionId: string, actor: ActionActor) {
  const action = getActionById(actionId);
  if (!action || !isResponsible(action, actor) || !["Assigned", "Open", "Rework Required"].includes(action.status)) return undefined;
  return updateAction(actionId, {
    status: "In Progress",
    activityHistory: appendActivity(action, createActivity("started", actor, undefined, "Zone Member")),
  });
}

export function submitActionForReview(
  actionId: string,
  actor: ActionActor,
  resolution: { observation: string; correctiveActionCategory: string; costSaving: number }
) {
  const action = getActionById(actionId);
  if (!action || !isResponsible(action, actor) || !["Assigned", "Open", "In Progress", "Rework Required"].includes(action.status)) return undefined;
  if (!resolution.observation.trim() || !resolution.correctiveActionCategory || action.evidence.length === 0 || !Number.isFinite(resolution.costSaving) || resolution.costSaving < 0) return undefined;
  const isResubmission = action.status === "Rework Required" || (action.reviewHistory?.length ?? 0) > 0;
  const now = new Date().toISOString();
  const zone = getFiveSZoneConfiguration(action.area);
  const zoneLeader = {
    id: zone?.leaderId ?? action.zoneLeaderId ?? "zone-leader",
    name: zone?.leader ?? action.zoneLeaderName ?? "Zone Leader",
  };
  const submittedActivity = createActivity(isResubmission ? "resubmitted" : "submitted", actor, undefined, "Zone Member");
  const reviewRequestedActivity = createActivity("review_requested", zoneLeader, undefined, "Zone Leader");
  const updated = updateAction(actionId, {
    status: "Awaiting Review",
    actionTakenDescription: resolution.observation.trim(),
    resolutionObservation: resolution.observation.trim(),
    correctiveActionCategory: resolution.correctiveActionCategory,
    costSaving: resolution.costSaving,
    currency: action.currency ?? "INR",
    submittedForReviewAt: now,
    completedAt: undefined,
    activityHistory: [...(action.activityHistory ?? []), submittedActivity, reviewRequestedActivity],
  });
  const zoneLeaderId = zoneLeader.id === "zone-leader" ? undefined : zoneLeader.id;
  if (updated && zoneLeaderId) createNotification({
    recipientUserId: zoneLeaderId,
    title: isResubmission ? "Action resubmitted for review" : "Action submitted for review",
    message: `${action.title} · Submitted by: ${actor.name} · Audit: ${action.sourceTitle} · Zone: ${action.area}`,
    href: `/5s/actions/${encodeURIComponent(action.id)}?mode=review`,
  });
  return updated;
}

export function sendActionBack(actionId: string, actor: ActionActor, remark: string) {
  const action = getActionById(actionId);
  if (!action || !isZoneLeader(action, actor) || action.status !== "Awaiting Review" || !remark.trim()) return undefined;
  const review = createActivity("sent_back", actor, remark.trim(), "Zone Leader");
  const updated = updateAction(actionId, {
    status: "Rework Required",
    reviewedAt: undefined,
    reviewedBy: undefined,
    reviewedByRole: undefined,
    reviewComment: remark.trim(),
    completedAt: undefined,
    reviewHistory: [...(action.reviewHistory ?? []), review],
    activityHistory: appendActivity(action, review),
  });
  if (updated) createNotification({
    recipientUserId: responsibleId(action),
    title: "Action returned for rework",
    message: `${action.title} · Reviewer: ${actor.name} · ${remark.trim()}`,
    href: `/5s/actions/${encodeURIComponent(action.id)}`,
  });
  return updated;
}

export function closeReviewedAction(actionId: string, actor: ActionActor) {
  const action = getActionById(actionId);
  if (!action || !isZoneLeader(action, actor) || action.status !== "Awaiting Review") return undefined;
  const now = new Date().toISOString();
  const reviewedActivity = createActivity("reviewed", actor, undefined, "Zone Leader");
  const closedActivity = createActivity("closed", actor, undefined, "Zone Leader");
  const updated = updateAction(actionId, {
    status: "Completed",
    reviewedBy: actor.name,
    reviewedByRole: "Zone Leader",
    reviewedAt: now,
    closedBy: actor.name,
    closedByRole: "Zone Leader",
    closedAt: now,
    completedAt: now,
    completedByUserId: action.responsiblePersonId,
    completedByName: action.responsiblePersonName ?? action.assignedTo,
    reviewHistory: [...(action.reviewHistory ?? []), reviewedActivity, closedActivity],
    activityHistory: [...(action.activityHistory ?? []), reviewedActivity, closedActivity],
  });
  if (updated) createNotification({
    recipientUserId: responsibleId(action),
    title: "Action approved and closed",
    message: `${action.title} · Reviewed by: ${actor.name} · Cost Saving: ₹${(action.costSaving ?? 0).toLocaleString("en-IN")}`,
    href: `/5s/actions/${encodeURIComponent(action.id)}`,
  });
  return updated;
}

/**
 * Update an existing action.
 */
export function updateAction(
  actionId: string,
  updates: Partial<MyAction>
): MyAction | undefined {
  loadFromStorage();

  let updatedAction:
    MyAction | undefined;

  actions =
    actions.map((action) => {
      if (
        action.id !== actionId
      ) {
        return action;
      }

      updatedAction = {
        ...action,
        ...updates,
      };

      return updatedAction;
    });

  emitChange();

  return updatedAction;
}

/**
 * Change action status.
 */
export function updateActionStatus(
  actionId: string,
  status: MyActionStatus
): MyAction | undefined {
  return updateAction(
    actionId,
    {
      status,

      ...(status ===
      "Completed"
        ? {
            completedAt:
              new Date()
                .toISOString()
                .slice(0, 10),
          }
        : {
            completedAt:
              undefined,
          }),
    }
  );
}

/**
 * Add evidence to an action.
 */
export function addActionEvidence(
  actionId: string,
  evidence: ActionEvidence
): MyAction | undefined {
  const action =
    getActionById(
      actionId
    );

  if (!action) {
    return undefined;
  }

  return updateAction(
    actionId,
    {
      evidence: [
        ...action.evidence,
        { ...evidence, actionId, evidenceType: "resolution" },
      ],
    }
  );
}

/**
 * Remove evidence from an action.
 */
export function removeActionEvidence(
  actionId: string,
  evidenceId: string
): MyAction | undefined {
  const action =
    getActionById(
      actionId
    );

  if (!action) {
    return undefined;
  }

  return updateAction(
    actionId,
    {
      evidence:
        action.evidence.filter(
          (evidence) =>
            evidence.id !==
            evidenceId
        ),
    }
  );
}

/**
 * Replace all actions.
 */
export function setActions(
  nextActions: MyAction[]
) {
  actions = nextActions.map(normalizeEvidence);

  emitChange();
}

/**
 * Reset actions to original demo data.
 */
export function resetActions() {
  actions = MY_ACTIONS.map(normalizeEvidence);

  emitChange();
}

/**
 * Clear saved actions completely.
 *
 * Useful if you want a fresh demo.
 */
export function clearSavedActions() {
  if (
    typeof window !==
    "undefined"
  ) {
    removeStorage(STORAGE_KEY);
  }

  hasLoadedFromStorage =
    false;

  actions = [
    ...MY_ACTIONS,
  ];

  emitChange();
}
